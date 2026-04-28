import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: true,
    unique: true,           // one payment record per request
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  electrician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  amount: { type: Number, required: true },   // in INR (not paise)
  method: {
    type: String,
    enum: ['online', 'cash'],
    required: true,
  },

  // Razorpay fields — only for online payments
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },

  paidAt: { type: Date },

}, { timestamps: true })

export default mongoose.model('Payment', paymentSchema)