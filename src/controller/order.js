import { Router } from "express";
import { authService } from "../service/auth.js";
import { orderService } from "../service/order.js";
import { order } from "../util/api.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { token, instrument_id, size, price, type1, type2 } = req.body;
    const uid = await authService.check(token);
    const result = await order.get(instrument_id);
    let { asks, bids, timestamp } = result.data;
    let results;
    if (type2 === "pendingOrder") {
      asks = asks.filter((ask) => ask[0] <= price);
      bids = bids.filter((bid) => bid[0] >= price);
    }
    if (type1 === "long") {
      results = doOrder(asks, price, size, timestamp);
    } else if (type1 === "short") {
      results = doOrder(bids, price, size, timestamp);
    }
    if (!results || results.length === 0)
      throw new Error("체결조건에 부합하지 않습니다.");
    console.log(results);
    for (const result of results) {
      await orderService.post(uid, instrument_id, result);
    }
    res.json(results);
  } catch (error) {
    let e = error.message;
    if (error.isAxiosError) e = error.response.data;
    res.status(400).json(e);
  }
});

export default router;

/**
 *
 * @param {[]} arrs
 * @param {*} size
 * @returns
 */
function doOrder(arrs, price, size, timestamp) {
  const result = [];
  let exec_size = 0;
  arrs.forEach((arr) => {
    const restSize = size - exec_size;
    if (restSize === 0) return;
    const exec_price = arr[0];
    const orders = parseInt(arr[3], 10);
    const exec_order = restSize - orders > 0 ? orders : restSize;
    exec_size += exec_order;
    const value = {
      order_price: price,
      order_size: size,
      exec_price,
      exec_order,
      timestamp,
    };
    result.push(value);
  });
  return result;
}
