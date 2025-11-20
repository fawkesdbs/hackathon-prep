import app from "./app";
import dotenv from "dotenv";
import { pool } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test Database Connection
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL");
    client.release();

    // Start Listening
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

startServer();