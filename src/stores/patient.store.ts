import { create } from "zustand";
import { Patient, CreatePatientInput } from "@/types/patient.types";
import { getPatients, getPatientById, addPatient } from "@/services/api/patients.service";

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  fetchPatientById: (id: string) => Promise<void>;
  createPatient: (input: CreatePatientInput) => Promise<Patient>;
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getPatients();
      set({ patients: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch patients", isLoading: false });
    }
  },

  fetchPatientById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const patient = await getPatientById(id);
      set({ selectedPatient: patient || null, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch patient", isLoading: false });
    }
  },

  createPatient: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const newPatient = await addPatient(input);
      set((state) => ({
        patients: [newPatient, ...state.patients],
        isLoading: false
      }));
      return newPatient;
    } catch (err: any) {
      set({ error: err.message || "Failed to create patient", isLoading: false });
      throw err;
    }
  }
}));
