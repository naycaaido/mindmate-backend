// src/routes/analyticsRoute.js
import express from "express";
import analyticsController from "../controllers/analyticsController.js";
import validateToken from "../middleware/validateToken.js";

const router = express.Router();

router.use(validateToken);

router.get("/stability", analyticsController.getMoodStability);

router.get("/top-triggers", analyticsController.getTopTriggers);

export default router;
