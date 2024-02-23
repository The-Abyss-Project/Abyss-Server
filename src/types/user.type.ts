import { Document, Model, Schema, Types } from "mongoose";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  username: string;
  photo?: string;
  email: string;
  password: string;
  role: Role;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  resetTokenExpires?: Date;
}

export interface IUserMethods {
  checkPassword: (password: string, hashedPassword: string) => Promise<boolean>;
  checkPasswordChangedAfter: (jwtTimestamp: Date) => boolean;
  createForgetPasswordToken: () => string;
}

interface UserDocument
  extends IUser,
    IUserMethods,
    Document<unknown, {}, IUser> {
  _id: Types.ObjectId;
  _doc: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel
  extends Model<IUser, {}, IUserMethods, {}, UserDocument> {}
