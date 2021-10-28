import { Router } from "express";
import auth from "./auth.js";
import order from "./order.js";
import fetch from "./fetch.js";

export const router = Router();

router.use("/auth", auth);
router.use("/order", order);
router.use("/fetch", fetch);
