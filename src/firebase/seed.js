import { collection, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

// Real products from coffeschool.com
const SEED_PRODUCTS = [
  {
    id: 'barista-course',
    type: 'course',
    name: 'دورة البريستا الاحترافية',
    nameEn: 'Top Barista Course',
    partner: 'Horeca Smart Academy',
    description:
      'دورة احترافية مع أكاديمية هوريكا سمارت. تعلم فن تحضير القهوة على أعلى مستوى، من أسرار الإسبريسو إلى الرسم على اللاتيه. دورة مكثفة تغطي كل جوانب صناعة القهوة الاحترافية.',
    price: 3000,
    currency: 'EGP',
    image: '/textures/barista-course.jpg',
    model: 'tamper',
    lightColor: '#f97316',
    badge: 'الأكثر مبيعاً',
    features: ['شهادة معتمدة', 'تدريب عملي', 'معدات مهنية', 'مدة 5 أيام'],
    order: 0,
  },
  {
    id: 'turkish-coffee',
    type: 'product',
    name: 'قهوة تركية ميد-كوفي',
    nameEn: 'Med-Coffee Turkish Coffee',
    variant: 'سادة / خفيف 250 جم',
    description:
      'قهوة تركية فاخرة من ميد-كوفيز بخلطة أرابيكا ممتازة. أرومة عميقة وطعم أصيل يأخذك لأجواء إسطنبول في كل رشفة.',
    price: 112,
    currency: 'EGP',
    image: '/textures/turkish-coffee.jpg',
    model: 'cezve',
    lightColor: '#8b5e3c',
    badge: 'وكيل حصري',
    features: ['250 جم', 'ناعمة الطحن', 'أرابيكا فاخرة', 'محمصة طازجة'],
    order: 1,
  },
  {
    id: 'syrup-1883',
    type: 'product',
    name: 'شراب 1883 الفرنسي',
    nameEn: 'Syrup 1883 French',
    description:
      'شراب 1883 الأصيل المصنوع في فرنسا منذ 1883. يضيف لمسة فرنسية راقية لمشروباتك الساخنة والباردة. متوفر بنكهات متعددة.',
    price: 350,
    currency: 'EGP',
    image: '/textures/syrup-1883.jpg',
    model: 'bottle',
    lightColor: '#3b82f6',
    badge: 'وكيل حصري',
    features: ['700 مل', 'صنع في فرنسا', 'منذ 1883', 'نكهات متعددة'],
    order: 2,
  },
  {
    id: 'elite-espresso',
    type: 'product',
    name: 'حبوب إسبريسو إيليت',
    nameEn: 'Elite Espresso Beans',
    variant: '1 كجم — 80% أرابيكا / 20% روبستا',
    description:
      'خلطة إيليت الاحترافية: 80% أرابيكا لنكهة ناعمة ومعقدة، 20% روبستا لكريما كثيفة وقوام ثري. المختار الأول للباريستا.',
    price: 575,
    currency: 'EGP',
    image: '/textures/elite-espresso.jpg',
    model: 'bag',
    lightColor: '#c5a059',
    badge: 'اختيار الخبراء',
    features: ['1 كجم', '80% أرابيكا', '20% روبستا', 'تحميص داكن'],
    order: 3,
  },
]

/**
 * Seeds Firestore with Coffee School products.
 * Idempotent: only writes if the products collection is empty.
 * Safe to call on every app startup.
 */
export async function seedFirestoreIfEmpty() {
  try {
    const snap = await getDocs(collection(db, 'products'))
    if (!snap.empty) return // already seeded

    const batch = writeBatch(db)
    for (const product of SEED_PRODUCTS) {
      const ref = doc(db, 'products', product.id)
      batch.set(ref, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
    await batch.commit()
    console.info('[CoffeeSchool] Firestore seeded with', SEED_PRODUCTS.length, 'products')
  } catch (err) {
    // Non-fatal: demo mode or offline — seed data already in Zustand
    console.warn('[CoffeeSchool] Firestore seed skipped:', err.message)
  }
}

export { SEED_PRODUCTS }
