
console.log("🚀🚀🚀 RELOAD CHECK 🚀🚀🚀");
console.log("🚀🚀🚀 RELOAD CHECK 🚀🚀🚀");
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
import notificationRouter from './src/routes/notification.route.js';
import ratingRouter from './src/routes/rating.route.js';
import paymentRouter from './src/routes/payment.route.js';
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

console.log("🔥 LIVE RELOAD WORKING");



const app = express();

const port = process.env.PORT || 3000

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Request logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
// to get ip address from proxy
app.set("trust proxy" , 1);


connectDB();

app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/user/address" , addressRouter)
app.use("/api/service" , serviceRouter)
app.use("/api/admin" , adminRouter)
app.use("/api/electrician" , electricianRouter)
app.use("/api/notifications" , notificationRouter)
app.use("/api/ratings" , ratingRouter)
app.use("/api/payment" , paymentRouter)

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
    });
});

const server = http.createServer(app);
//  socket goes HERE
initSocket(server);

console.log("🔥 LIVE RELOAD TEST");

server.listen(port , () => {
    console.log(`server running at ${port}`)
})