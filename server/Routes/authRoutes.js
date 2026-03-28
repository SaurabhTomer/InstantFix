import express from 'express'
import { register, login, refresh, logout, getMe } from '../controllers/authController.js'
import auth from '../middleware/auth.js'
import rateLimiter from '../middleware/rateLimiter.js'
import { resetPassword, sendOTP, verifyOTP } from '../controllers/forgorPasswordController.js'

const router = express.Router()

// auth routes
router.post('/register', register)
router.post('/login', rateLimiter, login)
router.post('/refresh', refresh)
router.post('/logout', auth, logout)
router.get('/me', auth, getMe)

// forgot password routes
router.post('/forgot-password/send-otp', sendOTP)
router.post('/forgot-password/verify-otp', verifyOTP)
router.post('/forgot-password/reset-password', resetPassword)

export default router