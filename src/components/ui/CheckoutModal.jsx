import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, User, Phone, MapPin, CheckCircle, Loader2, ChevronRight, Coffee } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import useUIStore from '../../store/useUIStore'
import useAuthStore from '../../store/useAuthStore'
import { submitOrder } from '../../firebase/firestore'

const IS_DEMO = !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key'

const STEPS = ['مراجعة الطلب', 'بيانات التسليم', 'تأكيد الطلب']

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function CheckoutModal({ open, onClose }) {
  const { cart, cartTotal, clearCart } = useCartStore()
  const { addToast } = useUIStore()
  const { user } = useAuthStore()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ name: user?.displayName || '', phone: '', address: '' })

  const total = cartTotal()

  const go = (next) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      addToast('يرجى ملء الاسم ورقم الهاتف', 'warning')
      return
    }
    setLoading(true)
    try {
      if (!IS_DEMO && user) {
        await submitOrder(user.uid, user.email, cart, total, { ...form })
      }
      clearCart()
      setDone(true)
      go(2)
    } catch {
      addToast('فشل تقديم الطلب، حاول مجدداً', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(0)
    setDir(1)
    setDone(false)
    setForm({ name: user?.displayName || '', phone: '', address: '' })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000]"
            style={{ background: 'rgba(5,3,2,0.88)', backdropFilter: 'blur(10px)' }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-[9100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-dark rounded-2xl w-full max-w-[480px] overflow-hidden shadow-2xl border border-[#c5a059]/15 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#c5a059]/15">
                <div className="flex items-center gap-2">
                  <Coffee size={20} className="text-[#c5a059]" />
                  <h2 className="text-lg font-bold text-[#c5a059]">إتمام الطلب</h2>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="text-[#c5a059]/50 hover:text-[#c5a059] transition-colors"
                  whileTap={{ scale: 0.85 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Step progress */}
              {!done && (
                <div className="px-6 pt-5 pb-2">
                  <div className="flex items-center gap-2">
                    {STEPS.map((label, i) => (
                      <div key={label} className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <motion.div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                            animate={{
                              background: i < step ? '#c5a059' : i === step ? '#c5a059' : 'rgba(197,160,89,0.15)',
                              color: i <= step ? '#050302' : 'rgba(197,160,89,0.4)',
                              scale: i === step ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {i < step ? <CheckCircle size={14} /> : i + 1}
                          </motion.div>
                          <span className={`text-xs hidden sm:block ${i === step ? 'text-[#c5a059]' : 'text-[#c5a059]/40'}`}>
                            {label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <motion.div
                            className="flex-1 h-px"
                            animate={{ background: i < step ? '#c5a059' : 'rgba(197,160,89,0.15)' }}
                            transition={{ duration: 0.4 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step content */}
              <div className="relative overflow-hidden min-h-[320px]">
                <AnimatePresence mode="wait" custom={dir}>
                  {step === 0 && (
                    <motion.div
                      key="step0"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="p-6 space-y-3"
                    >
                      {/* Cart items summary */}
                      <div className="space-y-2 max-h-[260px] overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-[#e5d5b0]">{item.name}</p>
                              <p className="text-xs text-[#c5a059]/60">× {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-[#c5a059]">
                              {(item.price * item.quantity).toLocaleString('ar-EG')} جنيه
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#c5a059]/15 text-[#c5a059] font-bold">
                        <span>الإجمالي</span>
                        <span>{total.toLocaleString('ar-EG')} جنيه</span>
                      </div>
                      <motion.button
                        onClick={() => go(1)}
                        className="btn-gold w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-2"
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      >
                        التالي <ChevronRight size={16} />
                      </motion.button>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="p-6 space-y-4"
                    >
                      <p className="text-sm text-[#c5a059]/60 mb-2">أدخل بياناتك لإتمام الطلب</p>

                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-[#c5a059]/60">
                          <User size={13} /> الاسم الكامل
                        </span>
                        <input
                          value={form.name}
                          onChange={update('name')}
                          placeholder="محمد أحمد"
                          className="w-full rounded-xl px-4 py-2.5 text-sm input-gold placeholder:text-[#c5a059]/30"
                        />
                      </label>

                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-[#c5a059]/60">
                          <Phone size={13} /> رقم الهاتف
                        </span>
                        <input
                          value={form.phone}
                          onChange={update('phone')}
                          placeholder="+20 1xx xxx xxxx"
                          type="tel"
                          dir="ltr"
                          className="w-full rounded-xl px-4 py-2.5 text-sm input-gold placeholder:text-[#c5a059]/30"
                        />
                      </label>

                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-[#c5a059]/60">
                          <MapPin size={13} /> العنوان (اختياري)
                        </span>
                        <input
                          value={form.address}
                          onChange={update('address')}
                          placeholder="المدينة، الحي، الشارع..."
                          className="w-full rounded-xl px-4 py-2.5 text-sm input-gold placeholder:text-[#c5a059]/30"
                        />
                      </label>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => go(0)}
                          className="py-2.5 px-4 rounded-xl border border-[#c5a059]/20 text-[#c5a059]/60 hover:text-[#c5a059] text-sm transition-all"
                        >
                          رجوع
                        </button>
                        <motion.button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="btn-gold flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        >
                          {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                          تأكيد الطلب
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={dir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="p-6 flex flex-col items-center justify-center text-center space-y-5 py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-[#c5a059]/15 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.25 }}
                        >
                          <CheckCircle size={40} className="text-[#c5a059]" />
                        </motion.div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <h3 className="text-xl font-black text-[#e5d5b0]">تم تقديم طلبك! ☕</h3>
                        <p className="text-sm text-[#c5a059]/60 max-w-xs">
                          شكراً {form.name}! سنتواصل معك على {form.phone} لتأكيد طلبك قريباً.
                        </p>
                      </motion.div>

                      <motion.button
                        onClick={handleClose}
                        className="btn-gold px-8 py-3 rounded-xl text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        إغلاق
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
