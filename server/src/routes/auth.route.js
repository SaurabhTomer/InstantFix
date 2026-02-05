import express from "express";
import { login, Logout, resendEmailOtp, resetPassword, sendOTP, signup, verifyOtp } from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", authMiddleware , Logout);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/resend-otp", resendEmailOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
