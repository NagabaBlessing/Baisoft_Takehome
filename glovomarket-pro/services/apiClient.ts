const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, '');
const ACCESS_TOKEN_KEY = 'glovo_access_token';
const REFRESH_TOKEN_KEY = 'glovo_refresh_token';

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const buildUrl = (path: string) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }
  return path;
};

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

  let response: Response;
  try {
    response = await fetch(buildUrl('/api/auth/refresh/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
  } catch {
    tokenStorage.clear();
    return null;
  }

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

  let response: Response;
  try {
    response = await fetch(buildUrl(path), { ...options, headers });
  } catch {
    throw new Error(
      `Cannot reach backend API. Start Django server and verify VITE_API_BASE_URL (current: ${API_BASE_URL || 'using Vite proxy / same-origin'}).`
    );
  }

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
      // keep fallback
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

export const apiConfig = {
  baseUrl: API_BASE_URL || '(vite proxy / same-origin)',
};
