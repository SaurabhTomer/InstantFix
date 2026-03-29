import express from 'express'
import { updateProfile } from '../controllers/userController.js'
import auth from '../middleware/auth.js'

const userRoute = express.Router()

userRoute.put('/profile', auth, updateProfile)

export default userRoute