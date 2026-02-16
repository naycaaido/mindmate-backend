import { Router } from "express";
import authRouter from "./authRoute.js";
import moodRouter from "./moodRoute.js";
import feelingRouter from "./feelingTagRoutes.js";
import moodTypeRoute from "./moodTypeRoute.js";
import analyticsRoute from "./analyticsRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/mood", moodRouter);
router.use("/feelings", feelingRouter);
router.use("/mood-type", moodTypeRoute);
router.use("/analytics", analyticsRoute);

export default router;
