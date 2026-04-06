import express from 'express'
import {
  createReview,
  getElectricianReviews,
  getMyReviews,
  checkReview,
} from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'  // your existing auth middleware

const router = express.Router()

router.post('/',                              protect, createReview)           // customer submits
router.get('/my',                             protect, getMyReviews)           // customer's reviews
router.get('/check/:requestId',               protect, checkReview)            // already reviewed?
router.get('/electrician/:electricianId',              getElectricianReviews)  // public — no auth needed

export default router