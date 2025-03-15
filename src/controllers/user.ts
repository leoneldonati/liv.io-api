import { userModel } from "@db";
import { parse } from "@utils/zod";
import { z } from "zod";
import type { Asset, UserWithoutId } from "definitions";
import type { Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import { convertFile } from "@libs/sharp";
import { uploadFile } from "@libs/cld";
import { getLocationByIp } from "@utils/ip";

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
  // OBTENER ARCHIVOS
  const files = req.files;
  // OBTENER CUERPO
  const userPayload = req.body;

  // PARSEAR INFORMACION
  const { error } = parse(userPayloadModel, userPayload);

  if (error) {
    res.status(400).json({ message: "Error on data sended by user", error });
    return;
  }

  try {
    // VERIFICAR SI EL NOMBRE DE USUARIO YA ESTA REGISTRADO
    const findedUserByUsername = await userModel.findOne({
      username: userPayload.username,
    });

    if (findedUserByUsername) {
      res.status(400).json({ message: "This username has been registered." });
      return;
    }
    // VERIFICAR SI HAY ARCHIVOS PARA SUBIR
    let uploadedResult: Array<{ name: string; uploadedAsset: Asset }> = [];
    if (files) {
      // CONVERTIR EN UN ARRAY DE OBJETOS key-value
      const arrayFromFiles = Object.entries(files).map(([key, value]) => ({
        name: key,
        file: value as UploadedFile,
      }));

      // MAPEAR EL ARREGLO
      for (const { name, file } of arrayFromFiles) {
        // CONVERTIR BUFFER A ARRAYBUFFER
        const arrayBuffer = Uint8Array.from(file.data).buffer;

        // OPTIMIZAR IMAGEN PARA SUBIDA
        const { buffer } = await convertFile(arrayBuffer, { format: "webp" });

        // SUBIR BUFFER OPTIMIZADO
        const { uploadedAsset } = await uploadFile(buffer, file.mimetype);

        uploadedResult.push({ name, uploadedAsset });
      }
    }

    const location = await getLocationByIp(req.ip);

    res.json({ userPayload, uploadedResult });
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};
