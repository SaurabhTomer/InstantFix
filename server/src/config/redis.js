import Redis from "ioredis";

// Store the Redis client instance globally to ensure singleton pattern
let redis = null;

// Function to get or create Redis client
const RedisClient = () => {

  if (!redis) {
    
    redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      // Retry connection with exponential backoff (max 2 seconds)
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      // Maximum retry attempts per request
      maxRetriesPerRequest: 3,
    });

    // Log successful connection
    redis.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });

    // Log connection errors
    redis.on("error", (err) => {
      console.error("❌ Redis connection error:", err);
    });
  }

  // Return the existing or newly created Redis instance
  return redis;
};


export default RedisClient();