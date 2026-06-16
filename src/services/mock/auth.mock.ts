import { User } from "@/types/common.types";
import { LoginCredentials } from "@/types/auth.types";

export const MOCK_DOCTOR: User = {
  id: "doc-priya-sharma",
  name: "Dr. Priya Sharma",
  email: "priya.sharma@caphealth.org",
  role: "doctor",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXHfflbxMFHh9DbP-GFvqAesDGmFjK12yS4eNp9GAT_GLIcNoAMvS4zXOZsy7LMrRtzqOawOfzz6uFXCf-muy9PBUpwJa5GqNFHCuwRCYFBjIoRp2_qNkHtQFFUbkwCaUG71dn4qQBK4NVeHnba6MLvbx3_Y0PnHPE0cQmpT9QGl7U3lBH6NbOyYVfoE7VTyAuU-i6dOSWx5TNYW78eA9mQ1ZnmgjkUgkup8xCuUjWO96qGPRRoXC1FGsiVxcX7Rf42jeBfr4a-WI"
};

export const MOCK_PATIENT_USER: User = {
  id: "pat-sunita-mehta",
  name: "Sunita Mehta",
  email: "sunita.mehta@gmail.com",
  role: "patient",
  avatarUrl: undefined
};

export async function mockLogin(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Network delay

  if (credentials.role === 'doctor') {
    return {
      user: MOCK_DOCTOR,
      token: "mock-doctor-jwt-token"
    };
  } else {
    return {
      user: MOCK_PATIENT_USER,
      token: credentials.pin || "mock-patient-jwt-token"
    };
  }
}
