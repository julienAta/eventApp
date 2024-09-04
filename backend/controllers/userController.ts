import { Request, Response } from "express";
import * as userModel from "../models/userModel.js";
import * as argon2 from "argon2";
import { generateToken } from "../utils/jwtUtils.js";
import {
  UserSchema,
  NewUserSchema,
  UpdateUserSchema,
} from "../schemas/userSchema.js";
import { logger } from "../app.js"; // Import the logger

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
  };
}

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userModel.getAllUsers();
    const validatedUsers = UserSchema.array().parse(users);
    logger.info("Retrieved all users successfully");
    res.json(validatedUsers);
  } catch (error) {
    logger.error("Error occurred while fetching users", { error });
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (user) {
      const validatedUser = UserSchema.parse(user);
      logger.info("Retrieved user by ID", { userId: req.params.id });
      res.json(validatedUser);
    } else {
      logger.warn("User not found", { userId: req.params.id });
      res.status(404).send("User not found");
    }
  } catch (error) {
    logger.error("Error occurred while fetching user", {
      error,
      userId: req.params.id,
    });
    res
      .status(500)
      .json({ message: "An error occurred while fetching the user" });
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      logger.warn("Unauthenticated user tried to access getCurrentUser");
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const userDetails = await userModel.getUserById(user.id);

    if (!userDetails) {
      logger.warn("User not found in getCurrentUser", { userId: user.id });
      res.status(404).json({ message: "User not found" });
      return;
    }

    logger.info("Retrieved current user", { userId: user.id });
    res.json({
      id: userDetails.id,
      name: userDetails.name,
    });
  } catch (error) {
    logger.error("Error in getCurrentUser", { error });
    res
      .status(500)
      .json({ message: "An error occurred while fetching user data" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newUser = NewUserSchema.parse(req.body);
    const createdUser = await userModel.addUser(newUser);
    const validatedUser = UserSchema.parse(createdUser);
    logger.info("User created successfully", { userId: validatedUser.id });
    res
      .status(201)
      .json({ message: "User created successfully", user: validatedUser });
  } catch (error) {
    if (error instanceof Error) {
      logger.warn("Invalid input for user creation", { error: error.message });
      res.status(400).json({ error: error.message });
    } else {
      logger.error("Error occurred while creating user", { error });
      res
        .status(500)
        .json({ message: "An error occurred while creating the user" });
    }
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = UpdateUserSchema.parse(req.body);
    const user = await userModel.updateUser(req.params.id, updatedUser);
    if (user) {
      const validatedUser = UserSchema.parse(user);
      logger.info("User updated successfully", { userId: req.params.id });
      res.json(validatedUser);
    } else {
      logger.warn("User not found for update", { userId: req.params.id });
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.warn("Invalid input for user update", {
        error: error.message,
        userId: req.params.id,
      });
      res.status(400).json({ error: error.message });
    } else {
      logger.error("Error occurred while updating user", {
        error,
        userId: req.params.id,
      });
      res
        .status(500)
        .json({ message: "An error occurred while updating the user" });
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const success = await userModel.deleteUser(req.params.id);
    if (success) {
      logger.info("User deleted successfully", { userId: req.params.id });
      res.status(204).json({ message: "User deleted successfully" });
    } else {
      logger.warn("User not found for deletion", { userId: req.params.id });
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    logger.error("Error occurred while deleting user", {
      error,
      userId: req.params.id,
    });
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const loginSchema = NewUserSchema.pick({ email: true, password: true });
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      logger.warn("Login attempt with invalid email", { email });
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      logger.warn("Login attempt with invalid password", { email });
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user);
    logger.info("User logged in successfully", { userId: user.id });
    res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      logger.warn("Invalid input for login", { error: error.message });
      res.status(400).json({ error: error.message });
    } else {
      logger.error("Error occurred during login", { error });
      res.status(500).json({ message: "An error occurred during login" });
    }
  }
};
