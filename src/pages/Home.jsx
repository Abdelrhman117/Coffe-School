import { useEffect, useRef } from 'react'
import { Coffee, BookOpen, ShoppingCart, Phone, MapPin, Mail, Star, ArrowDown, CheckCircle } from 'lucide-react'
import useStore from '../store/useStore'
import useScrollTrigger from '../hooks/useScrollTrigger'
import CanvasContainer from '../components/3d/CanvasContainer'

const CONTACT = {
  phones: ['+20 100 000 0000', '+20 111 111 1111'],
  addresses: ['القاهرة — المهندسين، شارع جامعة الدول العربية', 'الإسكندرية — سموحة، شارع فؤاد'],
  email: 'info@coffeeschool.com',
}

// Section color accent per product (matches SceneLighting)
const SECTION_ACCENTS = ['#f97316', '#92510a', '#3b82f6', '#c5a059']

export default function Home() {
  const { products, addToCart, openAuthModal, addToast } = useStore()
  const sectionIds = products.map((_, i) => `product-section-${i}`)

  useScrollTrigger(sectionIds)

  const handleAdd = (product) => {
    addToCart(product)
    addToast(`تم إضافة "${product.name}" إلى السلة ☕`, 'success')
  }

  return (
    <>
      {/* Fixed 3D Canvas — sits behind all HTML (z:1), no pointer events */}
      <CanvasContainer />

      {/* Scrollable HTML overlay */}
      <div id="scroll-root" className="relative" style={{ zIndex: 10 }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          id="hero"
          className="h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(5,3,2,0.95) 0%, rgba(5,3,2,0.5) 60%, transparent 100%)' }}
        >
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[700px] rounded-full border border-[#c5a059]/5 animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[450px] h-[450px] rounded-full border border-[#c5a059]/8 animate-[spin_40s_linear_infinite_reverse]" />
          </div>

          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5a059]/30 glass text-[#c5a059] text-sm mb-2">
              <Star size={12} className="fill-[#c5a059]" />
              الوكيل الحصري لـ Syrup 1883 و Med-Coffees في مصر
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight">
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #c5a059 0%, #f0d080 50%, #c5a059 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                مدرسة
              </span>
              <span className="block text-[#e5d5b0]">القهوة</span>
            </h1>

            <p className="text-lg md:text-xl text-[#c5a059]/60 leading-relaxed max-w-xl mx-auto">
              ارتقِ بتجربتك في عالم القهوة — دورات احترافية،
              منتجات فاخرة، وأفضل العلامات العالمية
            </p>

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <a href="#product-section-0" className="btn-gold px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2 font-bold">
                <Coffee size={18} /> اكتشف الآن
              </a>
              <button onClick={openAuthModal} className="px-8 py-3.5 rounded-xl text-base border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059]/10 transition-all inline-flex items-center gap-2">
                <BookOpen size={18} /> سجّل دخولك
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#c5a059]/30 animate-bounce">
            <span className="text-xs">مرر للأسفل</span>
            <ArrowDown size={16} />
          </div>
        </section>

        {/* ── PRODUCT SECTIONS ──────────────────────────────────────────────── */}
        {products.map((product, i) => (
          <section
            key={product.id}
            id={`product-section-${i}`}
            className="h-screen flex items-center justify-end px-6 md:px-16 lg:px-24 relative scroll-mt-0"
            style={{
              background: i % 2 === 0
                ? `linear-gradient(270deg, rgba(5,3,2,0.92) 0%, rgba(5,3,2,0.6) 55%, transparent 100%)`
                : `linear-gradient(90deg, rgba(5,3,2,0.92) 0%, rgba(5,3,2,0.6) 55%, transparent 100%)`,
            }}
          >
            {/* Accent glow behind card */}
            <div
              className="absolute inset-y-0 pointer-events-none"
              style={{
                right: i % 2 === 0 ? 0 : 'auto',
                left: i % 2 !== 0 ? 0 : 'auto',
                width: '60%',
                background: `radial-gradient(ellipse 60% 80% at ${i % 2 === 0 ? '80%' : '20%'} 50%, ${SECTION_ACCENTS[i]}12 0%, transparent 70%)`,
              }}
            />

            {/* Product Card */}
            <div
              className={`
                relative glass-dark rounded-3xl p-6 md:p-8 w-full max-w-[420px]
                border border-[#c5a059]/15 shadow-2xl
                ${i % 2 !== 0 ? 'mr-auto' : ''}
              `}
              style={{ borderColor: `${SECTION_ACCENTS[i]}33` }}
            >
              {/* Section number */}
              <div
                className="absolute -top-4 -right-4 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black"
                style={{ background: SECTION_ACCENTS[i], color: '#050302' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Badge */}
              {product.badge && (
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                  style={{
                    background: `${SECTION_ACCENTS[i]}20`,
                    color: SECTION_ACCENTS[i],
                    border: `1px solid ${SECTION_ACCENTS[i]}44`,
                  }}
                >
                  {product.badge}
                </span>
              )}

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-black text-[#e5d5b0] leading-tight mb-1">
                {product.name}
              </h2>
              {product.variant && (
                <p className="text-xs text-[#c5a059]/60 mb-1">{product.variant}</p>
              )}
              {product.partner && (
                <p className="text-xs font-semibold mb-2" style={{ color: SECTION_ACCENTS[i] }}>
                  بالشراكة مع {product.partner}
                </p>
              )}

              {/* Description */}
              <p className="text-sm text-[#c5a059]/65 leading-relaxed mb-5 border-t border-[#c5a059]/10 pt-4">
                {product.description}
              </p>

              {/* Features */}
              {product.features?.length > 0 && (
                <ul className="grid grid-cols-2 gap-1.5 mb-5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-[#c5a059]/70">
                      <CheckCircle size={11} style={{ color: SECTION_ACCENTS[i] }} className="shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {/* Price + CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-[#c5a059]/10">
                <div>
                  <p className="text-xs text-[#c5a059]/40 mb-0.5">السعر</p>
                  <p className="text-2xl font-black" style={{ color: SECTION_ACCENTS[i] }}>
                    {product.price.toLocaleString('ar-EG')}
                    <span className="text-sm font-normal text-[#c5a059]/50 mr-1">{product.currency}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                  style={{ background: SECTION_ACCENTS[i], color: '#050302' }}
                >
                  <ShoppingCart size={16} />
                  {product.type === 'course' ? 'احجز الآن' : 'أضف للسلة'}
                </button>
              </div>
            </div>

            {/* Scroll progress mini-indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {products.map((_, j) => (
                <div
                  key={j}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: j === i ? 24 : 6,
                    height: 6,
                    background: j === i ? SECTION_ACCENTS[i] : 'rgba(197,160,89,0.2)',
                  }}
                />
              ))}
            </div>
          </section>
        ))}

        {/* ── ABOUT / PARTNERS ───────────────────────────────────────────────── */}
        <section
          className="py-24 px-6 relative"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(5,3,2,0.98) 15%)' }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#c5a059]/50">من نحن</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#e5d5b0]">
              الوجهة الأولى لعشاق القهوة
            </h2>
            <p className="text-[#c5a059]/60 leading-relaxed max-w-2xl mx-auto">
              نحن وكلاء حصريون لأشهر العلامات التجارية العالمية في مجال القهوة ومنتجاتها.
              نقدم دورات تدريبية احترافية بالشراكة مع أكاديمية Horeca Smart،
              وننظم رحلات تعليمية وتذوق للمحترفين والهواة على حد سواء.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {['Syrup 1883', 'Med-Coffees', 'Horeca Smart Academy'].map((p) => (
                <div key={p} className="glass px-6 py-3 rounded-2xl border border-[#c5a059]/20">
                  <span className="text-[#c5a059] font-bold text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────────────────────── */}
        <section id="contact" className="py-20 px-6 bg-[#050302]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059]/50">تواصل معنا</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#e5d5b0]">نحن هنا لمساعدتك</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ContactCard icon={<Phone size={20} />} title="اتصل بنا">
                {CONTACT.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, '')}`} dir="ltr"
                    className="block text-sm text-[#c5a059]/70 hover:text-[#c5a059] transition-colors">
                    {p}
                  </a>
                ))}
              </ContactCard>
              <ContactCard icon={<MapPin size={20} />} title="عناويننا">
                {CONTACT.addresses.map((a) => (
                  <p key={a} className="text-sm text-[#c5a059]/70 leading-relaxed">{a}</p>
                ))}
              </ContactCard>
              <ContactCard icon={<Mail size={20} />} title="البريد الإلكتروني">
                <a href={`mailto:${CONTACT.email}`} dir="ltr"
                  className="text-sm text-[#c5a059]/70 hover:text-[#c5a059] transition-colors">
                  {CONTACT.email}
                </a>
              </ContactCard>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <footer className="border-t border-[#c5a059]/10 py-8 px-6 bg-[#050302] text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Coffee size={16} className="text-[#c5a059]" />
            <span className="text-[#c5a059] font-black tracking-wide">Coffee School</span>
          </div>
          <p className="text-[#c5a059]/30 text-xs">
            © {new Date().getFullYear()} Coffee School. جميع الحقوق محفوظة.
          </p>
          <p className="text-[#c5a059]/20 text-xs">
            وكيل حصري لـ Syrup 1883 و Med-Coffees في مصر
          </p>
        </footer>

      </div>
    </>
  )
}

function ContactCard({ icon, title, children }) {
  return (
    <div className="glass rounded-2xl p-6 space-y-3 border border-[#c5a059]/10 hover:border-[#c5a059]/25 transition-colors">
      <div className="flex items-center gap-2 text-[#c5a059]">
        {icon}
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}
