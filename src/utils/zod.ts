import type { ZodObject, ZodRawShape } from "zod";

export const parse = <Schema extends ZodObject<ZodRawShape>>(
  model: Schema,
  data: unknown
): { data: Schema["_output"] | null; error: unknown } => {
  try {
    const parsedData = model.parse(data);
    return { data: parsedData, error: null };
  } catch (e: any) {
    return { data: null, error: e?.issues };
  }
};
