import { Router } from "express";
import { fireBase } from "../loader/firebase.js";
import { authService } from "../service/auth.js";
import crypto from "crypto";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("이메일 혹은 비밀번호를 입력하세요.");
    const result = await fireBase.register(email, password);
    const { uid } = result.user;
    await authService.register(uid, email, password);
    res.json("등록 성공");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("이메일 혹은 비밀번호를 입력하세요.");
    const result = await fireBase.login(email, password);
    const { uid } = result.user;
    const token = crypto.randomBytes(64).toString("hex");
    await authService.login(uid, email, password, token);
    res.json({ token });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default router;
