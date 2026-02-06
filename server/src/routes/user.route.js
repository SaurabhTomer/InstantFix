import express from "express";
import {authMiddleware, authorizeRoles} from "../middlewares/auth.middleware.js";
import {  changePassword , deleteAccount, getMe, updateProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/change-password",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" , "ADMIN"),  changePassword);
userRouter.get("/getme",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" , "ADMIN"),  getMe);
userRouter.patch(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  updateProfile
);

userRouter.delete("/delete-account",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" , "ADMIN"), deleteAccount );



export default userRouter;
