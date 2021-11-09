import { Order } from "../models/order.js";
import { fetchApi } from "../util/api.js";

export const fetchService = {
  get: async (uid, base_time) => {
    const order = new Order();
    const orderResults = await order.getFetch(uid, base_time);
    if (orderResults.length === 0) throw new Error("데이터가 없습니다.");
    const tikers = await fetchApi.get();
    const result = calProfit(orderResults, tikers);
    return result;
  },
};

const calProfit = (orderResults, tickers) => {
  const total = [];
  orderResults.forEach((orderResult) => {
    const { exec_price, exec_size, instrument_id } = orderResult;
    const ticker = tickers.data.find((x) => x.instrument_id === instrument_id);
    const compare = exec_price - ticker.last;
    const long = (ticker.last - exec_price) * exec_size;
    const short = (exec_price - ticker.last) * exec_size;
    const value = {
      result: orderResult,
      profit: { compare, long, short },
    };
    total.push(value);
  });
  return total;
};
