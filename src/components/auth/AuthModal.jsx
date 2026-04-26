import { useState, useRef, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
} from 'firebase/auth'
import { X, Mail, Phone, Eye, EyeOff, Loader2, Coffee } from 'lucide-react'
import { auth, googleProvider, appleProvider } from '../../firebase/config'
import { ensureUserDoc } from '../../firebase/firestore'
import useStore from '../../store/useStore'

// ─── Tab state: 'login' | 'signup' ───────────────────────────────────────────
// ─── Method: 'email' | 'phone' ───────────────────────────────────────────────

const DEMO_MODE = !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key'

export default function AuthModal() {
  const { closeAuthModal, setUser, addToast } = useStore()
  const [tab, setTab] = useState('login')
  const [method, setMethod] = useState('email')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const recaptchaRef = useRef(null)
  const confirmationRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
  })

  useEffect(() => {
    return () => {
      if (window._recaptchaVerifier) {
        window._recaptchaVerifier.clear()
        window._recaptchaVerifier = null
      }
    }
  }, [])

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  // ── Demo mode helper ────────────────────────────────────────────────────────
  const handleDemoLogin = () => {
    const fakeUser = {
      uid: 'demo-user',
      email: 'demo@coffeeschool.com',
      displayName: 'مستخدم تجريبي',
      photoURL: null,
      phoneNumber: null,
    }
    setUser(fakeUser)
    addToast('تم تسجيل الدخول في الوضع التجريبي', 'info')
    closeAuthModal()
  }

  // ── Email / Password ────────────────────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (DEMO_MODE) { handleDemoLogin(); return }
    if (!form.email || !form.password) {
      addToast('يرجى ملء جميع الحقول', 'warning'); return
    }
    setLoading(true)
    try {
      let cred
      if (tab === 'signup') {
        cred = await createUserWithEmailAndPassword(auth, form.email, form.password)
        if (form.name) await updateProfile(cred.user, { displayName: form.name })
        await ensureUserDoc(cred.user)
        addToast('تم إنشاء الحساب بنجاح! أهلاً بك ☕', 'success')
      } else {
        cred = await signInWithEmailAndPassword(auth, form.email, form.password)
        addToast('أهلاً بعودتك!', 'success')
      }
      setUser(cred.user)
      closeAuthModal()
    } catch (err) {
      addToast(mapError(err.code), 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Phone / OTP ─────────────────────────────────────────────────────────────
  const setupRecaptcha = () => {
    if (!window._recaptchaVerifier) {
      window._recaptchaVerifier = new RecaptchaVerifier(
        auth,
        recaptchaRef.current,
        { size: 'invisible', callback: () => {} }
      )
    }
    return window._recaptchaVerifier
  }

  const handleSendOtp = async () => {
    if (DEMO_MODE) {
      setOtpSent(true)
      addToast('تم إرسال رمز OTP (وضع تجريبي)', 'info')
      return
    }
    if (!form.phone) { addToast('أدخل رقم الهاتف', 'warning'); return }
    setLoading(true)
    try {
      const verifier = setupRecaptcha()
      const confirmation = await signInWithPhoneNumber(
        auth,
        form.phone.startsWith('+') ? form.phone : `+20${form.phone}`,
        verifier
      )
      confirmationRef.current = confirmation
      setOtpSent(true)
      addToast('تم إرسال رمز التحقق إلى هاتفك', 'success')
    } catch (err) {
      addToast(mapError(err.code), 'error')
      if (window._recaptchaVerifier) {
        window._recaptchaVerifier.clear()
        window._recaptchaVerifier = null
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (DEMO_MODE) { handleDemoLogin(); return }
    if (!form.otp) { addToast('أدخل رمز التحقق', 'warning'); return }
    setLoading(true)
    try {
      const cred = await confirmationRef.current.confirm(form.otp)
      await ensureUserDoc(cred.user)
      setUser(cred.user)
      addToast('تم تسجيل الدخول بنجاح! ☕', 'success')
      closeAuthModal()
    } catch (err) {
      addToast('رمز التحقق غير صحيح', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Social auth ─────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    if (DEMO_MODE) { handleDemoLogin(); return }
    setLoading(true)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      await ensureUserDoc(cred.user)
      setUser(cred.user)
      addToast('تم الدخول بحساب جوجل بنجاح', 'success')
      closeAuthModal()
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        addToast(mapError(err.code), 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleApple = async () => {
    if (DEMO_MODE) { handleDemoLogin(); return }
    setLoading(true)
    try {
      const cred = await signInWithPopup(auth, appleProvider)
      await ensureUserDoc(cred.user)
      setUser(cred.user)
      addToast('تم الدخول بحساب Apple بنجاح', 'success')
      closeAuthModal()
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        addToast(mapError(err.code), 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,3,2,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && closeAuthModal()}
    >
      {/* Invisible recaptcha anchor */}
      <div ref={recaptchaRef} />

      <div className="glass-dark rounded-2xl w-full max-w-[420px] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-[#c5a059]/15">
          <div className="flex items-center gap-3 justify-center">
            <Coffee size={24} className="text-[#c5a059]" />
            <h2 className="text-xl font-bold text-[#c5a059]">
              {tab === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </h2>
          </div>
          <p className="text-center text-sm text-[#c5a059]/50 mt-1">
            Coffee School — مدرسة القهوة
          </p>
          <button
            onClick={closeAuthModal}
            className="absolute top-4 left-4 text-[#c5a059]/50 hover:text-[#c5a059] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Tab switcher */}
          <div className="flex rounded-xl overflow-hidden border border-[#c5a059]/20 text-sm font-semibold">
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setOtpSent(false) }}
                className={`flex-1 py-2.5 transition-all duration-200 ${
                  tab === t
                    ? 'bg-[#c5a059] text-[#050302]'
                    : 'text-[#c5a059]/60 hover:text-[#c5a059]'
                }`}
              >
                {t === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
              </button>
            ))}
          </div>

          {/* Method switcher */}
          <div className="flex gap-2">
            <MethodBtn
              active={method === 'email'}
              onClick={() => { setMethod('email'); setOtpSent(false) }}
              icon={<Mail size={15} />}
              label="بريد إلكتروني"
            />
            <MethodBtn
              active={method === 'phone'}
              onClick={() => { setMethod('phone'); setOtpSent(false) }}
              icon={<Phone size={15} />}
              label="رقم الهاتف"
            />
          </div>

          {/* Email form */}
          {method === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {tab === 'signup' && (
                <Input
                  placeholder="الاسم الكامل"
                  value={form.name}
                  onChange={update('name')}
                  type="text"
                />
              )}
              <Input
                placeholder="البريد الإلكتروني"
                value={form.email}
                onChange={update('email')}
                type="email"
                dir="ltr"
              />
              <div className="relative">
                <Input
                  placeholder="كلمة المرور"
                  value={form.password}
                  onChange={update('password')}
                  type={showPwd ? 'text' : 'password'}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]/50 hover:text-[#c5a059]"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <SubmitBtn loading={loading}>
                {tab === 'login' ? 'دخول' : 'إنشاء الحساب'}
              </SubmitBtn>
            </form>
          )}

          {/* Phone form */}
          {method === 'phone' && (
            <div className="space-y-3">
              {!otpSent ? (
                <>
                  <div className="flex gap-2 items-center">
                    <span className="text-[#c5a059] text-sm font-mono shrink-0 border border-[#c5a059]/30 rounded-lg px-3 py-2.5 bg-[#c5a059]/5">
                      +20
                    </span>
                    <Input
                      placeholder="01x xxxx xxxx"
                      value={form.phone}
                      onChange={update('phone')}
                      type="tel"
                      dir="ltr"
                    />
                  </div>
                  <SubmitBtn loading={loading} onClick={handleSendOtp} type="button">
                    إرسال رمز التحقق
                  </SubmitBtn>
                </>
              ) : (
                <>
                  <p className="text-xs text-[#c5a059]/60 text-center">
                    أدخل الرمز المرسل إلى {form.phone}
                  </p>
                  <Input
                    placeholder="رمز التحقق (6 أرقام)"
                    value={form.otp}
                    onChange={update('otp')}
                    type="text"
                    dir="ltr"
                    maxLength={6}
                  />
                  <SubmitBtn loading={loading} onClick={handleVerifyOtp} type="button">
                    تأكيد الرمز
                  </SubmitBtn>
                  <button
                    onClick={() => { setOtpSent(false); setForm((f) => ({ ...f, otp: '' })) }}
                    className="w-full text-xs text-[#c5a059]/50 hover:text-[#c5a059] transition-colors"
                  >
                    إعادة الإرسال
                  </button>
                </>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#c5a059]/15" />
            <span className="text-[#c5a059]/40 text-xs">أو</span>
            <div className="flex-1 h-px bg-[#c5a059]/15" />
          </div>

          {/* Social auth */}
          <div className="grid grid-cols-2 gap-3">
            <SocialBtn onClick={handleGoogle} disabled={loading}>
              {/* Google SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-semibold">Google</span>
            </SocialBtn>

            <SocialBtn onClick={handleApple} disabled={loading}>
              {/* Apple SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-semibold">Apple</span>
            </SocialBtn>
          </div>

          {DEMO_MODE && (
            <p className="text-center text-xs text-[#c5a059]/40 mt-1">
              وضع تجريبي — يعمل بدون Firebase حقيقي
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Helper components ─────────────────────────────────────────────────────────
function MethodBtn({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg text-sm border transition-all ${
        active
          ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10'
          : 'border-[#c5a059]/20 text-[#c5a059]/50 hover:border-[#c5a059]/50'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function Input({ ...props }) {
  return (
    <input
      className="w-full rounded-xl px-4 py-2.5 text-sm input-gold placeholder:text-[#c5a059]/30"
      {...props}
    />
  )
}

function SubmitBtn({ loading, children, onClick, type = 'submit' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="btn-gold w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

function SocialBtn({ onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#c5a059]/20 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-60"
    >
      {children}
    </button>
  )
}

// ─── Firebase error → Arabic message ──────────────────────────────────────────
function mapError(code) {
  const map = {
    'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني',
    'auth/wrong-password': 'كلمة المرور غير صحيحة',
    'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
    'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل)',
    'auth/invalid-email': 'البريد الإلكتروني غير صالح',
    'auth/too-many-requests': 'محاولات كثيرة، حاول لاحقاً',
    'auth/network-request-failed': 'فشل الاتصال، تحقق من الإنترنت',
    'auth/invalid-phone-number': 'رقم الهاتف غير صالح',
    'auth/invalid-verification-code': 'رمز التحقق غير صحيح',
  }
  return map[code] || 'حدث خطأ، يرجى المحاولة مجدداً'
}
