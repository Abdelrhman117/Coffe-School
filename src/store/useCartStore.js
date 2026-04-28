import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { submitOrder } from '../firebase/firestore'
import useAuthStore from './useAuthStore'
import useUIStore from './useUIStore'

const IS_DEMO = !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key'

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) =>
        set((s) => {
          const existing = s.cart.find((i) => i.id === product.id)
          if (existing) {
            return { cart: s.cart.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) }
          }
          return { cart: [...s.cart, { ...product, quantity: 1 }] }
        }),

      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((s) => ({
          cart: quantity < 1
            ? s.cart.filter((i) => i.id !== id)
            : s.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ cart: [] }),

      cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      checkout: async () => {
        const { user } = useAuthStore.getState()
        const { addToast } = useUIStore.getState()
        const { cart, cartTotal, clearCart } = get()

        if (!user) {
          addToast('Please sign in to place an order', 'warning')
          return false
        }
        if (cart.length === 0) {
          addToast('Your cart is empty', 'warning')
          return false
        }
        try {
          if (!IS_DEMO) {
            await submitOrder(user.uid, user.email, cart, cartTotal())
          }
          clearCart()
          addToast("Order placed! We'll contact you shortly ☕", 'success')
          return true
        } catch {
          addToast('Order failed, please try again', 'error')
          return false
        }
      },
    }),
    {
      name: 'coffee-school-cart-v1',
      partialize: (s) => ({ cart: s.cart }),
    }
  )
)

export default useCartStore
