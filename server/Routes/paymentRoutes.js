import express from 'express'
import {
  createOrder,
  verifyPayment,
  markCashPaid,
  getPaymentByRequest,
} from '../controllers/paymentController.js'
import auth from '../middleware/auth.js'

const paymentRouter = express.Router()

paymentRouter.post('/create-order',          auth, createOrder)           // customer
paymentRouter.post('/verify',                auth, verifyPayment)         // customer
paymentRouter.post('/cash',                  auth, markCashPaid)          // electrician
paymentRouter.get('/request/:requestId',     auth, getPaymentByRequest)   // both

export default paymentRouter