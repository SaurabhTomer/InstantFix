import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'


const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const existing = await User.findOne({ email: 'admin@instantfix.com' })
    if (existing) {
      console.log('Admin already exists')
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash('admin123', 10)

    await User.create({
      name: 'Admin',
      email: 'admin@instantfix.com',
      password: hashedPassword,
      role: 'admin'
    })

    console.log('Admin created successfully')
    console.log('Email: admin@instantfix.com')
    console.log('Password: admin123')

    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

createAdmin()