import axios from 'axios'
import { getAuthToken } from '@/lib/authToken'

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const clerkToken = await getAuthToken()
  if (clerkToken) {
    config.headers.Authorization = `Bearer ${clerkToken}`
  }
  return config
})

export default api
