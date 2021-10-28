import { connection } from "../loader/mysql.js";
import { passwordHash, compareHash } from "../util/bcrypt.js";

export const authService = {
  register: async (uid, email, password) => {
    const password_hashed = await passwordHash(password);
    const query =
      "INSERT INTO `trading`.`user` (`uid`, `email`, `password`) VALUES (?, ?, ?);";
    const values = [uid, email, password_hashed];
    await (await connection).execute(query, values);
  },

  login: async (uid, email, password, token) => {
    const query =
      "SELECT password FROM `trading`.`user` WHERE uid = ? AND email = ?;";
    const values = [uid, email];
    const [rows] = await (await connection).execute(query, values);
    const password_hashed = rows[0].password;
    const result = await compareHash(password, password_hashed);
    if (!result) throw new Error("비밀번호가 맞지 않습니다.");
    const updateQuery = "UPDATE trading.user SET token = ? WHERE uid = ?";
    const tokenValues = [token, uid];
    await (await connection).execute(updateQuery, tokenValues);
    return result;
  },

  check: async (token) => {
    if (!token) throw new Error("Token이 없습니다.");
    const query = "SELECT uid FROM `trading`.`user` WHERE token = ?;";
    const values = [token];
    const [rows] = await (await connection).execute(query, values);
    if (rows.length === 0) throw new Error("Token이 일치 하지 않습니다.");
    const { uid } = rows[0];
    return uid;
  },
};
