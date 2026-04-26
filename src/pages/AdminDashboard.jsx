// Step 5 will implement full CRUD (products, orders) on this dashboard.
// Auth guard: redirects non-admins back to Home.

import { Shield } from 'lucide-react'
import useStore from '../store/useStore'

export default function AdminDashboard({ onClose }) {
  const { isAdmin } = useStore()

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[8500] flex items-center justify-center bg-[#050302]/90">
        <div className="glass-dark rounded-2xl p-10 text-center space-y-3 border border-red-500/20">
          <Shield size={40} className="text-red-400 mx-auto" />
          <p className="text-red-400 font-bold">غير مصرح بالوصول</p>
          <button onClick={onClose} className="btn-gold px-6 py-2 rounded-xl text-sm">
            العودة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[8500] bg-[#050302]/95 overflow-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-[#c5a059]">لوحة الإدارة</h1>
          <button onClick={onClose} className="text-[#c5a059]/60 hover:text-[#c5a059] text-sm">
            إغلاق
          </button>
        </div>
        <div className="glass rounded-2xl p-8 text-center text-[#c5a059]/40">
          <Shield size={32} className="mx-auto mb-3 opacity-40" />
          <p>يتم بناء لوحة الإدارة الكاملة في الخطوة الخامسة</p>
          <p className="text-xs mt-1">CRUD المنتجات — إدارة الطلبات — رفع صور المنتجات</p>
        </div>
      </div>
    </div>
  )
}
