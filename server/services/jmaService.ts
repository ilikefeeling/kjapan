// JMA Realtime Data Service (Node 18+ native fetch used)

export interface TranslatedAlert {
  alertId: string;
  disasterType: 'EARTHQUAKE' | 'TSUNAMI' | 'HEAVY_RAIN' | 'VOLCANO' | 'TYPHOON';
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

let latestAlert: TranslatedAlert | null = null;
let isPollingActive = false;

// Prefecture Japanese to Korean mapping
const PREFECTURE_MAP_KR: Record<string, string> = {
  "東京都": "도쿄도",
  "大阪府": "오사카부",
  "京都府": "교토부",
  "福岡県": "후쿠오카현",
  "神奈川県": "카나가와현",
  "千葉県": "치바현",
  "埼玉県": "사이타마현",
  "愛知県": "아이치현",
  "北海道": "홋카이도",
  "沖縄県": "오키나와현",
  "宮城県": "미야기현",
  "福島県": "후쿠시마현",
  "熊本県": "쿠마모토현",
  "石川県": "이시카와현"
};

// Seismic scale mapping
const INTENSITY_MAP_KR: Record<string, string> = {
  "1": "진도 1 (미세 진동)",
  "2": "진도 2 (경미한 진동)",
  "3": "진도 3 (건물 흔들림)",
  "4": "진도 4 (강한 진동, 물건 두들김)",
  "5-": "진도 5약 (공포감, 전등 흔들림)",
  "5+": "진도 5강 (선반 물건 떨어짐)",
  "6-": "진도 6약 (서 있기 어려움)",
  "6+": "진도 6강 (벽체 균열, 대피 필요)",
  "7": "진도 7 (최고 위험, 대형 파괴)"
};

export async function fetchLiveJmaAlert(): Promise<TranslatedAlert | null> {
  try {
    const res = await fetch("https://www.jma.go.jp/bosai/quake/data/list.json", {
      headers: { "User-Agent": "KJapan-Emergency-Service/1.0" }
    });

    if (!res.ok) {
      return latestAlert;
    }

    const data: any = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return latestAlert;
    }

    const recent = data[0]; // Most recent JMA earthquake entry
    const ctd = recent.ctd || recent.ttl || "";
    const intensity = recent.maxi || "3";
    const epicenterJp = recent.anm || "일본 현지";

    let locationKr = "일본 관동/관서 지역";
    for (const [jpKey, krVal] of Object.entries(PREFECTURE_MAP_KR)) {
      if (epicenterJp.includes(jpKey)) {
        locationKr = krVal;
        break;
      }
    }

    const intensityKr = INTENSITY_MAP_KR[intensity] || `진도 ${intensity}`;
    const isDanger = ["5-", "5+", "6-", "6+", "7"].includes(intensity);
    const alertLevel = isDanger ? 'DANGER' : (intensity === '4' ? 'WARNING' : 'SAFETY');

    latestAlert = {
      alertId: recent.eid || `JMA-${Date.now()}`,
      disasterType: 'EARTHQUAKE',
      alertLevel,
      locationKr,
      intensityKr,
      pushTitle: `[JMA 실시간 속보] ${locationKr} ${intensityKr} 감지`,
      pushBody: isDanger
        ? "강한 지진 진동 발생! 즉시 머리를 보호하고 가까운 오프라인 대피소 위치를 확인하세요."
        : "일본 현지 지진 정보 수신. 진동 발생 시 안전 수칙을 준수해 주세요.",
      actionGuideKr: isDanger ? [
        "즉시 방석이나 가방으로 머리를 보호하고 책상 밑으로 대피하세요.",
        "엘리베이터 사용을 절대 금지하고 계단을 이용하세요.",
        "진동 정지 후 앱의 오프라인 지도에서 최단거리 대피소로 이동하세요."
      ] : [
        "진동 발생 여부를 주위 환경에서 확인하세요.",
        "비상 연락처 및 대피소 위치를 미리 숙지하세요."
      ],
      timestamp: recent.at || new Date().toISOString(),
      magnitude: recent.mag ? parseFloat(recent.mag) : undefined,
      depthKm: recent.dep ? parseInt(recent.dep) : undefined,
      tsunamiWarning: recent.dom ? true : false
    };

    return latestAlert;
  } catch (error) {
    console.warn("JMA fetch error (operating on fallback):", error);
    return latestAlert;
  }
}

export function startJmaPolling(intervalMs = 8000) {
  if (isPollingActive) return;
  isPollingActive = true;
  console.log("📡 JMA (일본 기상청) 실시간 웹소켓/폴링 파이프라인이 시작되었습니다.");

  // Initial fetch
  fetchLiveJmaAlert();

  // Periodic polling every 8s
  setInterval(() => {
    fetchLiveJmaAlert();
  }, intervalMs);
}

export function getLatestJmaAlert(): TranslatedAlert | null {
  return latestAlert;
}
