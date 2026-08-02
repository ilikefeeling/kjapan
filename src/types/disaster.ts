// DisasterGuard JP - Type Definitions

export type DisasterSeverity = 'NORMAL' | 'ADVISORY' | 'WARNING' | 'EMERGENCY';

export type DisasterCategory = 
  | 'EARTHQUAKE' 
  | 'TSUNAMI' 
  | 'HEAVY_RAIN' 
  | 'TYPHOON' 
  | 'VOLCANO' 
  | 'HEATWAVE' 
  | 'GENERAL';

export interface JmaAlertRaw {
  id: string;
  jmaCode: string; // e.g. "EQ_5U", "TSUNAMI_WARN", "RAIN_EMERGENCY", "VOLCANO_L2"
  category: DisasterCategory;
  severity: DisasterSeverity;
  prefectureCode: string; // e.g. "13" (Tokyo), "27" (Osaka), "26" (Kyoto), "40" (Fukuoka), "01" (Hokkaido), "47" (Okinawa), "ALL"
  prefectureNameKo: string;
  prefectureNameJa: string;
  epicenterJa?: string;
  epicenterKo?: string;
  magnitude?: number;
  maxSeismicIntensity?: string; // e.g. "5Upper" (5강), "6Lower" (6약)
  waveHeightMeters?: number;
  timestamp: string;
  source: string; // e.g. "JMA (Japan Meteorological Agency)"
}

export interface KoreanRuleTemplate {
  jmaCode: string;
  titleKo: string;
  summaryKo: string;
  actionItemsKo: string[];
  audioGuideKo: string;
  bgSeverity: DisasterSeverity;
  category: DisasterCategory;
}

export interface ShelterFacility {
  aed: boolean;
  waterSupply: boolean;
  powerGenerator: boolean;
  firstAid: boolean;
  multilingualStaff: boolean;
  wheelchairAccessible: boolean;
  barrierFree: boolean;
}

export interface JapanShelter {
  id: string;
  nameJa: string;
  nameKo: string;
  nameEn: string;
  prefectureCode: string;
  prefectureKo: string;
  cityKo: string;
  addressJa: string;
  addressKo: string;
  lat: number;
  lng: number;
  capacity: number;
  facilities: ShelterFacility;
  shelterType: 'EVACUATION_BUILDING' | 'PARK' | 'SCHOOL' | 'TSUNAMI_TOWER' | 'COMMUNITY_CENTER';
  distanceMeters?: number;
  bearingDegrees?: number;
  bearingDirectionKo?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  prefectureCode: string;
  prefectureKo: string;
  cityKo: string;
  accuracyMeters?: number;
  isSimulated?: boolean;
}

export interface TravelPass {
  token: string;
  passType: '3_DAY' | '7_DAY';
  purchasedAt: string;
  expiresAt: string;
  isActive: boolean;
  userId: string;
  features: {
    unlimitedPushAlerts: boolean;
    offlineDbAutoSync: boolean;
    prioritySosRouting: boolean;
  };
}

export interface EmergencyContact {
  id: string;
  titleKo: string;
  subTitleKo: string;
  phone: string;
  category: 'EMBASSY' | 'EMERGENCY' | 'HELPLINE' | 'INSURANCE';
  is24h: boolean;
  descriptionKo: string;
}

export interface EmergencyFlashcard {
  id: string;
  category: 'SOS' | 'SHELTER' | 'MEDICAL' | 'GENERAL';
  korean: string;
  japanesePronunciation: string;
  japaneseKanji: string;
  audioText: string;
}
