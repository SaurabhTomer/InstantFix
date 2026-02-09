import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    electrician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    rejectedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],


    issueType: {
      type: String,
      enum: ["Fan", "Light", "Switch", "Wiring", "Other"],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    description: {
      type: String,
      required: true
    },
    startedAt: Date,
    completedAt: Date,
    rejectedAt: Date,

    images: [String],

    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "in-progress", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);



serviceRequestSchema.index({ location: "2dsphere" });


const ServiceRequest = mongoose.model(
  "ServiceRequest",
  serviceRequestSchema
);

export default ServiceRequest;
