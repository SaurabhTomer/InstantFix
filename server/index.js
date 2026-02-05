import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/connectDB.js';
import authRouter from './src/routes/auth.route.js'

const app = express();

const port = process.env.PORT || 3000

app.use(cookieParser());
app.use(express.json())

connectDB();


app.use("/api/auth" , authRouter)

app.listen(port , () => {
    console.log(`server running at ${port}`)
})