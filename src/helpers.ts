import { config } from "dotenv";
config();

// Environment variables with defaults
const DATAMAKER_API_URL =
  process.env.DATAMAKER_API_URL ?? "https://api.datamaker.dev.automators.com";

const AUTOMATORS_AUTH_JWT = process.env.AUTOMATORS_AUTH_JWT;


export async function fetchAPI<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<T> {
  const fullUrl = `${DATAMAKER_API_URL.replace(/\/+$/, "")}/${endpoint.replace(
    /^\/+/,
    ""
  )}`;

  console.error(JSON.stringify({ fullUrl }));

  const response = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AUTOMATORS_AUTH_JWT}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody = await response.text();
    try {
      errorBody = JSON.parse(errorBody);
    } catch (e) {
      // Do nothing
      console.error(
        JSON.stringify({
          status: response.status,
          body: errorBody,
        })
      );
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
