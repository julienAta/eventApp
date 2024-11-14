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
  logoutUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshUserToken);

router.get("/me", getCurrentUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/logout", logoutUser);

export default router;
