import { User } from "../models/user.js";
import { passwordHash, compareHash } from "../util/bcrypt.js";
import { fireBase } from "../loader/firebase.js";
import crypto from "crypto";

export const authService = {
  register: async (email, password) => {
    const uid = await fireBase.register(email, password);
    const password_hashed = await passwordHash(password);
    const user = new User();
    await user.createUser(uid, email, password_hashed);
  },

  login: async (email, password) => {
    const uid = await fireBase.login(email, password);
    const user = new User();
    const password_hashed = await user.getPassword(uid, email);
    await compareHash(password, password_hashed);
    const token = crypto.randomBytes(64).toString("hex");
    await user.setToken(token, uid);
    return token;
  },

  check: async (token) => {
    if (!token) throw new Error("Token이 없습니다.");
    const user = new User()
    const id = await user.getId(token);
    return id;
  },
};
