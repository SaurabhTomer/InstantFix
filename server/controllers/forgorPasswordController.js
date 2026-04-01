import bcrypt from 'bcryptjs'
import redis from '../config/redis.js'
import User from '../models/User.js'
import Electrician from '../models/Electrician.js'
import { sendOTPEmail } from '../utils/sendEmail.js'
import sendSMS from '../utils/sendSMS.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

// Search both collections with parallel queries instead of sequential
const findUser = async (identifier, method) => {
    const field = method === 'email' ? { email: identifier } : { phone: identifier }

    const [user, electrician] = await Promise.all([
        User.findOne(field).lean(),
        Electrician.findOne(field).lean()
    ])

    if (user)        return { user, collection: 'user' }
    if (electrician) return { user: electrician, collection: 'electrician' }
    return null
}

// ─── Send OTP ─────────────────────────────────────────────────────────────────

// @route POST /api/auth/forgot-password/send-otp
export const sendOTP = async (req, res, next) => {
    try {
        const { method, email, phone } = req.body

        if (!method || !['email', 'phone'].includes(method)) {
            return res.status(400).json({ success: false, message: 'Method must be email or phone' })
        }

        const identifier = method === 'email' ? email : phone

        if (!identifier) {
            return res.status(400).json({ success: false, message: `${method} is required` })
        }

        // BUG FIX: always return same response whether account exists or not
        // Original returned 404 if not found — this lets attackers enumerate
        // registered emails/phones (user enumeration vulnerability)
        const result = await findUser(identifier, method)

        const otp = generateOTP()

        if (result) {
            // Only store OTP and send if account actually exists
            await redis.set(`otp:${identifier}`, otp, 'EX', 10 * 60)

            // BUG FIX: original fired and forgot — no await, no error handling
            // If email/SMS fails, user gets success but never receives OTP
            try {
                if (method === 'email') {
                    await sendOTPEmail(identifier, otp)
                } else {
                    await sendSMS(phone, `Your InstantFix password reset OTP is: ${otp}. Valid for 10 minutes.`)
                }
            } catch (sendError) {
                // Clean up OTP from redis if sending failed
                await redis.del(`otp:${identifier}`)
                return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' })
            }
        }

        // Same response regardless — prevents user enumeration
        return res.status(200).json({
            success: true,
            message: `If an account exists, an OTP has been sent to your ${method === 'email' ? 'email' : 'phone'}`
        })
    } catch (error) {
        next(error)
    }
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────

// @route POST /api/auth/forgot-password/verify-otp
export const verifyOTP = async (req, res, next) => {
    try {
        const { method, email, phone, otp } = req.body

        if (!method || !otp) {
            return res.status(400).json({ success: false, message: 'method and otp are required' })
        }

        const identifier = method === 'email' ? email : phone

        if (!identifier) {
            return res.status(400).json({ success: false, message: `${method} is required` })
        }

        const storedOTP = await redis.get(`otp:${identifier}`)

        // BUG FIX: return same error for both expired and invalid OTP
        // Original returned different messages — attacker could distinguish
        // "OTP expired" vs "Invalid OTP" to know if OTP was ever sent
        if (!storedOTP || storedOTP !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' })
        }

        await redis.del(`otp:${identifier}`)
        await redis.set(`reset:${identifier}`, '1', 'EX', 10 * 60)

        return res.status(200).json({ success: true, message: 'OTP verified successfully' })
    } catch (error) {
        next(error)
    }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

// @route POST /api/auth/forgot-password/reset-password
export const resetPassword = async (req, res, next) => {
    try {
        const { method, email, phone, password, confirmPassword } = req.body

        if (!method || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' })
        }

        // BUG FIX: add minimum password length check
        // Original accepted any password including empty strings
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
        }

        const identifier = method === 'email' ? email : phone

        if (!identifier) {
            return res.status(400).json({ success: false, message: `${method} is required` })
        }

        const isVerified = await redis.get(`reset:${identifier}`)
        if (!isVerified) {
            return res.status(400).json({ success: false, message: 'Session expired, please start again' })
        }

        const result = await findUser(identifier, method)
        if (!result) {
            return res.status(404).json({ success: false, message: 'No account found' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const Model = result.collection === 'user' ? User : Electrician
        await Model.findByIdAndUpdate(result.user._id, { password: hashedPassword })

        // Clean up reset token after successful password change
        await redis.del(`reset:${identifier}`)

        return res.status(200).json({ success: true, message: 'Password reset successfully' })
    } catch (error) {
        next(error)
    }
}