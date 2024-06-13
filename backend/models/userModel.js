export let users = [
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

export const addUser = (user) => {
  users.push(user);
};

export const updateUser = (id, updatedUser) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
  }
};

export const deleteUser = (id) => {
  users = users.filter((user) => user.id !== id);
};
