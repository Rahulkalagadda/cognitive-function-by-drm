import { LoginCredentials } from "@/types/auth.types";
import { User } from "@/types/common.types";
import { httpGet, httpPost, httpPostForm } from "../http";

export async function lookupPatient(identifier: string): Promise<{ patient_id: string; name: string; channel: string }> {
  return httpPost<{ patient_id: string; name: string; channel: string }>("/auth/patient/lookup", { identifier });
}

export async function requestOtp(patientId: string, channel: string, purpose: string = "login"): Promise<{ verification_id: string; expires_at: string; code_simulation?: string }> {
  return httpPost<any>("/auth/otp/request", {
    patient_id: patientId,
    channel,
    purpose,
  });
}

export async function verifyOtp(patientId: string, otpCode: string, purpose: string = "login"): Promise<{ verified: boolean }> {
  return httpPost<any>("/auth/otp/verify", {
    patient_id: patientId,
    purpose,
    otp_code: otpCode,
  });
}

export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  if (credentials.role === "doctor") {
    const res = await httpPostForm<{ access_token: string; token_type: string }>("/auth/login", {
      username: credentials.email || "",
      password: credentials.password || "",
    });
    
    const token = res.access_token;
    if (typeof window !== "undefined") {
      localStorage.setItem("cap_token", token);
    }
    
    const doctorRes = await httpGet<any>("/auth/me");
    
    const user: User = {
      id: doctorRes.id,
      name: doctorRes.name,
      email: doctorRes.email,
      role: "doctor",
      avatarUrl: doctorRes.avatar_url || undefined,
    };
    
    return { user, token };
  } else {
    // Real OTP-based patient authentication flow
    const identifier = credentials.email || "";
    const lookup = await lookupPatient(identifier);
    
    await verifyOtp(lookup.patient_id, credentials.pin || "", "login");
    
    const profile = await httpGet<any>(`/auth/patient/${lookup.patient_id}/profile`);
    const user: User = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: "patient",
      avatarUrl: undefined,
    };
    
    return { user, token: lookup.patient_id };
  }
}

export async function getCurrentUser(token: string): Promise<User | null> {
  try {
    const isJwt = token.includes(".");
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(token);

    if (isJwt) {
      if (typeof window !== "undefined") {
        localStorage.setItem("cap_token", token);
      }
      const doctorRes = await httpGet<any>("/auth/me");
      return {
        id: doctorRes.id,
        name: doctorRes.name,
        email: doctorRes.email,
        role: "doctor",
        avatarUrl: doctorRes.avatar_url || undefined,
      };
    } else if (isUuid) {
      const patientRes = await httpGet<any>(`/auth/patient/${token}/profile`);
      return {
        id: patientRes.id,
        name: patientRes.name,
        email: patientRes.email,
        role: "patient",
        avatarUrl: undefined,
      };
    } else {
      const patientRes = await httpPost<any>("/auth/patient/validate", { raw_token: token });
      return {
        id: patientRes.id,
        name: patientRes.name,
        email: patientRes.email,
        role: "patient",
        avatarUrl: undefined,
      };
    }
  } catch (e) {
    console.error("Failed to get current user:", e);
    return null;
  }
}

