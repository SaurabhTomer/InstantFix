import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
  type: String,
  default: ''
},
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    default: 'customer'
  },
  phone: {
    type: String,
    trim: true
  }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User