import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import globalErrorHandler from "./controllers/error";
import ApiError from "./models/appError";

dotenv.config();
const app = express();

// Middlewares
app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  console.log("Morgan enabled...");
  app.use(morgan("dev"));
} 

// Routes

// Not found route
app.all("*", (req, res, next) => {
  next(
    new ApiError(
      `Can't perform (${req.method}) request on ${req.originalUrl}`,
      400
    )
  );
});

// Error handling middleware
app.use(globalErrorHandler);

export default app;
