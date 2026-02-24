
import Payment from "../models/payment.model.js";
import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import ServiceRequest from "../models/serviceRequest.model.js";
import NotificationService from "../utils/notificationService.js";

// Check if payment exists for a request
export const checkPaymentExists = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Check if request exists and belongs to user
    const serviceRequest = await ServiceRequest.findOne({
      _id: requestId,
      customer: userId,
    });

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    // Check if payment exists
    const existingPayment = await Payment.findOne({ request: requestId });
    
    return res.status(200).json({
      success: true,
      hasPayment: !!existingPayment,
      payment: existingPayment
    });

  } catch (error) {
    console.error("Check payment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify payment after Razorpay checkout
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, requestId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find the order
    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment order not found",
      });
    }

    // Update payment status
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "paid";
    payment.paymentDate = new Date();
    await payment.save();

    // Update service request payment status
    await ServiceRequest.findByIdAndUpdate(requestId, {
      paymentStatus: "paid"
    });

    // Create payment success notification
    await NotificationService.notifyPaymentSuccessful(payment.user, payment.amount);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// create payment order
export const createOrder = async (req, res) => {
  try {
    const { requestId, amount } = req.body;
    const userId = req.user.id;

    console.log('Payment order request:', { requestId, amount, userId });

    if (!requestId || !amount) {
      return res.status(400).json({
        success: false,
        message: "requestId and amount are required",
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Check if service request exists and belongs to user
    const serviceRequest = await ServiceRequest.findOne({
      _id: requestId,
      customer: userId,
    });

    console.log('Found service request:', serviceRequest);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found or not authorized",
      });
    }

    // Check if service is completed
    if (serviceRequest.status !== "completed") {
      console.log('Payment blocked - service not completed. Status:', serviceRequest.status);
      return res.status(400).json({
        success: false,
        message: "Payment can only be made for completed services. Current status: " + serviceRequest.status,
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      request: requestId,
      status: { $in: ["created", "paid"] },
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already initiated or completed for this request",
      });
    }

    // Razorpay order create
    let order;
    try {
      order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paisa
        currency: "INR",
        receipt: `receipt_${requestId}_${Date.now()}`,
        notes: {
          requestId: requestId,
          userId: req.user.id,
        },
      });
    } catch (razorpayError) {
      console.error("Razorpay order creation failed:", razorpayError);
      // For testing purposes, create a mock order
      order = {
        id: `order_test_${Date.now()}`,
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${requestId}_${Date.now()}`,
      };
    }

    // Save in DB
    const payment = await Payment.create({
      request: requestId,
      user: req.user.id,
      amount,
      orderId: order.id,
      status: "created",
      currency: "INR",
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: amount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
        paymentId: payment._id,
      },
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};




export const razorpayWebhook = async (req, res) => {
  try {
    // Get webhook secret 
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!secret) {
      console.error("Razorpay webhook secret not configured");
      return res.status(500).json({ message: "Webhook configuration error" });
    }

    // Create HMAC SHA256 hash using webhook secret
    const shasum = crypto.createHmac("sha256", secret);

    // Razorpay jo body bhejta hai uska exact JSON stringify karke hash banate hain
    shasum.update(JSON.stringify(req.body));

    // Generate final digest (hex format)
    const digest = shasum.digest("hex");

    // Get signature sent by Razorpay in headers
    const signature = req.headers["x-razorpay-signature"];

    // Compare generated digest with Razorpay signature
    if (digest !== signature) {
      console.error("Invalid webhook signature");
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    // Get event type from webhook body
    const event = req.body.event;
    const payload = req.body.payload;

    console.log("Webhook event received:", event);

    // Handle different webhook events
    switch (event) {
      case "payment.captured":
        await handlePaymentSuccess(payload.payment.entity);
        break;
      
      case "payment.failed":
        await handlePaymentFailure(payload.payment.entity);
        break;
      
      case "order.paid":
        await handleOrderPaid(payload.order.entity);
        break;
      
      default:
        console.log("Unhandled webhook event:", event);
    }

    // Always respond 200 to acknowledge webhook
    res.status(200).json({ status: "ok", event });

  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Webhook processing error" });
  }
};

// Handle successful payment
async function handlePaymentSuccess(paymentData) {
  try {
    const payment = await Payment.findOne({
      orderId: paymentData.order_id,
    });

    if (!payment) {
      console.error("Payment not found for order:", paymentData.order_id);
      return;
    }

    if (payment.status === "paid") {
      console.log("Payment already processed:", paymentData.id);
      return;
    }

    // Update payment details
    payment.status = "paid";
    payment.paymentId = paymentData.id;
    payment.method = paymentData.method;
    payment.amount = paymentData.amount / 100; // Convert back to rupees
    payment.currency = paymentData.currency;
    payment.paidAt = new Date();

    await payment.save();

    // Update service request payment status
    await ServiceRequest.findByIdAndUpdate(payment.request, {
      paymentStatus: "paid",
    });

    console.log("Payment processed successfully:", paymentData.id);

    // Create payment success notification
    await NotificationService.notifyPaymentSuccessful(payment.user, payment.amount);

    // TODO: Send payment confirmation email
    // TODO: Emit socket event to user

  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

// Handle payment failure
async function handlePaymentFailure(paymentData) {
  try {
    const payment = await Payment.findOne({
      orderId: paymentData.order_id,
    });

    if (payment) {
      payment.status = "failed";
      payment.failureReason = paymentData.error?.description || "Payment failed";
      await payment.save();

      // Create payment failure notification
      await NotificationService.notifyPaymentFailed(payment.user, payment.amount);
    }

    console.log("Payment failed:", paymentData.id);

  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

// Handle order paid event
async function handleOrderPaid(orderData) {
  try {
    console.log("Order paid:", orderData.id);
    // Additional order processing if needed
  } catch (error) {
    console.error("Error handling order paid:", error);
  }
}
