// src/routes/analyticsRoute.js
import express from "express";
import { getMoodStability } from "../controllers/analyticsController.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

router.use(validateToken);

router.get("/stability", getMoodStability);

export default router;
