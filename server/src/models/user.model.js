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

    address: [addressSchema],
  },

  { timestamps: true }

);

export default mongoose.model("User", userSchema);
