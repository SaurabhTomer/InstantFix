import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Electrician from '../models/Electrician.js'
import redis from '../config/redis.js'
import {
    generateAccessToken,
    generateRefreshToken,
    storeRefreshToken,
    blacklistAccessToken,
    deleteRefreshToken
} from '../utils/tokenUtils.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sendRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })
}

// ─── Register ─────────────────────────────────────────────────────────────────

// @route POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, role } = req.body

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        // Electrician register
        if (role === 'electrician') {
            const existing = await Electrician.findOne({ email }).lean()
            if (existing) {
                return res.status(400).json({ success: false, message: 'Email already exists' })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            await Electrician.create({ name, email, password: hashedPassword, phone, approvalStatus: 'pending' })

            return res.status(201).json({
                success: true,
                message: 'Registration successful, wait for admin approval'
            })
        }

        // Customer register (default)
        const existing = await User.findOne({ email }).lean()
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword, phone })

        const payload      = { id: user._id, role: user.role }
        const accessToken  = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        await storeRefreshToken(user._id, refreshToken)
        sendRefreshTokenCookie(res, refreshToken)

        return res.status(201).json({
            success: true,
            accessToken,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        })
    } catch (error) {
        next(error)
    }
}

// ─── Login ────────────────────────────────────────────────────────────────────

// @route POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }

        // ── Electrician login ──
        const electrician = await Electrician.findOne({ email }).select('+password')

        if (electrician) {
            const isMatch = await bcrypt.compare(password, electrician.password)
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' })
            }

            if (electrician.approvalStatus === 'pending') {
                return res.status(403).json({ success: false, message: 'Your account is pending approval' })
            }

            if (electrician.approvalStatus === 'rejected') {
                return res.status(403).json({ success: false, message: 'Your account has been rejected' })
            }

            const payload      = { id: electrician._id, role: 'electrician' }
            const accessToken  = generateAccessToken(payload)
            const refreshToken = generateRefreshToken(payload)

            await storeRefreshToken(electrician._id, refreshToken)
            sendRefreshTokenCookie(res, refreshToken)

            return res.status(200).json({
                success: true,
                accessToken,
                user: {
                    id:             electrician._id,
                    name:           electrician.name,
                    email:          electrician.email,
                    phone:          electrician.phone,
                    role:           'electrician',
                    approvalStatus: electrician.approvalStatus
                }
            })
        }

        // ── Customer / Admin login ──
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            // Same message for both cases — avoids user enumeration
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const payload      = { id: user._id, role: user.role }
        const accessToken  = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)

        await storeRefreshToken(user._id, refreshToken)
        sendRefreshTokenCookie(res, refreshToken)

        return res.status(200).json({
            success: true,
            accessToken,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        })
    } catch (error) {
        next(error)
    }
}

// ─── Refresh ──────────────────────────────────────────────────────────────────

// @route POST /api/auth/refresh
export const refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken
        if (!token) {
            return res.status(401).json({ success: false, message: 'No refresh token' })
        }

        // jwt.verify throws if expired or tampered — catches both cases
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

        const storedToken = await redis.get(`refresh:${decoded.id}`)
        if (!storedToken || storedToken !== token) {
            return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' })
        }

        const payload     = { id: decoded.id, role: decoded.role }
        const accessToken = generateAccessToken(payload)

        return res.status(200).json({ success: true, accessToken })
    } catch (error) {
        // jwt.verify throws JsonWebTokenError / TokenExpiredError
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' })
        }
        next(error)
    }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

// @route POST /api/auth/logout
export const logout = async (req, res, next) => {
    try {
        const accessToken  = req.headers.authorization?.split(' ')[1]
        const refreshToken = req.cookies?.refreshToken

        // Blacklist access token so it can't be reused within its remaining TTL
        if (accessToken) await blacklistAccessToken(accessToken)

        if (refreshToken) {
            // BUG FIX: was using wrong secret (JWT_REFRESH_SECRET vs REFRESH_TOKEN_SECRET)
            // Using jwt.decode here is intentional — we don't want logout to fail
            // just because the refresh token is already expired
            const decoded = jwt.decode(refreshToken)
            if (decoded?.id) await deleteRefreshToken(decoded.id)
        }

        clearRefreshTokenCookie(res)

        return res.status(200).json({ success: true, message: 'Logged out successfully' })
    } catch (error) {
        next(error)
    }
}

// ─── Get Me ───────────────────────────────────────────────────────────────────

// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
    try {
        const { id, role } = req.user

        const Model = role === 'electrician' ? Electrician : User

        const user = await Model.findById(id).select('-password').lean()

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        return res.status(200).json({ success: true, user })
    } catch (error) {
        next(error)
    }
}