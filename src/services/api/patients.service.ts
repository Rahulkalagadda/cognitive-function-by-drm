import { Patient, CreatePatientInput } from "@/types/patient.types";
import { fetchMockPatients, fetchMockPatientById, createMockPatient } from "../mock/patients.mock";
import { httpGet, httpPost } from "../http";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function getPatients(): Promise<Patient[]> {
  if (USE_MOCK) {
    return fetchMockPatients();
  }
  return httpGet<Patient[]>("/patients");
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  if (USE_MOCK) {
    return fetchMockPatientById(id);
  }
  try {
    return await httpGet<Patient>(`/patients/${id}`);
  } catch (e) {
    return undefined;
  }
}

export async function addPatient(input: CreatePatientInput): Promise<Patient> {
  if (USE_MOCK) {
    const defaultPatientData: Omit<Patient, "id" | "createdAt" | "updatedAt"> = {
      name: input.name,
      email: input.email,
      age: input.age,
      gender: input.gender,
      phone: input.phone,
      status: input.status,
      medicalId: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      assessmentToken: `token-${Math.random().toString(36).substring(2, 7)}`,
      doctorName: "Dr. Priya Sharma"
    };
    return createMockPatient(defaultPatientData);
  }
  return httpPost<Patient>("/patients", input);
}
