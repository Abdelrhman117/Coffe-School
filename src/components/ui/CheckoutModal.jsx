import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, User, Phone, MapPin, CheckCircle, Loader2, ChevronRight, Coffee } from 'lucide-react'
import emailjs from '@emailjs/browser'
import useCartStore from '../../store/useCartStore'
import useUIStore from '../../store/useUIStore'
import useAuthStore from '../../store/useAuthStore'
import { submitOrder } from '../../firebase/firestore'

const IS_DEMO = !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key'

const EJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EJS_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const EMAILJS_ON = EJS_SERVICE && EJS_SERVICE !== 'your_service_id'

async function sendOrderEmail(form, cart, total, userEmail) {
  if (!EMAILJS_ON) return
  const itemsList = cart.map((i) => `${i.nameEn || i.name} × ${i.quantity} — ${(i.price * i.quantity).toLocaleString('en-EG')} EGP`).join('\n')
  await emailjs.send(EJS_SERVICE, EJS_TEMPLATE, {
    customer_name: form.name,
    customer_phone: form.phone,
    customer_address: form.address || 'Not provided',
    customer_email: userEmail || 'Not provided',
    order_items: itemsList,
    order_total: `${total.toLocaleString('en-EG')} EGP`,
    order_date: new Date().toLocaleString('en-EG'),
  }, EJS_KEY)
}

const STEPS = ['Review Order', 'Delivery Info', 'Confirmed']

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

  const go = (next) => { setDir(next > step ? 1 : -1); setStep(next) }
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { addToast('Please fill in your name and phone number', 'warning'); return }
    setLoading(true)
    try {
      if (!IS_DEMO && user) await submitOrder(user.uid, user.email, cart, total, { ...form })
      await sendOrderEmail(form, cart, total, user?.email)
      clearCart()
      setDone(true)
      go(2)
    } catch {
      addToast('Order failed, please try again', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(0); setDir(1); setDone(false)
    setForm({ name: user?.displayName || '', phone: '', address: '' })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000]" style={{ background: 'rgba(5,3,2,0.88)', backdropFilter: 'blur(10px)' }} onClick={handleClose} />

          <motion.div key="modal" initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-[9100] flex items-center justify-center p-4 pointer-events-none">
            <div className="glass-dark rounded-2xl w-full max-w-[480px] overflow-hidden shadow-2xl border border-[#c5a059]/15 pointer-events-auto" onClick={(e) => e.stopPropagation()}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#c5a059]/15">
                <div className="flex items-center gap-2">
                  <Coffee size={20} className="text-[#c5a059]" />
                  <h2 className="text-lg font-bold text-[#c5a059]">Checkout</h2>
                </div>
                <motion.button onClick={handleClose} className="text-[#c5a059]/50 hover:text-[#c5a059] transition-colors" whileTap={{ scale: 0.85 }}>
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
                          <motion.div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                            animate={{ background: i <= step ? '#c5a059' : 'rgba(197,160,89,0.15)', color: i <= step ? '#050302' : 'rgba(197,160,89,0.4)', scale: i === step ? 1.1 : 1 }}
                            transition={{ duration: 0.3 }}>
                            {i < step ? <CheckCircle size={14} /> : i + 1}
                          </motion.div>
                          <span className={`text-xs hidden sm:block ${i === step ? 'text-[#c5a059]' : 'text-[#c5a059]/40'}`}>{label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <motion.div className="flex-1 h-px" animate={{ background: i < step ? '#c5a059' : 'rgba(197,160,89,0.15)' }} transition={{ duration: 0.4 }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="relative overflow-hidden min-h-[320px]">
                <AnimatePresence mode="wait" custom={dir}>
                  {step === 0 && (
                    <motion.div key="step0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="p-6 space-y-3">
                      <div className="space-y-2 max-h-[260px] overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between glass rounded-xl px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-[#e5d5b0]">{item.nameEn || item.name}</p>
                              <p className="text-xs text-[#c5a059]/60">× {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-[#c5a059]">{(item.price * item.quantity).toLocaleString('en-EG')} EGP</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#c5a059]/15 text-[#c5a059] font-bold">
                        <span>Total</span><span>{total.toLocaleString('en-EG')} EGP</span>
                      </div>
                      <motion.button onClick={() => go(1)} className="btn-gold w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                        Next <ChevronRight size={16} />
                      </motion.button>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div key="step1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="p-6 space-y-4">
                      <p className="text-sm text-[#c5a059]/60 mb-2">Enter your details to complete the order</p>
                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-[#c5a059]/60"><User size={13} /> Full Name</span>
                        <input value={form.name} onChange={update('name')} placeholder="John Smith" className="w-full rounded-xl px-4 py-2.5 text-sm input-gold placeholder:text-[#c5a059]/30" />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-[#c5a059]/60"><Phone size={13} /> Phone Number</span>
                        <input value={form.phone} onChange={update('phone')} placeholder="+20 1xx xxx xxxx" type="tel" className="w-full rounded-xl px-4 py-2.5 text-sm input-gold placeholder:text-[#c5a059]/30" />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-[#c5a059]/60"><MapPin size={13} /> Address (optional)</span>
                        <input value={form.address} onChange={update('address')} placeholder="City, district, street..." className="w-full rounded-xl px-4 py-2.5 text-sm input-gold placeholder:text-[#c5a059]/30" />
                      </label>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => go(0)} className="py-2.5 px-4 rounded-xl border border-[#c5a059]/20 text-[#c5a059]/60 hover:text-[#c5a059] text-sm transition-all">Back</button>
                        <motion.button onClick={handleSubmit} disabled={loading} className="btn-gold flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                          {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                          Place Order
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35 }} className="p-6 flex flex-col items-center justify-center text-center space-y-5 py-12">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-[#c5a059]/15 flex items-center justify-center">
                        <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.25 }}>
                          <CheckCircle size={40} className="text-[#c5a059]" />
                        </motion.div>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
                        <h3 className="text-xl font-black text-[#e5d5b0]">Order Placed! ☕</h3>
                        <p className="text-sm text-[#c5a059]/60 max-w-xs">
                          Thank you {form.name}! We'll contact you at {form.phone} to confirm your order shortly.
                        </p>
                      </motion.div>
                      <motion.button onClick={handleClose} className="btn-gold px-8 py-3 rounded-xl text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        Close
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
