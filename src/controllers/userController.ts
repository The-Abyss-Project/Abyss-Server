import User from "../models/user";
import { AuthRequestHandler } from "../types/auth";
import catchAsync from "../utils/catchAsync";
import { UpdateOne, deleteOne, findAll, findOne } from "./handleFactory";

export const getAllUsers = findAll(User);
export const getUser = findOne(User);
export const updateUser = UpdateOne(User);
export const deleteUser = deleteOne(User);
