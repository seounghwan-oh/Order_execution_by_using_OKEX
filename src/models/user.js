import { connection } from "../loader/mysql.js";

export class User {
  _email;
  _password;
  _uid;
  _token;

  async createUser(uid, email, password) {
    const query =
      "INSERT INTO trading.user (uid, email, password) VALUES (?, ?, ?);";
    const values = [uid, email, password];
    await (await connection).execute(query, values);
  }

  async getPassword(uid, email) {
    const query =
      "SELECT password FROM trading.user WHERE uid = ? AND email = ?;";
    const values = [uid, email];
    const [rows] = await (await connection).execute(query, values);
    const { password } = rows[0];
    return password;
  }

  async getId(token) {
    const query = "SELECT id FROM trading.user WHERE token = ?;";
    const values = [token];
    const [rows] = await (await connection).execute(query, values);
    if (rows.length === 0) throw new Error("Token이 일치 하지 않습니다.");
    const { id } = rows[0];
    return id;
  }

  async setToken(token, uid) {
    const query = "UPDATE trading.user SET token = ? WHERE uid = ?";
    const values = [token, uid];
    await (await connection).execute(query, values);
  }
}
