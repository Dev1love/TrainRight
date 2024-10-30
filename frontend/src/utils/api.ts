import axios from 'axios';
import { ErrorHandler } from './errorHandler';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Let ErrorHandler handle other errors
    return Promise.reject(ErrorHandler.handleApiError(error));
  }
);

export const api = {
  get: <T>(url: string) => 
    axiosInstance.get<T>(url),
  
  post: <T>(url: string, data: unknown) => 
    axiosInstance.post<T>(url, data),
  
  put: <T>(url: string, data: unknown) => 
    axiosInstance.put<T>(url, data),
  
  delete: <T>(url: string) => 
    axiosInstance.delete<T>(url),

  // Mock API methods for development
  mock: {
    getWorkouts: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        data: {
          data: [
            {
              id: '1',
              title: 'Full Body Workout',
              exercises: [
                { name: 'Squats', sets: 3, reps: 12 },
                { name: 'Push-ups', sets: 3, reps: 15 }
              ],
              duration: '45 minutes',
              difficulty: 'intermediate'
            },
            {
              id: '2',
              title: 'Upper Body Focus',
              exercises: [
                { name: 'Bench Press', sets: 4, reps: 10 },
                { name: 'Pull-ups', sets: 3, reps: 8 }
              ],
              duration: '30 minutes',
              difficulty: 'advanced'
            }
          ]
        }
      };
    },

    getWorkout: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: {
          data: {
            id,
            title: 'Full Body Workout',
            exercises: [
              { name: 'Squats', sets: 3, reps: 12 },
              { name: 'Push-ups', sets: 3, reps: 15 },
              { name: 'Pull-ups', sets: 3, reps: 8 }
            ],
            duration: '45 minutes',
            difficulty: 'intermediate'
          }
        }
      };
    }
  }
}; 