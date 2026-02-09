import express from 'express'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware.js';
import { getAssignedRequests, getCompletedRequests, getNearbyRequests, setAvailability, setElectricianLocation } from '../controllers/service.electrician.controller.js';
import { getElectricianRatings } from '../controllers/rating.controller.js';

const electricianRouter = express.Router();

electricianRouter.patch(
  "/set-location",
  authMiddleware,
  authorizeRoles("ELECTRICIAN"),
  setElectricianLocation
);

//get near by requests
electricianRouter.get(
  "/nearby-requests",
  authMiddleware,
  authorizeRoles("ELECTRICIAN"),
  getNearbyRequests
);

// set availability
electricianRouter.patch("/availability",
  authMiddleware,
  authorizeRoles("ELECTRICIAN"),
  setAvailability);

//get all assigned request to a electrician(accepted , in progress)
electricianRouter.get("/assigned-requests",
  authMiddleware,
  authorizeRoles("ELECTRICIAN"),
  getAssignedRequests);

  //get completed request
electricianRouter.get("/completed-requests",
  authMiddleware,
  authorizeRoles("ELECTRICIAN"),
  getCompletedRequests);

// get all rating of electricians  public route
electricianRouter.get("/:electricianId/ratings" ,
    getElectricianRatings
  )

export default electricianRouter;
