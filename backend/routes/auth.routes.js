import { Router } from "express";
import { getMe, loginUser, logout, signup } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

//
router.get("/me", protect, getMe);
router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;
