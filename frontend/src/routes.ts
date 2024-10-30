// Centralized route definitions
export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    CLIENT: '/dashboard/client',
    TRAINER: '/dashboard/trainer',
    ADMIN: '/dashboard/admin',
  },
  WORKOUTS: {
    LIST: '/workouts',
    DETAIL: (id: string) => `/workouts/${id}`,
    EDIT: (id: string) => `/workouts/${id}/edit`,
    CREATE: '/workouts/create',
  },
  PROFILE: {
    VIEW: '/profile/view',
    EDIT: '/profile/edit',
  },
  ERROR: {
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '/404',
  }
} as const; 