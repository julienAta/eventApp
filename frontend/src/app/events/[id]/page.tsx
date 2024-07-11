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

async function fetchEvent(id: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event");
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
      } catch (err) {
        console.log("error fetching data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

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
    <div className="container mx-auto px-4 py-8 h-full">
      <div className="flex flex-wrap -mx-4 h-full ">
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0 h-full">
          <EventDetail event={event} />
        </div>
        <div className="w-full md:w-1/2 px-4 flex flex-col justify-center items-center">
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
