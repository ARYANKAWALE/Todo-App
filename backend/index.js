import express from "express"
import mongoose from "mongoose"
import env from "dotenv"
import { dbConnect } from "./src/db/index.js"
import cookieParser from "cookie-parser"
import userRouter from "./src/routes/user.routes.js"
import todoRouter from "./src/routes/todo.routes.js"
import cors from "cors"
env.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [process.env.CORS_ORIGIN, "https://todo-app-p2hw.onrender.com", "https://todo-app-p2hw.onrender.com"],
    credentials: true
}))

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    try {
        await dbConnect();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

app.use("/api/v4/users", userRouter)
app.use("/api/v4/todos", todoRouter)

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is running perfectly! 🚀",
        success: true
    })
})

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
});

// Only listen if not running on Vercel
if (!process.env.VERCEL) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}

export default app