import upload from "../middlewares/multer.js"
import { createServiceRequest, getMyAllRequest } from "../controllers/service.controller.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js";


import express from 'express'

const serviceRouter = express.Router();

serviceRouter.post(
  "/create",
  authMiddleware,
  authorizeRoles("USER"),
  upload.array("images", 2), 
  createServiceRequest
);

serviceRouter.get(
  "/my",
  authMiddleware,
  authorizeRoles("USER"),
  getMyAllRequest
);


export default serviceRouter;