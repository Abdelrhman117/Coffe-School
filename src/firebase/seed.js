import { collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

export const SEED_PRODUCTS = [
  // ── الدورات ────────────────────────────────────────────────────────────────
  {
    id: 'barista-course',
    type: 'course',
    name: 'دورة البريستا الاحترافية',
    nameEn: 'Professional Barista Course',
    partner: 'Horeca Smart Academy',
    description: 'دورة احترافية مع أكاديمية هوريكا سمارت. تعلم فن تحضير القهوة على أعلى مستوى — من أسرار الإسبريسو إلى الرسم على اللاتيه. دورة مكثفة تغطي كل جوانب صناعة القهوة الاحترافية.',
    price: 3000,
    currency: 'EGP',
    model: 'tamper',
    lightColor: '#f97316',
    badge: 'الأكثر مبيعاً',
    features: ['شهادة معتمدة', 'تدريب عملي', 'معدات مهنية', 'مدة 5 أيام'],
    order: 0,
  },

  // ── إسبريسو ────────────────────────────────────────────────────────────────
  {
    id: 'med-coffee-espresso-100',
    type: 'product',
    name: 'إسبريسو 100% ميد-كوفي',
    nameEn: 'Espress 100% Med-Coffee',
    variant: 'حبوب كاملة',
    description: 'خلطة إسبريسو 100% أرابيكا من ميد-كوفيز، بتحميص احترافي يمنحك كريما كثيفة وطعماً غنياً في كل كوب.',
    price: 625,
    currency: 'EGP',
    model: 'bag',
    lightColor: '#92510a',
    badge: 'ميد-كوفي',
    features: ['100% أرابيكا', 'حبوب كاملة', 'كريما كثيفة', 'تحميص داكن'],
    order: 1,
  },
  {
    id: 'med-coffee-crema',
    type: 'product',
    name: 'حبوب كريما ميد-كوفي',
    nameEn: 'MED-COFFEE Crema Whole Beans',
    variant: '1000 جم — 60% أرابيكا / 40% روبستا',
    description: 'خلطة كريما الاحترافية: 60% أرابيكا لنكهة ناعمة، 40% روبستا لجسم قوي وحموضة منخفضة. مثالية للإسبريسو.',
    price: 475,
    currency: 'EGP',
    model: 'bag',
    lightColor: '#c5a059',
    badge: 'الأكثر مبيعاً',
    features: ['1000 جم', '60% أرابيكا', '40% روبستا', 'حموضة منخفضة'],
    order: 2,
  },
  {
    id: 'med-coffee-elite',
    type: 'product',
    name: 'حبوب إيليت ميد-كوفي',
    nameEn: 'MED-COFFEE ELITE Whole Beans',
    variant: '1000 جم — 80% أرابيكا / 20% روبستا',
    description: 'خلطة إيليت المتميزة: 80% أرابيكا لنكهة ناعمة ومعقدة، 20% روبستا لكريما كثيفة. الاختيار الأول للباريستا المحترف.',
    price: 575,
    currency: 'EGP',
    model: 'bag',
    lightColor: '#f97316',
    badge: 'اختيار الخبراء',
    features: ['1000 جم', '80% أرابيكا', '20% روبستا', 'للمحترفين'],
    order: 3,
  },
  {
    id: 'med-coffee-filtro',
    type: 'product',
    name: 'قهوة فيلترو ميد-كوفي',
    nameEn: 'MED-COFFEE Filtro Ground Coffee',
    variant: '1000 جم — مطحونة — تحميص متوسط',
    description: 'فيلترو ميد-كوفي: خلطة متوازنة من أرابيكا وروبستا بتحميص متوسط. مطحونة بدقة للفلتر، طعم ناعم وأرومة رائعة.',
    price: 450,
    currency: 'EGP',
    model: 'bag',
    lightColor: '#3b82f6',
    badge: 'مطحونة',
    features: ['1000 جم', 'مطحونة', 'تحميص متوسط', 'للفلتر'],
    order: 4,
  },

  // ── شراب 1883 ──────────────────────────────────────────────────────────────
  {
    id: 'syrup-1883-pure-900',
    type: 'product',
    name: 'شراب 1883 الأصلي',
    nameEn: 'Pure 1883 Syrup 900ML',
    variant: '900 مل',
    description: 'شراب 1883 الأصيل المصنوع في فرنسا منذ 1883. يضيف لمسة راقية لمشروباتك الساخنة والباردة بنكهات متعددة.',
    price: 450,
    currency: 'EGP',
    model: 'bottle',
    lightColor: '#a855f7',
    badge: 'وكيل حصري',
    features: ['900 مل', 'صنع في فرنسا', 'منذ 1883', 'نكهات متعددة'],
    order: 5,
  },
  {
    id: 'syrup-1883-no-sugar',
    type: 'product',
    name: 'شراب 1883 بدون سكر',
    nameEn: 'Syrup 1883 No Sugar 1L',
    variant: '1 لتر — خالٍ من السكر',
    description: 'نفس نكهة 1883 الفرنسية الأصيلة بدون سكر. الخيار الأمثل لمن يفضل مشروبه لذيذاً دون سعرات حرارية إضافية.',
    price: 325,
    currency: 'EGP',
    model: 'bottle',
    lightColor: '#22c55e',
    badge: 'بدون سكر',
    features: ['1 لتر', 'خالٍ من السكر', 'فرنسي أصلي', 'نكهات متعددة'],
    order: 6,
  },
  {
    id: 'syrup-1883-frappe',
    type: 'product',
    name: 'فرابي ميكس 1883',
    nameEn: 'Syrup 1883 Frappe Mix 1L',
    variant: '1 لتر — خاص بالفرابي',
    description: 'مزيج 1883 المصمم خصيصاً للفرابي والمشروبات الباردة. يمنح قوام كريمي ونكهة غنية في كل كوب.',
    price: 325,
    currency: 'EGP',
    model: 'bottle',
    lightColor: '#06b6d4',
    badge: 'فرابي',
    features: ['1 لتر', 'خاص بالفرابي', 'قوام كريمي', 'فرنسي أصلي'],
    order: 7,
  },
  {
    id: 'pump-syrup',
    type: 'product',
    name: 'مضخة شراب 1883',
    nameEn: 'Pump Syrup 1 Liter',
    variant: '1 لتر — مع مضخة',
    description: 'مضخة شراب 1883 الاحترافية. تضمن جرعة دقيقة من الشراب في كل ضغطة — الحل المثالي للكافيهات والمنزل.',
    price: 75,
    currency: 'EGP',
    model: 'bottle',
    lightColor: '#f59e0b',
    badge: 'ملحقات',
    features: ['1 لتر', 'مضخة دقيقة', 'للكافيهات', 'سهل الاستخدام'],
    order: 8,
  },
]

export async function seedFirestoreIfEmpty() {
  try {
    const snap = await getDocs(collection(db, 'products'))
    if (!snap.empty) return

    const batch = writeBatch(db)
    for (const product of SEED_PRODUCTS) {
      const ref = doc(db, 'products', product.id)
      batch.set(ref, { ...product, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
    }
    await batch.commit()
    console.info('[CoffeeSchool] Firestore seeded with', SEED_PRODUCTS.length, 'products')
  } catch (err) {
    console.warn('[CoffeeSchool] Firestore seed skipped:', err.message)
  }
}
