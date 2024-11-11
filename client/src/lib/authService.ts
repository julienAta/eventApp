const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signIn(email: string, password: string) {
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
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}

export async function signUp(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, rôle: "default" }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign up");
  }

  return response.json();
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("accessToken");
  }
  return false;
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_URL}/users/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function fetchWithToken(url: string, options: RequestInit = {}) {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token available");
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      // Token has expired, try to refresh it
      await refreshToken();
      accessToken = localStorage.getItem("accessToken");
      // Retry the original request with the new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "Failed to refresh token") {
      logout();
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
}
