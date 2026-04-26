import { useState } from 'react'
import { signOut } from 'firebase/auth'
import {
  ShoppingCart,
  LogOut,
  User,
  Settings,
  Coffee,
  Menu,
  X,
} from 'lucide-react'
import { auth } from '../../firebase/config'
import useStore from '../../store/useStore'

export default function Navbar() {
  const {
    user,
    isAdmin,
    cartCount,
    openAuthModal,
    openCartModal,
    toggleAdminPanel,
    clearUser,
    addToast,
  } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const count = cartCount()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch {
      // ignore — we always clear local state
    }
    clearUser()
    addToast('تم تسجيل الخروج', 'info')
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 right-0 left-0 z-[8000] glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Coffee size={22} className="text-[#c5a059]" />
          <span className="font-black text-[#c5a059] text-lg tracking-wide">
            Coffee School
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-[#c5a059]/70 font-medium">
          <NavLink href="#hero">الرئيسية</NavLink>
          <NavLink href="#products">المنتجات</NavLink>
          <NavLink href="#courses">الدورات</NavLink>
          <NavLink href="#contact">اتصل بنا</NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={openCartModal}
            className="relative p-2 rounded-xl hover:bg-[#c5a059]/10 text-[#c5a059]/70 hover:text-[#c5a059] transition-all"
            aria-label="سلة التسوق"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 bg-[#c5a059] text-[#050302] text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] px-1">
                {count}
              </span>
            )}
          </button>

          {/* Auth / User */}
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl glass hover:bg-[#c5a059]/10 text-[#c5a059] transition-all text-sm"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
                <span className="max-w-[100px] truncate">
                  {user.displayName || user.email?.split('@')[0] || 'مستخدم'}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute left-0 top-full mt-2 w-44 glass-dark rounded-xl overflow-hidden shadow-xl py-1 border border-[#c5a059]/15">
                  {isAdmin && (
                    <MenuButton
                      icon={<Settings size={15} />}
                      onClick={() => { toggleAdminPanel(); setMenuOpen(false) }}
                    >
                      لوحة الإدارة
                    </MenuButton>
                  )}
                  <MenuButton
                    icon={<LogOut size={15} />}
                    onClick={handleSignOut}
                    danger
                  >
                    تسجيل الخروج
                  </MenuButton>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="hidden md:flex btn-gold py-2 px-4 rounded-xl text-sm items-center gap-1.5"
            >
              <User size={15} />
              دخول / تسجيل
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-xl text-[#c5a059]/70 hover:text-[#c5a059] transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-[#c5a059]/15 px-4 py-4 space-y-2">
          {['#hero', '#products', '#courses', '#contact'].map((href, i) => {
            const labels = ['الرئيسية', 'المنتجات', 'الدورات', 'اتصل بنا']
            return (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 rounded-xl text-[#c5a059]/70 hover:text-[#c5a059] hover:bg-[#c5a059]/10 text-sm transition-all"
              >
                {labels[i]}
              </a>
            )
          })}
          <div className="pt-2 border-t border-[#c5a059]/10">
            {user ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => { toggleAdminPanel(); setMenuOpen(false) }}
                    className="flex items-center gap-2 w-full py-2 px-3 rounded-xl text-[#c5a059]/70 hover:text-[#c5a059] text-sm"
                  >
                    <Settings size={15} /> لوحة الإدارة
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full py-2 px-3 rounded-xl text-red-400/70 hover:text-red-400 text-sm"
                >
                  <LogOut size={15} /> تسجيل الخروج
                </button>
              </>
            ) : (
              <button
                onClick={() => { openAuthModal(); setMenuOpen(false) }}
                className="btn-gold w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <User size={15} /> دخول / تسجيل
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="hover:text-[#c5a059] transition-colors py-1"
    >
      {children}
    </a>
  )
}

function MenuButton({ icon, onClick, children, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors text-right ${
        danger
          ? 'text-red-400/70 hover:text-red-400 hover:bg-red-400/10'
          : 'text-[#c5a059]/70 hover:text-[#c5a059] hover:bg-[#c5a059]/10'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}
