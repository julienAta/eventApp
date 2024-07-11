"use client";

import React, { useState, useEffect } from "react";
import { EventDetail } from "@/components/event-detail";
import { Chat } from "@/components/chat";
import { Spinner } from "@/components/spinner";
import ExpenseManager from "@/components/ExpenseManager";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

async function getCurrentUser() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function fetchFullEventData(id: number) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch full event data");
  }

  return response.json();
}

export default function EventDetailClient({
  eventId,
  initialEventBasicInfo,
}: {
  eventId: number;
  initialEventBasicInfo: any; // Replace 'any' with a proper type for your event basic info
}) {
  const [eventBasicInfo, setEventBasicInfo] = useState(initialEventBasicInfo);
  const [fullEventData, setFullEventData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, eventData] = await Promise.all([
          getCurrentUser(),
          fetchFullEventData(eventId),
        ]);
        setCurrentUser(userData);
        setFullEventData(eventData);
      } catch (err) {
        console.log("error fetching data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [eventId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>An error occurred: {error}</p>;
  }

  if (!fullEventData) {
    return <p>Event not found</p>;
  }

  if (!currentUser) {
    return <p>Please log in to view this page</p>;
  }

  const eventToDisplay = fullEventData || eventBasicInfo;

  return (
    <div className="container mx-auto px-4 py-8 h-full">
      <div className="flex flex-wrap -mx-4 h-full ">
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0 h-full">
          <EventDetail event={eventToDisplay} />
        </div>
        <div className="w-full md:w-1/2 px-4 flex flex-col justify-center items-center">
          <Chat eventId={eventId} currentUser={currentUser} />
        </div>
      </div>
      <div className="mt-8">
        <ExpenseManager eventId={eventId} currentUser={currentUser} />
      </div>
    </div>
  );
}
