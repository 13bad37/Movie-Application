import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setAuth: (email) => set({ user: email }),
      clearAuth: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',        // key in localStorage
      getStorage: () => localStorage,
    }
  )
)
