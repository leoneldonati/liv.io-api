import { historiesModel } from "@db";
import { uploadFile, uploadLargeFile } from "@libs/cld";
import { convertVideo } from "@libs/ffmpeg";
import { convertFile } from "@libs/sharp";
import type { RequestWithUser } from "definitions";
import type { Response } from "express";

export const getHistories = async (req: RequestWithUser, res: Response) => {
  const query = req.query;
  if (!query?.sort || typeof query?.sort !== "string") {
    res.status(400).json({ message: "¡sort param must be included!" });
    return;
  }
  try {
    const recentHistories = await historiesModel
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(recentHistories);
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};

export const createHistory = async (req: RequestWithUser, res: Response) => {
  const videoTypeRegex = /(?<=video\/).*/;
  const imageTypeRegex = /(?<=image\/).*/;
  const files = req.files;
  if (!files?.file || Array.isArray(files?.file)) {
    res
      .status(400)
      .json({ message: "File must be provided to create a new history" });
    return;
  }
  const { file } = files;
  let uploaded = null;
  try {
    // ARCHIVO DE TIPO VIDEO
    if (videoTypeRegex.exec(file.mimetype) !== null) {
      const { buffer, error: convertError } = await convertVideo(file);

      if (convertError) throw new Error(JSON.stringify(convertError));

      const { error: uploadError, resolved } = await uploadLargeFile(buffer);

      if (uploadError) throw new Error(JSON.stringify(uploadError));

      uploaded = resolved;
    }

    // ARCHIVO DE TIPO IMAGEN
    if (imageTypeRegex.exec(file.mimetype) !== null) {
      const { buffer } = await convertFile(file.data.buffer, {
        format: "avif",
      });

      if (!buffer) throw new Error("Error on convert image file");

      const { uploadedAsset } = await uploadFile(buffer, file.mimetype);

      if (!uploadedAsset) throw new Error("Error on upload image file");

      uploaded = uploadedAsset;
    }

    const { password, ...rest } = req.userLogged;
    const newStatus = {
      owner: {
        ...rest,
      },
      uploaded,
      createdAt: new Date(),
    };

    const { insertedId } = await historiesModel.insertOne(newStatus);
    res.json({ _id: insertedId, ...newStatus });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Error on server." });
  }
};
