import { connection } from "../loader/mysql.js";

export const fetchService = {
  get: async (uid, base_time) => {
    const values = [uid, base_time];
    const query =
      "SELECT instrument_id, exec_price, exec_size FROM `trading`.`order_result` WHERE uid = ? AND exec_time > ?";
    const [rows] = await (await connection).execute(query, values);
    return rows;
  },
};
