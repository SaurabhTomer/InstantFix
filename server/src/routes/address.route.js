import express from "express";
import {authMiddleware, authorizeRoles} from "../middlewares/auth.middleware.js";
import { addAddress , deleteAddress } from "../controllers/user.controller.js";
import { getAllAddress, setDefaultAddress, updateAddress } from "../controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.post("/address",authMiddleware , authorizeRoles("USER"),addAddress );
addressRouter.delete("/:addressId",authMiddleware , authorizeRoles("USER"), deleteAddress );
addressRouter.patch("/:addressId" , authMiddleware , authorizeRoles("USER"), updateAddress)
addressRouter.get("/addresses" , authMiddleware , authorizeRoles("USER"),getAllAddress )
addressRouter.patch("/:addressId/default" , authMiddleware , authorizeRoles("USER"),setDefaultAddress )


export default addressRouter;
