import bcrypt from 'bcryptjs'
import redis from '../config/redis.js'
import User from '../models/User.js'
import Electrician from '../models/Electrician.js'
import { sendOTPEmail } from '../utils/sendEmail.js'
import sendSMS from '../utils/sendSMS.js'

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// finding user with one single function
const findUser = async (identifier, method) => {
  if (method === 'email') {
    const user = await User.findOne({ email: identifier })
    if (user) return { user, collection: 'user' }
    const electrician = await Electrician.findOne({ email: identifier })
    if (electrician) return { user: electrician, collection: 'electrician' }
  } else {
    const user = await User.findOne({ phone: identifier })
    if (user) return { user, collection: 'user' }
    const electrician = await Electrician.findOne({ phone: identifier })
    if (electrician) return { user: electrician, collection: 'electrician' }
  }
  return null
}

// @route POST /api/auth/forgot-password/send-otp
export const sendOTP = async (req, res, next) => {
  try {
    const { method, email, phone } = req.body
    const identifier = method === 'email' ? email : phone

    const result = await findUser(identifier, method)
    if (!result) {
      return res.status(404).json({ success: false, message: 'No account found' })
    }

    const otp = generateOTP()
    await redis.set(`otp:${identifier}`, otp, 'EX', 10 * 60)
    console.log(`OTP is ${otp}`)

    if (method === 'email') {
       sendOTPEmail(identifier, otp)
    } else {
       sendSMS(phone, `Your InstantFix password reset OTP is: ${otp}. Valid for 10 minutes.`)
    }

    return res.status(200).json({
      success: true,
      message: `OTP sent to your ${method === 'email' ? 'email' : 'phone'}`
    })
  } catch (error) {
    next(error)
  }
}

// @route POST /api/auth/forgot-password/verify-otp
export const verifyOTP = async (req, res, next) => {
  try {
    const { method, email, phone, otp } = req.body
    // console.log(req.body);
    
    const identifier = method === 'email' ? email : phone

    const storedOTP = await redis.get(`otp:${identifier}`)

    if (!storedOTP) {
      return res.status(400).json({ success: false, message: 'OTP expired' })
    }

    if (storedOTP !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    await redis.del(`otp:${identifier}`)
    await redis.set(`reset:${identifier}`, '1', 'EX', 10 * 60)

    return res.status(200).json({ success: true, message: 'OTP verified' })
  } catch (error) {
    next(error)
  }
}

// @route POST /api/auth/forgot-password/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { method, email, phone, password, confirmPassword } = req.body
    const identifier = method === 'email' ? email : phone

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' })
    }

    const isVerified = await redis.get(`reset:${identifier}`)
    if (!isVerified) {
      return res.status(400).json({ success: false, message: 'Session expired, start again' })
    }

    const result = await findUser(identifier, method)
    if (!result) {
      return res.status(404).json({ success: false, message: 'No account found' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    if (result.collection === 'user') {
      await User.findByIdAndUpdate(result.user._id, { password: hashedPassword })
    } else {
      await Electrician.findByIdAndUpdate(result.user._id, { password: hashedPassword })
    }

    await redis.del(`reset:${identifier}`)

    return res.status(200).json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    next(error)
  }
}