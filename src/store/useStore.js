import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Seed data from coffeschool.com ───────────────────────────────────────────
const SEED_PRODUCTS = [
  {
    id: 'barista-course',
    type: 'course',
    name: 'دورة البريستا الاحترافية',
    nameEn: 'Top Barista Course',
    partner: 'Horeca Smart Academy',
    description:
      'دورة احترافية مع أكاديمية هوريكا سمارت. تعلم فن تحضير القهوة على أعلى مستوى، من أسرار الإسبريسو إلى الرسم على اللاتيه.',
    price: 3000,
    currency: 'EGP',
    image: '/textures/barista-course.jpg',
    model: 'cup',
    lightColor: '#f97316',
    badge: 'الأكثر مبيعاً',
    features: ['شهادة معتمدة', 'تدريب عملي', 'معدات مهنية', 'مدة 5 أيام'],
  },
  {
    id: 'turkish-coffee',
    type: 'product',
    name: 'قهوة تركية ميد-كوفي',
    nameEn: 'Med-Coffee Turkish Coffee',
    variant: 'سادة / خفيف 250 جم',
    description:
      'قهوة تركية فاخرة من ميد-كوفيز بخلطة أرابيكا ممتازة. أرومة عميقة وطعم أصيل يأخذك لأجواء إسطنبول في كل رشفة.',
    price: 112,
    currency: 'EGP',
    image: '/textures/turkish-coffee.jpg',
    model: 'cezve',
    lightColor: '#8b5e3c',
    badge: 'وكيل حصري',
    features: ['250 جم', 'ناعمة الطحن', 'أرابيكا فاخرة', 'محمصة طازجة'],
  },
  {
    id: 'syrup-1883',
    type: 'product',
    name: 'شراب 1883 الفرنسي',
    nameEn: 'Syrup 1883 French',
    description:
      'شراب 1883 الأصيل المصنوع في فرنسا منذ 1883. يضيف لمسة فرنسية راقية لمشروباتك الساخنة والباردة. متوفر بنكهات متعددة.',
    price: 350,
    currency: 'EGP',
    image: '/textures/syrup-1883.jpg',
    model: 'bottle',
    lightColor: '#3b82f6',
    badge: 'وكيل حصري',
    features: ['700 مل', 'صنع في فرنسا', 'منذ 1883', 'نكهات متعددة'],
  },
  {
    id: 'elite-espresso',
    type: 'product',
    name: 'حبوب إسبريسو إيليت',
    nameEn: 'Elite Espresso Beans',
    variant: '1 كجم — 80% أرابيكا / 20% روبستا',
    description:
      'خلطة إيليت الاحترافية: 80% أرابيكا لنكهة ناعمة ومعقدة، 20% روبستا لكريما كثيفة وقوام ثري. المختار الأول للباريستا.',
    price: 575,
    currency: 'EGP',
    image: '/textures/elite-espresso.jpg',
    model: 'bag',
    lightColor: '#c5a059',
    badge: 'اختيار الخبراء',
    features: ['1 كجم', '80% أرابيكا', '20% روبستا', 'تحميص داكن'],
  },
]

// ─── Admin emails (in production this comes from Firestore claims) ─────────────
const ADMIN_EMAILS = ['admin@coffeeschool.com', 'info@coffeeschool.com']

// ─── Store ─────────────────────────────────────────────────────────────────────
const useStore = create(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────────────────────────
      user: null,
      isAdmin: false,
      authLoading: true,

      setUser: (user) => {
        const isAdmin = user ? ADMIN_EMAILS.includes(user.email) : false
        set({ user, isAdmin, authLoading: false })
      },

      setAuthLoading: (authLoading) => set({ authLoading }),

      clearUser: () => set({ user: null, isAdmin: false }),

      // ── Products ──────────────────────────────────────────────────────────────
      products: SEED_PRODUCTS,

      addProduct: (product) =>
        set((s) => ({
          products: [
            ...s.products,
            { ...product, id: product.id || crypto.randomUUID() },
          ],
        })),

      updateProduct: (id, updates) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
        })),

      // ── Cart ──────────────────────────────────────────────────────────────────
      cart: [],

      addToCart: (product) =>
        set((s) => {
          const existing = s.cart.find((i) => i.id === product.id)
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
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
              : s.cart.map((i) =>
                  i.id === id ? { ...i, quantity } : i
                ),
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

      // ── UI State ──────────────────────────────────────────────────────────────
      authModalOpen: false,
      cartModalOpen: false,
      adminPanelOpen: false,
      toasts: [],

      openAuthModal: () => set({ authModalOpen: true }),
      closeAuthModal: () => set({ authModalOpen: false }),

      openCartModal: () => set({ cartModalOpen: true }),
      closeCartModal: () => set({ cartModalOpen: false }),

      toggleAdminPanel: () =>
        set((s) => ({ adminPanelOpen: !s.adminPanelOpen })),

      // ── Toast notifications ───────────────────────────────────────────────────
      addToast: (message, type = 'info') => {
        const id = crypto.randomUUID()
        set((s) => ({
          toasts: [...s.toasts, { id, message, type }],
        }))
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
        }, 3500)
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'coffee-school-storage',
      partialize: (s) => ({ cart: s.cart }),
    }
  )
)

export default useStore
