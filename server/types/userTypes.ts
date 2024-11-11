export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export type NewUser = Omit<User, "id">;
export type UpdateUser = Partial<NewUser>;
