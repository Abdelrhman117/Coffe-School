import { useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Coffee, BookOpen, ShoppingCart, Phone, MapPin, Mail, Star, ArrowDown, CheckCircle } from 'lucide-react'
import useProductStore from '../store/useProductStore'
import useCartStore from '../store/useCartStore'
import useUIStore from '../store/useUIStore'

const CONTACT = {
  phones: ['+20 100 000 0000', '+20 111 111 1111'],
  addresses: ['القاهرة — المهندسين، شارع جامعة الدول العربية', 'الإسكندرية — سموحة، شارع فؤاد'],
  email: 'info@coffeeschool.com',
}

const SECTION_ACCENTS = ['#f97316', '#c5a059', '#3b82f6', '#a855f7']

// ── Shared variants ────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: d, ease: [0.25, 0.46, 0.45, 0.94] } }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ── Ken Burns Hero ─────────────────────────────────────────────────────────────
function HeroSection({ onAuthOpen }) {
  return (
    <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Ken Burns background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ scale: 1.12 }}
        initial={{ scale: 1 }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(197,160,89,0.08) 0%, rgba(5,3,2,0) 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(249,115,22,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(59,130,246,0.05) 0%, transparent 60%)',
        }}
      />

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[700, 500, 320].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-[#c5a059]/6"
            style={{ width: size, height: size }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.03, 1] }}
            transition={{
              rotate: { duration: 50 + i * 15, repeat: Infinity, ease: 'linear' },
              scale: { duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ))}
      </div>

      {/* Floating coffee dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#c5a059]/15"
          style={{
            width: 6 + i * 3,
            height: 6 + i * 3,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{ y: [-12, 12, -12], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(5,3,2,0.9) 0%, rgba(5,3,2,0.4) 50%, rgba(5,3,2,0.85) 100%)' }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 space-y-6 max-w-3xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={staggerItem}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5a059]/30 glass text-[#c5a059] text-sm"
        >
          <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 2 }}>
            <Star size={12} className="fill-[#c5a059]" />
          </motion.span>
          الوكيل الحصري لـ Syrup 1883 و Med-Coffees في مصر
        </motion.div>

        <motion.h1 variants={staggerItem} className="text-6xl md:text-8xl font-black leading-none tracking-tight">
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
        </motion.h1>

        <motion.p variants={staggerItem} className="text-lg md:text-xl text-[#c5a059]/60 leading-relaxed max-w-xl mx-auto">
          ارتقِ بتجربتك في عالم القهوة — دورات احترافية،
          منتجات فاخرة، وأفضل العلامات العالمية
        </motion.p>

        <motion.div variants={staggerItem} className="flex flex-wrap gap-3 justify-center pt-2">
          <motion.a
            href="#product-section-0"
            className="btn-gold px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2 font-bold"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coffee size={18} /> اكتشف الآن
          </motion.a>
          <motion.button
            onClick={onAuthOpen}
            className="px-8 py-3.5 rounded-xl text-base border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059]/10 transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen size={18} /> سجّل دخولك
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#c5a059]/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-xs tracking-widest">مرر للأسفل</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── Product Section ─────────────────────────────────────────────────────────────
function ProductSection({ product, index, total, onAdd }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const accent = SECTION_ACCENTS[index % SECTION_ACCENTS.length]
  const isEven = index % 2 === 0

  return (
    <section
      ref={ref}
      id={`product-section-${index}`}
      className="relative h-screen flex items-center overflow-hidden"
      style={{ background: `linear-gradient(${isEven ? '270' : '90'}deg, rgba(5,3,2,0.95) 0%, rgba(5,3,2,0.5) 60%, transparent 100%)` }}
    >
      {/* Parallax glow blob */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 55% 70% at ${isEven ? '75%' : '25%'} 50%, ${accent}18 0%, transparent 65%)`,
          }}
        />
      </motion.div>

      {/* Card wrapper — full width, card positioned left or right */}
      <div className={`relative z-10 w-full flex ${isEven ? 'justify-end' : 'justify-start'} px-6 md:px-16 lg:px-24`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? 80 : -80, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-[440px]"
        >
          {/* Card */}
          <motion.div
            className="glass-dark rounded-3xl p-6 md:p-8 border shadow-2xl"
            style={{ borderColor: `${accent}33` }}
            whileHover={{ y: -4, boxShadow: `0 32px 64px ${accent}20` }}
            transition={{ duration: 0.3 }}
          >
            {/* Index badge */}
            <motion.div
              className="absolute -top-4 -right-4 w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black shadow-lg"
              style={{ background: accent, color: '#050302' }}
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 18 }}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.div>

            {/* Badge */}
            {product.badge && (
              <motion.span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}44` }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {product.badge}
              </motion.span>
            )}

            {/* Title */}
            <motion.h2
              className="text-2xl md:text-3xl font-black text-[#e5d5b0] leading-tight mb-1"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
            >
              {product.name}
            </motion.h2>

            {product.variant && <p className="text-xs text-[#c5a059]/60 mb-1">{product.variant}</p>}
            {product.partner && (
              <p className="text-xs font-semibold mb-2" style={{ color: accent }}>
                بالشراكة مع {product.partner}
              </p>
            )}

            {/* Description */}
            <motion.p
              className="text-sm text-[#c5a059]/65 leading-relaxed mb-5 border-t border-[#c5a059]/10 pt-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
            >
              {product.description}
            </motion.p>

            {/* Features */}
            {product.features?.length > 0 && (
              <motion.ul
                className="grid grid-cols-2 gap-1.5 mb-5"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {product.features.map((f) => (
                  <motion.li key={f} variants={staggerItem} className="flex items-center gap-1.5 text-xs text-[#c5a059]/70">
                    <CheckCircle size={11} style={{ color: accent }} className="shrink-0" />
                    {f}
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {/* Price + CTA */}
            <motion.div
              className="flex items-center justify-between pt-4 border-t border-[#c5a059]/10"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
            >
              <div>
                <p className="text-xs text-[#c5a059]/40 mb-0.5">السعر</p>
                <p className="text-2xl font-black" style={{ color: accent }}>
                  {product.price.toLocaleString('ar-EG')}
                  <span className="text-sm font-normal text-[#c5a059]/50 mr-1">{product.currency}</span>
                </p>
              </div>
              <motion.button
                onClick={() => onAdd(product)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
                style={{ background: accent, color: '#050302' }}
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.93 }}
              >
                <ShoppingCart size={16} />
                {product.type === 'course' ? 'احجز الآن' : 'أضف للسلة'}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {Array.from({ length: total }).map((_, j) => (
          <motion.div
            key={j}
            className="rounded-full"
            animate={{ width: j === index ? 24 : 6, background: j === index ? accent : 'rgba(197,160,89,0.2)' }}
            transition={{ duration: 0.3 }}
            style={{ height: 6 }}
          />
        ))}
      </div>
    </section>
  )
}

// ── Stats row ──────────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: '500+', label: 'خريج محترف' },
    { value: '4', label: 'علامات حصرية' },
    { value: '10+', label: 'سنوات خبرة' },
    { value: '2', label: 'فرع رئيسي' },
  ]
  return (
    <section className="py-16 px-6" style={{ background: 'rgba(5,3,2,0.98)' }}>
      <motion.div
        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {stats.map(({ value, label }) => (
          <motion.div key={label} variants={staggerItem} className="text-center">
            <motion.p
              className="text-4xl font-black"
              style={{ color: '#c5a059' }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {value}
            </motion.p>
            <p className="text-sm text-[#c5a059]/50 mt-1">{label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ── About Section ──────────────────────────────────────────────────────────────
function AboutSection() {
  const partners = ['Syrup 1883', 'Med-Coffees', 'Horeca Smart Academy']
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'rgba(5,3,2,0.98)' }}>
      {/* Background accent */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(197,160,89,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <motion.span
          className="text-xs font-bold uppercase tracking-[0.3em] text-[#c5a059]/50"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          من نحن
        </motion.span>

        <motion.h2
          className="text-4xl md:text-5xl font-black text-[#e5d5b0]"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.1}
        >
          الوجهة الأولى لعشاق القهوة
        </motion.h2>

        <motion.p
          className="text-[#c5a059]/60 leading-relaxed max-w-2xl mx-auto"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}
        >
          نحن وكلاء حصريون لأشهر العلامات التجارية العالمية في مجال القهوة ومنتجاتها.
          نقدم دورات تدريبية احترافية بالشراكة مع أكاديمية Horeca Smart،
          وننظم رحلات تعليمية وتذوق للمحترفين والهواة على حد سواء.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 pt-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {partners.map((p) => (
            <motion.div
              key={p}
              variants={staggerItem}
              className="glass px-6 py-3 rounded-2xl border border-[#c5a059]/20"
              whileHover={{ scale: 1.06, borderColor: 'rgba(197,160,89,0.5)', y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[#c5a059] font-bold text-sm">{p}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Contact Section ────────────────────────────────────────────────────────────
function ContactSection() {
  const cards = [
    {
      icon: <Phone size={20} />, title: 'اتصل بنا',
      content: CONTACT.phones.map((p) => (
        <a key={p} href={`tel:${p.replace(/\s/g, '')}`} dir="ltr"
          className="block text-sm text-[#c5a059]/70 hover:text-[#c5a059] transition-colors">
          {p}
        </a>
      )),
    },
    {
      icon: <MapPin size={20} />, title: 'عناويننا',
      content: CONTACT.addresses.map((a) => (
        <p key={a} className="text-sm text-[#c5a059]/70 leading-relaxed">{a}</p>
      )),
    },
    {
      icon: <Mail size={20} />, title: 'البريد الإلكتروني',
      content: (
        <a href={`mailto:${CONTACT.email}`} dir="ltr"
          className="text-sm text-[#c5a059]/70 hover:text-[#c5a059] transition-colors">
          {CONTACT.email}
        </a>
      ),
    },
  ]

  return (
    <section id="contact" className="py-20 px-6 bg-[#050302]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <motion.span
            className="text-xs font-bold uppercase tracking-widest text-[#c5a059]/50"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            تواصل معنا
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-black text-[#e5d5b0]"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.1}
          >
            نحن هنا لمساعدتك
          </motion.h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {cards.map(({ icon, title, content }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="glass rounded-2xl p-6 space-y-3 border border-[#c5a059]/10"
              whileHover={{ y: -4, borderColor: 'rgba(197,160,89,0.3)', boxShadow: '0 20px 40px rgba(197,160,89,0.08)' }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2 text-[#c5a059]">
                {icon}
                <h3 className="font-bold text-sm">{title}</h3>
              </div>
              <div className="space-y-1">{content}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function FooterSection() {
  return (
    <motion.footer
      className="border-t border-[#c5a059]/10 py-8 px-6 bg-[#050302] text-center space-y-2"
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
    >
      <div className="flex items-center justify-center gap-2">
        <Coffee size={16} className="text-[#c5a059]" />
        <span className="text-[#c5a059] font-black tracking-wide">Coffee School</span>
      </div>
      <p className="text-[#c5a059]/30 text-xs">© {new Date().getFullYear()} Coffee School. جميع الحقوق محفوظة.</p>
      <p className="text-[#c5a059]/20 text-xs">وكيل حصري لـ Syrup 1883 و Med-Coffees في مصر</p>
    </motion.footer>
  )
}

// ── Home ───────────────────────────────────────────────────────────────────────
export default function Home() {
  const products = useProductStore((s) => s.products)
  const { addToCart } = useCartStore()
  const { openAuthModal, addToast } = useUIStore()

  const handleAdd = (product) => {
    addToCart(product)
    addToast(`تم إضافة "${product.name}" إلى السلة ☕`, 'success')
  }

  return (
    <div id="scroll-root">
      <HeroSection onAuthOpen={openAuthModal} />

      {products.map((product, i) => (
        <ProductSection
          key={product.id}
          product={product}
          index={i}
          total={products.length}
          onAdd={handleAdd}
        />
      ))}

      <StatsSection />
      <AboutSection />
      <ContactSection />
      <FooterSection />
    </div>
  )
}
