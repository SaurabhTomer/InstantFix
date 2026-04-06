import express from 'express'
import {
  createReview,
  getElectricianReviews,
  getMyReviews,
  checkReview,
} from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'  // your existing auth middleware

const reviewRouter = express.Router()

reviewRouter.post('/',                              protect, createReview)           // customer submits
reviewRouter.get('/my',                             protect, getMyReviews)           // customer's reviews
reviewRouter.get('/check/:requestId',               protect, checkReview)            // already reviewed?
reviewRouter.get('/electrician/:electricianId',              getElectricianReviews)  // public — no auth needed

export default reviewRouter