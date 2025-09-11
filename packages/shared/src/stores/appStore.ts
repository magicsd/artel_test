import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  
  // UI state
  sidebarOpen: boolean
  
  // Actions
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      sidebarOpen: false,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

