import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
} from 'firebase/firestore'
import { db } from './config'

// ─── Collection names ─────────────────────────────────────────────────────────
const COL = {
  products: 'products',
  orders: 'orders',
  users: 'users',
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts() {
  const snap = await getDocs(
    query(collection(db, COL.products), orderBy('createdAt', 'asc'))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getProduct(id) {
  const snap = await getDoc(doc(db, COL.products, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createProduct(data) {
  const ref = await addDoc(collection(db, COL.products), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, COL.products, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, COL.products, id))
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function submitOrder(uid, email, items, total) {
  const ref = await addDoc(collection(db, COL.orders), {
    uid,
    email: email || null,
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    total,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserOrders(uid) {
  const snap = await getDocs(
    query(
      collection(db, COL.orders),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getAllOrders(limitCount = 50) {
  const snap = await getDocs(
    query(
      collection(db, COL.orders),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function updateOrderStatus(id, status) {
  await updateDoc(doc(db, COL.orders, id), { status, updatedAt: serverTimestamp() })
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function ensureUserDoc(user) {
  const ref = doc(db, COL.users, user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || null,
      phone: user.phoneNumber || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      role: 'user',
      createdAt: serverTimestamp(),
    })
  }
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, COL.users, uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}
