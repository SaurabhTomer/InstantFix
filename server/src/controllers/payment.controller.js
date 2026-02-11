import Razorpay from "razorpay";
import Payment from "../models/Payment.js";
import razorpay from "../utils/razorpay.js";

// create payment order
export const createOrder = async (req, res) => {
  try {
    const { requestId, amount } = req.body;

    if (!requestId || !amount) {
      return res.status(400).json({
        success: false,
        message: "requestId and amount required",
      });
    }

    // Razorpay order create
    const order = await razorpay.orders.create({
      amount: amount * 100, // paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save in DB
    const payment = await Payment.create({
      request: requestId,
      user: req.user.id,
      amount,
      orderId: order.id,
      status: "created",
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};
