import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
type CmsRefreshResponse = { access: string };
type ApiErrorResponse = { detail?: string; [key: string]: unknown };

export function getCmsToken() {
  return Cookies.get("cms_access_token");
}

export function setCmsTokens(access: string, refresh: string) {
  const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };
  Cookies.set("cms_access_token", access, { expires: 1 / 24, ...cookieOptions }); // 1 hour
  Cookies.set("cms_refresh_token", refresh, { expires: 7, ...cookieOptions }); // 7 days
}

export function clearCmsTokens() {
  Cookies.remove("cms_access_token");
  Cookies.remove("cms_refresh_token");
}

export async function cmsFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getCmsToken();
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string> | undefined) ?? {}),
  };

  // Only set application/json if body is not FormData
  if (!(options?.body instanceof FormData) && !("Content-Type" in headers)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_URL}/cms${endpoint}`, {
    ...options,
    headers,
  });

  // Handle Token Expiry
  if (response.status === 401) {
    const refreshToken = Cookies.get("cms_refresh_token");
    if (refreshToken) {
      const refreshRes = await fetch(`${API_URL}/cms/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (refreshRes.ok) {
        const { access } = (await refreshRes.json()) as CmsRefreshResponse;
        const cookieOptions = { secure: process.env.NODE_ENV === "production", sameSite: "strict" as const };
        Cookies.set("cms_access_token", access, { expires: 1 / 24, ...cookieOptions });
        headers["Authorization"] = `Bearer ${access}`;
        // Retry original request
        response = await fetch(`${API_URL}/cms${endpoint}`, { ...options, headers });
      } else {
        clearCmsTokens();
        window.location.href = "/cms/login";
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      clearCmsTokens();
      window.location.href = "/cms/login";
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    let errorMessage = `API Error ${response.status}`;
    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      errorMessage = errorData.detail || JSON.stringify(errorData);
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
