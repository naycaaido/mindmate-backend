import { Router } from "express";
import feelingController from "../controllers/feelingController.js";

const feelingRouter = Router();

feelingRouter.get("/", feelingController);

export default feelingRouter;
