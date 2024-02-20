import { Model } from "mongoose";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  name: string;
  photo?: string;
  email: string;
  password: string;
  role: Role;
  passwordChangedAt: Date;
}

export interface IUserMethods {
  checkPassword: (password: string, hashedPassword: string) => Promise<boolean>;
  checkPasswordChangedAfter: (jwtTimestamp: Date) => boolean;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
