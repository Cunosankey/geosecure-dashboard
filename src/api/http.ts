// Base URL for your backend API.
// - We first try to read NEXT_PUBLIC_API_BASE_URL from your environment (.env.local)
// - If it's not set, we fall back to your local mock server at http://localhost:5000
// The replace(/\/$/, "") just removes a trailing slash to avoid URLs like "//api/incidents".
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

// Supported HTTP methods (for reference). We don't use this directly below,
// but it's helpful to know what's typical for REST APIs.
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// A small error shape we throw when the server responds with a non-2xx status.
// This lets components catch and display friendly messages or access status codes.
export interface HttpError extends Error {
  status?: number; // e.g., 400, 404, 500
  details?: unknown; // parsed JSON error body (if any) or raw text
}

// Core request helper used by the convenience methods (get/post/etc.).
// - path: the API path, like "/api/incidents" (with or without leading slash)
// - options: any fetch options (method, headers, body, etc.)
// Returns a promise that resolves to the parsed response (JSON by default).
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Make a full URL by joining base + path, ensuring exactly one slash between them.
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  // Issue the HTTP request with JSON headers by default
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options, // the purpose of "...options" is to allow the caller to override any of the default settings above
  });

  // If server says anything outside 2xx, turn it into a thrown error
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err: HttpError = new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    err.status = res.status;
    try {
      // Many APIs return JSON error bodies; parse if possible
      err.details = JSON.parse(text);
    } catch (_) {
      err.details = text; // fallback to raw text
    }
    throw err;
  }

  // Parse successful responses.
  // If the server says it's JSON, parse as JSON; otherwise return text.
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

// A tiny convenience API that mirrors typical HTTP verbs.
// Each method just forwards to the core request() with the appropriate method and JSON-encoded body.
// This piece of code just makes it slightly easier to call GET/POST/PUT/PATCH/DELETE without repeating yourself.
export const http = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { method: "GET", ...(init || {}) }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, ...(init || {}) }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined, ...(init || {}) }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined, ...(init || {}) }),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { method: "DELETE", ...(init || {}) }),
};

export default http;
