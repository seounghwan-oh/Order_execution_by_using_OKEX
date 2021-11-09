import { Router } from "express";
import { authService } from "../service/auth.js";
import { orderService } from "../service/order.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const user_id = await authService.check(body.token);
    const results = await orderService.save(user_id, body);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

export default router;
