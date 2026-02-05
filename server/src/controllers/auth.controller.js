import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

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