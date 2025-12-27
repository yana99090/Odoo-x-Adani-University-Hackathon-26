import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401 errors (unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const api = {
  // Authentication
  register: async (name: string, email: string, password: string) => {
    const { data } = await axiosInstance.post('/api/auth/register', {
      name,
      email,
      password,
    })
    return data
  },

  login: async (email: string, password: string) => {
    const { data } = await axiosInstance.post('/api/auth/login', {
      email,
      password,
    })
    return data
  },

  getCurrentUser: async () => {
    const { data } = await axiosInstance.get('/api/auth/me')
    return data
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  },

  // Dashboard
  getDashboardStats: async () => {
    const { data } = await axiosInstance.get('/api/dashboard/stats')
    return data
  },

  // Categories
  getCategories: async () => {
    const { data } = await axiosInstance.get('/api/categories')
    return data
  },
  createCategory: async (category: any) => {
    const { data } = await axiosInstance.post('/api/categories', category)
    return data
  },
  updateCategory: async (id: number, category: any) => {
    const { data } = await axiosInstance.put(`/api/categories/${id}`, category)
    return data
  },
  deleteCategory: async (id: number) => {
    await axiosInstance.delete(`/api/categories/${id}`)
  },

  // Users
  getUsers: async () => {
    const { data } = await axiosInstance.get('/api/users')
    return data
  },
  createUser: async (user: any) => {
    const { data } = await axiosInstance.post('/api/users', user)
    return data
  },

  // Teams
  getTeams: async () => {
    const { data } = await axiosInstance.get('/api/teams')
    return data
  },
  getTeam: async (id: number) => {
    const { data } = await axiosInstance.get(`/api/teams/${id}`)
    return data
  },
  createTeam: async (team: any) => {
    const { data } = await axiosInstance.post('/api/teams', team)
    return data
  },
  updateTeam: async (id: number, team: any) => {
    const { data} = await axiosInstance.put(`/api/teams/${id}`, team)
    return data
  },
  deleteTeam: async (id: number) => {
    const { data } = await axiosInstance.delete(`/api/teams/${id}`)
    return data
  },

  // Equipment
  getEquipment: async (activeOnly = true) => {
    const { data } = await axiosInstance.get('/api/equipment', {
      params: { active_only: activeOnly }
    })
    return data
  },
  getEquipmentById: async (id: number) => {
    const { data } = await axiosInstance.get(`/api/equipment/${id}`)
    return data
  },
  getEquipmentDetails: async (id: number) => {
    const { data } = await axiosInstance.get(`/api/equipment/${id}/details`)
    return data
  },
  getEquipmentRequests: async (id: number) => {
    const { data } = await axiosInstance.get(`/api/equipment/${id}/requests`)
    return data
  },
  getEquipmentRequestsCount: async (id: number) => {
    const { data } = await axiosInstance.get(`/api/equipment/${id}/requests/count`)
    return data
  },
  createEquipment: async (equipment: any) => {
    const { data } = await axiosInstance.post('/api/equipment', equipment)
    return data
  },
  updateEquipment: async (id: number, equipment: any) => {
    const { data } = await axiosInstance.put(`/api/equipment/${id}`, equipment)
    return data
  },
  scrapEquipment: async (id: number) => {
    const { data } = await axiosInstance.post(`/api/equipment/${id}/scrap`)
    return data
  },

  // Stages
  getStages: async () => {
    const { data } = await axiosInstance.get('/api/stages')
    return data
  },
  createStage: async (stage: any) => {
    const { data } = await axiosInstance.post('/api/stages', stage)
    return data
  },
  updateStage: async (id: number, stage: any) => {
    const { data } = await axiosInstance.put(`/api/stages/${id}`, stage)
    return data
  },
  deleteStage: async (id: number) => {
    const { data } = await axiosInstance.delete(`/api/stages/${id}`)
    return data
  },

  // Maintenance Requests
  getRequests: async (filters?: any) => {
    const { data } = await axiosInstance.get('/api/requests', {
      params: filters
    })
    return data
  },
  getRequest: async (id: number) => {
    const { data } = await axiosInstance.get(`/api/requests/${id}`)
    return data
  },
  createRequest: async (request: any) => {
    const { data } = await axiosInstance.post('/api/requests', request)
    return data
  },
  updateRequest: async (id: number, request: any) => {
    const { data } = await axiosInstance.put(`/api/requests/${id}`, request)
    return data
  },
  assignRequestToMe: async (id: number) => {
    const { data } = await axiosInstance.post(`/api/requests/${id}/assign-to-me`)
    return data
  },
}

export default api

