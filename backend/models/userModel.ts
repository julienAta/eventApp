import { User, NewUser, UpdateUser } from "../types/userTypes";

export let users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
  },
];

export const addUser = (user: User): User => {
  users.push(user);
  return user;
};

export const updateUser = (
  id: string,
  updatedUser: UpdateUser
): User | undefined => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    return users[index];
  }
  return undefined;
};

export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  users = users.filter((user) => user.id !== id);
  return users.length < initialLength;
};
