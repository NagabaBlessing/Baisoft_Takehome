const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

// In local/dev environments, keep API calls relative by default so Vite's
// `/api` proxy can route traffic to the backend without CORS/mixed-content issues.
const API_BASE_URL = configuredApiBaseUrl.replace(/\/$/, '');
const ACCESS_TOKEN_KEY = 'glovo_access_token';
const REFRESH_TOKEN_KEY = 'glovo_refresh_token';

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const tokenStorage = {
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  hasAccessToken: () => Boolean(getAccessToken()),
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    tokenStorage.clear();
    return null;
  }

  const data = await response.json();
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  return data.access;
};

export const apiRequest = async <T>(path: string, options: RequestInit = {}, retry = true): Promise<T> => {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401 && retry) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      return apiRequest<T>(path, options, false);
    }
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      message = errorData.detail || JSON.stringify(errorData);
    } catch {
      // keep fallback message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

export const apiConfig = {
  baseUrl: API_BASE_URL,
};
