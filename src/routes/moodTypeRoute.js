import { Router } from "express";
import getAllMoodType from "../controllers/moodTypeController.js";

const moodTypeRoute = Router();

moodTypeRoute.get("/", getAllMoodType);

export default moodTypeRoute;
