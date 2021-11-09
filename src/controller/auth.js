import { Router } from "express";
import { authService } from "../service/auth.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    infoError(email, password);
    await authService.register(email, password);
    res.json("등록 성공");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    infoError(email, password);
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;

const infoError = (email, password) => {
  if (!email || !password)
    throw new Error("이메일 혹은 비밀번호를 입력하세요.");
};
