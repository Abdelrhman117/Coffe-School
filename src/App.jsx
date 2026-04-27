import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import { seedFirestoreIfEmpty } from './firebase/seed'
import useAuthStore from './store/useAuthStore'
import useProductStore from './store/useProductStore'
import useUIStore from './store/useUIStore'

import Navbar from './components/layout/Navbar'
import AuthModal from './components/auth/AuthModal'
import CartDrawer from './components/ui/CartDrawer'
import CheckoutModal from './components/ui/CheckoutModal'
import ToastContainer from './components/ui/Toast'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const { setUser } = useAuthStore()
  const { fetchProducts } = useProductStore()
  const { authModalOpen, cartDrawerOpen, checkoutModalOpen, closeCheckoutModal, adminPanelOpen, toggleAdminPanel } = useUIStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return unsub
  }, [setUser])

  useEffect(() => {
    seedFirestoreIfEmpty()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="min-h-screen bg-[#050302]">
      <Navbar />
      <Home />

      {adminPanelOpen && <AdminDashboard onClose={toggleAdminPanel} />}
      {authModalOpen && <AuthModal />}
      <CartDrawer open={cartDrawerOpen} />
      <CheckoutModal open={checkoutModalOpen} onClose={closeCheckoutModal} />
      <ToastContainer />
    </div>
  )
}
