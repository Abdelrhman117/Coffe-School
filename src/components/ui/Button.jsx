import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'gold',
  size = 'md',
  magnetic = false,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    if (!magnetic || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.25
    const dy = (e.clientY - cy) * 0.25
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const handleMouseLeave = () => {
    if (!magnetic || !ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
    ref.current.style.transition = 'transform 0.35s ease'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-3.5 text-base',
  }

  const variantClasses = {
    gold: 'btn-gold',
    ghost: 'border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059]/10',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: magnetic ? 1 : 1.04 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-bold
        transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  )
}
