import { Request, Response } from "express";
import * as userModel from "../models/userModel.js";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

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
import { log } from "winston";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
  };
}
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret";

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

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    logger.error("Get current user error:", error);
    res.status(500).json({ message: "Failed to get user data" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newUser = NewUserSchema.parse(req.body);
    logger.info("Usesfully", newUser);
    console.log(newUser, "newUser");
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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await userModel.saveRefreshToken(user.id, refreshToken);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const refreshUserToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const user = await userModel.getUserByRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await userModel.replaceRefreshToken(user.id, refreshToken, newRefreshToken);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error("Token refresh error:", error);
    res.status(500).json({ message: "Token refresh failed" });
  }
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    await userModel.deleteRefreshToken(req.user.id, refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
