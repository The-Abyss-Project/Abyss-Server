import { Router } from "express";
import { allowFor, isAuth, login, signup } from "../controllers/authController";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController";
import { Role } from "../types/user";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/", isAuth, allowFor(Role.ADMIN, Role.USER), getAllUsers);

router
  .route("/:id")
  .get(isAuth, allowFor(Role.ADMIN, Role.USER), getUser)
  .patch(isAuth, allowFor(Role.ADMIN), updateUser)
  .delete(isAuth, allowFor(Role.ADMIN), deleteUser);

export default router;
