import { Router } from "express";
import {
  forgotPassword,
  login,
  signup,
} from "../controllers/auth.controller.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import { allowFor, isAuth } from "../middlewares/auth.middleware.js";
import { Role } from "../types/user.type.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
// router.post("/resetPassword/:resetToken",resetPassword);

router.get("/", isAuth, allowFor(Role.ADMIN, Role.USER), getAllUsers);

router
  .route("/:id")
  .get(isAuth, allowFor(Role.ADMIN, Role.USER), getUser)
  .patch(isAuth, allowFor(Role.ADMIN), updateUser)
  .delete(isAuth, allowFor(Role.ADMIN), deleteUser);

export default router;
