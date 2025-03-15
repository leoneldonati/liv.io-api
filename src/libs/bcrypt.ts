import bcrypt from "bcrypt";

// verificar si matchean las contraseñas
export const isMatch = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

// encriptar un string
export const hash = async (string: string) => {
  return await bcrypt.hash(string, 10);
};
