import { Router } from "express";
import authController from "../controllers/authController.js";

const authRouter = Router();

// register & login
authRouter.post("/register", authController.registerUser);

authRouter.post("/login", authController.loginUser);

authRouter.post("/refresh", authController.loginUser);

authRouter.post("/logout", authController.logoutUser);

export default authRouter;
