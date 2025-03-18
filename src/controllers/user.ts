import { userModel } from "@db";
import { parse } from "@utils/zod";
import { convertFile } from "@libs/sharp";
import { deleteFile, uploadFile } from "@libs/cld";
import { getLocationByIp } from "@utils/ip";
import { hash } from "@libs/bcrypt";
import { z } from "zod";
import { ObjectId } from "mongodb";
import type { Asset, User, UserWithoutId } from "definitions";
import type { Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";

// CREAR USUARIO
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

    // VERIFICAR SI EL EMAIL SE ENCUENTRA REGISTRADO
    const findedUserByEmail = await userModel.findOne({
      email: userPayload.email,
    });
    if (findedUserByEmail) {
      res.status(400).json({ message: "This email has been registered." });
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

    // ESTADOS BOOLEANOS PARA COMPROBAR SUBIDAS DE ARCHIVOS
    const hasNotUploaded = uploadedResult.length === 0;
    const hasUploadedAvatar =
      !hasNotUploaded && uploadedResult.some((res) => res.name === "avatar");
    const hasUploadedHeader =
      !hasNotUploaded && uploadedResult.some((res) => res.name === "header");

    // ENCRIPTAR LA CONTRASEÑA
    const hashedPassword = await hash(userPayload.password);

    // OBTENER LOCALIZACION DEL USUARIO A REGISTRAR
    const location = await getLocationByIp(req.ip);

    // CONSTRUIR MODELO DE USUARIO A GUARDAR
    const newUser: UserWithoutId = {
      name: userPayload.name,
      username: userPayload.username,
      password: hashedPassword,
      bio: userPayload.bio,
      email: userPayload.email,
      date: new Date(userPayload.date),
      location,
      hasPremium: false,
      followers: [],
      following: [],
      joinedAt: new Date(),
      updatedAt: new Date(),
      settings: {
        accentColor: "",
        enableNotifications: true,
        theme: "",
      },
      avatar: !hasUploadedAvatar
        ? null
        : uploadedResult.find((res) => res.name === "avatar")?.uploadedAsset,
      header: !hasUploadedHeader
        ? null
        : uploadedResult.find((res) => res.name === "header")?.uploadedAsset,
    };

    // GUARDAR NUEVO USUARIO
    const insertedDocument = await userModel.insertOne(newUser);
    res.json({
      message: "User created succefully!",
      insertedId: insertedDocument.insertedId,
    });
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};

// BORRAR USUARIO
export const deleteUserController = async (req: Request, res: Response) => {
  const params = req.params;
  if (!params?._id) {
    res.status(400).json({ message: "You must include id param" });
    return;
  }

  try {
    // BUSCAR USUARIO A ELIMINAR PARA ELIMINAR LAS FOTOS ANTES
    const userToDelete = (await userModel.findOne({
      _id: new ObjectId(params._id),
    })) as User | null;

    if (!userToDelete) {
      res.status(404).json({ message: "This user is not registered." });
      return;
    }
    // EXTRAER AVATAR Y PORTADA
    const avatarPublicId = userToDelete.avatar?.publicId;
    const headerPublicId = userToDelete.header?.publicId;

    //JUNTAR EN UN ARRAY
    const arrayFromIds = [avatarPublicId, headerPublicId];

    arrayFromIds.forEach(async (id) => {
      if (id) {
        await deleteFile(id);
      }
    });

    // FINALMENTE, ELIMINAR EL USUARIO DE LA BDD
    await userModel.findOneAndDelete({
      _id: new ObjectId(params._id),
    });

    res.json({ message: "User deleted succefully!" });
  } catch (e) {
    res.status(500).json({ message: "Error on server." });
  }
};
