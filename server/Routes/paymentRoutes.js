import express from 'express'
import {
  createOrder,
  verifyPayment,
  markCashPaid,
  getPaymentByRequest,
} from '../controllers/paymentController.js'
import { protect } from '../middleware/authMiddleware.js'

const paymentRouter = express.Router()

paymentRouter.post('/create-order',          protect, createOrder)           // customer
paymentRouter.post('/verify',                protect, verifyPayment)         // customer
paymentRouter.post('/cash',                  protect, markCashPaid)          // electrician
paymentRouter.get('/request/:requestId',     protect, getPaymentByRequest)   // both

export default paymentRouter