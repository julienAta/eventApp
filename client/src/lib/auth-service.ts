"use server";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}
import { cookies } from "next/headers";

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to sign in");
    }

    const data = await response.json();
    const token = data.accessToken;
    const refreshToken = data.refreshToken;

    cookies().set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    cookies().set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return data.user;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function signUp(name: string, email: string, password: string) {
  const testUser = {
    name: "Test User AAAAdzadazdAAAAAAA",
    email: "testdAAAAAdzdaAAAAAAAazd2@example.com",
    password: "password123",
    role: "default",
  };

  const user = {
    name,
    email,
    password,
    role: "default",
  };

  const response = await fetch("http://localhost:3000/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to sign up");
  }

  return data;
}
export async function getUser() {
  try {
    const accessToken = cookies().get("accessToken");

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function refreshToken() {
  try {
    const response = await fetch(`${API_URL}/users/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return await response.json();
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
}

export async function logout() {
  try {
    cookies().delete("accessToken");
    cookies().delete("refreshToken");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export const getAccessToken = async () => {
  const accessToken = await cookies().get("accessToken");
  if (!accessToken) {
    return null;
  }
  return accessToken.value;
};
