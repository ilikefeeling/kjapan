import React, { useState } from 'react';
import { Languages, Volume2, Copy, Check, X } from 'lucide-react';
import { speakEmergencyKoreanGuide } from '../utils/audioAlert';

interface LanguageTranslateModalProps {
  onClose: () => void;
}

export const LanguageTranslateModal: React.FC<LanguageTranslateModalProps> = ({ onClose }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const phrases = [
    { kr: "지진이 발생했나요?", jp: "地震が発生しましたか？", romaji: "지신가 합세이 시마시타카?", cat: "재난 확인" },
    { kr: "가장 가까운 대피소가 어디인가요?", jp: "一番近い避難所はどこですか？", romaji: "이치반 치카이 히난죠와 도코데스카?", cat: "대피소" },
    { kr: "다쳤습니다. 도움이 필요합니다.", jp: "怪我をしました。助けが必要です。", romaji: "케가오 시마시타. 타스케가 히츠요오데스.", cat: "긴급 구조" },
    { kr: "한국어 통역을 부탁드립니다.", jp: "韓国語の通訳をお願いします。", romaji: "칸코쿠고노 츠야쿠오 오네가이시마스.", cat: "통역" },
    { kr: "물과 음식이 있나요?", jp: "水と食料はありますか？", romaji: "미즈토 쇼쿠료오와 아리마스카?", cat: "구호물품" },
    { kr: "스마트폰을 충전할 수 있나요?", jp: "スマホを充電できますか？", romaji: "스마호오 주우덴 데키마스카?", cat: "편의" }
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-gray-200 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-[#091426]" />
            <h3 className="font-black text-[18px] text-[#091426]">일본어 응급 회화 치트시트</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[12px] font-medium text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
          💡 일본 재난 현장에서 말소리를 스피커로 들려주거나 카운터 직원에게 화면을 보여주세요.
        </p>

        <div className="space-y-2.5">
          {phrases.map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 card-shadow hover:border-gray-400 transition-all space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.cat}</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => speakEmergencyKoreanGuide(item.jp)}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1 text-[11px] font-bold px-2"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>음성</span>
                  </button>
                  <button
                    onClick={() => handleCopy(item.jp, idx)}
                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1 text-[11px] font-bold px-2"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>복사</span>
                  </button>
                </div>
              </div>

              <p className="font-extrabold text-[15px] text-gray-900">{item.kr}</p>
              <p className="font-bold text-[16px] text-red-600 bg-red-50 p-1.5 rounded border border-red-100">{item.jp}</p>
              <p className="text-[12px] font-medium text-amber-800">🗣️ 발음: {item.romaji}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#091426] text-white font-bold rounded-xl hover:bg-[#15233a]"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
