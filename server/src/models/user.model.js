import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({


  street: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },

    role: {
      type: String,
      enum: ["USER", "ELECTRICIAN", "ADMIN"],
      default: "USER"
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: [Number] // [longitude, latitude]
    },


    electricianProfile: {
      skills: [String],
      experience: Number,
      certificates: [String],
      serviceArea: String,
      hourlyRate: Number,
    },

    isAvailable: {
      type: Boolean,
      default: false
    },

    lastActiveAt: Date,
    
    averageRating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },
    //  electrician approval status
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    address: [addressSchema],
  },

  { timestamps: true }

);

export default mongoose.model("User", userSchema);
