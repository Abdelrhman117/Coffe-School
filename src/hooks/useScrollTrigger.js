import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useStore from '../store/useStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * Watches scroll position and updates activeSection + scrollProgress in the store.
 * Each sectionId maps to a product index (0-based).
 * The store then drives the 3D scene.
 */
export default function useScrollTrigger(sectionIds = []) {
  const setActiveSection = useStore((s) => s.setActiveSection)
  const setScrollProgress = useStore((s) => s.setScrollProgress)

  useEffect(() => {
    if (!sectionIds.length) return

    // Per-section trigger: updates activeSection when section hits center
    const triggers = sectionIds.map((id, index) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setActiveSection(index),
        onEnterBack: () => setActiveSection(index),
      })
    )

    // Global scrub for overall scroll progress (0 → 1)
    const globalTrigger = ScrollTrigger.create({
      trigger: '#scroll-root',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => setScrollProgress(self.progress),
    })

    return () => {
      triggers.forEach((t) => t.kill())
      globalTrigger.kill()
    }
  }, [sectionIds, setActiveSection, setScrollProgress])
}
