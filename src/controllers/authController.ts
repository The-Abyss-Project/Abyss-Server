import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { Types } from "mongoose";
import AppError from "../models/appError";
import User, { IUser } from "../models/user";
import catchAsync from "../utils/catchAsync";

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
}

const signToken = (id: Types.ObjectId) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

export const signup: RequestHandler = catchAsync(async (req, res, next) => {
  const newUser = new User(req.body as IUser);
  await newUser.save();

  const token = signToken(newUser._id);
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    token,
  });
});

export const login: RequestHandler = catchAsync(async (req, res, next) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password)
    throw new AppError("Please provide email and password!", 400);

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkPassword(password, user.password))) {
    throw new AppError("Incorrect email or password!", 401);
  }
  const token = signToken(user._id);
  res.status(200).json({ token });
});

export const isAuth: RequestHandler = catchAsync(async (req, res, next) => {
  let token = "";

  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) throw new AppError("Please login to get access!", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;

  const user = await User.findById(decoded.userId);
  if (!user)
    throw new AppError(
      "User belonging to this token does no longer exist!",
      401
    );

  if (user.checkPasswordChangedAfter(new Date(decoded.iat! * 1000)))
    throw new AppError(
      "User recently changed password. Please login again!",
      401
    );

  next();
});