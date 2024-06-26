"use server";
const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
const fetchEvents = async () => {
  try {
    const res = await fetch(`${backendUrl}/api/events`, {
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

    if (Array.isArray(data)) {
      return data;
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
  const res = await fetch(`${backendUrl}/api/events/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export { fetchEvents, fetchEvent };
