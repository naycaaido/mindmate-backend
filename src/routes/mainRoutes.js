import { Router } from "express";
import authRouter from "./authRoute.js";
import moodRouter from "./moodRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/mood", moodRouter);
export default router;
