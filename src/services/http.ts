// In production: use relative URL — Next.js rewrites proxy it to Railway server-side
// In development: call localhost backend directly
// This eliminates Mixed Content errors because the browser only ever calls Vercel (HTTPS)
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/v1"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getHeaders(contentType: string | null = "application/json"): HeadersInit {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("cap_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function httpGet<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: getHeaders(null),
  });
  if (!res.ok) {
    let errorDetail = `HTTP GET failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

export async function httpPost<T>(url: string, body: any): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: getHeaders("application/json"),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errorDetail = `HTTP POST failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

/**
 * Public GET — never sends Authorization header.
 * Use for patient-facing endpoints that authenticate via URL token query param.
 */
export async function httpGetPublic<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    let errorDetail = `HTTP GET failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

/**
 * Public POST — never sends Authorization header.
 * Use for patient-facing endpoints like /assessment/start.
 */
export async function httpPostPublic<T>(url: string, body: any): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errorDetail = `HTTP POST failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

export async function httpPostForm<T>(url: string, body: Record<string, string>): Promise<T> {
  const formBody = Object.keys(body)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
    .join('&');

  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: getHeaders("application/x-www-form-urlencoded"),
    body: formBody,
  });
  if (!res.ok) {
    let errorDetail = `HTTP POST (form) failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errorDetail;
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

