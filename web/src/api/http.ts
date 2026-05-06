const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {})
      },
      credentials: 'include'
    });
  } catch (err: any) {
    // Common causes: API server not running, wrong VITE_API_URL, or browser CORS block.
    const hint = `Network error reaching API at ${API_URL}. Is the server running and is CORS allowing this origin?`;
    throw new ApiError(err?.message ? `${err.message}. ${hint}` : hint, 0, null);
  }

  const text = await res.text();
  const body = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const message = (body && typeof body === 'object' && 'error' in body)
      ? String((body as any).error)
      : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
