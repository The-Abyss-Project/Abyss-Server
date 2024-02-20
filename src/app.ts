import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import globalErrorHandler from "./controllers/errorController";
import ApiError from "./models/appError";
import userRouter from "./routes/userRoutes";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
if (process.env.NODE_ENV === "development") {
  console.log("Morgan enabled...");
  app.use(morgan("dev"));
}
app.use(bodyParser.json());

// Routes
app.use("/api/v1/users", userRouter);

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
