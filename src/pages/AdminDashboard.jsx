import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Plus, Edit2, Trash2, ShoppingBag, Package,
  Loader2, Shield, Save, RefreshCw, CheckCircle, Clock, XCircle, Coffee,
  LayoutDashboard,
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useProductStore from '../store/useProductStore'
import useUIStore from '../store/useUIStore'

const MODELS = ['tamper', 'cezve', 'bottle', 'bag', 'cup']
const TYPES = ['product', 'course']
const STATUS_LABELS = { pending: 'قيد الانتظار', confirmed: 'مؤكد', cancelled: 'ملغي', delivered: 'تم التسليم' }
const STATUS_COLORS = { pending: '#facc15', confirmed: '#4ade80', cancelled: '#f87171', delivered: '#c5a059' }

const EMPTY_FORM = {
  name: '', nameEn: '', type: 'product', price: '', currency: 'EGP',
  description: '', model: 'bag', lightColor: '#c5a059',
  badge: '', features: '', variant: '', partner: '', image: '',
}

const NAV_ITEMS = [
  { id: 'products', label: 'المنتجات', icon: Package },
  { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
]

// ── Slide-up card variant ──────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

export default function AdminDashboard({ onClose }) {
  const { isAdmin } = useAuthStore()
  const { products, addProduct, updateProduct, deleteProduct, orders, ordersLoading, fetchOrders } = useProductStore()
  const { addToast } = useUIStore()

  const [tab, setTab] = useState('products')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (tab === 'orders') fetchOrders()
  }, [tab, fetchOrders])

  if (!isAdmin) {
    return (
      <motion.div
        className="fixed inset-0 z-[8500] flex items-center justify-center"
        style={{ background: 'rgba(5,3,2,0.97)', backdropFilter: 'blur(10px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <div className="glass-dark rounded-2xl p-10 text-center space-y-4 border border-red-500/20 max-w-sm">
          <Shield size={44} className="text-red-400 mx-auto" />
          <p className="text-red-400 font-bold text-lg">غير مصرح بالوصول</p>
          <p className="text-[#c5a059]/50 text-sm">هذه الصفحة للمشرفين فقط</p>
          <button onClick={onClose} className="btn-gold px-8 py-2.5 rounded-xl text-sm">العودة</button>
        </div>
      </motion.div>
    )
  }

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true) }

  const openEdit = (p) => {
    setForm({
      name: p.name || '', nameEn: p.nameEn || '', type: p.type || 'product',
      price: String(p.price || ''), currency: p.currency || 'EGP',
      description: p.description || '', model: p.model || 'bag',
      lightColor: p.lightColor || '#c5a059', badge: p.badge || '',
      features: (p.features || []).join('، '), variant: p.variant || '',
      partner: p.partner || '', image: p.image || '',
    })
    setEditId(p.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { addToast('الاسم والسعر مطلوبان', 'warning'); return }
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) { addToast('السعر يجب أن يكون رقماً موجباً', 'warning'); return }
    setSaving(true)
    const data = {
      ...form, price,
      features: form.features ? form.features.split(/[,،]/).map((f) => f.trim()).filter(Boolean) : [],
    }
    if (editId) {
      await updateProduct(editId, data)
      addToast('تم تحديث المنتج بنجاح', 'success')
    } else {
      await addProduct(data)
      addToast('تم إضافة المنتج بنجاح', 'success')
    }
    setSaving(false)
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    await deleteProduct(id)
    setDeleteConfirm(null)
    addToast('تم حذف المنتج', 'info')
  }

  return (
    <motion.div
      className="fixed inset-0 z-[8500] flex overflow-hidden"
      style={{ background: 'rgba(5,3,2,0.97)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ── SIDEBAR ───────────────────────────────────────────────────────────── */}
      <motion.aside
        className="hidden md:flex flex-col w-60 shrink-0 border-l border-[#c5a059]/10 bg-[#080604]"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-6 border-b border-[#c5a059]/10">
          <div className="w-8 h-8 rounded-xl bg-[#c5a059]/15 flex items-center justify-center">
            <LayoutDashboard size={16} className="text-[#c5a059]" />
          </div>
          <div>
            <p className="text-[#c5a059] font-black text-sm leading-none">لوحة الإدارة</p>
            <p className="text-[#c5a059]/30 text-[10px] mt-0.5">Coffee School</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: tab === id ? '#050302' : 'rgba(197,160,89,0.55)' }}
            >
              {tab === id && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-[#c5a059]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={16} className="relative z-10" />
              <span className="relative z-10">{label}</span>
              {id === 'products' && (
                <span className={`relative z-10 mr-auto text-[10px] font-black px-1.5 rounded-full ${tab === id ? 'bg-[#050302]/20 text-[#050302]' : 'bg-[#c5a059]/15 text-[#c5a059]/60'}`}>
                  {products.length}
                </span>
              )}
              {id === 'orders' && orders.length > 0 && (
                <span className={`relative z-10 mr-auto text-[10px] font-black px-1.5 rounded-full ${tab === id ? 'bg-[#050302]/20 text-[#050302]' : 'bg-[#c5a059]/15 text-[#c5a059]/60'}`}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Close */}
        <div className="p-4 border-t border-[#c5a059]/10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-[#c5a059]/50 hover:text-[#c5a059] hover:bg-[#c5a059]/8 transition-all"
          >
            <X size={15} /> إغلاق اللوحة
          </button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-[#c5a059]/10 shrink-0">
          <div className="flex items-center gap-2">
            <Coffee size={18} className="text-[#c5a059]" />
            <span className="text-[#c5a059] font-black text-sm">لوحة الإدارة</span>
          </div>
          <button onClick={onClose} className="text-[#c5a059]/50 hover:text-[#c5a059] p-1">
            <X size={20} />
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-[#c5a059]/10 shrink-0">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
                tab === id ? 'text-[#c5a059] border-b-2 border-[#c5a059]' : 'text-[#c5a059]/40'
              }`}
            >
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            {tab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-[#e5d5b0]">المنتجات والدورات</h2>
                    <p className="text-xs text-[#c5a059]/40 mt-0.5">{products.length} عنصر</p>
                  </div>
                  <motion.button
                    onClick={openAdd}
                    className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={15} /> إضافة منتج
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {products.map((p, i) => (
                      <motion.div
                        key={p.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="glass rounded-2xl p-5 border border-[#c5a059]/10 group"
                        whileHover={{ borderColor: 'rgba(197,160,89,0.3)', y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                style={{ background: (p.lightColor || '#c5a059') + '22', color: p.lightColor || '#c5a059', border: `1px solid ${p.lightColor || '#c5a059'}44` }}
                              >
                                {p.type === 'course' ? 'دورة' : 'منتج'}
                              </span>
                              {p.badge && <span className="text-[9px] text-[#c5a059]/40 truncate">{p.badge}</span>}
                            </div>
                            <h3 className="font-bold text-[#e5d5b0] text-sm leading-snug">{p.name}</h3>
                            {p.variant && <p className="text-[10px] text-[#c5a059]/50 mt-0.5">{p.variant}</p>}
                            <p className="text-xs text-[#c5a059]/55 mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>
                            <p className="text-[#c5a059] font-black text-base mt-2.5">
                              {Number(p.price).toLocaleString('ar-EG')}
                              <span className="text-[10px] font-normal mr-1">{p.currency}</span>
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              onClick={() => openEdit(p)}
                              className="p-2 rounded-lg bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059]/25 transition-colors"
                              whileTap={{ scale: 0.85 }}
                            >
                              <Edit2 size={14} />
                            </motion.button>
                            <motion.button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-colors"
                              whileTap={{ scale: 0.85 }}
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {tab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-[#e5d5b0]">الطلبات الواردة</h2>
                    <p className="text-xs text-[#c5a059]/40 mt-0.5">{orders.length} طلب</p>
                  </div>
                  <motion.button
                    onClick={fetchOrders}
                    className="text-[#c5a059]/50 hover:text-[#c5a059] flex items-center gap-1.5 text-sm transition-colors"
                    whileTap={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <RefreshCw size={14} /> تحديث
                  </motion.button>
                </div>

                {ordersLoading ? (
                  <div className="flex justify-center py-24">
                    <Loader2 size={28} className="animate-spin text-[#c5a059]" />
                  </div>
                ) : orders.length === 0 ? (
                  <motion.div
                    className="text-center py-24 text-[#c5a059]/30"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  >
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-semibold">لا توجد طلبات بعد</p>
                    <p className="text-xs mt-1 opacity-60">ستظهر الطلبات هنا فور تقديمها</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, i) => {
                      const color = STATUS_COLORS[order.status] || STATUS_COLORS.pending
                      return (
                        <motion.div
                          key={order.id}
                          custom={i}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          className="glass rounded-2xl p-4 border border-[#c5a059]/10"
                          whileHover={{ borderColor: 'rgba(197,160,89,0.25)' }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: `${color}20`, color, border: `1px solid ${color}44` }}
                                >
                                  {STATUS_LABELS[order.status] || 'قيد الانتظار'}
                                </span>
                                <span className="text-[9px] text-[#c5a059]/30 font-mono">#{order.id?.slice(-6)}</span>
                              </div>
                              <p className="text-sm text-[#e5d5b0] font-semibold truncate">
                                {order.contactName || order.email || order.uid?.slice(0, 14) + '...'}
                              </p>
                              {order.contactPhone && (
                                <p className="text-xs text-[#c5a059]/50 mt-0.5" dir="ltr">{order.contactPhone}</p>
                              )}
                              <p className="text-xs text-[#c5a059]/40 mt-1">
                                {order.items?.length} منتج ·{' '}
                                {order.items?.map((i) => i.name).join('، ').slice(0, 55)}
                                {order.items?.map((i) => i.name).join('، ').length > 55 ? '...' : ''}
                              </p>
                            </div>
                            <div className="text-left shrink-0">
                              <p className="text-[#c5a059] font-black text-base">
                                {Number(order.total || 0).toLocaleString('ar-EG')}
                                <span className="text-xs font-normal mr-1">جنيه</span>
                              </p>
                              {order.createdAt?.toDate && (
                                <p className="text-[10px] text-[#c5a059]/30 text-right mt-0.5">
                                  {order.createdAt.toDate().toLocaleDateString('ar-EG')}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── PRODUCT FORM PANEL (slides in from right/left) ─────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              key="form-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
              style={{ background: 'rgba(5,3,2,0.65)' }}
              onClick={() => setShowForm(false)}
            />
            <motion.div
              key="form-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 36 }}
              className="absolute top-0 right-0 bottom-0 z-20 w-full max-w-[520px] glass-dark border-l border-[#c5a059]/15 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#c5a059]/15 shrink-0">
                <h3 className="font-bold text-[#c5a059]">{editId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                <motion.button onClick={() => setShowForm(false)} className="text-[#c5a059]/50 hover:text-[#c5a059]" whileTap={{ scale: 0.85 }}>
                  <X size={18} />
                </motion.button>
              </div>

              {/* Form fields */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FField label="الاسم بالعربية *">
                    <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.name} onChange={setField('name')} placeholder="دورة البريستا..." />
                  </FField>
                  <FField label="الاسم بالإنجليزية">
                    <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" dir="ltr" value={form.nameEn} onChange={setField('nameEn')} placeholder="Barista Course" />
                  </FField>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <FField label="النوع">
                    <select className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.type} onChange={setField('type')}>
                      {TYPES.map((t) => <option key={t} value={t}>{t === 'course' ? 'دورة' : 'منتج'}</option>)}
                    </select>
                  </FField>
                  <FField label="السعر (EGP) *">
                    <input type="number" className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" dir="ltr" value={form.price} onChange={setField('price')} placeholder="3000" min="0" />
                  </FField>
                  <FField label="موديل 3D">
                    <select className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.model} onChange={setField('model')}>
                      {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </FField>
                </div>

                <FField label="الوصف">
                  <textarea className="w-full input-gold rounded-xl px-3 py-2.5 text-sm resize-none" rows={3} value={form.description} onChange={setField('description')} placeholder="وصف تفصيلي..." />
                </FField>

                <div className="grid grid-cols-2 gap-3">
                  <FField label="الفارقة (variant)">
                    <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.variant} onChange={setField('variant')} placeholder="250 جم" />
                  </FField>
                  <FField label="الشريك (partner)">
                    <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.partner} onChange={setField('partner')} placeholder="Horeca Smart" />
                  </FField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FField label="شارة (badge)">
                    <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.badge} onChange={setField('badge')} placeholder="الأكثر مبيعاً" />
                  </FField>
                  <FField label="لون الإضاءة">
                    <div className="flex items-center gap-2">
                      <input type="color" className="w-10 h-10 rounded-lg cursor-pointer border border-[#c5a059]/25 bg-transparent p-1" value={form.lightColor} onChange={setField('lightColor')} />
                      <input className="flex-1 input-gold rounded-xl px-3 py-2.5 text-sm font-mono" dir="ltr" value={form.lightColor} onChange={setField('lightColor')} />
                    </div>
                  </FField>
                </div>

                <FField label="المميزات (مفصولة بفاصلة)">
                  <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.features} onChange={setField('features')} placeholder="شهادة معتمدة، تدريب عملي، مدة 5 أيام" />
                </FField>

                <FField label="رابط الصورة">
                  <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" dir="ltr" value={form.image} onChange={setField('image')} placeholder="/textures/product.jpg" />
                </FField>
              </div>

              {/* Panel footer */}
              <div className="flex gap-3 px-6 py-5 border-t border-[#c5a059]/15 shrink-0">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-[#c5a059]/20 text-[#c5a059]/60 hover:text-[#c5a059] text-sm transition-all">
                  إلغاء
                </button>
                <motion.button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-gold flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {editId ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            key="delete-confirm"
            className="absolute inset-0 z-30 flex items-center justify-center p-4"
            style={{ background: 'rgba(5,3,2,0.88)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-dark rounded-2xl p-8 max-w-sm w-full text-center space-y-4 border border-red-500/25"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.1 }}
              >
                <Trash2 size={40} className="text-red-400 mx-auto" />
              </motion.div>
              <p className="text-[#e5d5b0] font-bold text-lg">هل أنت متأكد من الحذف؟</p>
              <p className="text-[#c5a059]/50 text-sm">لا يمكن التراجع عن هذا الإجراء</p>
              <div className="flex gap-3 justify-center pt-1">
                <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2.5 rounded-xl border border-[#c5a059]/20 text-[#c5a059]/60 hover:text-[#c5a059] text-sm transition-all">
                  إلغاء
                </button>
                <motion.button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-6 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-bold transition-all"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                >
                  نعم، احذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-[#c5a059]/60 font-semibold block">{label}</label>
      {children}
    </div>
  )
}
