import { adminOnly } from "../middlewares/adminOnly.middleware.js";
import express from 'express'
import { authMiddleware } from './../middlewares/auth.middleware.js';
import { approveElectrician, getAllElectricians, getElectricianDetails, getPendingElectricians, rejectElectrician } from "../controllers/admiin.controller.js";

const adminRouter = express.Router();

//approve elecetrician
adminRouter.patch("/electrician/:electricianId/approve",
  authMiddleware,
  adminOnly,
  approveElectrician);

  //reject electrician
adminRouter.patch("/electrician/:electricianId/reject",
  authMiddleware,
  adminOnly,
  rejectElectrician);

  //get all pending request of electrican to approve
adminRouter.get("/electricians/pending",
  authMiddleware,
  adminOnly,
  getPendingElectricians);

  //get all electricians
adminRouter.get("/electricians",
  authMiddleware,
  adminOnly,
  getAllElectricians);

  // get a single electrician by id
adminRouter.get("/electricians/:id",
  authMiddleware,
  adminOnly,
  getElectricianDetails);

export default adminRouter;