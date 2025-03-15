import bcrypt from "bcrypt";
export const isMatch = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
