import sharp from "sharp";

export async function convertFile(
  arrayBuffer: ArrayBuffer,
  { format }: { format: keyof sharp.FormatEnum }
): Promise<{ ok: boolean; buffer: ArrayBuffer | null }> {
  try {
    const buffer = await sharp(arrayBuffer).toFormat(format).toBuffer();

    const resultantArrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );

    return {
      ok: true,
      buffer: resultantArrayBuffer,
    };
  } catch (e) {
    return {
      ok: false,
      buffer: null,
    };
  }
}
