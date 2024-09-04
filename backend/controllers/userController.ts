import { Request, Response } from "express";
import * as userModel from "../models/userModel.js";
import * as argon2 from "argon2";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtUtils.js";
import {
  UserSchema,
  NewUserSchema,
  UpdateUserSchema,
} from "../schemas/userSchema.js";
import { logger } from "../utils/logger";

import { supabase } from "../supabase/supabaseClient.js";
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
export const verifyUserExists = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (error) {
      logger.error("Error verifying user existence:", {
        errorObject: error,
        errorMessage: error.message,
        userId: userId,
      });
      return false;
    }

    return !!data;
  } catch (error) {
    logger.error("Unexpected error in verifyUserExists:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      userId: userId,
    });
    return false;
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const loginSchema = NewUserSchema.pick({ email: true, password: true });
  try {
    const { email, password } = loginSchema.parse(req.body);
    logger.info(`Login attempt for email: ${email}`);

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      logger.warn(`Login attempt with invalid email: ${email}`);
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    logger.info(`User found for email: ${email}`);

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      logger.warn(`Login attempt with invalid password for email: ${email}`);
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    logger.info(`Password verified for user: ${user.id}`);

    const userExists = await verifyUserExists(user.id);
    if (!userExists) {
      logger.error(`User not found in database: ${user.id}`);
      res.status(401).json({ message: "Invalid user" });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    logger.info(`Tokens generated for user: ${user.id}`);

    try {
      await userModel.saveRefreshToken(user.id, refreshToken);
    } catch (saveError) {
      logger.error(`Error saving refresh token:`, {
        error: saveError instanceof Error ? saveError.message : "Unknown error",
        stack: saveError instanceof Error ? saveError.stack : "No stack trace",
        userId: user.id,
      });
      res.status(500).json({ message: "Error during login process" });
      return;
    }

    logger.info(`User logged in successfully: ${user.id}`);
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Login error:`, {
        error: error.message,
        stack: error.stack,
      });
      if (error.message.includes("parse")) {
        res.status(400).json({ message: "Invalid input data" });
      } else {
        res
          .status(500)
          .json({ message: "An unexpected error occurred during login" });
      }
    } else {
      logger.error(`Unknown login error:`, { error });
      res
        .status(500)
        .json({ message: "An unexpected error occurred during login" });
    }
  }
};
