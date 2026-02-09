import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MONGO DB connected');
    } catch (error) {
        console.error("MONGO DB connection error:", error);
        process.exit(1);
    }
}