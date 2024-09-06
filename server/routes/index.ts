import { Router } from "express";
import eventRoutes from "./eventRoutes.js";
import userRoutes from "./userRoutes.js";
import chatRoutes from "./chatRoutes.js";
import expenseRoutes from "./expenseRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const router = Router();

router.use("/events", eventRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatRoutes);
router.use("/expenses", expenseRoutes);
router.use("/upload", uploadRoutes);

export default router;
