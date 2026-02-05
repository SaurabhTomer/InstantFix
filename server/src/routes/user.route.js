import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { changePassword } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/change-password",authMiddleware ,  changePassword);


export default userRouter;
