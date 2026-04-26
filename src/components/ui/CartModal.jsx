import { useState } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import useStore from '../../store/useStore'

const DEMO_MODE = !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key'

export default function CartModal() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    closeCartModal,
    openAuthModal,
    user,
    addToast,
  } = useStore()
  const [loading, setLoading] = useState(false)

  const total = cartTotal()

  const handleCheckout = async () => {
    if (!user) {
      addToast('سجّل دخولك أولاً لإتمام الطلب', 'warning')
      closeCartModal()
      openAuthModal()
      return
    }
    if (cart.length === 0) {
      addToast('السلة فارغة', 'warning'); return
    }

    setLoading(true)
    try {
      if (!DEMO_MODE) {
        await addDoc(collection(db, 'orders'), {
          uid: user.uid,
          email: user.email || null,
          items: cart.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total,
          status: 'pending',
          createdAt: serverTimestamp(),
        })
      }
      clearCart()
      closeCartModal()
      addToast('تم تقديم طلبك بنجاح! سنتواصل معك قريباً ☕', 'success')
    } catch {
      addToast('فشل تقديم الطلب، حاول مجدداً', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,3,2,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && closeCartModal()}
    >
      <div className="glass-dark rounded-2xl w-full max-w-[480px] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c5a059]/15">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#c5a059]" />
            <h2 className="text-lg font-bold text-[#c5a059]">سلة التسوق</h2>
          </div>
          <button
            onClick={closeCartModal}
            className="text-[#c5a059]/50 hover:text-[#c5a059] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 max-h-[50vh] overflow-y-auto space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-[#c5a059]/40">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p>السلة فارغة</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onQuantity={(q) => updateQuantity(item.id, q)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-[#c5a059]/15 space-y-4">
            <div className="flex items-center justify-between text-[#c5a059] font-bold text-lg">
              <span>الإجمالي</span>
              <span>{total.toLocaleString('ar-EG')} جنيه</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { clearCart(); addToast('تم تفريغ السلة', 'info') }}
                className="py-2.5 px-4 rounded-xl border border-[#c5a059]/20 text-[#c5a059]/60 hover:text-[#c5a059] text-sm transition-all"
              >
                تفريغ
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-gold flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                تأكيد الطلب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CartItem({ item, onRemove, onQuantity }) {
  return (
    <div className="flex items-center gap-3 glass rounded-xl p-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#e5d5b0] truncate">{item.name}</p>
        <p className="text-xs text-[#c5a059] mt-0.5">
          {item.price.toLocaleString('ar-EG')} جنيه × {item.quantity}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onQuantity(item.quantity - 1)}
          className="w-7 h-7 rounded-lg bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059]/20 flex items-center justify-center transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="text-sm text-[#e5d5b0] w-6 text-center font-bold">
          {item.quantity}
        </span>
        <button
          onClick={() => onQuantity(item.quantity + 1)}
          className="w-7 h-7 rounded-lg bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059]/20 flex items-center justify-center transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
      <button
        onClick={onRemove}
        className="text-red-400/50 hover:text-red-400 transition-colors p-1"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
