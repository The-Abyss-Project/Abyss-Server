import bcrypt from "bcrypt";
import { Timestamp } from "mongodb";
import { Model, model, Schema } from "mongoose";

export interface IUser {
  name: string;
  photo?: string;
  email: string;
  password: string;
  passwordChangedAt: Date;
}

interface IUserMethods {
  checkPassword: (password: string, hashedPassword: string) => Promise<boolean>;
  checkPasswordChangedAfter: (jwtTimestamp: Date) => boolean;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    unique: true,
  },
  photo: String,
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, +process.env.SALT_ROUNDS!);
  next();
});

userSchema.methods.checkPassword = async function (
  password: string,
  hashedPassword: string
) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.methods.checkPasswordChangedAfter = function (jwtTimestamp: Date) {
  if (this.passwordChangedAt) {
    return jwtTimestamp < this.passwordChangedAt;
  }
  return false;
};

export default model<IUser, UserModel>("User", userSchema);
