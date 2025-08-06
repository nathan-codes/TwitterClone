import { Router } from "express";
import { loginUser, logout, signup } from "../controllers/auth.controller.js";

const router = Router();

//
router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;
