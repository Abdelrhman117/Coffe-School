import { useState, useEffect } from 'react'

export default function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState('up')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 60)
      if (Math.abs(currentY - lastY) < threshold) return
      setDirection(currentY > lastY ? 'down' : 'up')
      lastY = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return { direction, scrolled }
}
