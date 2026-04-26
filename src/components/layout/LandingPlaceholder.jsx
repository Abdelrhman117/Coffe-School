import { Coffee, BookOpen, Package, Phone, MapPin, Star } from 'lucide-react'
import useStore from '../../store/useStore'

const CONTACT = {
  phones: ['+20 100 000 0000', '+20 111 111 1111'],
  addresses: [
    'القاهرة — المهندسين، شارع جامعة الدول العربية',
    'الإسكندرية — سموحة، شارع فؤاد',
  ],
  email: 'info@coffeeschool.com',
}

export default function LandingPlaceholder() {
  const { products, openAuthModal, addToCart, addToast } = useStore()

  const handleAddToCart = (product) => {
    addToCart(product)
    addToast(`تم إضافة "${product.name}" إلى السلة`, 'success')
  }

  return (
    <main className="pt-16">
      {/* ── Hero ── */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(197,160,89,0.08) 0%, transparent 70%)',
        }}
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-[#c5a059]/5" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-[#c5a059]/8" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-[#c5a059]/12" />
        </div>

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5a059]/25 glass text-[#c5a059] text-sm mb-2">
            <Star size={13} className="fill-[#c5a059]" />
            وكيل حصري لـ Syrup 1883 و Med-Coffees في مصر
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            <span className="gold-text">مدرسة القهوة</span>
          </h1>
          <p className="text-lg md:text-xl text-[#c5a059]/60 leading-relaxed max-w-xl mx-auto">
            ارتقِ بتجربتك في عالم القهوة — دورات احترافية، منتجات فاخرة،
            ومعدات من أرقى العلامات العالمية
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="#products"
              className="btn-gold px-8 py-3 rounded-xl text-base inline-flex items-center gap-2"
            >
              <Package size={18} />
              تصفح المنتجات
            </a>
            <a
              href="#courses"
              className="px-8 py-3 rounded-xl text-base border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059]/10 transition-all inline-flex items-center gap-2"
            >
              <BookOpen size={18} />
              الدورات التدريبية
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#c5a059]/30 text-xs">
          <span>مرر للأسفل</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#c5a059]/30 to-transparent" />
        </div>
      </section>

      {/* ── Products & Courses ── */}
      <section
        id="products"
        className="py-20 px-4 max-w-7xl mx-auto scroll-mt-20"
      >
        <SectionHeader
          eyebrow="منتجاتنا وكوراساتنا"
          title="اختر ما يناسبك"
          sub="من حبوب الإسبريسو الفاخرة إلى دورات البريستا الاحترافية"
        />
        <div id="courses" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => handleAddToCart(product)}
              onBook={() => {
                handleAddToCart(product)
              }}
            />
          ))}
        </div>
      </section>

      {/* ── About / Partners ── */}
      <section className="py-16 px-4 border-y border-[#c5a059]/10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <SectionHeader
            eyebrow="من نحن"
            title="Coffee School"
            sub="الوجهة الأولى لعشاق القهوة في مصر والوطن العربي"
          />
          <p className="text-[#c5a059]/60 leading-relaxed text-sm md:text-base">
            نحن وكلاء حصريون لأشهر العلامات التجارية العالمية في مجال القهوة
            ومنتجاتها. نقدم دورات تدريبية احترافية بالشراكة مع أكاديمية Horeca
            Smart، وننظم رحلات تعليمية وتذوق للمحترفين والهواة على حد سواء.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {['Syrup 1883', 'Med-Coffees', 'Horeca Smart Academy'].map((p) => (
              <span
                key={p}
                className="px-4 py-2 glass rounded-xl text-[#c5a059] text-sm font-semibold border border-[#c5a059]/20"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        id="contact"
        className="py-20 px-4 max-w-5xl mx-auto scroll-mt-20"
      >
        <SectionHeader
          eyebrow="تواصل معنا"
          title="نحن هنا لمساعدتك"
          sub="فريقنا متاح طوال أيام الأسبوع"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <ContactCard icon={<Phone size={20} />} title="اتصل بنا">
            {CONTACT.phones.map((p) => (
              <a
                key={p}
                href={`tel:${p.replace(/\s/g, '')}`}
                className="block text-sm text-[#c5a059]/70 hover:text-[#c5a059] transition-colors dir-ltr"
                dir="ltr"
              >
                {p}
              </a>
            ))}
          </ContactCard>
          <ContactCard icon={<MapPin size={20} />} title="عناويننا">
            {CONTACT.addresses.map((a) => (
              <p key={a} className="text-sm text-[#c5a059]/70 leading-relaxed">
                {a}
              </p>
            ))}
          </ContactCard>
          <ContactCard icon={<Coffee size={20} />} title="البريد الإلكتروني">
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-sm text-[#c5a059]/70 hover:text-[#c5a059] transition-colors"
              dir="ltr"
            >
              {CONTACT.email}
            </a>
          </ContactCard>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#c5a059]/10 py-8 px-4 text-center text-[#c5a059]/30 text-xs space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Coffee size={14} className="text-[#c5a059]/50" />
          <span className="text-[#c5a059]/50 font-bold">Coffee School</span>
        </div>
        <p>© {new Date().getFullYear()} Coffee School. جميع الحقوق محفوظة.</p>
        <p>وكيل حصري لـ Syrup 1883 و Med-Coffees في مصر</p>
      </footer>
    </main>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="text-center space-y-2">
      <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059]/50">
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl font-black text-[#e5d5b0]">{title}</h2>
      {sub && <p className="text-[#c5a059]/60 text-sm md:text-base max-w-xl mx-auto">{sub}</p>}
    </div>
  )
}

function ProductCard({ product, onAdd, onBook }) {
  const isCourse = product.type === 'course'
  return (
    <div className="glass rounded-2xl overflow-hidden group hover:border-[#c5a059]/40 transition-all duration-300 flex flex-col border border-[#c5a059]/10">
      {/* Color bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${product.lightColor}88, ${product.lightColor})`,
        }}
      />

      {/* Model icon placeholder */}
      <div
        className="h-36 flex items-center justify-center relative overflow-hidden"
        style={{
          background: `radial-gradient(circle, ${product.lightColor}15 0%, transparent 70%)`,
        }}
      >
        <ModelIcon model={product.model} color={product.lightColor} />
        {product.badge && (
          <span
            className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${product.lightColor}22`,
              color: product.lightColor,
              border: `1px solid ${product.lightColor}44`,
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-bold text-[#e5d5b0] text-sm leading-snug">
            {product.name}
          </h3>
          {product.variant && (
            <p className="text-[10px] text-[#c5a059]/50 mt-0.5">{product.variant}</p>
          )}
          {product.partner && (
            <p className="text-[10px] text-[#c5a059]/60 mt-0.5 font-medium">
              بالشراكة مع {product.partner}
            </p>
          )}
        </div>

        <p className="text-[11px] text-[#c5a059]/60 leading-relaxed flex-1">
          {product.description.slice(0, 90)}…
        </p>

        {product.features && (
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[9px] px-1.5 py-0.5 rounded-md border border-[#c5a059]/20 text-[#c5a059]/60"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#c5a059]/10">
          <span className="text-[#c5a059] font-black text-base">
            {product.price.toLocaleString('ar-EG')}{' '}
            <span className="text-[10px] font-normal">{product.currency}</span>
          </span>
          <button
            onClick={isCourse ? onBook : onAdd}
            className="btn-gold px-3 py-1.5 rounded-lg text-[11px] font-bold"
          >
            {isCourse ? 'احجز الآن' : 'أضف للسلة'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ModelIcon({ model, color }) {
  const size = 52
  const style = { color }
  const icons = {
    cup: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} stroke="currentColor" strokeWidth="1.2">
        <path d="M5 2h14l-2 13H7L5 2z" />
        <path d="M17 8h2a2 2 0 0 1 0 4h-2" />
        <path d="M3 21h18" />
        <path d="M7 15v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      </svg>
    ),
    cezve: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} stroke="currentColor" strokeWidth="1.2">
        <path d="M7 4h10l1 9H6L7 4z" />
        <path d="M4 4h3" />
        <path d="M6 13c0 2 1.5 4 6 4s6-2 6-4" />
        <path d="M10 2c0 0 1 1 2 1s2-1 2-1" />
      </svg>
    ),
    bottle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} stroke="currentColor" strokeWidth="1.2">
        <path d="M9 2h6v3l2 3v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8l2-3V2z" />
        <path d="M7 10h10" />
        <path d="M10 2v3" />
        <path d="M14 2v3" />
      </svg>
    ),
    bag: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} stroke="currentColor" strokeWidth="1.2">
        <path d="M6 3h12l1 17H5L6 3z" />
        <path d="M9 3c0-1.5 6-1.5 6 0" />
        <path d="M8 10h8" />
        <path d="M8 14h8" />
      </svg>
    ),
    tamper: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} stroke="currentColor" strokeWidth="1.2">
        <rect x="8" y="2" width="8" height="6" rx="1" />
        <line x1="12" y1="8" x2="12" y2="18" />
        <ellipse cx="12" cy="20" rx="5" ry="2" />
      </svg>
    ),
  }
  return icons[model] || <Coffee size={size} style={style} />
}

function ContactCard({ icon, title, children }) {
  return (
    <div className="glass rounded-2xl p-6 space-y-3 border border-[#c5a059]/10">
      <div className="flex items-center gap-2 text-[#c5a059]">
        {icon}
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}
