import { Role, User, PaginatedResponse } from '../types';
import { apiRequest, tokenStorage } from './apiClient';

type ApiBusiness = { id: number; name: string };
type ApiUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  business: ApiBusiness;
};

const SESSION_KEY = 'glovo_session_user';

const mapUser = (apiUser: ApiUser): User => ({
  id: String(apiUser.id),
  username: apiUser.username,
  email: apiUser.email,
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  name: `${apiUser.first_name} ${apiUser.last_name}`.trim() || apiUser.username,
  role: apiUser.role,
  businessId: String(apiUser.business?.id || ''),
  businessName: apiUser.business?.name || '',
});

const saveSessionUser = (user: User) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));

export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    const tokenData = await apiRequest<{ access: string; refresh: string }>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    tokenStorage.setTokens(tokenData.access, tokenData.refresh);

    const userData = await apiRequest<ApiUser>('/api/auth/me/');
    const mappedUser = mapUser(userData);
    saveSessionUser(mappedUser);
    return mappedUser;
  },

  signupBusinessAdmin: async (payload: {
    businessName: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> => {
    await apiRequest<ApiUser>('/api/auth/signup/', {
      method: 'POST',
      body: JSON.stringify({
        business_name: payload.businessName,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        first_name: payload.firstName,
        last_name: payload.lastName,
      }),
    });
    return authService.login(payload.username, payload.password);
  },

  logout: () => {
    tokenStorage.clear();
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (!tokenStorage.hasAccessToken()) {
      return null;
    }
    try {
      const userData = await apiRequest<ApiUser>('/api/auth/me/');
      const mappedUser = mapUser(userData);
      saveSessionUser(mappedUser);
      return mappedUser;
    } catch {
      authService.logout();
      return null;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiRequest<PaginatedResponse<ApiUser>>('/api/users/');
    return response.results.map(mapUser);
  },

  createUser: async (
    payload: {
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: Role;
    },
  ): Promise<User> => {
    const user = await apiRequest<ApiUser>('/api/users/', {
      method: 'POST',
      body: JSON.stringify({
        username: payload.username,
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        password: payload.password,
        role: payload.role,
      }),
    });
    return mapUser(user);
  },

  deleteUser: async (userId: string) => {
    await apiRequest(`/api/users/${userId}/`, { method: 'DELETE' });
  },
};
