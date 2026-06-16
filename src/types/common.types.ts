export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Status = 'pending' | 'complete' | 'error' | 'info';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient';
  avatarUrl?: string;
}
