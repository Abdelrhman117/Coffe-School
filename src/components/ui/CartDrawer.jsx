import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import useUIStore from '../../store/useUIStore'
import useAuthStore from '../../store/useAuthStore'

export default function CartDrawer({ open }) {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCartStore()
  const { closeCartDrawer, openCheckoutModal, openAuthModal, addToast } = useUIStore()
  const { user } = useAuthStore()
  const total = cartTotal()

  const handleCheckout = () => {
    if (!user) {
      addToast('Please sign in to complete your order', 'warning')
      closeCartDrawer()
      openAuthModal()
      return
    }
    openCheckoutModal()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[8500]" style={{ background: 'rgba(5,3,2,0.75)', backdropFilter: 'blur(4px)' }} onClick={closeCartDrawer} />

          <motion.div key="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 38 }}
            className="fixed top-0 left-0 h-full z-[8600] w-full max-w-[400px] glass-dark flex flex-col shadow-2xl border-r border-[#c5a059]/15">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#c5a059]/15 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#c5a059]" />
                <h2 className="text-lg font-bold text-[#c5a059]">Shopping Cart</h2>
                {cart.length > 0 && (
                  <span className="text-xs bg-[#c5a059]/20 text-[#c5a059] rounded-full px-2 py-0.5 font-bold">{cart.length}</span>
                )}
              </div>
              <motion.button onClick={closeCartDrawer} className="text-[#c5a059]/50 hover:text-[#c5a059] transition-colors p-1" whileTap={{ scale: 0.85 }}>
                <X size={20} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {cart.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-[#c5a059]/40">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Your cart is empty</p>
                    <p className="text-xs mt-1 opacity-60">Add products to start shopping</p>
                  </motion.div>
                ) : (
                  cart.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0, marginTop: 0 }} transition={{ duration: 0.2 }}>
                      <CartItem item={item} onRemove={() => removeFromCart(item.id)} onQuantity={(q) => updateQuantity(item.id, q)} />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-5 border-t border-[#c5a059]/15 space-y-4 shrink-0">
                <div className="flex items-center justify-between text-[#c5a059] font-bold text-lg">
                  <span>Total</span>
                  <span>{total.toLocaleString('en-EG')} EGP</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { clearCart(); addToast('Cart cleared', 'info') }}
                    className="py-2.5 px-4 rounded-xl border border-[#c5a059]/20 text-[#c5a059]/60 hover:text-[#c5a059] text-sm transition-all">
                    Clear
                  </button>
                  <motion.button onClick={handleCheckout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="btn-gold flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                    Checkout
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CartItem({ item, onRemove, onQuantity }) {
  return (
    <div className="flex items-center gap-3 glass rounded-xl p-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#e5d5b0] truncate">{item.nameEn || item.name}</p>
        <p className="text-xs text-[#c5a059] mt-0.5">{item.price.toLocaleString('en-EG')} EGP × {item.quantity}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onQuantity(item.quantity - 1)} className="w-7 h-7 rounded-lg bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059]/20 flex items-center justify-center transition-colors">
          <Minus size={12} />
        </button>
        <span className="text-sm text-[#e5d5b0] w-6 text-center font-bold">{item.quantity}</span>
        <button onClick={() => onQuantity(item.quantity + 1)} className="w-7 h-7 rounded-lg bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059]/20 flex items-center justify-center transition-colors">
          <Plus size={12} />
        </button>
      </div>
      <button onClick={onRemove} className="text-red-400/50 hover:text-red-400 transition-colors p-1">
        <Trash2 size={15} />
      </button>
    </div>
  )
}
