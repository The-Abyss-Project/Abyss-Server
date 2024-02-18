import { ErrorRequestHandler } from "express";
import AppError from "../models/appError";

const errorHandler: ErrorRequestHandler = (err: AppError, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      ...err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        message: err.message,
        status: err.status,
      });
    } else {
      console.log("💣 ERROR \n", err);
      res.status(500).json({
        message: "Something went wrong",
        status: "error",
      });
    }
  }
};

export default errorHandler;
