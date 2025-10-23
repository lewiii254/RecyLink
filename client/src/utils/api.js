import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - don't redirect automatically
      // Let the components handle this based on their needs
      console.log('Unauthorized access')
    }
    return Promise.reject(error)
  }
)

// API functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

export const reportsAPI = {
  create: (reportData) => api.post('/reports', reportData),
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  verify: (id) => api.put(`/reports/${id}/verify`),
  collect: (id) => api.put(`/reports/${id}/collect`),
}

export const adminAPI = {
  collectReport: (id) => api.put(`/reports/${id}/collect`),
}

export const rewardsAPI = {
  getHistory: () => api.get('/rewards/history'),
  getStats: () => api.get('/rewards/stats'),
}

export default api
