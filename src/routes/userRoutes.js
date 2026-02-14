import { Router } from "express";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";

const userRoutes = Router();

userRoutes.use(validateToken);

userRoutes.get("/", userController.getMyProfile);

export default userRoutes;
