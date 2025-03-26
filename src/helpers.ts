// Environment variables with defaults
const DATAMAKER_API_KEY = process.env.DATAMAKER_API_KEY;
const DATAMAKER_URL =
  process.env.DATAMAKER_URL ?? "https://cloud.datamaker.app";

// Helper function for making DataMaker API requests
export async function fetchDM<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const headers = {
    Authorization: DATAMAKER_API_KEY!,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${DATAMAKER_URL}/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
