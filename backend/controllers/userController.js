import { users } from "../models/index.js";

export const getAllUsers = (req, res) => {
  res.json(users);
};

export const getUserById = (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
};

export const createUser = (req, res) => {
  const newUser = { id: Date.now().toString(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).send("User not found");
  }
};

export const deleteUser = (req, res) => {
  users = users.filter((u) => u.id !== req.params.id);
  res.status(204).send();
};
