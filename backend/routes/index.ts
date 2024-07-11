import { Router } from "express";
import eventRoutes from "./eventRoutes";
import userRoutes from "./userRoutes";
import chatRoutes from "./chatRoutes";
import expenseRoutes from "./expenseRoutes";

const router = Router();

router.use("/events", eventRoutes);
router.use("/users", userRoutes);
router.use("/chat", chatRoutes);
router.use("/expenses", expenseRoutes);

export default router;
