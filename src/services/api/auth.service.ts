import { LoginCredentials } from "@/types/auth.types";
import { User } from "@/types/common.types";
import { mockLogin } from "../mock/auth.mock";

export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  // In a real application: return httpPost("/auth/login", credentials);
  return mockLogin(credentials);
}

export async function getCurrentUser(token: string): Promise<User | null> {
  // In a real application: return httpGet("/auth/me");
  if (token === "mock-doctor-jwt-token") {
    const { MOCK_DOCTOR } = await import("../mock/auth.mock");
    return MOCK_DOCTOR;
  } else {
    const { MOCK_PATIENT_USER } = await import("../mock/auth.mock");
    return MOCK_PATIENT_USER;
  }
}
