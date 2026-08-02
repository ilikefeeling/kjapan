import React, { useState } from 'react';
import { BookOpen, AlertTriangle, Radio, Train, Waves, Mountain, Shield, Volume2 } from 'lucide-react';
import { speakEmergencyKoreanGuide } from '../utils/audioAlert';

export const DisasterManualView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'earthquake' | 'tsunami' | 'subway' | 'rain' | 'volcano'>('earthquake');

  const manuals = {
    earthquake: {
      title: "지진 발생 시 단계별 행동 요령",
      icon: AlertTriangle,
      color: "text-amber-600",
      steps: [
        {
          num: "01",
          title: "실내(호텔/식당/쇼핑몰)에 있을 때",
          body: "책상 밑이나 방석으로 머리를 보호하고, 흔들림이 완전히 멈출 때까지 대기하세요. 엘리베이터는 절대 사용하지 마세요."
        },
        {
          num: "02",
          title: "출구 확보 및 화재 예방",
          body: "문이 비틀어져 갇히지 않도록 미리 문을 조금 열어두고, 가스밸브를 잠그고 전열기구 코드를 뽑아 화재를 예방하세요."
        },
        {
          num: "03",
          title: "야외/거리/관광지에 있을 때",
          body: "유리창, 간판, 가판대 붕괴 위험이 있으므로 가방이나 옷으로 머리를 감싸고 넓은 광장이나 공원으로 대피하세요."
        },
        {
          num: "04",
          title: "피난 시 소지품 최소화",
          body: "여권, 스마트폰, 보조배터리, 필요한 약품만 챙기고 귀중품에 집착하지 말고 신속히 이동하세요."
        }
      ]
    },
    tsunami: {
      title: "쓰나미(해일) 긴급 대피 요령",
      icon: Waves,
      color: "text-indigo-600",
      steps: [
        {
          num: "01",
          title: "해안가/강가 즉시 탈출",
          body: "해안가나 강 인근에서 강한 지진을 느끼거나 쓰나미 경보가 발령되면 물건을 챙기지 말고 즉시 고지대로 달리세요."
        },
        {
          num: "02",
          title: "3층 이상 철근 콘크리트 건물 대피",
          body: "고지대로 갈 시간이 없는 경우 주변의 '쓰나미 피난 빌딩(津波避難ビル)' 마크가 붙은 3층 이상 튼튼한 건물로 올라가세요."
        },
        {
          num: "03",
          title: "해제 경보 발령 전 귀환 금지",
          body: "쓰나미는 2파, 3파가 더 클 수 있습니다. 기상청 경보가 완전히 해제될 때까지 절대로 바닷가로 내려가지 마세요."
        }
      ]
    },
    subway: {
      title: "일본 전철/지하철/신칸센 안 행동 요령",
      icon: Train,
      color: "text-blue-600",
      steps: [
        {
          num: "01",
          title: "긴급정지 시 낮은 자세 유지",
          body: "지진 감지 시 열차가 급정거합니다. 손잡이나 봉을 단단히 잡고 가방으로 머리를 보호하세요."
        },
        {
          num: "02",
          title: "선로 무단 탈출 금지",
          body: "반대편 선로에 열차가 다니거나 감전 위험이 있습니다. 승무원의 안내 방송이 나올 때까지 차내에서 대기하세요."
        },
        {
          num: "03",
          title: "지하철역 가이드라인 준수",
          body: "지하철역은 내진 설계가 우수합니다. 당황하여 비상구로 몰리지 말고 일렬로 질서있게 지상으로 이동하세요."
        }
      ]
    },
    rain: {
      title: "집중호우 및 지하상가 침수 대비",
      icon: Radio,
      color: "text-cyan-600",
      steps: [
        {
          num: "01",
          title: "지하 상가/지하철 유출구 주의",
          body: "빗물이 지하로 유입되면 계단 수압으로 문을 열 수 없게 됩니다. 물이 차오르기 전 지상으로 신속히 이동하세요."
        },
        {
          num: "02",
          title: "맨홀 및 하천 주변 보행 금지",
          body: "침수된 도로에서는 수압으로 맨홀 뚜껑이 열려있을 수 있으므로 우산이나 막대기로 바닥을 확인하며 이동하세요."
        }
      ]
    },
    volcano: {
      title: "화산 폭발 및 태풍 대비 요령",
      icon: Mountain,
      color: "text-[#bb0112]",
      steps: [
        {
          num: "01",
          title: "화산재 및 쇄설류 대비",
          body: "마스크나 젖은 수건으로 입과 코를 가리고, 보안경을 착용하여 화산재 흡입을 막으세요."
        },
        {
          num: "02",
          title: "태풍 강풍 시 실내 대기",
          body: "일본 태풍은 바람이 매우 강합니다. 창문에서 떨어지고 호텔 실내에서 기상 정보에 귀를 기울이세요."
        }
      ]
    }
  };

  const currentManual = manuals[activeTab];

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-[#091426] text-white p-4 rounded-xl space-y-1 shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="font-black text-[18px]">일본 여행객 재난 행동 요령</h2>
        </div>
        <p className="text-[12px] text-gray-300">
          일본 기상청(JMA) 방재 지침에 따른 상황별 4단계 행동 수칙
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('earthquake')}
          className={`px-3 py-2 rounded-xl text-[12px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'earthquake' ? 'bg-amber-600 text-white shadow' : 'bg-white border text-gray-700'
          }`}
        >
          <span>🌋 지진</span>
        </button>
        <button
          onClick={() => setActiveTab('tsunami')}
          className={`px-3 py-2 rounded-xl text-[12px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'tsunami' ? 'bg-indigo-600 text-white shadow' : 'bg-white border text-gray-700'
          }`}
        >
          <span>🌊 쓰나미</span>
        </button>
        <button
          onClick={() => setActiveTab('subway')}
          className={`px-3 py-2 rounded-xl text-[12px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'subway' ? 'bg-blue-600 text-white shadow' : 'bg-white border text-gray-700'
          }`}
        >
          <span>🚆 지하철/열차</span>
        </button>
        <button
          onClick={() => setActiveTab('rain')}
          className={`px-3 py-2 rounded-xl text-[12px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rain' ? 'bg-cyan-600 text-white shadow' : 'bg-white border text-gray-700'
          }`}
        >
          <span>🌧️ 집중호우</span>
        </button>
        <button
          onClick={() => setActiveTab('volcano')}
          className={`px-3 py-2 rounded-xl text-[12px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'volcano' ? 'bg-[#bb0112] text-white shadow' : 'bg-white border text-gray-700'
          }`}
        >
          <span>🌀 화산/태풍</span>
        </button>
      </div>

      {/* Manual Content */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 card-shadow space-y-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className={`font-black text-[17px] ${currentManual.color} flex items-center gap-2`}>
            <span>{currentManual.title}</span>
          </h3>
          <button
            onClick={() => speakEmergencyKoreanGuide(currentManual.steps.map(s => s.title + ". " + s.body).join(" "))}
            className="text-[11px] font-bold text-gray-600 hover:text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg flex items-center gap-1"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>음성 낭독</span>
          </button>
        </div>

        <div className="space-y-3">
          {currentManual.steps.map((step, idx) => (
            <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="font-black text-[14px] text-white bg-[#091426] px-2 py-0.5 rounded shrink-0">
                {step.num}
              </span>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-[15px] text-gray-900">{step.title}</h4>
                <p className="text-[13px] font-medium text-gray-600 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
