// DisasterGuard JP - JWT Travel Pass Utility
import { TravelPass } from '../types/disaster';

const STORAGE_KEY = 'disasterguard_pass_token';

export function createSimulatedJwtPass(passType: '3_DAY' | '7_DAY'): TravelPass {
  const now = new Date();
  const durationDays = passType === '3_DAY' ? 3 : 7;
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  const payload = {
    sub: `user_${Math.random().toString(36).substring(2, 9)}`,
    passType,
    purchasedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    isActive: true,
    features: {
      unlimitedPushAlerts: true,
      offlineDbAutoSync: true,
      prioritySosRouting: true
    }
  };

  // Base64 simulated JWT token header.payload.signature
  const headerB64 = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadB64 = btoa(JSON.stringify(payload));
  const sigB64 = btoa('disasterguard_jp_secure_sig');

  const token = `${headerB64}.${payloadB64}.${sigB64}`;

  const pass: TravelPass = {
    token,
    passType,
    purchasedAt: payload.purchasedAt,
    expiresAt: payload.expiresAt,
    isActive: true,
    userId: payload.sub,
    features: payload.features
  };

  savePassToken(token);
  return pass;
}

export function getStoredPass(): TravelPass | null {
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    const expiresAt = new Date(payload.expiresAt);
    const isActive = expiresAt.getTime() > Date.now();

    return {
      token,
      passType: payload.passType,
      purchasedAt: payload.purchasedAt,
      expiresAt: payload.expiresAt,
      isActive,
      userId: payload.sub,
      features: payload.features
    };
  } catch (e) {
    console.error('[JWT] Invalid pass token:', e);
    return null;
  }
}

export function savePassToken(token: string): void {
  localStorage.setItem(STORAGE_KEY, token);
}

export function clearPassToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}
