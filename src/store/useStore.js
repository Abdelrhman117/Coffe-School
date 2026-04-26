import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_PRODUCTS } from '../firebase/seed'
import {
  getProducts,
  createProduct,
  updateProduct as fsUpdateProduct,
  deleteProduct as fsDeleteProduct,
  submitOrder,
  getAllOrders,
} from '../firebase/firestore'

const ADMIN_EMAILS = ['admin@coffeeschool.com', 'info@coffeeschool.com']

const IS_DEMO = !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key'

const useStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────────────────────────
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

      // ── Products ──────────────────────────────────────────────────────────────
      products: SEED_PRODUCTS,
      productsLoading: false,
      productsError: null,

      fetchProducts: async () => {
        if (IS_DEMO) return // use seeded data
        set({ productsLoading: true, productsError: null })
        try {
          const products = await getProducts()
          if (products.length > 0) {
            set({ products, productsLoading: false })
          } else {
            // Firestore empty — keep seed data and trigger seed
            const { seedFirestoreIfEmpty } = await import('../firebase/seed')
            await seedFirestoreIfEmpty()
            set({ productsLoading: false })
          }
        } catch (err) {
          console.warn('[store] fetchProducts failed, using seed data:', err.message)
          set({ productsLoading: false, productsError: err.message })
        }
      },

      // Admin CRUD — syncs to Firestore then updates local state
      addProduct: async (data) => {
        const product = { ...data, id: data.id || crypto.randomUUID() }
        if (!IS_DEMO) {
          try {
            await createProduct(product)
          } catch (err) {
            console.warn('addProduct Firestore error:', err.message)
          }
        }
        set((s) => ({ products: [...s.products, product] }))
      },

      updateProduct: async (id, updates) => {
        if (!IS_DEMO) {
          try {
            await fsUpdateProduct(id, updates)
          } catch (err) {
            console.warn('updateProduct Firestore error:', err.message)
          }
        }
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
      },

      deleteProduct: async (id) => {
        if (!IS_DEMO) {
          try {
            await fsDeleteProduct(id)
          } catch (err) {
            console.warn('deleteProduct Firestore error:', err.message)
          }
        }
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
      },

      // ── Cart ──────────────────────────────────────────────────────────────────
      cart: [],

      addToCart: (product) =>
        set((s) => {
          const existing = s.cart.find((i) => i.id === product.id)
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { cart: [...s.cart, { ...product, quantity: 1 }] }
        }),

      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((s) => ({
          cart:
            quantity < 1
              ? s.cart.filter((i) => i.id !== id)
              : s.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ cart: [] }),

      cartTotal: () => {
        const { cart } = get()
        return cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },

      cartCount: () => {
        const { cart } = get()
        return cart.reduce((sum, i) => sum + i.quantity, 0)
      },

      // ── Orders ────────────────────────────────────────────────────────────────
      orders: [],
      ordersLoading: false,

      checkout: async () => {
        const { user, cart, cartTotal, clearCart, addToast } = get()
        if (!user) {
          addToast('سجّل دخولك أولاً لإتمام الطلب', 'warning')
          return false
        }
        if (cart.length === 0) {
          addToast('السلة فارغة', 'warning')
          return false
        }
        try {
          if (!IS_DEMO) {
            await submitOrder(user.uid, user.email, cart, cartTotal())
          }
          clearCart()
          addToast('تم تقديم طلبك بنجاح! سنتواصل معك قريباً ☕', 'success')
          return true
        } catch (err) {
          addToast('فشل تقديم الطلب، حاول مجدداً', 'error')
          return false
        }
      },

      fetchOrders: async () => {
        const { isAdmin } = get()
        if (!isAdmin || IS_DEMO) return
        set({ ordersLoading: true })
        try {
          const orders = await getAllOrders(100)
          set({ orders, ordersLoading: false })
        } catch {
          set({ ordersLoading: false })
        }
      },

      // ── Scroll / 3D scene state ───────────────────────────────────────────────
      activeSection: 0,          // index into products[] — drives the 3D scene
      scrollProgress: 0,         // 0–1 within the active section

      setActiveSection: (index) => set({ activeSection: index }),
      setScrollProgress: (progress) => set({ scrollProgress: progress }),

      // ── UI state ──────────────────────────────────────────────────────────────
      authModalOpen: false,
      cartModalOpen: false,
      adminPanelOpen: false,
      toasts: [],

      openAuthModal: () => set({ authModalOpen: true }),
      closeAuthModal: () => set({ authModalOpen: false }),
      openCartModal: () => set({ cartModalOpen: true }),
      closeCartModal: () => set({ cartModalOpen: false }),
      toggleAdminPanel: () => set((s) => ({ adminPanelOpen: !s.adminPanelOpen })),

      // ── Toast ─────────────────────────────────────────────────────────────────
      addToast: (message, type = 'info') => {
        const id = crypto.randomUUID()
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
        }, 3500)
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'coffee-school-v2',
      partialize: (s) => ({ cart: s.cart }),
    }
  )
)

export default useStore
