import express from 'express'
import { chat } from '../controllers/chatController.js'
import { protect } from '../middleware/authMiddleware.js'

const chatRouter = express.Router()

chatRouter.post('/', protect, chat)

export default chatRouter