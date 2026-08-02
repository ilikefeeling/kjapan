// DisasterGuard JP - Token Cost Zero Rule-based JMA Code Matching Engine
import { JmaAlertRaw, KoreanRuleTemplate } from '../types/disaster';

export const JMA_RULE_TEMPLATES: Record<string, KoreanRuleTemplate> = {
  'NORMAL_STATE': {
    jmaCode: 'NORMAL_STATE',
    titleKo: '실시간 재난 모니터링: 정상 (Normal)',
    summaryKo: '현재 일본 기상청(JMA) 감지 시스템 상 감지된 위급 재난 상황이 없습니다.',
    actionItemsKo: [
      '평상시 이동 경로 근처 대피소 위치를 미리 확인하세요.',
      '만약의 상황에 대비해 보조 배터리와 여권을 항상 휴대하세요.',
      '현지 긴급 연락망(영사콜센터 +82-2-3210-0404)을 확인해 두세요.'
    ],
    audioGuideKo: '현재 기상청 감지 재난이 없습니다. 안심하고 여행을 즐기세요.',
    bgSeverity: 'NORMAL',
    category: 'GENERAL'
  },
  'EQ_5U': {
    jmaCode: 'EQ_5U',
    titleKo: '【긴급 지진 속보】 진도 5강 (5 Upper) 강진 발생!',
    summaryKo: '해당 지역에 강한 진동이 감지되었습니다. 서둘러 몸을 보호하고 낙하물에 주의하세요.',
    actionItemsKo: [
      '즉시 단단한 책상이나 탁자 밑으로 들어가 머리를 보호하세요.',
      '엘리베이터 사용을 절대 금하고 계단을 통해 대피하세요.',
      '진동이 멈추면 전열기구 코드를 뽑고 문을 열어 탈출구를 확보하세요.',
      '유리창이나 간판 탈락 위험이 있으므로 건물 외벽 근처를 피하세요.'
    ],
    audioGuideKo: '긴급 지진 경보! 진도 5강의 지진이 발생했습니다. 즉시 몸을 낮추고 책상 밑으로 대피하십시오.',
    bgSeverity: 'EMERGENCY',
    category: 'EARTHQUAKE'
  },
  'EQ_6L': {
    jmaCode: 'EQ_6L',
    titleKo: '【대형 지진 특보】 진도 6약 (6 Lower) 대형 지진 발생!',
    summaryKo: '서 있기 힘들 정도의 대형 진동입니다. 가구 도괴 및 화재에 각별히 주의하십시오.',
    actionItemsKo: [
      '넘어지는 가구나 가전제품으로부터 멀리 떨어지세요.',
      '화재 발생 시 젖은 수건으로 입과 코를 가리고 낮은 자세로 대피하세요.',
      '해안가나 하천 근처에 있다면 쓰나미 발생 가능성이 있으므로 고지대로 이동하세요.'
    ],
    audioGuideKo: '대형 지진 발생! 머리를 보호하고 해안가 근처는 피하십시오.',
    bgSeverity: 'EMERGENCY',
    category: 'EARTHQUAKE'
  },
  'TSUNAMI_WARN': {
    jmaCode: 'TSUNAMI_WARN',
    titleKo: '【긴급 쓰나미 주의보】 해안가 진입 금지 및 고지대 이동!',
    summaryKo: '해안 및 하구 주변에 1~3m 수준의 쓰나미 도달이 예상됩니다. 즉시 지시대피 하십시오.',
    actionItemsKo: [
      '해변, 하천, 다리 근처에서 즉시 벗어나세요.',
      '해발 20m 이상 높이의 언덕이나 철근 콘크리트 건물 3층 이상으로 대피하세요.',
      '쓰나미는 반복하여 밀려오므로 해제 발령 전까지 절대로 해안가로 돌아가지 마세요.'
    ],
    audioGuideKo: '쓰나미 주의보 발령! 해안가에서 벗어나 즉시 높은 건물이나 언덕으로 대피하십시오.',
    bgSeverity: 'EMERGENCY',
    category: 'TSUNAMI'
  },
  'TSUNAMI_MAJOR': {
    jmaCode: 'TSUNAMI_MAJOR',
    titleKo: '【대형 쓰나미 경보】 3m 이상 대형 해일 접근 중!',
    summaryKo: '파괴적인 대형 쓰나미가 밀려오고 있습니다. 일초를 다투어 최고 지대로 대피하세요.',
    actionItemsKo: [
      '모든 소지품을 버리고 오직 신속한 고지대 대피에만 집중하세요.',
      '차량 이동은 도로 정체를 유발하므로 도보로 신속히 대피하세요.'
    ],
    audioGuideKo: '대형 쓰나미 경보! 신속하게 가장 높은 고지대로 대피하십시오!',
    bgSeverity: 'EMERGENCY',
    category: 'TSUNAMI'
  },
  'RAIN_EMERGENCY': {
    jmaCode: 'RAIN_EMERGENCY',
    titleKo: '【대우 특별경보】 기록적 폭우 및 침수·산사태 위험!',
    summaryKo: '수십 년 만의 기록적인 폭우가 내리고 있습니다. 산사태 및 하천 범람에 대비하세요.',
    actionItemsKo: [
      '지하철역, 지하상가, 지하 보도 등 지하 공간에서 즉시 지상으로 이동하세요.',
      '하천이나 용배수로 부근 접근을 절대 금합니다.',
      '야간이나 야외 이동이 위험한 경우 2층 이상의 안전한 방으로 이동하세요.'
    ],
    audioGuideKo: '기록적 폭우 경보! 지하 공간을 피하고 안전한 건물 상층부로 이동하십시오.',
    bgSeverity: 'WARNING',
    category: 'HEAVY_RAIN'
  },
  'VOLCANO_L2': {
    jmaCode: 'VOLCANO_L2',
    titleKo: '【화산 화구 주변 경보】 화산재 분화 및 분출물 주의',
    summaryKo: '화산 화구 근처에 입산 규제 및 화산재 낙하 위험이 있습니다.',
    actionItemsKo: [
      '마스크나 수건으로 호흡기를 보호하세요.',
      '우산이나 모자를 착용하여 화산재 차단 조치를 취하세요.',
      '화산 가스 흡입 방지를 위해 바람을 등지고 대피하세요.'
    ],
    audioGuideKo: '화산 경보 발령. 마스크를 착용하고 화산재를 피하십시오.',
    bgSeverity: 'ADVISORY',
    category: 'VOLCANO'
  }
};

export function matchJmaAlertToRuleTemplate(rawAlert: JmaAlertRaw): KoreanRuleTemplate {
  const matched = JMA_RULE_TEMPLATES[rawAlert.jmaCode];
  if (matched) {
    return matched;
  }

  // Fallback Rule Matching based on severity & category
  return {
    jmaCode: rawAlert.jmaCode,
    titleKo: `【재난 알림】 ${rawAlert.prefectureNameKo} 지역 ${rawAlert.category} 알림`,
    summaryKo: `일본 기상청에서 발령된 ${rawAlert.maxSeismicIntensity || rawAlert.category} 관련 재난 정보입니다.`,
    actionItemsKo: [
      '현지 안내 방송 및 지자체 지침에 따라 신속히 대피하세요.',
      '통신 끊겨도 대피소 가기 버튼을 눌러 가까운 대피소 좌표를 확인하세요.'
    ],
    audioGuideKo: `긴급 재난 정보! ${rawAlert.prefectureNameKo} 지역 안전에 주의하십시오.`,
    bgSeverity: rawAlert.severity,
    category: rawAlert.category
  };
}
