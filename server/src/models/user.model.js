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
    electricianProfile: {
      skills: [String],
      experience: Number,
      certificates: [String],
      serviceArea: String,
      hourlyRate: Number,
      approved: {
        type: Boolean,
        default: false
      },
    },
    // 👇 electrician approval status
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    address: [addressSchema],

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      }
    },
  },


  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);

