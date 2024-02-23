import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: "./env" });

// Handle uncaught exceptions
process.on("uncaughtException", err => {
  console.log("💥 Uncaught Exception Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import app from "./app.js";
import { connectToDb } from "./db/abyss.js";

// Connect to database
connectToDb();

// Start server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: string, promise: Promise<any>) => {
  console.log("💥 Unhandled Rejection Shutting down...");
  console.log(reason);
  server.close(() => {
    process.exit(1);
  });
});
