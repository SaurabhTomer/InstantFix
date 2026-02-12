import dotenv from "dotenv"
dotenv.config()

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import {OAuth2Client} from 'google-auth-library'

// google client id
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    //  Validate
    if (!idToken) {
      return res.status(400).json({
        success: false,
        msg: "Google ID token is required",
      });
    }

    //  Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        msg: "Google email not verified",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {

      //  Block electrician login via Google
      if (user.role === "ELECTRICIAN") {
        return res.status(403).json({
          success: false,
          msg: "Electricians must login using email/password",
        });
      }

      //  Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        user.avatar = picture;
        await user.save();
      }

    } else {
      //  Create new USER only
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        avatar: picture,
        role: "USER",
      });
    }

    //  Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    //   Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //  Response
    return res.status(200).json({
      success: true,
      msg: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Google authentication failed",
    });
  }
};


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
      role,
      approvalStatus: role === "ELECTRICIAN" ? "pending" : "approved",
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
        role: user.role,
        approvalStatus:user.approvalStatus
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Email and password are required" });
    }

    //  Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    //  Block Google users from password login
    if (user.authProvider === "google") {
      return res.status(400).json({
        msg: "This account is registered with Google. Please login using Google."
      });
    }

    //  Electrician approval check
    if (
      user.role === "ELECTRICIAN" &&
      user.approvalStatus !== "approved"
    ) {
      return res.status(403).json({
        msg: "Electrician account not approved by admin yet",
      });
    }

    //  Compare password
    const isMatch =  bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    //  Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    //  Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    //  Send response
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        approvalStatus: user.approvalStatus,
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
      secure: false,
      sameSite: "lax",
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
    // console.log(otp);

     const rediskey = `send_otp:${email}`;
    await redis.set(
      rediskey,
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





 