"use client";

import React, { useState, useEffect } from "react";
import { EventDetail } from "@/components/event-detail";
import { Chat } from "@/components/chat";
import { Spinner } from "@/components/spinner";
import ExpenseManager from "@/components/ExpenseManager";
import { refreshToken, logout } from "@/lib/authService";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("No access token available");
    throw new Error("No access token available");
  }
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.status === 401 || response.status === 403) {
    console.log(
      `Received ${response.status} status, attempting to refresh token`
    );
    try {
      const refreshResult = await refreshToken();
      if (refreshResult.success) {
        console.log("Token refresh successful, retrying original request");
        accessToken = localStorage.getItem("accessToken");
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        console.error("Token refresh failed");
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      await logout();
      throw new Error("Session expired. Please log in again.");
    }
  }
  return response;
}

async function getCurrentUser() {
  const response = await fetchWithAuth(`${API_BASE_URL}/users/me`);
  if (!response.ok) {
    console.error(`Failed to fetch current user. Status: ${response.status}`);
    throw new Error(`Failed to fetch current user. Status: ${response.status}`);
  }
  return response.json();
}

async function fetchEvent(id: number) {
  const response = await fetchWithAuth(`${API_BASE_URL}/events/${id}`);
  if (!response.ok) {
    console.error(`Failed to fetch event. Status: ${response.status}`);
    throw new Error(`Failed to fetch event. Status: ${response.status}`);
  }
  return response.json();
}

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const id = parseInt(params.id, 10);
    async function fetchData() {
      try {
        const [eventData, userData] = await Promise.all([
          fetchEvent(id),
          getCurrentUser(),
        ]);
        setEvent(eventData.event);
        setCurrentUser(userData);
      } catch (err: any) {
        console.error("Error fetching data", err);
        setError(err.message);
        if (
          err.message.includes("Session expired") ||
          err.message.includes("401") ||
          err.message.includes("403")
        ) {
          console.log("Redirecting to auth page due to authentication error");
          router.push("/auth");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id, router]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>An error occurred: {error}</p>;
  }

  if (!event) {
    return <p>Event not found</p>;
  }

  if (!currentUser) {
    return <p>Please log in to view this page</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-full w-full">
      <div className="flex flex-wrap -mx-4 h-full w-full">
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0 h-full">
          <EventDetail event={event} />
        </div>
        <div className="w-full md:w-1/2  flex flex-col justify-center items-center">
          <Chat eventId={parseInt(params.id, 10)} currentUser={currentUser} />
        </div>
      </div>
      <div className="mt-8">
        <ExpenseManager
          eventId={parseInt(params.id, 10)}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
