import express from 'express'
import {
  createReview,
  getElectricianReviews,
  getMyReviews,
  checkReview,
} from '../controllers/reviewController.js'
import  auth  from '../middleware/auth.js'  // your existing auth middleware

const reviewRouter = express.Router()

reviewRouter.post('/',                              auth, createReview)           // customer submits
reviewRouter.get('/my',                             auth, getMyReviews)           // customer's reviews
reviewRouter.get('/check/:requestId',               auth, checkReview)            // already reviewed?
reviewRouter.get('/electrician/:electricianId',              getElectricianReviews)  // public — no auth needed

export default reviewRouter