import express from 'express'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';
import { createOrder, razorpayWebhook } from '../controllers/payment.controller';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const paymentRouter = express.Router();

// Apply general rate limiter to all payment routes
paymentRouter.use(apiLimiter);

paymentRouter.post("/create-order", authMiddleware, authorizeRoles("USER"), createOrder);
paymentRouter.post("/webhook", razorpayWebhook);

export default paymentRouter;