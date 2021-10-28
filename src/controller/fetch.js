import { Router } from "express";
import { authService } from "../service/auth.js";
import { fetchService } from "../service/fetch.js";
import { fetch } from "../util/api.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { token, base_time } = req.body;
    const uid = await authService.check(token);
    const rows = await fetchService.get(uid, base_time);
    if (rows.length === 0) throw new Error("데이터가 없습니다.");
    const result = await fetch.get();
    const total = [];
    rows.forEach((row) => {
      const { exec_price, exec_size, instrument_id } = row;
      const ticker = result.data.find((x) => x.instrument_id === instrument_id);
      const compare = exec_price - ticker.last;
      const long = (ticker.last - exec_price) * exec_size;
      const short = (exec_price - ticker.last) * exec_size;
      const value = {
        result: row,
        profit: { compare, long, short },
      };
      total.push(value);
    });
    res.json(total);
  } catch (error) {
    let e = error.message;
    if (error.isAxiosError) e = error.response.data;
    res.status(400).json(e);
  }
});

export default router;
