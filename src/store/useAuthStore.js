import { create } from 'zustand'

const ADMIN_EMAILS = ['admin@coffeeschool.com', 'info@coffeeschool.com']

const useAuthStore = create((set) => ({
  user: null,
  isAdmin: false,
  authLoading: true,

  setUser: (user) => {
    const isAdmin = user
      ? ADMIN_EMAILS.includes(user.email) || user.email?.endsWith('@coffeeschool.com')
      : false
    set({ user, isAdmin, authLoading: false })
  },

  setAuthLoading: (v) => set({ authLoading: v }),
  clearUser: () => set({ user: null, isAdmin: false }),
}))

export default useAuthStore
