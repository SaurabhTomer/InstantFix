import { adminOnly } from "../middlewares/adminOnly.middleware.js";
import express from 'express'
import { authMiddleware } from './../middlewares/auth.middleware.js';
import { approveElectrician, getAllElectricians, getElectricianDetails, getPendingElectricians, rejectElectrician } from "../controllers/admiin.controller.js";

const adminRouter = express.Router();


adminRouter.patch("/electrician/:electricianId/approve", authMiddleware , adminOnly , approveElectrician);
adminRouter.patch("/electrician/:electricianId/reject", authMiddleware , adminOnly , rejectElectrician);

adminRouter.get("/electricians/pending", authMiddleware, adminOnly, getPendingElectricians);

adminRouter.get("/electricians", authMiddleware, adminOnly, getAllElectricians);

adminRouter.get("/electricians/:id", authMiddleware, adminOnly, getElectricianDetails);

export default adminRouter;