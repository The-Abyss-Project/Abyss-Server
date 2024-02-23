import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiRequest, JWTPayload } from "../types/auth.type";
import { Role } from "../types/user.type";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

export const isAuth = catchAsync(async (req: ApiRequest, res, next) => {
  let token = "";

  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) throw new ApiError("Please login to get access", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JWTPayload;

  const user = await User.findById(decoded.userId).select("-__v");
  if (!user)
    throw new ApiError(
      "User belonging to this token does no longer exist",
      401
    );

  if (user.checkPasswordChangedAfter(new Date(decoded.iat! * 1000)))
    throw new ApiError(
      "User recently changed password. Please login again",
      401
    );
  req.user = user;
  next();
});

export const allowFor = (...roles: Role[]) => {
  return (req: ApiRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role))
      throw new ApiError(
        "You do not have permission to perform this action",
        403
      );

    next();
  };
};
