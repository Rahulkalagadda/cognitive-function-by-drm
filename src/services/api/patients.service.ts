import { Patient, CreatePatientInput } from "@/types/patient.types";
import { httpGet, httpPost } from "../http";
import { useAuthStore } from "@/stores/auth.store";

function mapPatientResponse(p: any): Patient {
  const authState = useAuthStore.getState();
  const currentDoctorName = authState.user?.role === "doctor" ? authState.user.name : undefined;

  return {
    id: p.id,
    name: p.name,
    email: p.email,
    age: p.age,
    gender: p.gender,
    phone: p.phone,
    status: p.status,
    medicalId: p.medical_id,
    assessmentToken: p.raw_assessment_link
      ? p.raw_assessment_link.substring(p.raw_assessment_link.lastIndexOf("/") + 1)
      : "",
    doctorName: p.doctor_name || currentDoctorName || "Clinician",
    lastAssessmentDate: p.last_assessment_date || undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at
  };
}

export async function getPatients(): Promise<Patient[]> {
  const authState = useAuthStore.getState();
  if (authState.user?.role === "patient") {
    const token = authState.token;
    if (!token) return [];
    try {
      const p = await httpPost<any>("/auth/patient/validate", { raw_token: token });
      return [mapPatientResponse(p)];
    } catch (_) {
      return [];
    }
  }

  const patients = await httpGet<any[]>("/patients");
  return patients.map(mapPatientResponse);
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  try {
    const authState = useAuthStore.getState();
    if (authState.user?.role === "patient" && authState.token) {
      const p = await httpPost<any>("/auth/patient/validate", { raw_token: authState.token });
      return mapPatientResponse(p);
    }
    const p = await httpGet<any>(`/patients/${id}`);
    return mapPatientResponse(p);
  } catch (e) {
    return undefined;
  }
}

export async function addPatient(input: CreatePatientInput): Promise<Patient> {
  const medicalId = `MED-${Math.floor(1000 + Math.random() * 9000)}`;
  const cleanPhone = input.phone.replace(/[^0-9]/g, "");

  const payload = {
    name: input.name,
    email: input.email,
    age: input.age,
    gender: input.gender,
    phone: cleanPhone,
    status: input.status,
    medical_id: medicalId,
    template_id: input.assessmentTemplateId || undefined
  };

  const p = await httpPost<any>("/patients/", payload);
  return mapPatientResponse(p);
}

export async function regenerateAssessmentLink(patientId: string): Promise<{ link: string; token: string } | null> {
  try {
    const p = await httpPost<any>(`/patients/${patientId}/regenerate-link`, {});
    if (p?.raw_assessment_link) {
      const token = p.raw_assessment_link.split("/").pop() || "";
      return { link: p.raw_assessment_link, token };
    }
    return null;
  } catch {
    return null;
  }
}
