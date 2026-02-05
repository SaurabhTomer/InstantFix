import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

//signup
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password , role} = req.body;

    // 1️⃣ Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // 2️⃣ Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role
      // address is optional at signup
    });

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,        // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 7️⃣ Send response
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email  || !password) {
      return res
        .status(400)
        .json({ msg: "Email/Phone and password are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 6️⃣ Send response
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


//Logout controller
export const Logout = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({ message: "Token not provided" });
    }

    // decode token to get expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // till this keep this token 
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    // blacklist token in redis
    await redis.set(`blacklist:${token}`, "true", "EX", ttl);

    // clear cookie if exists
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    // console.log(token);

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

//SEND OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({email});

    
    if (!user) {
      return res.status(200).json({
        message: "If the email exists, OTP has been sent",
      });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);

    const redisKey = `send_otp:${email}`;
    await redis.set(
      redisKey,
      otp,
      "EX",
      1 * 60
    );
    // console.log(otp);

   // after generating otp
    sendOtpEmail(email, otp)
    .catch(err => console.error("send otp failed:", err));

    return res.status(200).json({
      message: "OTP sent to your email",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//RESEND OTP

export const resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const redisKey = `resend_otp:${email}`;

    // 2. Prevent OTP spam (check existing OTP)
    const existingOtp = await redis.get(redisKey);

    if (existingOtp) {
      const ttl = await redis.ttl(redisKey);

      return res.status(429).json({
        message: `OTP already sent. Please wait ${ttl} seconds before requesting again.`,
      });
    }

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    // 4. Store OTP 
    await redis.set(redisKey, otp, "EX", 1 * 60);

    // 5. Send OTP email (NON-BLOCKING)
    sendOtpEmail(email, otp)
      .catch(err => console.error("Resend email OTP failed:", err));

    return res.status(200).json({
      message: "OTP resent successfully to your email",
    });

  } catch (error) {
    console.error("Resend email OTP error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const storedOtp = await redis.get(`send_otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP expired or not found",
      });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    
    await redis.del(`send_otp:${email}`); // OTP used once

    await redis.set(
      `sendotp_verified:${email}`,
      "true",   // flag
      "EX",
      5 * 60 // 5 minutes window to reset password
    );

    return res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// RESET PASSWORD 
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // 1️⃣ Validate input
    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    // 2️⃣ Check OTP verification flag (Redis)
    const isVerified = await redis.get(`sendotp_verified:${email}`);

    if (!isVerified) {
      return res.status(403).json({
        message: "OTP not verified or reset window expired",
      });
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update password in MongoDB
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 5️⃣ Cleanup Redis keys
    await redis.del(`sendotp_verified:${email}`);
    await redis.del(`send_otp:${email}`); // safety cleanup

    return res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};



// CHANGE PASSWORD (Profile Section)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const { oldPassword, newPassword } = req.body;

    // 1. Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    // 2. Get user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


 