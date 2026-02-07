import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model.js"

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const adminExists = await User.findOne({ role: "ADMIN" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin@123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@instantfix.com",
      phone: "9999999999",
      password: hashedPassword,
      role: "ADMIN",
      approvalStatus: "approved",
    });

    console.log("Admin created successfully");
    console.log({
      email: admin.email,
      password: "admin@123",
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
