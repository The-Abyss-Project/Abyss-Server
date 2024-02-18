import { RequestHandler } from "express";
import AppError from "../models/appError";
import User, { IUser } from "../models/user";
import catchAsync from "../utils/catchAsync";

export const getAllUsers: RequestHandler = catchAsync(
  async (req, res, next) => {
    const users = await User.find().select("-__v");

    res.status(200).json(users);
  }
);
