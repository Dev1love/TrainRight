import axios from 'axios';

// Always use localhost for browser requests
const api = axios.create({
  baseURL: 'http://localhost:3000',  // Always use localhost for browser requests
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request logging with full URL
api.interceptors.request.use(request => {
  const fullUrl = request.baseURL + request.url;
  console.log('Starting Request:', {
    fullUrl,
    baseURL: request.baseURL,
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
});

// Add more detailed error logging
api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config.url,
        baseURL: error.config.baseURL,
        method: error.config.method,
        data: error.config.data
      }
    });
    return Promise.reject(error);
  }
);

// Add request interceptor for JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Get token from localStorage (only in browser)
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: async (email: string, password: string) => {
    try {
      console.log('API: Sending login request:', { email });
      const response = await api.post('/api/auth/login', { email, password });
      console.log('API: Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
};

interface TrainerProfile {
  specialization: string;
  experience: string;
  certifications: string;
  hourlyRate: string;
}

interface ClientProfile {
  age: string;
  height: string;
  weight: string;
  fitnessGoals: string;
  medicalConditions: string;
}

interface UpdateProfileData {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  trainerProfile?: TrainerProfile;
  clientProfile?: ClientProfile;
}

// User endpoints
export const users = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },
};

export default api; 