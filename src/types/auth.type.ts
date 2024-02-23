import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "./user.type";

export interface JWTPayload extends jwt.JwtPayload {
  userId: string;
}

export interface ApiRequest extends Request {
  user?: IUser;
}

export interface ApiRequestHandler extends RequestHandler {
  (req: ApiRequest, res: Response, next: NextFunction): void;
}
