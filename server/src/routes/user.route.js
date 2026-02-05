import express from "express";
import {authMiddleware, authorizeRoles} from "../middlewares/auth.middleware.js";
import {  changePassword , deleteAccount, getMe } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/getme",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" , "ADMIN"),  getMe);
userRouter.post("/change-password",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" , "ADMIN"),  changePassword);
userRouter.delete("/delete-account",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" , "ADMIN"), deleteAccount );



export default userRouter;
