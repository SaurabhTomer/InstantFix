import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    // retry connection every 2s, max 10 attempts
    if (times > 10) {
      console.error('Redis max retries reached')
      return null
    }
    return Math.min(times * 200, 2000)
  }
})

redis.on('connect', () => console.log('Redis connected'))
redis.on('error', (err) => console.error(`Redis error: ${err.message}`))

export default redis