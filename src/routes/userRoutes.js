import { Router } from "express";
import upload from "../middleware/upload.js";
import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";

const userRoutes = Router();

userRoutes.use(validateToken);

userRoutes.get("/", userController.getMyProfile);
userRoutes.put("/edit", upload.single("file"), userController.updateProfile);

export default userRoutes;
