import express from 'express'
import { register, login, refresh, logout, getMe } from '../controllers/authController.js'
import auth from '../middleware/auth.js'
import rateLimiter from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', rateLimiter, login)
router.post('/refresh', refresh)
router.post('/logout', auth, logout)
router.get('/me', auth, getMe)

export default router