import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'firebase/auth'
import { ShoppingCart, LogOut, User, Settings, Coffee, Menu, X } from 'lucide-react'
import { auth } from '../../firebase/config'
import useScrollDirection from '../../hooks/useScrollDirection'
import useAuthStore from '../../store/useAuthStore'
import useCartStore from '../../store/useCartStore'
import useUIStore from '../../store/useUIStore'

const NAV_LINKS = [
  ['#hero', 'Home'],
  ['#products', 'Products'],
  ['#courses', 'Courses'],
  ['#contact', 'Contact'],
]

export default function Navbar() {
  const { user, isAdmin, clearUser } = useAuthStore()
  const cartCount = useCartStore((s) => s.cartCount())
  const { openAuthModal, openCartDrawer, toggleAdminPanel, addToast } = useUIStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const { direction, scrolled } = useScrollDirection()

  const handleSignOut = async () => {
    try { await signOut(auth) } catch { /* ignore */ }
    clearUser()
    addToast('Signed out successfully', 'info')
    setMenuOpen(false)
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[8000] glass-dark"
      animate={{ y: direction === 'down' && scrolled ? -80 : 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <Coffee size={22} className="text-[#c5a059]" />
          <span className="font-black text-[#c5a059] text-lg tracking-wide">Coffee School</span>
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-[#c5a059]/70 font-medium">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="hover:text-[#c5a059] transition-colors py-1 relative group">
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#c5a059] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button onClick={openCartDrawer} className="relative p-2 rounded-xl hover:bg-[#c5a059]/10 text-[#c5a059]/70 hover:text-[#c5a059] transition-all" whileTap={{ scale: 0.9 }} aria-label="Shopping cart">
            <ShoppingCart size={20} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-[#c5a059] text-[#050302] text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {user ? (
            <div className="relative hidden md:block">
              <button onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl glass hover:bg-[#c5a059]/10 text-[#c5a059] transition-all text-sm">
                {user.photoURL ? <img src={user.photoURL} alt="avatar" className="w-6 h-6 rounded-full object-cover" /> : <User size={16} />}
                <span className="max-w-[100px] truncate">{user.displayName || user.email?.split('@')[0] || 'User'}</span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-44 glass-dark rounded-xl overflow-hidden shadow-xl py-1 border border-[#c5a059]/15">
                    {isAdmin && (
                      <DropdownItem icon={<Settings size={15} />} onClick={() => { toggleAdminPanel(); setMenuOpen(false) }}>Admin Panel</DropdownItem>
                    )}
                    <DropdownItem icon={<LogOut size={15} />} onClick={handleSignOut} danger>Sign Out</DropdownItem>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button onClick={openAuthModal} className="hidden md:flex btn-gold py-2 px-4 rounded-xl text-sm items-center gap-1.5" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <User size={15} /> Sign In
            </motion.button>
          )}

          <button onClick={() => setMenuOpen((o) => !o)} className="md:hidden p-2 rounded-xl text-[#c5a059]/70 hover:text-[#c5a059] transition-colors">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="md:hidden glass-dark border-t border-[#c5a059]/15 px-4 py-4 space-y-2 overflow-hidden">
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 rounded-xl text-[#c5a059]/70 hover:text-[#c5a059] hover:bg-[#c5a059]/10 text-sm transition-all">
                {label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#c5a059]/10">
              {user ? (
                <>
                  {isAdmin && (
                    <button onClick={() => { toggleAdminPanel(); setMenuOpen(false) }} className="flex items-center gap-2 w-full py-2 px-3 rounded-xl text-[#c5a059]/70 hover:text-[#c5a059] text-sm">
                      <Settings size={15} /> Admin Panel
                    </button>
                  )}
                  <button onClick={handleSignOut} className="flex items-center gap-2 w-full py-2 px-3 rounded-xl text-red-400/70 hover:text-red-400 text-sm">
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { openAuthModal(); setMenuOpen(false) }} className="btn-gold w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                  <User size={15} /> Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function DropdownItem({ icon, onClick, children, danger }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors ${danger ? 'text-red-400/70 hover:text-red-400 hover:bg-red-400/10' : 'text-[#c5a059]/70 hover:text-[#c5a059] hover:bg-[#c5a059]/10'}`}>
      {icon}{children}
    </button>
  )
}
