import { useState, useEffect } from 'react'
import {
  X, Plus, Edit2, Trash2, ShoppingBag, Package,
  Loader2, Shield, Save, RefreshCw, CheckCircle, Clock, XCircle,
} from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useProductStore from '../store/useProductStore'
import useUIStore from '../store/useUIStore'

const MODELS = ['tamper', 'cezve', 'bottle', 'bag', 'cup']
const TYPES = ['product', 'course']
const STATUS_LABELS = { pending: 'قيد الانتظار', confirmed: 'مؤكد', cancelled: 'ملغي', delivered: 'تم التسليم' }
const STATUS_ICONS = {
  pending: <Clock size={14} className="text-yellow-400" />,
  confirmed: <CheckCircle size={14} className="text-green-400" />,
  cancelled: <XCircle size={14} className="text-red-400" />,
  delivered: <CheckCircle size={14} className="text-[#c5a059]" />,
}

const EMPTY_FORM = {
  name: '', nameEn: '', type: 'product', price: '', currency: 'EGP',
  description: '', model: 'bag', lightColor: '#c5a059',
  badge: '', features: '', variant: '', partner: '', image: '',
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
      <div className="fixed inset-0 z-[8500] flex items-center justify-center bg-[#050302]/95">
        <div className="glass-dark rounded-2xl p-10 text-center space-y-4 border border-red-500/20 max-w-sm">
          <Shield size={44} className="text-red-400 mx-auto" />
          <p className="text-red-400 font-bold text-lg">غير مصرح بالوصول</p>
          <p className="text-[#c5a059]/50 text-sm">هذه الصفحة للمشرفين فقط</p>
          <button onClick={onClose} className="btn-gold px-8 py-2.5 rounded-xl text-sm">العودة</button>
        </div>
      </div>
    )
  }

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
  }

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
    if (!form.name.trim() || !form.price) {
      addToast('الاسم والسعر مطلوبان', 'warning'); return
    }
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) {
      addToast('السعر يجب أن يكون رقماً موجباً', 'warning'); return
    }
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
    <div className="fixed inset-0 z-[8500] bg-[#050302]/96 overflow-auto" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8 pb-20">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#c5a059]">لوحة الإدارة</h1>
            <p className="text-[#c5a059]/40 text-xs mt-0.5">Coffee School Admin Panel</p>
          </div>
          <button onClick={onClose} className="glass px-4 py-2 rounded-xl text-[#c5a059]/60 hover:text-[#c5a059] text-sm flex items-center gap-1.5 border border-[#c5a059]/15 transition-all">
            <X size={15} /> إغلاق
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-[#c5a059]/15 mb-8 w-fit">
          <TabBtn active={tab === 'products'} onClick={() => setTab('products')} icon={<Package size={15} />}>
            المنتجات ({products.length})
          </TabBtn>
          <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')} icon={<ShoppingBag size={15} />}>
            الطلبات {orders.length > 0 && `(${orders.length})`}
          </TabBtn>
        </div>

        {/* ── PRODUCTS TAB ──────────────────────────────────────────────────── */}
        {tab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[#e5d5b0] font-bold">المنتجات والدورات</h2>
              <button onClick={openAdd} className="btn-gold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                <Plus size={15} /> إضافة منتج
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="glass rounded-2xl p-5 border border-[#c5a059]/10 hover:border-[#c5a059]/25 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase"
                          style={{ background: p.lightColor + '22', color: p.lightColor, border: `1px solid ${p.lightColor}44` }}
                        >
                          {p.type === 'course' ? 'دورة' : 'منتج'}
                        </span>
                        {p.badge && <span className="text-[9px] text-[#c5a059]/50">{p.badge}</span>}
                      </div>
                      <h3 className="font-bold text-[#e5d5b0] text-sm leading-snug">{p.name}</h3>
                      {p.variant && <p className="text-[10px] text-[#c5a059]/50 mt-0.5">{p.variant}</p>}
                      <p className="text-xs text-[#c5a059]/60 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[#c5a059] font-black text-base">
                          {Number(p.price).toLocaleString('ar-EG')} <span className="text-[10px] font-normal">{p.currency}</span>
                        </span>
                        <span className="text-[#c5a059]/30 text-xs">موديل: {p.model}</span>
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-white/20"
                          style={{ background: p.lightColor }}
                          title="لون الإضاءة"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-[#c5a059]/10 text-[#c5a059] hover:bg-[#c5a059]/20 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ORDERS TAB ────────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[#e5d5b0] font-bold">الطلبات الواردة</h2>
              <button onClick={fetchOrders} className="text-[#c5a059]/50 hover:text-[#c5a059] flex items-center gap-1.5 text-sm transition-colors">
                <RefreshCw size={14} /> تحديث
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={28} className="animate-spin text-[#c5a059]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 text-[#c5a059]/30">
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                <p>لا توجد طلبات بعد</p>
                <p className="text-xs mt-1">ستظهر الطلبات هنا فور تقديمها</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="glass rounded-2xl p-4 border border-[#c5a059]/10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {STATUS_ICONS[order.status] || STATUS_ICONS.pending}
                          <span className="text-xs text-[#c5a059]/60">
                            {STATUS_LABELS[order.status] || 'قيد الانتظار'}
                          </span>
                          <span className="text-[9px] text-[#c5a059]/30 font-mono">#{order.id?.slice(-6)}</span>
                        </div>
                        <p className="text-sm text-[#e5d5b0] font-semibold truncate">
                          {order.email || order.uid?.slice(0, 12) + '...'}
                        </p>
                        <p className="text-xs text-[#c5a059]/50 mt-0.5">
                          {order.items?.length} منتج ·{' '}
                          {order.items?.map((i) => i.name).join('، ').slice(0, 50)}
                          {order.items?.map(i => i.name).join('، ').length > 50 ? '...' : ''}
                        </p>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-[#c5a059] font-black text-base">
                          {Number(order.total || 0).toLocaleString('ar-EG')}
                          <span className="text-xs font-normal mr-1">جنيه</span>
                        </p>
                        {order.createdAt?.toDate && (
                          <p className="text-[10px] text-[#c5a059]/30 text-right">
                            {order.createdAt.toDate().toLocaleDateString('ar-EG')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── PRODUCT FORM MODAL ──────────────────────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-[9000] flex items-start justify-center p-4 pt-12 overflow-auto"
          style={{ background: 'rgba(5,3,2,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="glass-dark rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl mb-8">
            {/* Form Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#c5a059]/15">
              <h3 className="font-bold text-[#c5a059]">
                {editId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-[#c5a059]/50 hover:text-[#c5a059] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
                <FField label="الموديل ثلاثي الأبعاد">
                  <select className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.model} onChange={setField('model')}>
                    {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </FField>
              </div>

              <FField label="الوصف">
                <textarea className="w-full input-gold rounded-xl px-3 py-2.5 text-sm resize-none" rows={3} value={form.description} onChange={setField('description')} placeholder="وصف تفصيلي للمنتج..." />
              </FField>

              <div className="grid grid-cols-2 gap-3">
                <FField label="الفارقة / الباقة (variant)">
                  <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.variant} onChange={setField('variant')} placeholder="250 جم / خفيف" />
                </FField>
                <FField label="الشريك (partner)">
                  <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.partner} onChange={setField('partner')} placeholder="Horeca Smart Academy" />
                </FField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FField label="شارة (badge)">
                  <input className="w-full input-gold rounded-xl px-3 py-2.5 text-sm" value={form.badge} onChange={setField('badge')} placeholder="الأكثر مبيعاً" />
                </FField>
                <FField label="لون الإضاءة">
                  <div className="flex items-center gap-2">
                    <input type="color" className="w-12 h-10 rounded-lg cursor-pointer border border-[#c5a059]/25 bg-transparent" value={form.lightColor} onChange={setField('lightColor')} />
                    <input className="flex-1 input-gold rounded-xl px-3 py-2.5 text-sm font-mono" dir="ltr" value={form.lightColor} onChange={setField('lightColor')} placeholder="#c5a059" />
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

            {/* Form Actions */}
            <div className="flex gap-3 px-6 py-4 border-t border-[#c5a059]/15">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-[#c5a059]/20 text-[#c5a059]/60 hover:text-[#c5a059] text-sm transition-all">
                إلغاء
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-gold flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {editId ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ───────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[9100] flex items-center justify-center p-4" style={{ background: 'rgba(5,3,2,0.9)' }}>
          <div className="glass-dark rounded-2xl p-8 max-w-sm w-full text-center space-y-4 border border-red-500/20">
            <Trash2 size={36} className="text-red-400 mx-auto" />
            <p className="text-[#e5d5b0] font-bold">هل أنت متأكد من الحذف؟</p>
            <p className="text-[#c5a059]/50 text-sm">لا يمكن التراجع عن هذا الإجراء</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-6 py-2.5 rounded-xl border border-[#c5a059]/20 text-[#c5a059]/60 hover:text-[#c5a059] text-sm">
                إلغاء
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-6 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-bold transition-all">
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all ${
        active ? 'bg-[#c5a059] text-[#050302]' : 'text-[#c5a059]/60 hover:text-[#c5a059]'
      }`}
    >
      {icon}{children}
    </button>
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
