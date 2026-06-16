import { Patient, CreatePatientInput } from "@/types/patient.types";
import { fetchMockPatients, fetchMockPatientById, createMockPatient } from "../mock/patients.mock";

export async function getPatients(): Promise<Patient[]> {
  return fetchMockPatients();
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  return fetchMockPatientById(id);
}

export async function addPatient(input: CreatePatientInput): Promise<Patient> {
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
