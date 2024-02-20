import { NextFunction, Request, RequestHandler, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user";

export interface JWTPayload extends JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface AuthRequestHandler extends RequestHandler {
  (req: AuthRequest, res: Response, next: NextFunction): void;
}
