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
    // this is used when user send data manualy like ne address while doing request
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },

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

    description: {
      type: String,
      required: true
    },

    images: [String],

    status: {
      type: String,
      enum: ["pending", "accepted", "completed" , "cancelled"],
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
