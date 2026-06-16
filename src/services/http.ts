export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function httpGet<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`);
  if (!res.ok) {
    throw new Error(`HTTP GET failed: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function httpPost<T>(url: string, body: any): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`HTTP POST failed: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
