import { NextFunction, Response } from "express";
import { Model } from "mongoose";
import AppError from "../models/appError";
import { AuthRequest } from "../types/auth";
import { IUser, Role } from "../types/user";
import catchAsync from "../utils/catchAsync";

export const findAll = (Model: Model<any, any, any>) => {
  return catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const doc = await Model.find();
      res.status(200).json(doc);
    }
  );
};

export const findOne = (Model: Model<any, any, any>) => {
  return catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) throw new AppError("No document found with that ID", 404);

      res.status(200).json(doc);
    }
  );
};

export const UpdateOne = (Model: Model<any, any, any>) => {
  return catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const doc = await Model.findByIdAndUpdate(
        req.params.id,
        req.body as IUser,
        { new: true, runValidators: true }
      );
      if (!doc) throw new AppError("No document found with that ID", 404);

      res.status(200).json(doc);
    }
  );
};

export const deleteOne = (Model: Model<any, any, any>) => {
  return catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw new AppError("No document found with that ID", 404);

      res.status(204).json(null);
    }
  );
};
