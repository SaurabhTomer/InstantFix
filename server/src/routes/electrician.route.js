import  express from 'express'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware.js';
import { getNearbyRequests, setElectricianLocation } from '../controllers/service.electrician.controller.js';

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

export default electricianRouter;
