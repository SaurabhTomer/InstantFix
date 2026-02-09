import { adminOnly } from "../middlewares/adminOnly.middleware.js";
import express from 'express'
import { authMiddleware } from './../middlewares/auth.middleware.js';
import { approveElectrician, rejectElectrician } from "../controllers/admiin.controller.js";

const adminRouter = express.Router();

// console.log(" admin.route.js loaded");
adminRouter.patch("/test", (req, res) => {
  res.send("ADMIN PATCH WORKING");
});
adminRouter.patch("/electrician/:requestId/approve", authMiddleware , adminOnly , approveElectrician)
adminRouter.patch("/electrician/:requestId/reject", authMiddleware , adminOnly , rejectElectrician)

export default adminRouter;