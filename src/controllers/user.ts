import { userModel } from "@db";
import { parse } from "@utils/zod";
import { z } from "zod";
import type { UserWithoutId } from "definitions";
import type { Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import { convertFile } from "@libs/sharp";
import { uploadFile } from "@libs/cld";

const userPayloadModel = z.object({
  name: z
    .string()
    .max(50, { message: "The name can't be contain more of 50 characters." }),
  username: z.string().regex(/^(?=.{3,20}$)[A-Za-z0-9_]+$/, {
    message:
      "The username only can be contain letters, numbers and down guides.",
  }),
  email: z.string().email({ message: "The email format is wrong." }),
  bio: z
    .string()
    .max(100, { message: "The bio only can be contain 100 characteres." }),
  password: z.string(),
  date: z.string(),
});
export const createUserController = async (req: Request, res: Response) => {
  const files = req.files;
  const userPayload = req.body;

  const { error } = parse(userPayloadModel, userPayload);

  if (error) {
    res.status(400).json({ message: "Error on data sended by user", error });
    return;
  }

  try {
    let uploadedResult = [];
    if (files) {
      const arrayFromFiles = Object.values(files) as UploadedFile[];

      for (const file of arrayFromFiles) {
        const arrayBuffer = Uint8Array.from(file.data).buffer;
        const { buffer } = await convertFile(arrayBuffer, { format: "webp" });

        const { uploadedAsset } = await uploadFile(buffer, file.mimetype);

        uploadedResult = [...uploadedResult, uploadedAsset];
      }
    }
    res.json(userPayload);
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};
