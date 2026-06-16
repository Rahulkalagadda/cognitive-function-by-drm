import { User } from "./common.types";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  pin?: string;
  role: 'doctor' | 'patient';
}
