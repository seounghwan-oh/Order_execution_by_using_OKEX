import { connection } from "../loader/mysql.js";

export const orderService = {
  post: async (
    id,
    instrument_id,
    { order_price, order_size, exec_price, exec_order, timestamp }
  ) => {
    const values = [
      id,
      instrument_id,
      order_price,
      order_size,
      exec_price,
      exec_order,
      timestamp,
    ];
    const query =
      "INSERT INTO `trading`.`order_result` (`user_id`, `instrument_id`, `order_price`, `order_size`, `exec_price`, `exec_size`, `exec_time`) VALUES (?, ?, ?, ?, ?, ?, ?);";
    await (await connection).execute(query, values);
  },
};
