import { usePatientStore } from "@/stores/patient.store";

export function usePatient() {
  const {
    patients,
    selectedPatient,
    isLoading,
    error,
    fetchPatients,
    fetchPatientById,
    createPatient
  } = usePatientStore();

  return {
    patients,
    selectedPatient,
    isLoading,
    error,
    fetchPatients,
    fetchPatientById,
    createPatient
  };
}
