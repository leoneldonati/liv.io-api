import type { UploadedFile } from "express-fileupload";
import { join } from "node:path";
import { readFile, unlink, writeFile } from "node:fs/promises";
import ffmpegPath from "ffmpeg-static";
import Ffmpeg from "fluent-ffmpeg";
export async function convertVideo(file: UploadedFile) {
  const formatTypeRegex = /video\/([\w-]+)/;
  const fileType = formatTypeRegex.exec(file.mimetype)[1];

  const tempFilePath = join(
    process.cwd(),
    `/temp-files/temp-file-${crypto.randomUUID()}.${fileType}`
  );
  const tempOutputPath = join(
    process.cwd(),
    `/temp-files/temp-output-${crypto.randomUUID()}.${fileType}`
  );

  try {
    await writeFile(tempFilePath, file.data);

    await new Promise((resolve, reject) => {
      Ffmpeg(tempFilePath)
        .setFfmpegPath(ffmpegPath)
        .outputOptions(["-vcodec libx264", "-crf 28", "-preset veryfast"])
        .save(tempOutputPath)
        .on("end", () => resolve({}))
        .on("error", (err) => reject(new Error(err.message)));
    });

    const buffer = (await readFile(tempOutputPath)).buffer;
    return {
      buffer,
      error: null,
    };
  } catch (e) {
    return {
      buffer: null,
      error: e?.message,
    };
  } finally {
    await unlink(tempFilePath);
    await unlink(tempOutputPath);
  }
}
