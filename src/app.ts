import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import path from "path";
import globalErrorHandler from "./controllers/error.controller.js";
import userRouter from "./routes/user.route.js";
import ApiError from "./utils/ApiError.js";

const __dirname = path.resolve();
const app = express();

// Middlewares
if (process.env.NODE_ENV === "development") {
  console.log("Morgan enabled...");
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));

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
