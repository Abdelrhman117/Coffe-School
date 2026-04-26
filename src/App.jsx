import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import useStore from './store/useStore'

import Navbar from './components/layout/Navbar'
import AuthModal from './components/auth/AuthModal'
import CartModal from './components/ui/CartModal'
import ToastContainer from './components/ui/Toast'
import LandingPlaceholder from './components/layout/LandingPlaceholder'

export default function App() {
  const { setUser, setAuthLoading, authModalOpen, cartModalOpen } = useStore()

  // ── Firebase auth state observer ─────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return unsubscribe
  }, [setUser])

  return (
    <div className="min-h-screen bg-[#050302]">
      <Navbar />

      {/* Main page content — Phase 3 will replace this */}
      <LandingPlaceholder />

      {/* Global modals */}
      {authModalOpen && <AuthModal />}
      {cartModalOpen && <CartModal />}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  )
}
