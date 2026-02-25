import { adminOnly } from "../middlewares/adminOnly.middleware.js";
import express from 'express'
import { authMiddleware } from './../middlewares/auth.middleware.js';
import { approveElectrician, getAllElectricians, getElectricianDetails, getPendingElectricians, rejectElectrician, getAdminProfile, getAdminStats, getAllServiceRequests, updateServiceRequestStatus, assignElectricianToRequest, getAllUsers, updateUserStatus } from "../controllers/admiin.controller.js";

const adminRouter = express.Router();

// Get admin profile
adminRouter.get("/profile",
  authMiddleware,
  adminOnly,
  getAdminProfile);

// Get admin statistics
adminRouter.get("/stats",
  authMiddleware,
  adminOnly,
  getAdminStats);

// User management endpoints
adminRouter.get("/users",
  authMiddleware,
  adminOnly,
  getAllUsers);

adminRouter.patch("/users/:userId/status",
  authMiddleware,
  adminOnly,
  updateUserStatus);

// Service request management endpoints
adminRouter.get("/service-requests",
  authMiddleware,
  adminOnly,
  getAllServiceRequests);

adminRouter.patch("/service-requests/:requestId/status",
  authMiddleware,
  adminOnly,
  updateServiceRequestStatus);

adminRouter.patch("/service-requests/:requestId/assign",
  authMiddleware,
  adminOnly,
  assignElectricianToRequest);

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