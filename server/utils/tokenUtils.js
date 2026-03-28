import dotenv from 'dotenv'
dotenv.config();
import jwt from 'jsonwebtoken'
import redis from '../config/redis.js'


// generate access token   (short time token)
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE
  })
}

// generate refresh token       (long time token)
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE
  })
}

// store refresh token in redis
export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh:${userId}`,
    refreshToken,
    'EX',
    7 * 24 * 60 * 60 // 7 days in seconds
  )
}

// blacklist access token on logout
export const blacklistAccessToken = async (token) => {
  const decoded = jwt.decode(token)
  const ttl = decoded.exp - Math.floor(Date.now() / 1000)
  if (ttl > 0) {
    await redis.set(`blacklist:${token}`, '1', 'EX', ttl)
  }
}

// delete refresh token from redis on logout
export const deleteRefreshToken = async (userId) => {
  await redis.del(`refresh:${userId}`)
}