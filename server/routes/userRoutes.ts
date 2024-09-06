import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getCurrentUser,
  refreshUserToken,
} from "../controllers/userController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", loginUser);
router.post("/", createUser);

router.use(authenticateJWT);

router.get("/me", getCurrentUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/refresh-token", refreshUserToken);

export default router;
