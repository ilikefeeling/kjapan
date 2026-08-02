// DisasterGuard JP - Japan Evacuation Shelter GeoJSON Dataset
import { JapanShelter } from '../types/disaster';

export const JAPAN_OFFLINE_SHELTERS: JapanShelter[] = [
  // --- TOKYO (도쿄도 - Prefecture Code 13) ---
  {
    id: 'tokyo-shibuya-01',
    nameJa: '宮下公園 (Miyashita Park)',
    nameKo: '미야시타 공원 (시부야 광역 대피소)',
    nameEn: 'Miyashita Park Shelter',
    prefectureCode: '13',
    prefectureKo: '도쿄도',
    cityKo: '시부야구',
    addressJa: '東京都渋谷区神宮前 6-20-10',
    addressKo: '도쿄도 시부야구 진구마에 6-20-10 (시부야역 도보 3분)',
    lat: 35.6620,
    lng: 139.7022,
    capacity: 5000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'PARK'
  },
  {
    id: 'tokyo-shibuya-02',
    nameJa: '渋谷区立神南小学校',
    nameKo: '진난 초등학교 (시부야 비상 지정 대피소)',
    nameEn: 'Jinnan Elementary School Shelter',
    prefectureCode: '13',
    prefectureKo: '도쿄도',
    cityKo: '시부야구',
    addressJa: '東京都渋谷区宇田川町 5-1',
    addressKo: '도쿄도 시부야구 우다가와초 5-1',
    lat: 35.6638,
    lng: 139.6985,
    capacity: 2500,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'SCHOOL'
  },
  {
    id: 'tokyo-shinjuku-01',
    nameJa: '新宿中央公園',
    nameKo: '신주쿠 중앙공원 (신주쿠 광역 대피소)',
    nameEn: 'Shinjuku Chuo Park Evacuation Center',
    prefectureCode: '13',
    prefectureKo: '도쿄도',
    cityKo: '신주쿠구',
    addressJa: '東京都新宿区西新宿 2-11',
    addressKo: '도쿄도 신주쿠구 니시신주쿠 2-11 (도청 근처)',
    lat: 35.6896,
    lng: 139.6908,
    capacity: 12000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'PARK'
  },
  {
    id: 'tokyo-ginza-01',
    nameJa: '泰明小学校',
    nameKo: '타이메이 초등학교 (긴자/유라쿠초 대피소)',
    nameEn: 'Taimei Elementary School Shelter',
    prefectureCode: '13',
    prefectureKo: '도쿄도',
    cityKo: '주오구 (긴자)',
    addressJa: '東京都中央区銀座 5-1-13',
    addressKo: '도쿄도 주오구 긴자 5-1-13 (긴자역 도보 4분)',
    lat: 35.6721,
    lng: 139.7618,
    capacity: 1800,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: false,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'SCHOOL'
  },
  {
    id: 'tokyo-asakusa-01',
    nameJa: '浅草中学校 (台東区避難所)',
    nameKo: '아사쿠사 중학교 (아사쿠사 센소지 인근 대피소)',
    nameEn: 'Asakusa Junior High School Shelter',
    prefectureCode: '13',
    prefectureKo: '도쿄도',
    cityKo: '다이토구 (아사쿠사)',
    addressJa: '東京都台東区浅草 3-38-1',
    addressKo: '도쿄도 다이토구 아사쿠사 3-38-1',
    lat: 35.7171,
    lng: 139.7963,
    capacity: 3200,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'SCHOOL'
  },
  {
    id: 'tokyo-roppongi-01',
    nameJa: '六本木ヒルズ アリーナ & 防災広場',
    nameKo: '롯폰기 힐즈 방재 아레나 (쓰나미/방재 거점)',
    nameEn: 'Roppongi Hills Disaster Relief Center',
    prefectureCode: '13',
    prefectureKo: '도쿄도',
    cityKo: '미나토구 (롯폰기)',
    addressJa: '東京都港区六本木 6-10-1',
    addressKo: '도쿄도 미나토구 롯폰기 6-10-1',
    lat: 35.6605,
    lng: 139.7292,
    capacity: 8000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'EVACUATION_BUILDING'
  },

  // --- OSAKA (오사카부 - Prefecture Code 27) ---
  {
    id: 'osaka-namba-01',
    nameJa: '難波中学校 (浪速区避難所)',
    nameKo: '난바 중학교 (난바/도톤보리 지정 대피소)',
    nameEn: 'Namba Junior High School Shelter',
    prefectureCode: '27',
    prefectureKo: '오사카부',
    cityKo: '오사카시 나니와구 (난바)',
    addressJa: '大阪府大阪市浪速区塩草 1-4-1',
    addressKo: '오사카시 나니와구 시오쿠사 1-4-1 (난바역 도보 7분)',
    lat: 34.6611,
    lng: 135.4952,
    capacity: 3000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'SCHOOL'
  },
  {
    id: 'osaka-umeda-01',
    nameJa: '梅田スカイビル 防災広場 & 避난ビル',
    nameKo: '우메다 스카이빌딩 방재 광장 (우메다역 인근)',
    nameEn: 'Umeda Sky Building Emergency Shelter',
    prefectureCode: '27',
    prefectureKo: '오사카부',
    cityKo: '오사카시 기타구 (우메다)',
    addressJa: '大阪府大阪市北区大淀中 1-1-88',
    addressKo: '오사카시 기타구 오요도나카 1-1-88',
    lat: 34.7053,
    lng: 135.4896,
    capacity: 6500,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'EVACUATION_BUILDING'
  },
  {
    id: 'osaka-dotonbori-tsunami-01',
    nameJa: '戎橋筋 津波緊急避難ビル',
    nameKo: '에비스바시 긴급 쓰나미 대피 타워 (도톤보리 중심)',
    nameEn: 'Ebisubashi Tsunami Evacuation Tower',
    prefectureCode: '27',
    prefectureKo: '오사카부',
    cityKo: '오사카시 주오구 (도톤보리)',
    addressJa: '大阪府大阪市中央区道頓堀 1-9',
    addressKo: '오사카시 주오구 도톤보리 1-9 (글리코상 100m)',
    lat: 34.6687,
    lng: 135.5013,
    capacity: 1500,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: false,
      barrierFree: false
    },
    shelterType: 'TSUNAMI_TOWER'
  },

  // --- KYOTO (교토부 - Prefecture Code 26) ---
  {
    id: 'kyoto-station-01',
    nameJa: '梅小路公園 (広域避難場所)',
    nameKo: '우메코지 공원 (교토역 인근 광역 대피소)',
    nameEn: 'Umekoji Park Kyoto Shelter',
    prefectureCode: '26',
    prefectureKo: '교토부',
    cityKo: '교토시 시모교구',
    addressJa: '京都府京都市下京区観喜寺町 56-3',
    addressKo: '교토부 교토시 시모교구 칸키지지초 56-3 (교토역 도보 10분)',
    lat: 34.9868,
    lng: 135.7483,
    capacity: 15000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'PARK'
  },
  {
    id: 'kyoto-gion-01',
    nameJa: '開建高等学校 (旧弥栄中学校)',
    nameKo: '기온 야사카 지역 대피소 (기온거리 도보 3분)',
    nameEn: 'Gion Disaster Evacuation Center',
    prefectureCode: '26',
    prefectureKo: '교토부',
    cityKo: '교토시 히가시야마구 (기온)',
    addressJa: '京都府京都市東山区祇園町南側',
    addressKo: '교토시 히가시야마구 기온마치 미나미가와',
    lat: 35.0028,
    lng: 135.7745,
    capacity: 2200,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: false,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'SCHOOL'
  },

  // --- FUKUOKA (후쿠오카현 - Prefecture Code 40) ---
  {
    id: 'fukuoka-hakata-01',
    nameJa: '博多小学校 (広域避難所)',
    nameKo: '하카타 초등학교 (하카타역/나카스 인근 지정 대피소)',
    nameEn: 'Hakata Elementary School Shelter',
    prefectureCode: '40',
    prefectureKo: '후쿠오카현',
    cityKo: '후쿠오카시 하카타구',
    addressJa: '福岡県福岡市博多区奈良屋町 1-38',
    addressKo: '후쿠오카시 하카타구 나라야마치 1-38 (나카스 도보 5분)',
    lat: 33.5960,
    lng: 130.4072,
    capacity: 4000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'SCHOOL'
  },
  {
    id: 'fukuoka-tenjin-01',
    nameJa: '警固公園 (天神中央避難広場)',
    nameKo: '케고 공원 (텐진 중심 광역 대피소)',
    nameEn: 'Kego Park Tenjin Shelter',
    prefectureCode: '40',
    prefectureKo: '후쿠오카현',
    cityKo: '후쿠오카시 주오구 (텐진)',
    addressJa: '福岡県中央区天神 2-2',
    addressKo: '후쿠오카시 주오구 텐진 2-2 (솔라리아 도보 1분)',
    lat: 33.5891,
    lng: 130.3989,
    capacity: 9000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'PARK'
  },

  // --- SAPPORO / HOKKAIDO (홋카이도 - Prefecture Code 01) ---
  {
    id: 'sapporo-odori-01',
    nameJa: '大通公園 (広域避難場所)',
    nameKo: '오도리 공원 (삿포로 중심 대피소)',
    nameEn: 'Odori Park Sapporo Shelter',
    prefectureCode: '01',
    prefectureKo: '홋카이도',
    cityKo: '삿포로시 주오구',
    addressJa: '北海道札幌市中央区大通西 1~12丁目',
    addressKo: '홋카이도 삿포로시 주오구 오도리니시 1~12초메',
    lat: 43.0601,
    lng: 141.3533,
    capacity: 25000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'PARK'
  },

  // --- OKINAWA (오키나와현 - Prefecture Code 47) ---
  {
    id: 'okinawa-naha-01',
    nameJa: '那覇市民体育館 (津波避難ビル)',
    nameKo: '나하 시민체육관 (국제거리 쓰나미 대피소)',
    nameEn: 'Naha Civic Gymnasium Tsunami Shelter',
    prefectureCode: '47',
    prefectureKo: '오키나와현',
    cityKo: '나하시 (국제거리)',
    addressJa: '沖縄県那覇市識名 2-1-1',
    addressKo: '오키나와현 나하시 시키나 2-1-1',
    lat: 26.2085,
    lng: 127.7020,
    capacity: 5000,
    facilities: {
      aed: true,
      waterSupply: true,
      powerGenerator: true,
      firstAid: true,
      multilingualStaff: true,
      wheelchairAccessible: true,
      barrierFree: true
    },
    shelterType: 'TSUNAMI_TOWER'
  }
];

export const EMERGENCY_CONTACTS = [
  {
    id: 'diplomatic-call-center',
    titleKo: '외교부 영사콜센터 (24시간 한국어)',
    subTitleKo: '해외 위급 상황, 통역, 긴급 보호',
    phone: '+82-2-3210-0404',
    category: 'EMBASSY' as const,
    is24h: true,
    descriptionKo: '무료 통화 및 카카오톡 영사콜센터 상담 가능'
  },
  {
    id: 'embassy-tokyo',
    titleKo: '주일 대한민국 대사관 (도쿄)',
    subTitleKo: '주일본 한국 대사관 긴급 전화',
    phone: '+81-3-3452-7613',
    category: 'EMBASSY' as const,
    is24h: true,
    descriptionKo: '긴급야간당직: +81-70-1321-9213'
  },
  {
    id: 'japan-119',
    titleKo: '일본 119 (화재·구급)',
    subTitleKo: 'Emergency Fire & Ambulance Services',
    phone: '119',
    category: 'EMERGENCY' as const,
    is24h: true,
    descriptionKo: '무음 모드에서도 호출 가능 / 통역 연결 서비스 지원'
  },
  {
    id: 'japan-110',
    titleKo: '일본 110 (경찰 신고)',
    subTitleKo: 'Japan Police Emergency Call',
    phone: '110',
    category: 'EMERGENCY' as const,
    is24h: true,
    descriptionKo: '범죄, 사고, 행방불명 신속 신고'
  },
  {
    id: 'jnto-hotline',
    titleKo: 'JNTO 헬프라인 (일본관광청 24h)',
    subTitleKo: 'Japan Visitor Hotline (한국어 지원)',
    phone: '050-3816-2720',
    category: 'HELPLINE' as const,
    is24h: true,
    descriptionKo: '재난 시 관광객 안내 및 병원/대피소 한국어 가이드'
  }
];

export const EMERGENCY_FLASHCARDS = [
  {
    id: 'card-01',
    category: 'SOS' as const,
    korean: '도와주세요!',
    japanesePronunciation: '타스케테 쿠다사이!',
    japaneseKanji: '助けてください！',
    audioText: '助けてください'
  },
  {
    id: 'card-02',
    category: 'SHELTER' as const,
    korean: '가장 가까운 대피소가 어디인가요?',
    japanesePronunciation: '이치반 치카이 피난죠와 도코데스카?',
    japaneseKanji: '一番近い避難所はどこですか？',
    audioText: '一番近い避難所はどこですか'
  },
  {
    id: 'card-03',
    category: 'MEDICAL' as const,
    korean: '다쳤습니다. 의사가 필요합니다.',
    japanesePronunciation: '케가오 시마시타. 이샤가 히츠요데스.',
    japaneseKanji: 'けがをしました。医師が必要です。',
    audioText: 'けがをしました。医師が必要です'
  },
  {
    id: 'card-04',
    category: 'SOS' as const,
    korean: '한국어 통역관을 불러주세요.',
    japanesePronunciation: '캉코쿠고 통야쿠오 오네가이시마스.',
    japaneseKanji: '韓国語通訳をお願いします。',
    audioText: '韓国語通訳をお願いします'
  },
  {
    id: 'card-05',
    category: 'GENERAL' as const,
    korean: '지진인가요? 쓰나미 위험이 있나요?',
    japanesePronunciation: '지신데스카? 트나미노 기켄가 아리마스카?',
    japaneseKanji: '地震ですか？津波の危険がありますか？',
    audioText: '地震ですか？津波の危険がありますか'
  }
];
