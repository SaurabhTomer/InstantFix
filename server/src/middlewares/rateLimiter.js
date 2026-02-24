import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.js";



// Helper function to get the correct IP address
const getIP = (req) =>
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;


// Login limiter
export const loginLimiter = rateLimit({
     store: new RedisStore({            //redis store
    sendCommand: (...args) => redisClient.call(...args),
    prefix: "login_rl:",
  }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                       // 5 requests allowed
    keyGenerator: (req) => {
        const ip = getIP(req);
        console.log(ip);
        if (!ip) {
            throw new Error('Could not determine IP address');
        }

        return `login_${ip}`;
    },
    message: {
        success: false,
        message: "Too many login attempts. Try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


// Signup limiter with Redis store
export const signupLimiter = rateLimit({
     store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
    prefix: "signup_rl:",
  }),
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyGenerator: (req) => {
        const ip = getIP(req);
        if (!ip) {
            throw new Error('Could not determine IP address');
        }
        return `signup:${ip}`;
    },
    message: {
        success: false,
        message: "Too many signup attempts. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

 
// General API limiter (less strict)
export const apiLimiter = rateLimit({
     store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
    prefix: "apiLimiter:",
  }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    keyGenerator: (req) => `api:${getIP(req) || 'unknown'}`,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true
});

// Stricter limiter for service creation
export const serviceCreationLimiter = rateLimit({
     store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
    prefix: "serviceCreationLimiter:",
  }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 5 service creations per hour
    keyGenerator: (req) => `service_create:${getIP(req)}`,
    message: {
        success: false,
        message: "Too many service creation attempts. Try again later."
    },
    standardHeaders: true
});