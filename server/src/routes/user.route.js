import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addAddress, changePassword, deleteAccount, deleteAddress, getMe } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/getme",authMiddleware ,  getMe);
userRouter.post("/change-password",authMiddleware ,  changePassword);
userRouter.post("/add-address",authMiddleware , addAddress );
userRouter.delete("/delete-address/:addressId",authMiddleware , deleteAddress );
userRouter.delete("/delete-account",authMiddleware , deleteAccount );


export default userRouter;
