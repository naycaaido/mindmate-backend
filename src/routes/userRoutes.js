import { Router } from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";

const userRoutes = Router();

userRoutes.use(validateToken);

userRoutes.get("/", userController.getMyProfile);
userRoutes.put("/edit", userController.updateProfile);

export default userRoutes;
