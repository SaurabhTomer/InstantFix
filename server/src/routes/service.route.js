import upload from "../middlewares/multer.js"
import { cancelServiceRequest, createServiceRequest, getMyAllRequest, getMyRequestById } from "../controllers/service.controller.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js";
import express from 'express'
import { acceptRequest, completeJob, startJob } from "../controllers/service.electrician.controller.js";
import { apiLimiter, serviceCreationLimiter } from "../middlewares/rateLimiter.js";

const serviceRouter = express.Router();

// Apply general rate limiter to all service routes
serviceRouter.use(apiLimiter);


//create request
serviceRouter.post(
  "/create",
  authMiddleware,
  authorizeRoles("USER"),
  upload.array("images", 2),
  serviceCreationLimiter,
  createServiceRequest
);

//pagination
serviceRouter.get(
  "/",
  authMiddleware,
  authorizeRoles("USER"),
  getMyAllRequest
);

// get reuest by id
serviceRouter.get(
  "/my-request/:requestId",
  authMiddleware,
  authorizeRoles("USER"),
  getMyRequestById
);

//cancel request from user end
serviceRouter.patch(
  "/:requestId/cancel",
  authMiddleware,
  authorizeRoles("USER"),
  cancelServiceRequest
);

//elcetrician accpets request
serviceRouter.patch(
  "/electrician/request/:requestId/accept",
  authMiddleware,
  authorizeRoles("ELECTRICIAN"),
  acceptRequest
);


serviceRouter.patch("/requests/:requestId/start", authMiddleware,  authorizeRoles("ELECTRICIAN"), startJob);


serviceRouter.patch("/requests/:requestId/complete", authMiddleware, authorizeRoles("ELECTRICIAN"), completeJob);



export default serviceRouter;