"use server";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetchEvents = async () => {
  try {
    const res = await fetch(`${backendUrl}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch events:", res.status, res.statusText);
      throw new Error("Failed to fetch events");
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Expected JSON response, but got:", contentType);
      throw new Error("Invalid content-type in response");
    }

    const data = await res.json();

    if (Array.isArray(data.events)) {
      return data.events;
    } else {
      console.error("Unexpected data format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
const fetchEvent = async (id: number) => {
  const res = await fetch(`${backendUrl}/events/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (!data) {
    throw new Error("Failed to fetch event");
  }
  return data;
};

export { fetchEvents, fetchEvent };
