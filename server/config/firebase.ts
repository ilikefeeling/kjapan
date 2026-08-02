import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Firebase Admin SDK Initialization (handles mock fallback gracefully if credentials are missing)
let db: any = null;

try {
  if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      : null;

    if (serviceAccount) {
      initializeApp({ credential: cert(serviceAccount) });
      db = getFirestore();
      console.log('🔥 Firebase Admin SDK & Cloud Firestore connected successfully.');
    } else {
      console.log('⚠️ FIREBASE_SERVICE_ACCOUNT_JSON not set. Operating in-memory Firestore fallback mode.');
    }
  } else {
    db = getFirestore();
  }
} catch (error) {
  console.warn('Firebase initialization warning:', error);
}

// In-Memory Storage for fallback when Firebase credentials are not provided
const inMemoryStore = {
  users: new Map<string, any>(),
  payments: new Map<string, any>(),
  alerts: new Map<string, any>()
};

// Default seed data for initial testing
const now = new Date();
const seedUser = {
  uid: 'kakao_77492100',
  kakaoId: '77492100',
  email: 'traveler@kakao.com',
  nickname: '홍길동',
  profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
  role: 'ADMIN',
  isPremium: true,
  premiumExpiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: now.toISOString(),
  updatedAt: now.toISOString()
};
inMemoryStore.users.set(seedUser.uid, seedUser);

// User DB Operations
export async function getOrCreateUser(kakaoData: { id: string | number; nickname: string; email?: string; profileImage?: string }) {
  const uid = `kakao_${kakaoData.id}`;
  if (db) {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (doc.exists) {
      return doc.data();
    }
    const newUser = {
      uid,
      kakaoId: String(kakaoData.id),
      email: kakaoData.email || `${kakaoData.id}@kakao.com`,
      nickname: kakaoData.nickname || '일본 여행자',
      profileImage: kakaoData.profileImage || '',
      role: 'USER',
      isPremium: false,
      premiumExpiresAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await userRef.set(newUser);
    return newUser;
  } else {
    if (inMemoryStore.users.has(uid)) {
      return inMemoryStore.users.get(uid);
    }
    const newUser = {
      uid,
      kakaoId: String(kakaoData.id),
      email: kakaoData.email || `${kakaoData.id}@kakao.com`,
      nickname: kakaoData.nickname || '일본 여행자',
      profileImage: kakaoData.profileImage || '',
      role: 'USER',
      isPremium: false,
      premiumExpiresAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryStore.users.set(uid, newUser);
    return newUser;
  }
}

export async function getUserById(uid: string) {
  if (db) {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  }
  return inMemoryStore.users.get(uid) || null;
}

// 10-Day Premium License Purchase Activation
export async function activate10DayLicense(userId: string, paypalOrderId: string, paypalPayerId: string, passStartsAt?: string, passExpiresAt?: string) {
  const now = new Date();
  
  // Use provided dates or default to starting now for 10 days
  const validFrom = passStartsAt ? new Date(passStartsAt).toISOString() : now.toISOString();
  const validUntil = passExpiresAt ? new Date(passExpiresAt).toISOString() : new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();

  const paymentRecord = {
    paymentId: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    paypalOrderId,
    paypalPayerId,
    amount: 1.00,
    currency: 'USD',
    licenseDays: 10,
    status: 'COMPLETED',
    validFrom: validFrom,
    validUntil: validUntil,
    createdAt: now.toISOString()
  };

  if (db) {
    await db.collection('payments').doc(paymentRecord.paymentId).set(paymentRecord);
    await db.collection('users').doc(userId).update({
      isPremium: true,
      premiumExpiresAt: validUntil,
      passStartsAt: validFrom,
      passType: '10_DAYS',
      updatedAt: now.toISOString()
    });
  } else {
    inMemoryStore.payments.set(paymentRecord.paymentId, paymentRecord);
    const u = inMemoryStore.users.get(userId);
    if (u) {
      u.isPremium = true;
      u.premiumExpiresAt = validUntil;
      u.passStartsAt = validFrom;
      u.passType = '10_DAYS';
      u.updatedAt = now.toISOString();
      inMemoryStore.users.set(userId, u);
    }
  }

  return { payment: paymentRecord, expiresAt: validUntil };
}

// Admin Stats & Lists
export async function getAdminDashboardStats() {
  let usersList: any[] = [];
  let paymentsList: any[] = [];
  let alertsList: any[] = [];

  if (db) {
    const usersSnap = await db.collection('users').get();
    usersList = usersSnap.docs.map((doc: any) => doc.data());

    const paymentsSnap = await db.collection('payments').get();
    paymentsList = paymentsSnap.docs.map((doc: any) => doc.data());

    const alertsSnap = await db.collection('emergency_alerts').get();
    alertsList = alertsSnap.docs.map((doc: any) => doc.data());
  } else {
    usersList = Array.from(inMemoryStore.users.values());
    paymentsList = Array.from(inMemoryStore.payments.values());
    alertsList = Array.from(inMemoryStore.alerts.values());
  }

  const nowTime = new Date().getTime();
  const activeLicenseUsers = usersList.filter(u => u.premiumExpiresAt && new Date(u.premiumExpiresAt).getTime() > nowTime);
  const totalRevenueUsd = paymentsList
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 1.00), 0);

  return {
    totalUsersCount: usersList.length,
    activeLicenseUsersCount: activeLicenseUsers.length,
    totalRevenueUsd,
    totalPaymentsCount: paymentsList.length,
    users: usersList,
    payments: paymentsList,
    alerts: alertsList
  };
}

// Post Emergency Alert by Admin
export async function createEmergencyAlert(adminId: string, alertData: { titleKr: string; bodyKr: string; region: string; severity: string }) {
  const alertRecord = {
    alertId: `ALERT-${Date.now()}`,
    adminId,
    titleKr: alertData.titleKr,
    bodyKr: alertData.bodyKr,
    region: alertData.region || 'ALL',
    severity: alertData.severity || 'WARNING',
    createdAt: new Date().toISOString()
  };

  if (db) {
    await db.collection('emergency_alerts').doc(alertRecord.alertId).set(alertRecord);
  } else {
    inMemoryStore.alerts.set(alertRecord.alertId, alertRecord);
  }

  return alertRecord;
}
