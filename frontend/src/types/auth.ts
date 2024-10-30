export type UserRole = 'CLIENT' | 'TRAINER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  validatedAt?: string;
}

export interface Session {
  user: User;
  expires: string;
}

export interface WorkoutData {
  id: string;
  title: string;
  exercises: Exercise[];
  duration: string;
  difficulty: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
} 