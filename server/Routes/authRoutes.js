import express from 'express'
import { register, login, refresh, logout, getMe } from '../controllers/authController.js'
import auth from '../middleware/auth.js'
import rateLimiter from '../middleware/rateLimiter.js'
import { sendOTP, verifyOTP, resetPassword } from '../controllers/forgotPasswordController.js'

const router = express.Router()

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/register',  rateLimiter, register)
router.post('/login',     rateLimiter, login)
router.post('/refresh',   refresh)
router.post('/logout',    auth, logout)
router.get('/me',         auth, getMe)

// ─── Forgot Password ──────────────────────────────────────────────────────────
router.post('/forgot-password/send-otp',      rateLimiter, sendOTP)
router.post('/forgot-password/verify-otp',    verifyOTP)
router.post('/forgot-password/reset-password', resetPassword)

export default router