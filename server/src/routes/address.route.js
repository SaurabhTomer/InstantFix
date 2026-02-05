import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addAddress , deleteAddress } from "../controllers/user.controller.js";
import { getAllAddress, updateAddress } from "../controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.post("/address",authMiddleware , addAddress );
addressRouter.delete("/:addressId",authMiddleware , deleteAddress );
addressRouter.patch("/:addressId" , authMiddleware , updateAddress)
addressRouter.get("/addresses" , authMiddleware ,getAllAddress )


export default addressRouter;
