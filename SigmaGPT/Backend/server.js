import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", chatRoutes);

const connectDB = async () => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("Missing JWT_SECRET in environment");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
        process.exit(1);
    }
};

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`server running on ${PORT}`);
    });
};

startServer();
