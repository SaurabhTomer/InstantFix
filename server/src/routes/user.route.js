import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {  changePassword , deleteAccount, getMe } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/getme",authMiddleware ,  getMe);
userRouter.post("/change-password",authMiddleware ,  changePassword);
userRouter.delete("/delete-account",authMiddleware , deleteAccount );



export default userRouter;
