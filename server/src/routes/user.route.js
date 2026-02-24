import express from "express";
import {authMiddleware, authorizeRoles} from "../middlewares/auth.middleware.js";
import {  changePassword , deleteAccount, getMe, updateLocation, updateProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";
import { apiLimiter } from "../middlewares/rateLimiter.js";

const userRouter = express.Router();

 
// Apply to all user routes
userRouter.use(apiLimiter);

userRouter.post("/change-password",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" , "ADMIN"),  changePassword);
userRouter.get("/getme",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" , "ADMIN"),  getMe);
userRouter.patch(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  updateProfile
);

userRouter.delete("/delete-account",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN"), deleteAccount );
userRouter.post("/update-location",authMiddleware ,authorizeRoles("USER" , "ELECTRICIAN" ), updateLocation );



export default userRouter;
