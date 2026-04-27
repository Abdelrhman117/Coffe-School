import { create } from 'zustand'

const useUIStore = create((set) => ({
  authModalOpen: false,
  cartDrawerOpen: false,
  checkoutModalOpen: false,
  adminPanelOpen: false,
  toasts: [],

  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),
  openCartDrawer: () => set({ cartDrawerOpen: true }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  openCheckoutModal: () => set({ checkoutModalOpen: true, cartDrawerOpen: false }),
  closeCheckoutModal: () => set({ checkoutModalOpen: false }),
  toggleAdminPanel: () => set((s) => ({ adminPanelOpen: !s.adminPanelOpen })),

  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export default useUIStore
