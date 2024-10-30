export interface TrainerProfile {
  specialization: string;
  experience: string;
  certifications: string;
  hourlyRate: string;
}

export interface ClientProfile {
  age: string;
  height: string;
  weight: string;
  fitnessGoals: string;
  medicalConditions: string;
}

export interface UpdateProfileData {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  trainerProfile?: TrainerProfile;
  clientProfile?: ClientProfile;
} 