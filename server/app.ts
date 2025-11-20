import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
    res.send("Auth Service is running");
});

export default app;