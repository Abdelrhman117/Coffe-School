import { Coffee } from 'lucide-react'
import { FadeIn } from '../animations'

export default function Footer() {
  return (
    <FadeIn>
      <footer className="border-t border-[#c5a059]/10 py-8 px-6 bg-[#050302] text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Coffee size={16} className="text-[#c5a059]" />
          <span className="text-[#c5a059] font-black tracking-wide">Coffee School</span>
        </div>
        <p className="text-[#c5a059]/30 text-xs">
          © {new Date().getFullYear()} Coffee School. جميع الحقوق محفوظة.
        </p>
        <p className="text-[#c5a059]/20 text-xs">وكيل حصري لـ Syrup 1883 و Med-Coffees في مصر</p>
      </footer>
    </FadeIn>
  )
}
