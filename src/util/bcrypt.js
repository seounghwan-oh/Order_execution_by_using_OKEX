import bcrypt from "bcrypt";

export const passwordHash = async (password) => {
  const saltRounds = 10;
  const result = await bcrypt.hash(password, saltRounds);
  return result;
};

export const compareHash = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};
