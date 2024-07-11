import { Request, Response } from "express";
import { NewUser, UpdateUser } from "../types/userTypes";
import * as userModel from "../models/userModel";
import * as argon2 from "argon2";
import { generateToken } from "../utils/jwtUtils";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
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
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching the user" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newUser: NewUser = req.body;
    const createdUser = await userModel.addUser(newUser);
    console.log(createdUser, "created user");

    res.status(201).json(createdUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while creating the user" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser: UpdateUser = req.body;
    const user = await userModel.updateUser(req.params.id, updatedUser);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while updating the user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const success = await userModel.deleteUser(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
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
    res.status(500).json({ message: "An error occurred during login" });
  }
};
