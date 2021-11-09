import { connection } from "../loader/mysql.js";

export class Order {
  user_id;
  instrument_id;
  order_price;
  order_size;
  exec_price;
  exec_order;
  timestamp;

  async saveOrder(
    user_id,
    instrument_id,
    order_price,
    order_size,
    exec_price,
    exec_order,
    timestamp
  ) {
    const values = [
      user_id,
      instrument_id,
      order_price,
      order_size,
      exec_price,
      exec_order,
      timestamp,
    ];
    const query = `INSERT INTO trading.order_result\
  (user_id, instrument_id, order_price, order_size, exec_price, exec_size, exec_time)\
  VALUES (?, ?, ?, ?, ?, ?, ?);`;
    await (await connection).execute(query, values);
  }

  async getFetch(uid, base_time) {
    const values = [uid, base_time];
    const query = `SELECT instrument_id, exec_price, exec_size\
  FROM trading.order_result WHERE user_id = ? AND exec_time > ?`;
    console.log(query);
    const [rows] = await (await connection).execute(query, values);
    return rows;
  }
}
