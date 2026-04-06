import crypto from 'crypto'
import razorpay from '../config/razorpay.js'
import Payment from '../models/Payment.js'
import ServiceRequest from '../models/ServiceRequest.js'


// POST /api/payments/create-order
export const createOrder = async (req, res) => {
  try {
    const { requestId } = req.body
    const customerId = req.user._id

    // Fetch & validate request
    const request = await Request.findById(requestId)

    if (!request) return res.status(404).json({ message: 'Request not found' })

    if (request.customer.toString() !== customerId.toString())
      return res.status(403).json({ message: 'Not your request' })

    if (request.status !== 'completed')
      return res.status(400).json({ message: 'Job not completed yet' })

    if (request.paymentStatus === 'paid')
      return res.status(400).json({ message: 'Already paid' })

    if (!request.totalAmount || request.totalAmount <= 0)
      return res.status(400).json({ message: 'Invalid amount on request' })

    //  Check if order already created (retry safe)
    let payment = await Payment.findOne({ request: requestId })

    if (payment?.razorpayOrderId && payment.status === 'pending') {
      return res.json({
        orderId:   payment.razorpayOrderId,
        amount:    payment.amount,
        currency:  'INR',
        keyId:     process.env.RAZORPAY_KEY_ID,
        paymentId: payment._id,
      })
    }

    //  Create Razorpay order (amount in paise)
    const order = await razorpay.orders.create({
      amount:   request.totalAmount * 100,
      currency: 'INR',
      receipt:  `receipt_${requestId}`,
    })

    //  Save payment record
    payment = await Payment.create({
      request:         requestId,
      customer:        customerId,
      electrician:     request.electrician,
      amount:          request.totalAmount,
      method:          'online',
      razorpayOrderId: order.id,
      status:          'pending',
    })

    res.json({
      orderId:   order.id,
      amount:    request.totalAmount,
      currency:  'INR',
      keyId:     process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    })

  } catch (err) {
    console.error('createOrder error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body

    //  Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' })
    }

    //  Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
        paidAt: new Date(),
      },
      { new: true }
    )
    if (!payment) return res.status(404).json({ message: 'Payment record not found' })

    //  Mark request as paid
    await Request.findByIdAndUpdate(payment.request, { paymentStatus: 'paid' })

    res.json({ message: 'Payment verified successfully', payment })

  } catch (err) {
    console.error('verifyPayment error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}


// POST /api/payments/cash
// Called by ELECTRICIAN after collecting cash from customer
export const markCashPaid = async (req, res) => {
  try {
    const { requestId } = req.body
    const electricianId = req.user._id

    const request = await Request.findById(requestId)
    if (!request) return res.status(404).json({ message: 'Request not found' })

    if (request.electrician.toString() !== electricianId.toString())
      return res.status(403).json({ message: 'Not your job' })

    if (request.status !== 'completed')
      return res.status(400).json({ message: 'Job not completed yet' })

    if (request.paymentStatus === 'paid')
      return res.status(400).json({ message: 'Already marked as paid' })

    // Create payment record
    const payment = await Payment.create({
      request:     requestId,
      customer:    request.customer,
      electrician: electricianId,
      amount:      request.totalAmount || 0,
      method:      'cash',
      status:      'paid',
      paidAt:      new Date(),
    })

    // Mark request as paid
    await Request.findByIdAndUpdate(requestId, { paymentStatus: 'paid' })

    res.json({ message: 'Cash payment recorded', payment })

  } catch (err) {
    console.error('markCashPaid error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/payments/request/:requestId
export const getPaymentByRequest = async (req, res) => {
  try {
    const payment = await Payment.findOne({ request: req.params.requestId })
      .populate('customer', 'name phone')
      .populate('electrician', 'name phone')

    if (!payment) return res.status(404).json({ message: 'No payment found' })

    res.json({ payment })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}