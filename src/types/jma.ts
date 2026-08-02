export type DisasterType = 'EARTHQUAKE' | 'TSUNAMI' | 'HEAVY_RAIN' | 'VOLCANO' | 'TYPHOON';

export interface JmaAlertPayload {
  alertId: string;
  disasterType: DisasterType;
  timestamp: string;
  prefectureCode: string;
  intensityCode: string; // '3', '4', '5-', '5+', '6-', '6+', '7'
  magnitude?: number;
  depthKm?: number;
  tsunamiWarning?: boolean;
  epicenterJp?: string;
}

export interface TranslatedAlert {
  alertId: string;
  disasterType: DisasterType;
  alertLevel: 'SAFETY' | 'WARNING' | 'DANGER';
  locationKr: string;
  intensityKr: string;
  pushTitle: string;
  pushBody: string;
  actionGuideKr: string[];
  timestamp: string;
  magnitude?: number;
  depthKm?: number;
  tsunamiWarning?: boolean;
}

export interface ShelterGeoJSON {
  id: string;
  nameKr: string;
  nameJp: string;
  addressJp: string;
  prefecture: string;
  lat: number;
  lng: number;
  capacity: number;
  facilities: string[];
  shelterType: 'EARTHQUAKE' | 'TSUNAMI' | 'GENERAL';
  distanceKm?: number;
  bearing?: string;
}

export interface UserPass {
  id: string;
  provider: 'kakao' | 'naver' | 'apple' | 'google';
  passType: '10_DAYS' | '3_DAYS' | '7_DAYS';
  purchasedAt: string;
  passStartsAt: string;
  passExpiresAt: string;
  status: 'PRE_ACTIVE' | 'ACTIVE' | 'EXPIRED' | 'PENDING';
  fcmPushToken: string;
  userName: string;
  userEmail: string;
  passportVerified: boolean;
  arrivalDate?: string;
  departureDate?: string;
  arrivalAirport?: string;
  departureAirport?: string;
  offlineMapDownloaded?: boolean;
}

export interface EmergencyContact {
  id: string;
  titleKr: string;
  subTitle: string;
  phone: string;
  type: 'consular' | 'fire' | 'police' | 'embassy';
  icon: string;
  bgColorClass: string;
  textColorClass: string;
}
