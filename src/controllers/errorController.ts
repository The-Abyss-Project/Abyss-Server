import { ErrorRequestHandler, Request } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { MongoServerError } from "mongodb";
import { Error } from "mongoose";
import AppError from "../models/appError";

const handleDuplicateFields = (err: MongoServerError) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `Duplicate field (${field}) value: '${err.keyValue[field]}'. Please use another value!`,
    400
  );
};

const handleValidationError = (err: Error.ValidationError) => {
  const errors = Object.values(err.errors).map(el => el.message);

  return new AppError(`Invalid input data. ${errors.join(". ")}!`, 400);
};

const handleJwtError = (err: JsonWebTokenError) => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJwtExpireError = (err: TokenExpiredError) => {
  return new AppError("Token expired. Please log in again!", 401);
};

const sendErrorDev: ErrorRequestHandler = (err: AppError, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      ...err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd: ErrorRequestHandler = (err: AppError, req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
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

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error: AppError = new AppError(err.message, err.statusCode || 500);
  error.isOperational = err.isOperational || false;

  if (process.env.NODE_ENV === "development") {
    console.log(err);
    sendErrorDev(error, req, res, next);
  } else if (process.env.NODE_ENV === "production") {
    if (err instanceof MongoServerError && err.code === 11000)
      error = handleDuplicateFields(err);
    if (err instanceof Error.ValidationError)
      error = handleValidationError(err);
    if (err instanceof JsonWebTokenError) error = handleJwtError(err);
    if (err instanceof TokenExpiredError) error = handleJwtExpireError(err);

    sendErrorProd(error, req, res, next);
  }
};

export default errorHandler;
