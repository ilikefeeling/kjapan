// DisasterGuard JP - Korean Disaster Action Guides Component
import React, { useState } from 'react';
import { Zap, Waves, CloudRain, Flame, ThermometerSun, CheckSquare, Square, ChevronRight } from 'lucide-react';

interface GuideCategory {
  id: string;
  nameKo: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  steps: string[];
  japanesePhrases: { ko: string; ja: string; pron: string }[];
}

const DISASTER_GUIDES: GuideCategory[] = [
  {
    id: 'earthquake',
    nameKo: '지진 (Earthquake)',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-red-600 text-white',
    description: '갑작스러운 진동 발생 시 초기 2분 내 핵심 대피 요령',
    steps: [
      '1. 튼튼한 탁자나 책상 밑으로 들어가 다리를 단단히 잡고 머리를 보호하세요.',
      '2. 진동 중 엘리베이터 절대 이용 금지! 갇힘 사고 위험이 높습니다.',
      '3. 진동이 멈춘 후 전열기구 및 가스 밸브를 차단하고 문을 열어 출구를 확보하세요.',
      '4. 야외 이동 시 블록담, 자판기, 유리창 탈락물에 주의하며 공원이나 광장으로 대피하세요.',
      '5. 해안가에 거주/이동 중이라면 지진 후 즉시 높은 곳으로 이동하여 쓰나미에 대비하세요.'
    ],
    japanesePhrases: [
      { ko: '지진인가요?', ja: '地震ですか？', pron: '지신데스카?' },
      { ko: '머리를 보호하세요', ja: '頭を守ってください', pron: '아타마오 마모앗테 쿠다사이' }
    ]
  },
  {
    id: 'tsunami',
    nameKo: '쓰나미 (Tsunami)',
    icon: <Waves className="w-5 h-5" />,
    color: 'bg-cyan-700 text-white',
    description: '해안가 및 하구 인근 쓰나미 특보 시 생존 가이드',
    steps: [
      '1. 강한 지진을 느끼거나 쓰나미 사이렌이 울리면 즉시 모든 소지품을 버리고 고지대로 이동하세요.',
      '2. 해발 20m 이상 언덕이나 철근 콘크리트 3층 이상 긴급 쓰나미 대피 빌딩으로 대피하세요.',
      '3. 쓰나미는 1파로 끝나지 않으며 2파, 3파가 더 클 수 있으므로 해제 발령 전까지 내려오지 마세요.',
      '4. 도로 정체 가능성이 높으므로 차를 버리고 도보로 신속히 대피하세요.'
    ],
    japanesePhrases: [
      { ko: '쓰나미 경보입니다!', ja: '津波警報です！', pron: '츠나미 케이호데스!' },
      { ko: '높은 곳으로 이동하세요', ja: '高い場所へ避難してください', pron: '타카이 바쇼에 히난시테 쿠다사이' }
    ]
  },
  {
    id: 'heavy_rain',
    nameKo: '폭우 / 침수 (Heavy Rain)',
    icon: <CloudRain className="w-5 h-5" />,
    color: 'bg-blue-700 text-white',
    description: '태풍 및 선상강수대 집중호우 시 침수 대비 가이드',
    steps: [
      '1. 지하철역, 지하상가, 지하 보차도 등 지하 공간 침수 시 즉시 지상으로 탈출하세요.',
      '2. 하천 주변, 용배수로, 바닥 맨홀 주변 접근을 절대 피하세요.',
      '3. 이미 외부에 물이 차올라 야외 이동이 불가한 경우 건물 2층 이상의 높이로 수직 대피하세요.',
      '4. 감전 위험이 있으므로 침수된 구역의 신호등이나 전신주 근처를 피하세요.'
    ],
    japanesePhrases: [
      { ko: '하천 범람 위험', ja: '河川氾濫の危険', pron: '카센 한란노 키켄' },
      { ko: '상층부로 이동하세요', ja: '上の階へ避難してください', pron: '우에노 카이에 히난시테 쿠다사이' }
    ]
  },
  {
    id: 'volcano',
    nameKo: '화산 / 화산재 (Volcano)',
    icon: <Flame className="w-5 h-5" />,
    color: 'bg-[#091426] text-white',
    description: '후지산, 아소산, 사쿠라지마 등 화산 분화 시 대처 수칙',
    steps: [
      '1. 분화 소식을 들으면 마스크나 물에 적신 수건으로 코와 입을 가려 호흡기를 보호하세요.',
      '2. 화산재는 눈에 극심한 자극을 주므로 렌즈 대신 안경을 착용하세요.',
      '3. 화산 가스 흡입 방지를 위해 바람이 불어오는 상류 방향으로 이동하세요.',
      '4. 시야 확보가 어려우므로 운전을 자제하고 건물 실내로 대피하세요.'
    ],
    japanesePhrases: [
      { ko: '화산재 주의', ja: '降灰に注意してください', pron: '코하이키니 주이시테 쿠다사이' }
    ]
  }
];

export const DisasterGuideView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('earthquake');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const currentGuide = DISASTER_GUIDES.find((g) => g.id === activeCategory) || DISASTER_GUIDES[0];

  const toggleCheck = (stepIdx: number) => {
    const key = `${activeCategory}_${stepIdx}`;
    setCheckedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {DISASTER_GUIDES.map((guide) => (
          <button
            key={guide.id}
            onClick={() => setActiveCategory(guide.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeCategory === guide.id
                ? 'bg-[#091426] text-white border-slate-800 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`p-1 rounded-md ${guide.color}`}>{guide.icon}</div>
            <span>{guide.nameKo}</span>
          </button>
        ))}
      </div>

      {/* Guide Content Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className={`p-2.5 rounded-xl ${currentGuide.color}`}>{currentGuide.icon}</div>
          <div>
            <h3 className="font-extrabold text-base font-['Atkinson_Hyperlegible_Next'] text-slate-900">
              {currentGuide.nameKo} 대피 가이드
            </h3>
            <p className="text-xs text-slate-500">{currentGuide.description}</p>
          </div>
        </div>

        {/* Step-by-Step Checklist */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-['Plus_Jakarta_Sans']">
            단계별 실행 수칙 (체크리스트)
          </h4>

          <div className="space-y-2">
            {currentGuide.steps.map((step, idx) => {
              const isChecked = !!checkedSteps[`${activeCategory}_${idx}`];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/80 border-emerald-300 text-slate-800'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <button className="mt-0.5 text-emerald-600 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  <p
                    className={`text-xs leading-relaxed font-medium ${
                      isChecked ? 'line-through text-slate-500' : 'text-slate-800'
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Essential Japanese Phrase Box for this Disaster */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-xs text-amber-400 flex items-center gap-1">
            🗣️ 현지 긴급 일어 회화 표현
          </h4>

          <div className="grid grid-cols-1 gap-2 text-xs">
            {currentGuide.japanesePhrases.map((p, i) => (
              <div key={i} className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <p className="font-bold text-slate-200">{p.ko}</p>
                <p className="font-mono text-amber-300 text-sm mt-0.5">{p.ja}</p>
                <p className="text-[11px] text-slate-400">발음: {p.pron}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
