import mongoose from 'mongoose'
import Review from '../models/Review.js'
import ServiceRequest from '../models/ServiceRequest.js'

// POST /api/reviews — customer submits a review
export const createReview = async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body
    const customerId = req.user._id

    // 1. Validate input
    if (!requestId || !rating) {
      return res.status(400).json({ message: 'requestId and rating are required' })
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    // 2. Fetch the request
    const request = await Request.findById(requestId)
    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    // 3. Must be the customer who created it
    if (request.customer.toString() !== customerId.toString()) {
      return res.status(403).json({ message: 'Not your request' })
    }

    // 4. Must be completed + paid
    if (request.status !== 'completed' || request.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Can only review completed and paid requests' })
    }

    // 5. Check duplicate — 1 review per request
    const existing = await Review.findOne({ request: requestId })
    if (existing) {
      return res.status(409).json({ message: 'You have already reviewed this request' })
    }

    // 6. Create review
    const review = await Review.create({
      request: requestId,
      customer: customerId,
      electrician: request.electrician,
      rating,
      comment: comment?.trim() || '',
    })

    res.status(201).json({ message: 'Review submitted', review })

  } catch (err) {
    console.error('createReview error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/reviews/electrician/:electricianId — get all reviews for an electrician
export const getElectricianReviews = async (req, res) => {
  try {
    const { electricianId } = req.params
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const skip  = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      Review.find({ electrician: electricianId })
        .populate('customer', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ electrician: electricianId }),
    ])

    // Calculate avg on the fly
    const aggr = await Review.aggregate([
      { $match: { electrician: new mongoose.Types.ObjectId(electricianId) } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])

    const avgRating    = aggr[0]?.avg    ? parseFloat(aggr[0].avg.toFixed(1)) : 0
    const totalReviews = aggr[0]?.count  || 0

    res.json({
      reviews,
      avgRating,
      totalReviews,
      page,
      totalPages: Math.ceil(total / limit),
    })

  } catch (err) {
    console.error('getElectricianReviews error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/reviews/my — customer sees their own submitted reviews
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user._id })
      .populate('electrician', 'name')
      .populate('request', 'category createdAt')
      .sort({ createdAt: -1 })

    res.json({ reviews })
  } catch (err) {
    console.error('getMyReviews error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/reviews/check/:requestId — check if review exists for a request
export const checkReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      request:  req.params.requestId,
      customer: req.user._id,
    })
    res.json({ reviewed: !!review, review: review || null })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}