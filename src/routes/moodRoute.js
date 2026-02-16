import { Router } from "express";
import moodController from "../controllers/moodController.js";
import validateToken from "../middleware/validateToken.js";

const moodRouter = Router();

moodRouter.use(validateToken);

moodRouter.get("/", moodController.getMood);

moodRouter.get("/streak-test", moodController.getMood);

moodRouter.post("/", moodController.createMood);

moodRouter.delete("/:id", moodController.deleteMood);

moodRouter.put("/:id", moodController.updateMood);

export default moodRouter;
