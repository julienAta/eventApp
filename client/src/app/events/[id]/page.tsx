"use client";

import React, { useState, useEffect } from "react";
import { EventDetail } from "@/components/event-detail";
import { Chat } from "@/components/chat";
import { Spinner } from "@/components/spinner";
import ExpenseManager from "@/components/ExpenseManager";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/event";

async function getCurrentUser() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function fetchEvent(id: number): Promise<Event> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Event not found");
    }

    console.log("Fetched event data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = parseInt(params.id, 10);

    async function fetchData() {
      try {
        setLoading(true);
        const [eventData, userData] = await Promise.all([
          fetchEvent(id),
          getCurrentUser(),
        ]);

        if (!userData) {
          router.push("/auth");
          return;
        }
        setEvent(eventData);
        setCurrentUser(userData);
        setIsParticipant(
          Array.isArray(eventData.users) &&
            eventData.users.includes(userData.id)
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Please log in to view this page</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-full w-full">
      <div className="flex flex-wrap -mx-4 h-full w-full">
        <div className="w-full px-4 mb-8">
          <EventDetail event={event} currentUser={currentUser} />
        </div>

        {!isParticipant && (
          <div className="w-full px-4 mb-8">
            <Alert>
              <AlertDescription>
                Join this event to access the chat and expense management
                features.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {isParticipant && (
          <>
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
              <Chat
                eventId={parseInt(params.id, 10)}
                currentUser={currentUser}
              />
            </div>
            <div className="w-full md:w-1/2 px-4">
              <ExpenseManager
                eventId={parseInt(params.id, 10)}
                currentUser={currentUser}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
