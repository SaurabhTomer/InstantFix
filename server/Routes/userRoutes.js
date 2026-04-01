import express from 'express'
import { updateProfile } from '../controllers/userController.js'
import auth from '../middleware/auth.js'
import upload from '../config/upload.js'  

const userRoute = express.Router()

router.put('/update-profile', auth, upload.single('avatar'), updateProfile)

export default userRoute


