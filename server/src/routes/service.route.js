import upload from "../middlewares/multer.js"
import { createServiceRequest } from "../controllers/service.controller.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js";


import express from 'express'

const serviceRouter = express.Router();

serviceRouter.post(
  "/create",
  authMiddleware,
  authorizeRoles("USER"),
  upload.array("images", 5), 
  createServiceRequest
);


export default serviceRouter;