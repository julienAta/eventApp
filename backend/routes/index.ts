import { Router } from "express";
import eventRoutes from "./eventRoutes";
import userRoutes from "./userRoutes";
import chatRoutes from "./chatRoutes";

const router = Router();

router.use("/events", eventRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatRoutes);

export default router;
