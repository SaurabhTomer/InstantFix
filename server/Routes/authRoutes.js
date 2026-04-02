import express from 'express'
import { register, login, refresh, logout, getMe } from '../controllers/authController.js'
import { updateProfile } from '../controllers/userController.js'
import auth from '../middleware/auth.js'
import rateLimiter from '../middleware/rateLimiter.js'
import upload from '../config/multer.js'
import { sendOTP, verifyOTP, resetPassword } from '../controllers/forgorPasswordController.js'

const router = express.Router()

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/register', rateLimiter, register)
router.post('/login',    rateLimiter, login)
router.post('/refresh',  refresh)
router.post('/logout',   auth, logout)
router.get('/me',        auth, getMe)

// ─── Profile ──────────────────────────────────────────────────────────────────
router.put('/update-profile', auth, upload.single('avatar'), updateProfile)

// ─── Forgot Password ──────────────────────────────────────────────────────────
router.post('/forgot-password/send-otp',       rateLimiter, sendOTP)
router.post('/forgot-password/verify-otp',     verifyOTP)
router.post('/forgot-password/reset-password', resetPassword)

export default router