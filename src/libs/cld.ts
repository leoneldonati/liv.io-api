import { CLOUDINARY_CREDENTIALS } from "@const";
import { arrayBufferToBase64 } from "@utils/buffer";
import { v2 as cld } from "cloudinary";
import { Readable } from "node:stream";

cld.config({
  api_key: CLOUDINARY_CREDENTIALS.CLD_KEY,
  api_secret: CLOUDINARY_CREDENTIALS.CLD_SECRET,
  cloud_name: CLOUDINARY_CREDENTIALS.CLD_NAME,
});
export async function uploadFile(buffer: ArrayBuffer, fileType: string) {
  const base64String = arrayBufferToBase64(buffer);
  const dataUri = `data:${fileType};base64,${base64String}`;

  try {
    const result = await cld.uploader.upload(dataUri, {
      folder: "livio-files",
    });
    return {
      uploadedAsset: {
        secureUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        size: result.bytes,
        lastModified: result.created_at,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      uploadedAsset: null,
    };
  }
}

export async function uploadLargeFile(
  buffer: ArrayBuffer
): Promise<{ error: unknown; resolved: any }> {
  const { upload_stream } = cld.uploader;
  const readableStream = Readable.from(Buffer.from(buffer));

  try {
    const promise = new Promise((resolve, reject) => {
      const stream = upload_stream(
        { folder: "livio-files", resource_type: "video" },
        (err, { api_key, ...result }) => {
          if (err)
            return reject({
              error: err,
              resolved: null,
            });

          resolve({
            error: null,
            resolved: result,
          });
        }
      );
      readableStream.pipe(stream);
    });

    return (await promise) as { error: unknown; resolved: any };
  } catch (e) {
    return {
      error: e?.message,
      resolved: null,
    };
  }
}
export async function deleteFile(publicId: string) {
  try {
    await cld.uploader.destroy(publicId);

    return {
      ok: true,
    };
  } catch (e) {
    return {
      ok: false,
    };
  }
}
