import mongoose from 'mongoose'

const serviceRequestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  electrician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Electrician',
    default: null
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'started', 'completed', 'cancelled'],
    default: 'pending'
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String,
    default: null
  }
}, { timestamps: true })

serviceRequestSchema.index({ location: '2dsphere' })

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema)

export default ServiceRequest