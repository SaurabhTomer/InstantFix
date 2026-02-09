
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    request: {      //  ek request pe ek hi rating
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
      unique: true, 
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    electrician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    review: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Rating = new mongoose.model("Rating" , ratingSchema);

export default Rating;
