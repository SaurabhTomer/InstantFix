import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
import { createServer } from 'http'                  
import { initSocket } from './config/socket.js'

import connectDB from './config/db.js'
import router from './Routes/authRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import ServiceRouter from './Routes/requestRoutes.js'
import adminRouter from './Routes/adminRoutes.js'
import electricianRouter from './Routes/electricianRoutes.js'
import paymentRouter from './Routes/paymentRoutes.js'
import reviewRouter from './Routes/reviewRoutes.js'
import chatRouter from './Routes/chatRoutes.js'


const app = express()
const httpServer = createServer(app)               // http server 
initSocket(httpServer)                            // socket init kro

connectDB()

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', router)
app.use('/api/requests', ServiceRouter)
app.use('/api/admin', adminRouter)
app.use('/api/electrician', electricianRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/chat', chatRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 5000


httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})