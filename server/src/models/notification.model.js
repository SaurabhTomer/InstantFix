
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "REQUEST_ACCEPTED",
        "REQUEST_STARTED",
        "REQUEST_COMPLETED",
        "REQUEST_CANCELLED",
        "ELECTRICIAN_APPROVED",
        "ELECTRICIAN_REJECTED",
        "NEW_SERVICE_REQUEST",
        "REQUEST_ASSIGNED",
        "NEW_ELECTRICIAN_APPLICATION",
        "SERVICE_REQUEST_CREATED",
        "PAYMENT_SUCCESSFUL",
        "PAYMENT_FAILED",
        "ADMIN_BROADCAST",
      ],
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Notification = new mongoose.model("Notification" , notificationSchema);
export default Notification;
