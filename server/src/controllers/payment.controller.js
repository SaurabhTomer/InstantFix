
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




export const razorpayWebhook = async (req, res) => {
  try {
    //  Get webhook secret 
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    //  Create HMAC SHA256 hash using webhook secret
    const shasum = crypto.createHmac("sha256", secret);

    // Razorpay jo body bhejta hai uska exact JSON stringify karke hash banate hain
    shasum.update(JSON.stringify(req.body));

    // Generate final digest (hex format)
    const digest = shasum.digest("hex");

    //  Get signature sent by Razorpay in headers
    const signature = req.headers["x-razorpay-signature"];

    //  Compare generated digest with Razorpay signature
    if (digest !== signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    //  Get event type from webhook body
    const event = req.body.event;

    //  Handle only successful payment event
    if (event === "payment.captured") {

      // Extract payment details from payload
      const paymentData = req.body.payload.payment.entity;

      //  Find payment in DB using orderId
      const payment = await Payment.findOne({
        orderId: paymentData.order_id,
      });

      if (payment) {
        //  Mark payment as paid
        payment.status = "paid";

        //  Save Razorpay payment ID for future reference
        payment.paymentId = paymentData.id;

        await payment.save();
      }
    }

    //  Always respond 200 to acknowledge webhook
    res.status(200).json({ status: "ok" });

  } catch (error) {
    res.status(500).json({ message: "Webhook error" });
  }
};
