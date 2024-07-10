import { Router } from "express";
import eventRoutes from "./eventRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/events", eventRoutes);
router.use("/users", userRoutes);

export default router;
