import jwt from 'jsonwebtoken'
import redis from '../config/redis.js'

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const isBlacklisted = await redis.get(`blacklist:${token}`)
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: 'Token is invalid' })
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded

    next()
  } catch (error) {
    next(error)
  }
}

export default auth