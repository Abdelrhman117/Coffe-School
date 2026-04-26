import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import { seedFirestoreIfEmpty } from './firebase/seed'
import useStore from './store/useStore'

import Navbar from './components/ui/Navbar'
import AuthModal from './components/auth/AuthModal'
import CartModal from './components/ui/CartModal'
import ToastContainer from './components/ui/Toast'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const {
    setUser,
    authModalOpen,
    cartModalOpen,
    adminPanelOpen,
    toggleAdminPanel,
    fetchProducts,
  } = useStore()

  // Firebase auth state observer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return unsub
  }, [setUser])

  // Seed Firestore on first run (no-op if already seeded or demo mode)
  useEffect(() => {
    seedFirestoreIfEmpty()
  }, [])

  // Load products from Firestore (falls back to seed data in demo mode)
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="min-h-screen bg-[#050302]">
      <Navbar />
      <Home />

      {adminPanelOpen && <AdminDashboard onClose={toggleAdminPanel} />}
      {authModalOpen && <AuthModal />}
      {cartModalOpen && <CartModal />}
      <ToastContainer />
    </div>
  )
}
