import { Router } from "express";
import moodController from "../controllers/moodController.js"

const moodRouter = Router();

moodRouter.get("/", moodController.getMood);
moodRouter.post("/", moodController.createMood);
moodRouter.delete("/:id", moodController.deleteMood);
moodRouter.put("/:id", moodController.updateMood);

export default moodRouter;