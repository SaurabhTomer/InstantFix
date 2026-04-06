import express from 'express'
import { chat } from '../controllers/chatController.js'
// import { protect } from '../middleware/authMiddleware.js'
import auth from '../middleware/auth.js'

const chatRouter = express.Router()

chatRouter.post('/', auth, chat)

export default chatRouter