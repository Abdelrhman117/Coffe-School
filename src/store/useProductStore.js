import { create } from 'zustand'
import useAuthStore from './useAuthStore'
import { SEED_PRODUCTS, seedFirestoreIfEmpty } from '../firebase/seed'
import {
  getProducts,
  createProduct,
  updateProduct as fsUpdateProduct,
  deleteProduct as fsDeleteProduct,
  getAllOrders,
} from '../firebase/firestore'

const IS_DEMO = !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key'

const useProductStore = create((set, get) => ({
  products: SEED_PRODUCTS,
  productsLoading: false,
  productsError: null,
  orders: [],
  ordersLoading: false,

  fetchProducts: async () => {
    if (IS_DEMO) return
    set({ productsLoading: true, productsError: null })
    try {
      const products = await getProducts()
      if (products.length > 0) {
        set({ products, productsLoading: false })
      } else {
        await seedFirestoreIfEmpty()
        set({ productsLoading: false })
      }
    } catch (err) {
      console.warn('[store] fetchProducts failed, using seed data:', err.message)
      set({ productsLoading: false, productsError: err.message })
    }
  },

  addProduct: async (data) => {
    const product = { ...data, id: data.id || crypto.randomUUID() }
    if (!IS_DEMO) {
      try { await createProduct(product) } catch (err) { console.warn('addProduct error:', err.message) }
    }
    set((s) => ({ products: [...s.products, product] }))
  },

  updateProduct: async (id, updates) => {
    if (!IS_DEMO) {
      try { await fsUpdateProduct(id, updates) } catch (err) { console.warn('updateProduct error:', err.message) }
    }
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)) }))
  },

  deleteProduct: async (id) => {
    if (!IS_DEMO) {
      try { await fsDeleteProduct(id) } catch (err) { console.warn('deleteProduct error:', err.message) }
    }
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }))
  },

  fetchOrders: async () => {
    const { isAdmin } = useAuthStore.getState()
    if (!isAdmin || IS_DEMO) return
    set({ ordersLoading: true })
    try {
      const orders = await getAllOrders(100)
      set({ orders, ordersLoading: false })
    } catch {
      set({ ordersLoading: false })
    }
  },
}))

export default useProductStore
