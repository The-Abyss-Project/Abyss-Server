import { Router } from "express";
import { isAuth, login, signup } from "../controllers/authController";
import { getAllUsers } from "../controllers/userController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/", isAuth, getAllUsers);

export default router;
