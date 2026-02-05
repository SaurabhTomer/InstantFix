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

    issueType: {
      type: String,
      enum: ["fan", "light", "switch", "wiring", "other"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    images: [String],

    status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const ServiceRequest = mongoose.model(
  "ServiceRequest",
  serviceRequestSchema
);

export default ServiceRequest;
