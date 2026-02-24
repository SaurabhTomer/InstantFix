import express from "express";
import { login, Logout, resendEmailOtp, resetPassword, sendOTP, signup, verifyOtp } from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { apiLimiter, loginLimiter, signupLimiter } from "../middlewares/rateLimiter.js";

const authRouter = express.Router();

authRouter.use(apiLimiter);

authRouter.post("/signup",signupLimiter, signup);
authRouter.post("/login", loginLimiter, login);
authRouter.get("/logout", authMiddleware , Logout);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/resend-otp", resendEmailOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);


export default authRouter;
