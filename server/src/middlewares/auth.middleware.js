import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

//verify token and pass id to request
export const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token" });
    }

    // 2️⃣ Check if token is blacklisted (logged out)
    const isBlacklisted = (await redis.get(`blacklist:${token}`)) || (await redis.get(token));
    if (isBlacklisted) {
      return res.status(401).json({ msg: "Session expired. Please login again" });
    }

    // 3️⃣ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    // 5️⃣ Move to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};


//role based
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Unauthorized access"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied for this role"
      });
    }

    next();
  };
};


