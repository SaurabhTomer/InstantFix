import upload from "../middlewares/multer.js"
import { cancelServiceRequest, createServiceRequest, getMyAllRequest, getMyRequestById } from "../controllers/service.controller.js";
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

//pagination
serviceRouter.get(
  "/",
  authMiddleware,
  authorizeRoles("USER"),
  getMyAllRequest
);


serviceRouter.get(
  "/my-request/:requestId",
  authMiddleware,
  authorizeRoles("USER"),
  getMyRequestById
);

serviceRouter.patch(
  "/:requestId/cancel",
  authMiddleware,
  authorizeRoles("USER"),
  cancelServiceRequest
);

export default serviceRouter;