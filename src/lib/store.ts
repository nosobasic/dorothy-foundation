import { create } from 'zustand'

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
