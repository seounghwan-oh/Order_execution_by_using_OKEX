import { connection } from "../loader/mysql.js";

export const fetchService = {
  get: async (id, base_time) => {
    const values = [id, base_time];
    const query =
      "SELECT instrument_id, exec_price, exec_size FROM `trading`.`order_result` WHERE user_id = ? AND exec_time > ?";
    const [rows] = await (await connection).execute(query, values);
    return rows;
  },
};
