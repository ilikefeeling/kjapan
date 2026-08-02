import { JmaAlertPayload, TranslatedAlert } from '../types/jma';

export const JMA_PREFECTURE_MAP: Record<string, string> = {
  "13": "도쿄도",
  "14": "가나가와현 (요코하마)",
  "27": "오사카부",
  "40": "후쿠오카현",
  "01": "홋카이도 (삿포로)",
  "26": "교토부",
  "28": "효고현 (고베)",
  "23": "아이치현 (나고야)",
  "11": "사이타마현",
  "12": "치바현",
  "47": "오키나와현",
  "04": "미야기현 (센다이)",
  "22": "시즈오카현 (후지산 부근)",
  "29": "나라현"
};

export const JMA_INTENSITY_MAP: Record<string, { label: string; action: string; level: 'WARNING' | 'DANGER' }> = {
  "3": { label: "진도 3", action: "건물이 흔들립니다. 소지품을 보호하세요.", level: "WARNING" },
  "4": { label: "진도 4", action: "전등이 크게 흔들립니다. 머리를 보호하세요.", level: "WARNING" },
  "5-": { label: "진도 5약", action: "책상 밑으로 대피하고 가구 이동에 주의하세요.", level: "DANGER" },
  "5+": { label: "진도 5강", action: "머리를 보호하고 책상 밑이나 안전 zone으로 대피하세요.", level: "DANGER" },
  "6-": { label: "진도 6약", action: "즉시 낮은 자세를 취하고 문을 열어 출구를 확보하세요.", level: "DANGER" },
  "6+": { label: "진도 6강", action: "가구 붕괴 위험! 즉시 안전한 장소나 대피소로 대피하세요.", level: "DANGER" },
  "7":  { label: "진도 7 (최대)", action: "대규모 파손 위험! 즉시 무너질 위험이 없는 안전 지대로 대피하십시오.", level: "DANGER" }
};

export function translateJmaAlert(raw: JmaAlertPayload): TranslatedAlert {
  const location = JMA_PREFECTURE_MAP[raw.prefectureCode] || "일본 현지";

  if (raw.disasterType === 'TSUNAMI') {
    return {
      alertId: raw.alertId,
      disasterType: 'TSUNAMI',
      alertLevel: 'DANGER',
      locationKr: location,
      intensityKr: '대형 쓰나미 특보',
      pushTitle: `[긴급 쓰나미 경보] ${location} 해안가 쓰나미 주의`,
      pushBody: '해안가 및 하구 부근에서 즉시 벗어나 높은 고지대나 3층 이상 콘크리트 건물로 대피하십시오!',
      actionGuideKr: [
        "1. 해안가 또는 강가에 계신 경우 물건을 챙기지 말고 즉시 고지대로 이동하세요.",
        "2. 3층 이상 단단한 철근 콘크리트 건물이나 지정 쓰나미 대피 빌딩으로 대피하세요.",
        "3. 해제 경보가 발령될 때까지 절대로 해안가로 돌아가지 마세요."
      ],
      timestamp: raw.timestamp,
      magnitude: raw.magnitude,
      tsunamiWarning: true
    };
  }

  if (raw.disasterType === 'HEAVY_RAIN') {
    return {
      alertId: raw.alertId,
      disasterType: 'HEAVY_RAIN',
      alertLevel: 'WARNING',
      locationKr: location,
      intensityKr: '호우 및 침수 경보',
      pushTitle: `[기상 경보] ${location} 집중호우 및 토사재해 위험`,
      pushBody: '지하도, 하천변, 산사태 위험지역 출입을 금지하고 안정한 건물 상층으로 대피하세요.',
      actionGuideKr: [
        "1. 지하상가나 지하철에 계신 경우 신속히 지상으로 대피하세요.",
        "2. 산사태 위험 지역이나 급경사지 인근 방문을 자제하세요.",
        "3. 실시간 오프라인 대피소 위치를 확인하고 안전하게 이동하세요."
      ],
      timestamp: raw.timestamp
    };
  }

  // Default Earthquake
  const intensity = JMA_INTENSITY_MAP[raw.intensityCode] || { label: `진도 ${raw.intensityCode}`, action: "안전에 주의하세요.", level: "WARNING" as const };

  return {
    alertId: raw.alertId,
    disasterType: raw.disasterType,
    alertLevel: intensity.level,
    locationKr: location,
    intensityKr: intensity.label,
    pushTitle: `[긴급 재난 경보] ${location} ${intensity.label} 감지`,
    pushBody: intensity.action,
    actionGuideKr: [
      "1. 흔들림이 멈출 때까지 책상 밑이나 방석으로 머리를 보호하세요.",
      "2. 화재 예방을 위해 가스 밸브를 잠그고 문을 열어 출구를 확보하세요.",
      "3. 해안가 인근인 경우 즉시 고지대로 대피하세요."
    ],
    timestamp: raw.timestamp,
    magnitude: raw.magnitude,
    depthKm: raw.depthKm,
    tsunamiWarning: raw.tsunamiWarning
  };
}
