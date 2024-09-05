import { Router } from "express";
import eventRoutes from "./eventRoutes.js";
import userRoutes from "./userRoutes.js";
import chatRoutes from "./chatRoutes.js";
import expenseRoutes from "./expenseRoutes.js";

const router = Router();

router.use("/events", eventRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatRoutes);
router.use("/expenses", expenseRoutes);

export default router;
