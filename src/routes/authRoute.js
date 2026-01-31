import { Router } from "express";

const authRouter = Router();

// register & login
authRouter.post(
  "/register",
  validate(authValidation.registerSchema),
  authController.registerUser,
);

authRouter.post(
  "/login",
  validate(authValidation.loginSchema),
  authController.loginUser,
);

// refresh & logout
authRouter.post(
  "/refresh",
  validate(authValidation.refreshSchema),
  authController.refreshToken,
);

authRouter.post("/logout", authController.logoutUser);

export default authRouter;
