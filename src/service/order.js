import { Order } from "../models/order.js";
import { orderApi } from "../util/api.js";

export const orderService = {
  save: async (user_id, body) => {
    let { instrument_id, size, price, type1, type2 } = body;
    const orderBook = await orderApi.get(instrument_id);
    let { asks, bids, timestamp } = orderBook.data;
    const arrs = orderType(type1, type2, price, asks, bids);
    const results = doOrder(arrs, price, size, timestamp);
    const order = new Order();
    for (const result of results) {
      const { order_price, order_size, exec_price, exec_size, timestamp } =
        result;
      await order.saveOrder(
        user_id,
        instrument_id,
        order_price,
        order_size,
        exec_price,
        exec_size,
        timestamp
      );
    }
    return results;
  },
};

const orderType = (type1, type2, price, asks, bids) => {
  if (type2 === "pendingOrder") {
    asks = asks.filter((ask) => ask[0] <= price);
    bids = bids.filter((bid) => bid[0] >= price);
  }
  const arrs = {
    long: asks,
    short: bids,
  };
  return arrs[type1];
};

const doOrder = (arrs, price, size, timestamp) => {
  const result = [];
  let exec_size = 0;
  arrs.forEach((arr) => {
    const restSize = size - exec_size;
    if (restSize === 0) return;
    const exec_price = arr[0];
    const orders = parseInt(arr[3], 10);
    const exec_order = restSize - orders > 0 ? orders : restSize;
    exec_size += exec_order;
    const value = orderResult(price, size, exec_price, exec_order, timestamp);
    result.push(value);
  });
  if (!result || result.length === 0)
    throw new Error("체결조건에 부합하지 않습니다.");
  return result;
};

const orderResult = (price, size, exec_price, exec_order, timestamp) => {
  return {
    order_price: price,
    order_size: size,
    exec_price,
    exec_size: exec_order,
    timestamp,
  };
};
