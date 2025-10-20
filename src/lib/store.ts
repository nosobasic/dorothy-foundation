import { create } from 'zustand'

interface User {
  id: number
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token)
    set({ user, token })
  },
  clearAuth: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null })
  },
  isAuthenticated: () => !!get().token,
}))

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  hideToast: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  type: 'info',
  show: false,
  showToast: (message, type) => set({ message, type, show: true }),
  hideToast: () => set({ show: false }),
}))

