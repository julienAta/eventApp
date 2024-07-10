import { Request, Response } from "express";
import { User, NewUser, UpdateUser } from "../types/userTypes";
import * as userModel from "../models/userModel";

export const getAllUsers = (req: Request, res: Response): void => {
  res.json(userModel.users);
};

export const getUserById = (req: Request, res: Response): void => {
  const user = userModel.users.find((u) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
};

export const createUser = (req: Request, res: Response): void => {
  const newUser: NewUser = req.body;
  const createdUser = userModel.addUser({
    id: Date.now().toString(),
    ...newUser,
  });
  res.status(201).json(createdUser);
};

export const updateUser = (req: Request, res: Response): void => {
  const updatedUser: UpdateUser = req.body;
  const user = userModel.updateUser(req.params.id, updatedUser);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
};

export const deleteUser = (req: Request, res: Response): void => {
  const success = userModel.deleteUser(req.params.id);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).send("User not found");
  }
};
