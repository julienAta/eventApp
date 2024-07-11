import { Request, Response } from "express";
import * as userModel from "../models/userModel";
import * as argon2 from "argon2";
import { generateToken } from "../utils/jwtUtils";
import {
  UserSchema,
  NewUserSchema,
  UpdateUserSchema,
} from "../schemas/userSchema";

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
    res.json(validatedUsers);
  } catch (error) {
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
      res.json(validatedUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
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
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const userDetails = await userModel.getUserById(user.id);

    if (!userDetails) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      id: userDetails.id,
      name: userDetails.name,
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
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
    res
      .status(201)
      .json({ message: "User created successfully", user: validatedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
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
      res.json(validatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
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
      res.status(204).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
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
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ message: "An error occurred during login" });
    }
  }
};
