import express from 'express'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware.js';
import { createOrder, razorpayWebhook, checkPaymentExists, verifyPayment } from '../controllers/payment.controller.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const paymentRouter = express.Router();

// Apply general rate limiter to all payment routes
paymentRouter.use(apiLimiter);

// Check if payment exists for a request
paymentRouter.get("/check/:requestId", authMiddleware, checkPaymentExists);

paymentRouter.post("/create-order", authMiddleware, authorizeRoles("USER"), createOrder);
paymentRouter.post("/verify", authMiddleware, authorizeRoles("USER"), verifyPayment);
paymentRouter.post("/webhook", razorpayWebhook);

export default paymentRouter;