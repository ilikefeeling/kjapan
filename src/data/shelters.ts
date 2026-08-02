import { ShelterGeoJSON } from '../types/jma';

export const JAPAN_SHELTERS_DATA: ShelterGeoJSON[] = [
  // Tokyo - Shibuya / Shinjuku / Harajuku / Ginza
  {
    id: "shelter-tokyo-01",
    nameKr: "시부야 구립 미야시타 공원 대피소",
    nameJp: "渋谷区立宮下公園避難所",
    addressJp: "東京都渋谷区神宮前 6-20-10",
    prefecture: "13",
    lat: 35.6620,
    lng: 139.7022,
    capacity: 2500,
    facilities: ["응급의료", "비상발전기", "음용수", "한국어 안내판"],
    shelterType: "GENERAL"
  },
  {
    id: "shelter-tokyo-02",
    nameKr: "시부야 소나무 초등학교 넓은 대피소",
    nameJp: "渋谷区立神南小学校避難所",
    addressJp: "東京都渋谷区宇田川町 5-1",
    prefecture: "13",
    lat: 35.6635,
    lng: 139.6990,
    capacity: 1800,
    facilities: ["내진건물", "비공식 식량", "Wi-Fi 라우터", "배리어프리"],
    shelterType: "EARTHQUAKE"
  },
  {
    id: "shelter-tokyo-03",
    nameKr: "요요기 공원 대규모 광역 대피지",
    nameJp: "代々木公園広域避難場所",
    addressJp: "東京都渋谷区代々木神園町 2-1",
    prefecture: "13",
    lat: 35.6717,
    lng: 139.6949,
    capacity: 10000,
    facilities: ["대형 야외광장", "의무막사", "급수차량", "위성통신"],
    shelterType: "GENERAL"
  },
  {
    id: "shelter-tokyo-04",
    nameKr: "신주쿠 구청 및 중앙공원 대피소",
    nameJp: "新宿区立新宿中央公園避難所",
    addressJp: "東京都新宿区西新宿 2-11",
    prefecture: "13",
    lat: 35.6897,
    lng: 139.6922,
    capacity: 8000,
    facilities: ["의료지원센터", "비상급수대", "다국어 지원원", "자가발전"],
    shelterType: "EARTHQUAKE"
  },
  {
    id: "shelter-tokyo-05",
    nameKr: "긴좌 도쿄 국제 포럼 귀가곤란자 대피소",
    nameJp: "東京国際フォーラム避難所",
    addressJp: "東京都千代田区丸の内 3-5-1",
    prefecture: "13",
    lat: 35.6766,
    lng: 139.7637,
    capacity: 4500,
    facilities: ["실내 대강당", "스마트폰 충전소", "외국인 통역관", "담요제공"],
    shelterType: "GENERAL"
  },
  // Osaka - Namba / Umeda
  {
    id: "shelter-osaka-01",
    nameKr: "난바 난바파크스 지정 긴급 대피소",
    nameJp: "なんばパークス緊急避難場所",
    addressJp: "大阪府大阪市浪速区難波中 2-10-70",
    prefecture: "27",
    lat: 34.6618,
    lng: 135.5015,
    capacity: 3200,
    facilities: ["옥상 녹지대피", "비상식량", "구급상자", "한국어 지원"],
    shelterType: "TSUNAMI"
  },
  {
    id: "shelter-osaka-02",
    nameKr: "우메다 오사카 스테이션 시티 대피 빌딩",
    nameJp: "大阪ステーションシティ避難ビル",
    addressJp: "大阪府大阪市北区梅田 3-1-1",
    prefecture: "27",
    lat: 34.7025,
    lng: 135.4959,
    capacity: 6000,
    facilities: ["3층 이상 쓰나미 대피", "실내 에어콘", "의료진 주둔", "비상전원"],
    shelterType: "TSUNAMI"
  },
  {
    id: "shelter-osaka-03",
    nameKr: "도톤보리 중앙 초등학교 대피소",
    nameJp: "大阪市立中央小学校避難所",
    addressJp: "大阪府大阪市中央区島之内 2-11-20",
    prefecture: "27",
    lat: 34.6703,
    lng: 135.5085,
    capacity: 1500,
    facilities: ["체육관 대피", "구호품 대기", "한국어 소통 지원"],
    shelterType: "EARTHQUAKE"
  },
  // Fukuoka - Hakata / Tenjin
  {
    id: "shelter-fukuoka-01",
    nameKr: "후쿠오카 텐진 중앙공원 대피소",
    nameJp: "天神中央公園避難場所",
    addressJp: "福岡県福岡市中央区天神 1-1",
    prefecture: "40",
    lat: 33.5902,
    lng: 130.4017,
    capacity: 4000,
    facilities: ["야외 광장", "비상 급수선", "재해용 화장실"],
    shelterType: "GENERAL"
  },
  {
    id: "shelter-fukuoka-02",
    nameKr: "하카타 초등학교 지정 대피소",
    nameJp: "福岡市立博多小学校避難所",
    addressJp: "福岡県福岡市博多区奈良屋町 1-38",
    prefecture: "40",
    lat: 33.5956,
    lng: 130.4042,
    capacity: 2000,
    facilities: ["내진 강풍 대피", "비상용 전등", "의무실"],
    shelterType: "EARTHQUAKE"
  },
  // Kyoto
  {
    id: "shelter-kyoto-01",
    nameKr: "교토시 가모가와 공원 대피소",
    nameJp: "鴨川公園広域避難場所",
    addressJp: "京都府京都市左京区下鴨宮河町",
    prefecture: "26",
    lat: 35.0305,
    lng: 135.7720,
    capacity: 5000,
    facilities: ["넓은 야외지대", "비상 자원고", "한국어 안내판"],
    shelterType: "GENERAL"
  }
];
