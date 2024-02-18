import mongoose from "mongoose";

// Handle uncaught exceptions
process.on("uncaughtException", err => {
  console.log("Uncaught Exception 💣 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import app from "./app";

// Connect to database
mongoose.connect(process.env.DATABASE_URL!).then(() => {
  console.log("Database connected...");
});

// Start server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: string, promise: Promise<any>) => {
  console.log("Unhandled Rejection 💣 Shutting down...");
  console.log(reason);
  server.close(() => {
    process.exit(1);
  });
});
