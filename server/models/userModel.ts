import { User, NewUser, UpdateUser } from "../types/userTypes.js";
import * as argon2 from "argon2";
import { supabase } from "../supabase/supabaseClient.js";
import { logger } from "../utils/logger";

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

export const saveRefreshToken = async (
  userId: string,
  refreshToken: string
): Promise<void> => {
  try {
    logger.info(`Attempting to save refresh token for user: ${userId}`);

    // Calculate expiration date (e.g., 7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error } = await supabase.from("user_refresh_tokens").insert({
      user_id: userId,
      refresh_token: refreshToken,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      logger.error("Error inserting refresh token:", {
        errorObject: error,
        errorMessage: error.message,
        errorDetails: error.details,
        hint: error.hint,
        code: error.code,
        userId: userId,
      });
      throw new Error(
        `Failed to save refresh token: ${error.message || "Unknown error"}`
      );
    }

    logger.info(`Successfully saved refresh token for user: ${userId}`);
  } catch (error) {
    logger.error("Unexpected error in saveRefreshToken:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      userId: userId,
    });
    throw error;
  }
};

export const validateRefreshToken = async (
  userId: string,
  refreshToken: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("user_refresh_tokens")
    .select("*")
    .eq("user_id", userId)
    .eq("refresh_token", refreshToken)
    .single();

  if (error) return false;
  return !!data;
};

export const replaceRefreshToken = async (
  userId: string,
  oldRefreshToken: string,
  newRefreshToken: string
): Promise<void> => {
  const { error } = await supabase
    .from("user_refresh_tokens")
    .update({ refresh_token: newRefreshToken })
    .eq("user_id", userId)
    .eq("refresh_token", oldRefreshToken);

  if (error) throw error;
};

export const deleteRefreshToken = async (
  userId: string,
  refreshToken: string
): Promise<void> => {
  const { error } = await supabase
    .from("user_refresh_tokens")
    .delete()
    .eq("user_id", userId)
    .eq("refresh_token", refreshToken);

  if (error) throw error;
};

export const getUserByRefreshToken = async (
  refreshToken: string
): Promise<User | null> => {
  try {
    logger.info("Attempting to get user by refresh token");

    const { data, error } = await supabase
      .from("user_refresh_tokens")
      .select("user_id, users:user_id(*)")
      .eq("refresh_token", refreshToken)
      .single();

    if (error) {
      logger.error("Error fetching user by refresh token:", {
        errorObject: error,
        errorMessage: error.message,
        errorDetails: error.details,
        hint: error.hint,
        code: error.code,
      });
      return null;
    }

    if (!data) {
      logger.warn("No user found for the provided refresh token");
      return null;
    }

    logger.info("Successfully retrieved user by refresh token");
    return data.users as any;
  } catch (error) {
    logger.error("Unexpected error in getUserByRefreshToken:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    throw error;
  }
};
