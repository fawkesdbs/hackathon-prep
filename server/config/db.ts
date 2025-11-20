import { Pool } from "pg";
import "dotenv/config";

// Ensure the connection string is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env");
}

// Create a new pool instance to manage database connections
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Optional: Log when a client connects to the database
pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database");
});

// Optional: Handle pool errors (e.g., idle client disconnected unexpectedly)
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});