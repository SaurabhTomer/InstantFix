import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addAddress, changePassword, deleteAddress, getMe } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/change-password",authMiddleware ,  changePassword);
userRouter.get("/getme",authMiddleware ,  getMe);
userRouter.post("/add-address",authMiddleware , addAddress );
userRouter.delete("/delete-address/:addressId",authMiddleware , deleteAddress );


export default userRouter;
