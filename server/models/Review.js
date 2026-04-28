import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: true,
    unique: true,          // 1 review per request — enforced at DB level
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  electrician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Electrician',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
  },
}, { timestamps: true })

export default mongoose.model('Review', reviewSchema)