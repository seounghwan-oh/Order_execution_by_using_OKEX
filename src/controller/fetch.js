import { Router } from "express";
import { authService } from "../service/auth.js";
import { fetchService } from "../service/fetch.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { token, base_time } = req.body;
    const user_id = await authService.check(token);
    const result = await fetchService.get(user_id, base_time);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
