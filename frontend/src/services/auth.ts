import { axiosInstance, setAccessToken, getAccessToken, setRefreshToken } from './api/axiosInstance';
import { User } from '@/types';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'Client' | 'Freelancer';
}

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}


const refreshPromise: Promise<string | null> | null = null;

const parseJwt = (token: string): TokenPayload => {
  const payload = token.split('.')[1];
  if (!payload) throw new Error('Invalid token');
  return JSON.parse(atob(payload));
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = parseJwt(token);
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export { getAccessToken, setAccessToken };

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  
  setAccessToken(response.data.accessToken);
  setRefreshToken(response.data.refreshToken);
  return response.data;
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/register', data);
  setAccessToken(response.data.accessToken);
  setRefreshToken(response.data.refreshToken);
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch {
    // Continue even if API call fails
  }
  setAccessToken(null);
  setRefreshToken(null);
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/auth/me');
  return response.data;
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (!storedRefreshToken) return null;
    const response = await axiosInstance.post<{ accessToken: string, refreshToken?: string }>(
      `/auth/refresh?token=${encodeURIComponent(storedRefreshToken)}`
    );
    setAccessToken(response.data.accessToken);
    if (response.data.refreshToken) {
      setRefreshToken(response.data.refreshToken);
    }
    return response.data.accessToken;
  } catch {
    setAccessToken(null);
    setRefreshToken(null);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  return token !== null && !isTokenExpired(token);
};

export const getUserRole = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  try {
    return parseJwt(token).role;
  } catch {
    return null;
  }
};