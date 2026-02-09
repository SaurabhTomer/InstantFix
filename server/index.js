import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/connectDB.js';
import authRouter from './src/routes/auth.route.js'
import userRouter from './src/routes/user.route.js';
import addressRouter from './src/routes/address.route.js';
import serviceRouter from './src/routes/service.route.js';
import { initSocket } from './src/socket/socket.js';
import http from "http";
import adminRouter from './src/routes/admin.route.js';
import electricianRouter from './src/routes/electrician.route.js';


const app = express();

const port = process.env.PORT || 3000

app.use(cookieParser());
app.use(express.json())

connectDB();


app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/user/address" , addressRouter)
app.use("/api/service" , serviceRouter)
app.use("/api/admin" , adminRouter)
app.use("/api/electrician" , electricianRouter)


const server = http.createServer(app);
//  socket goes HERE
initSocket(server);

server.listen(port , () => {
    console.log(`server running at ${port}`)
})