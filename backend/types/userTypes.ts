export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type NewUser = Omit<User, "id">;
export type UpdateUser = Partial<NewUser>;
