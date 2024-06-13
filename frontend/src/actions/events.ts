"use server";

const fetchEvents = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/events`, {
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

export default fetchEvents;
