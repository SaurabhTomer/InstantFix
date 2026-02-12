import express from 'express'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';
import { createOrder, razorpayWebhook } from '../controllers/payment.controller';

const paymentRouter = express.Router();


paymentRouter.post("/create-order", authMiddleware, authorizeRoles("USER"),  createOrder);
paymentRouter.post("/webhook", razorpayWebhook);

export default paymentRouter;