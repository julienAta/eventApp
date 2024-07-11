import { User, NewUser, UpdateUser } from "../types/userTypes";
import * as argon2 from "argon2";
import { supabase } from "../supabase/supabaseClient";

export const addUser = async (user: NewUser): Promise<User> => {
  const hashedPassword = await argon2.hash(user.password);
  const { data, error } = await supabase
    .from("users")
    .insert({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    })
    .select()
    .single();

  if (error) throw error;
  return data as User;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data as User | null;
};

export const updateUser = async (
  id: string,
  updatedUser: UpdateUser
): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .update(updatedUser)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as User | null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("users").delete().eq("id", id);

  return !error;
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;
  return data as User[];
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as User | null;
};
