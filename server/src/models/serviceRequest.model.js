import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  electrician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  issueType: String,
  description: String,

  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


const serviceRequest = new mongoose.model("Service" , serviceRequestSchema)
export default serviceRequest;