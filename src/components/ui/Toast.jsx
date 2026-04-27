import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import useUIStore from '../../store/useUIStore'

const ICONS = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  warning: <AlertTriangle size={18} className="text-yellow-400" />,
  info: <Info size={18} className="text-[#c5a059]" />,
}

const BG = {
  success: 'border-green-500/30 bg-green-900/20',
  error: 'border-red-500/30 bg-red-900/20',
  warning: 'border-yellow-500/30 bg-yellow-900/20',
  info: 'border-[#c5a059]/30 bg-[#c5a059]/10',
}

function ToastItem({ toast }) {
  const removeToast = useUIStore((s) => s.removeToast)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(show)
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => removeToast(toast.id), 300)
  }

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-xl glass-dark
        border ${BG[toast.type] || BG.info}
        transition-all duration-300 min-w-[280px] max-w-[360px]
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
      `}
    >
      <span className="mt-0.5 shrink-0">{ICONS[toast.type] || ICONS.info}</span>
      <p className="text-sm text-[#e5d5b0] flex-1 leading-relaxed">
        {toast.message}
      </p>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-[#c5a059]/60 hover:text-[#c5a059] transition-colors mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)

  if (!toasts.length) return null

  return (
    <div
      className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2 items-start"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
