import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEventById,
  deleteEventById,
} from "../controllers/eventController.js";
const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.put("/:id", updateEventById);
router.delete("/:id", deleteEventById);

export default router;
