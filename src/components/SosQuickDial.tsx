import React, { useState } from 'react';
import { Phone, PhoneCall, ShieldAlert, Building2, HelpCircle, Copy, Check, Volume2 } from 'lucide-react';
import { speakEmergencyKoreanGuide } from '../utils/audioAlert';

interface SosQuickDialProps {
  userLocationKr: string;
  userLocationJp: string;
}

export const SosQuickDial: React.FC<SosQuickDialProps> = ({
  userLocationKr,
  userLocationJp
}) => {
  const [showJapanesePhrases, setShowJapanesePhrases] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const emergencyPhrases = [
    {
      titleKr: "119 구급차 / 화재 요청",
      jpText: `助けてください。韓国人旅行者です。現在、${userLocationJp}にいます。救急車をお願いします。`,
      romaji: "도스케테 쿠다사이. 칸코쿠진 리요코샤데스. 겐자이, 토쿄토 시부야쿠니 이마스. 큐큐샤오 오네가이시마스.",
      meaning: "도와주세요. 한국인 여행객입니다. 현재 위치에 구급차를 보내주세요."
    },
    {
      titleKr: "부상자 / 지진 대피 도움 요청",
      jpText: "けが人がいます。日本語が話せません。韓国語ができる方はいらっしゃいますか？",
      romaji: "케가닌가 이마스. 니혼고가 하나세마센. 칸코쿠고가 데키루 카타와 이라시야이마스카?",
      meaning: "부상자가 있습니다. 일본어를 못합니다. 한국어 가능한 분 계신가요?"
    },
    {
      titleKr: "경찰 110 긴급 신고",
      jpText: `緊急事態です。110番に通報してください。現在地は${userLocationJp}です。`,
      romaji: "킨큐지타이데스. 히야쿠토오반니 츠호시테 쿠다사이. 겐자이치와 토쿄토 시부야쿠데스.",
      meaning: "긴급 상황입니다. 110번에 신고해 주세요. 현재 위치는 여기입니다."
    }
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="space-y-3 pt-2">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-[15px] text-[#45474c] flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-red-600" />
          <span>긴급 SOS 연락처</span>
        </h3>
        <button
          onClick={() => setShowJapanesePhrases(!showJapanesePhrases)}
          className="text-[12px] font-bold text-red-600 hover:text-red-700 underline flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>119/110 현지 통화 일본어 멘트</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Contact 1: Foreign Ministry Consular Call Center */}
        <a
          href="tel:+82232100404"
          className="bg-white rounded-xl p-3 flex flex-col items-center justify-center border border-[#c5c6cd]/50 card-shadow hover:border-red-400 hover:bg-red-50/30 transition-all active:scale-95 text-center gap-1.5"
          title="외교부 영사콜센터 전화하기"
        >
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
            <Phone className="w-4 h-4 text-[#e02928] fill-[#e02928]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-[#1b1b1d]">영사콜센터</span>
            <span className="text-[11px] font-medium text-gray-500">한국어 24시간</span>
          </div>
        </a>

        {/* Contact 2: Japan 119 Emergency */}
        <a
          href="tel:119"
          className="bg-white rounded-xl p-3 flex flex-col items-center justify-center border border-[#c5c6cd]/50 card-shadow hover:border-red-500 hover:bg-red-50/30 transition-all active:scale-95 text-center gap-1.5"
          title="현지 119 전화하기"
        >
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-[#bb0112]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-[#1b1b1d]">일본 119</span>
            <span className="text-[11px] font-medium text-gray-500">화재·구급</span>
          </div>
        </a>

        {/* Contact 3: Korean Embassy in Japan */}
        <a
          href="tel:+81334527611"
          className="bg-white rounded-xl p-3 flex flex-col items-center justify-center border border-[#c5c6cd]/50 card-shadow hover:border-slate-400 hover:bg-slate-50/50 transition-all active:scale-95 text-center gap-1.5"
          title="주일 한국대사관 전화하기"
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#091426]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-[#1b1b1d]">한국대사관</span>
            <span className="text-[11px] font-medium text-gray-500">긴급 당직</span>
          </div>
        </a>

        {/* Contact 4: Japan Police 110 */}
        <a
          href="tel:110"
          className="bg-white rounded-xl p-3 flex flex-col items-center justify-center border border-[#c5c6cd]/50 card-shadow hover:border-slate-400 hover:bg-slate-50/50 transition-all active:scale-95 text-center gap-1.5"
          title="현지 110 전화하기"
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Phone className="w-4 h-4 text-[#1e293b] fill-[#1e293b]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-[#1b1b1d]">일본 110</span>
            <span className="text-[11px] font-medium text-gray-500">경찰 신고</span>
          </div>
        </a>
      </div>

      {/* Japanese Phrases Overlay Modal */}
      {showJapanesePhrases && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-[18px] text-[#091426]">119 / 110 현지 통화 응급 대사</h3>
                <p className="text-[12px] text-gray-500">일본인 대원에게 음성을 들려주거나 아래 문장을 읽어주세요.</p>
              </div>
              <button
                onClick={() => setShowJapanesePhrases(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {emergencyPhrases.map((phrase, idx) => (
                <div key={idx} className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-red-600">{phrase.titleKr}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => speakEmergencyKoreanGuide(phrase.jpText)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-[11px] font-bold text-gray-700 flex items-center gap-1"
                        title="일본어 발음 듣기"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>듣기</span>
                      </button>
                      <button
                        onClick={() => handleCopy(phrase.jpText, idx)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-[11px] font-bold text-gray-700 flex items-center gap-1"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>복사</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[16px] font-black text-gray-900 bg-white p-2 rounded border border-gray-300">
                    {phrase.jpText}
                  </p>
                  <p className="text-[12px] font-medium text-amber-800 bg-amber-50 p-1.5 rounded">
                    🗣️ 발음: {phrase.romaji}
                  </p>
                  <p className="text-[12px] text-gray-600">
                    💡 뜻: {phrase.meaning}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowJapanesePhrases(false)}
              className="w-full bg-[#091426] text-white font-bold py-3 rounded-xl hover:bg-[#15233a]"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
