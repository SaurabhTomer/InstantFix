import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import connectDB from './config/db.js'
import redis from './config/redis.js'
import router from './Routes/authRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import ServiceRouter from './Routes/serviceRequestRoutes.js'
import adminRouter from './Routes/adminRoutes.js'

const app = express()

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



app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})