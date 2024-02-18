import { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../models/appError";

const catchAsync = (
  cb: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    cb(req, res, next).catch(next);
  };
};

export default catchAsync;
