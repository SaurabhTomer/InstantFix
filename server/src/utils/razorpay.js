import Razorpay from "razorpay"

// Temporarily commented out for testing
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_key_secret",
});

export default razorpay;
