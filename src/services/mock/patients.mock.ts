import { Patient } from "@/types/patient.types";

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "pat-sunita-mehta",
    name: "Sunita Mehta",
    email: "sunita.mehta@gmail.com",
    age: 48,
    gender: "Female",
    phone: "9876543210",
    status: "Stable",
    medicalId: "AX8C92",
    assessmentToken: "sunita-token-48",
    doctorName: "Dr. Priya Sharma",
    lastAssessmentDate: "12 March 2025",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-03-12T10:30:00Z",
    scoresHistory: [
      { date: "Jan 15", score: 62 },
      { date: "Feb 12", score: 68 },
      { date: "Mar 12", score: 74 }
    ]
  },
  {
    id: "pat-arjun-bansal",
    name: "Arjun Bansal",
    email: "arjun.bansal@gmail.com",
    age: 32,
    gender: "Male",
    phone: "9823456789",
    status: "Scheduled",
    medicalId: "1024-X",
    assessmentToken: "arjun-token-32",
    doctorName: "Dr. Priya Sharma",
    lastAssessmentDate: undefined,
    createdAt: "2025-03-15T09:00:00Z",
    updatedAt: "2025-03-15T09:00:00Z",
    scoresHistory: []
  },
  {
    id: "pat-meera-patel",
    name: "Meera Patel",
    email: "meera.patel@yahoo.com",
    age: 54,
    gender: "Female",
    phone: "9812345670",
    status: "Stable",
    medicalId: "1056-K",
    assessmentToken: "meera-token-54",
    doctorName: "Dr. Priya Sharma",
    lastAssessmentDate: "28 February 2025",
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-28T14:20:00Z",
    scoresHistory: [
      { date: "Feb 1", score: 80 },
      { date: "Feb 28", score: 82 }
    ]
  },
  {
    id: "pat-ravi-kumar",
    name: "Ravi Kumar",
    email: "ravi.kumar@rediffmail.com",
    age: 67,
    gender: "Male",
    phone: "9898765432",
    status: "Critical",
    medicalId: "0988-J",
    assessmentToken: "ravi-token-67",
    doctorName: "Dr. Priya Sharma",
    lastAssessmentDate: "05 March 2025",
    createdAt: "2025-01-20T11:00:00Z",
    updatedAt: "2025-03-05T16:45:00Z",
    scoresHistory: [
      { date: "Jan 25", score: 55 },
      { date: "Feb 15", score: 50 },
      { date: "Mar 5", score: 42 }
    ]
  },
  {
    id: "pat-sana-nair",
    name: "Sana Nair",
    email: "sana.nair@outlook.com",
    age: 24,
    gender: "Female",
    phone: "9834567890",
    status: "Testing",
    medicalId: "1121-W",
    assessmentToken: "sana-token-24",
    doctorName: "Dr. Priya Sharma",
    lastAssessmentDate: "10 March 2025",
    createdAt: "2025-03-01T08:30:00Z",
    updatedAt: "2025-03-10T12:00:00Z",
    scoresHistory: [
      { date: "Mar 10", score: 88 }
    ]
  }
];

export async function fetchMockPatients(): Promise<Patient[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_PATIENTS];
}

export async function fetchMockPatientById(id: string): Promise<Patient | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_PATIENTS.find(p => p.id === id || p.medicalId === id);
}

export async function createMockPatient(patient: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const newPatient: Patient = {
    ...patient,
    id: `pat-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scoresHistory: []
  };
  MOCK_PATIENTS.push(newPatient);
  return newPatient;
}
