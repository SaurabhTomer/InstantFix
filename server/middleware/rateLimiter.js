import redis from '../config/redis.js'

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip
    const key = `ratelimit:login:${ip}`

    const attempts = await redis.get(key)

    if (attempts >= 20) {
      return res.status(429).json({ success: false, message: 'Too many attempts, try after 15 minutes' })
    }

    await redis.set(key, (parseInt(attempts) || 0) + 1, 'EX', 15 * 60)

    next()
  } catch (error) {
    next(error)
  }
}

export default rateLimiter