import bcrypt from "bcrypt";
import { model, Query, Schema } from "mongoose";
import { IUser, IUserMethods, Role, UserModel } from "../types/user";

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
    validate: {
      validator: function (value: string) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        return emailRegex.test(value);
      },
      message: "Please provide a valid email address",
    },
  },
  password: {
    type: String,
    select: false,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  role: {
    type: String,
    enum: Role,
    default: Role.USER,
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, +process.env.SALT_ROUNDS!);
  next();
});

userSchema.pre(/^find/, function (next) {
  if (this instanceof Query) this.select("-__v");
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
