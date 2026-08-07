import React from 'react';
import { TranslatedAlert } from '../types/jma';
import { Volume2, VolumeX, ShieldCheck, AlertTriangle, Radio, Navigation } from 'lucide-react';

interface HeroSafetyCardProps {
  currentAlert: TranslatedAlert | null;
  onFindShelter: () => void;
  onStopAudio: () => void;
  isAudioPlaying: boolean;
}

export const HeroSafetyCard: React.FC<HeroSafetyCardProps> = ({
  currentAlert,
  onFindShelter,
  onStopAudio,
  isAudioPlaying
}) => {
  const isEmergency = currentAlert && currentAlert.alertLevel !== 'SAFETY';

  if (!isEmergency) {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {/* Safe Status Card */}
        <div className="bg-white rounded-xl p-3 flex flex-col justify-center border border-[#c5c6cd]/50 card-shadow gap-1.5 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10B981]"></div>
          <div className="flex items-center gap-2 pl-1.5">
            <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            </div>
            <span className="font-bold text-[15px] text-[#10B981]">안전</span>
          </div>
          <p className="text-[11px] font-medium text-gray-500 pl-1.5 leading-tight tracking-tight">
            감지된 재난 없음
          </p>
        </div>

        {/* Monitoring Card */}
        <div className="bg-white rounded-xl p-3 flex flex-col justify-center border border-[#c5c6cd]/50 card-shadow gap-1.5 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 pl-1.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded w-fit mb-0.5 leading-none">
                  일본 기상청(JMA) 연동
                </span>
                <span className="font-bold text-[14px] text-blue-800 tracking-tight leading-tight">
                  실시간 모니터링 중
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] font-medium text-emerald-600 pl-1.5 leading-tight tracking-tight">
            응답 정상 0.01s
          </p>
        </div>
      </div>
    );
  }

  // Emergency Alert View
  const isDanger = currentAlert.alertLevel === 'DANGER';
  const themeColor = isDanger ? 'bg-red-600' : 'bg-amber-500';
  const textColor = isDanger ? 'text-red-600' : 'text-amber-600';
  const borderColor = isDanger ? 'border-red-500' : 'border-amber-500';

  return (
    <section className={`relative bg-red-50/90 rounded-xl p-4 border-2 ${borderColor} card-shadow-lg overflow-hidden animate-pulse-subtle`}>
      {/* Left Red/Amber Accent Bar */}
      <div className={`absolute top-0 left-0 w-2.5 h-full ${themeColor}`}></div>

      <div className="flex justify-between items-start mb-2 pl-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-5 h-5 ${textColor} animate-bounce`} />
          <span className={`font-black text-[13px] px-2 py-0.5 rounded text-white ${themeColor}`}>
            {currentAlert.intensityKr}
          </span>
          <span className="font-bold text-[14px] text-gray-800">{currentAlert.locationKr}</span>
        </div>
        <div className="flex items-center gap-2">
          {isAudioPlaying && (
            <button
              onClick={onStopAudio}
              className="flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded-full animate-bounce shadow-sm"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>사이렌 끄기</span>
            </button>
          )}
          <span className="text-[11px] font-semibold text-gray-500">{currentAlert.timestamp}</span>
        </div>
      </div>

      <div className="pl-2 mb-3">
        <h3 className={`font-extrabold text-[22px] ${textColor} leading-tight mb-1`}>
          {currentAlert.pushTitle}
        </h3>
        <p className="text-[15px] font-bold text-gray-900 bg-white/80 p-2.5 rounded-lg border border-red-200">
          🚨 {currentAlert.pushBody}
        </p>
      </div>

      {/* Immediate Korean Action Steps */}
      <div className="pl-2 bg-white/90 p-3 rounded-lg border border-red-200 mb-3 space-y-1.5">
        <div className="font-bold text-[13px] text-gray-800 flex items-center gap-1.5">
          <Radio className="w-4 h-4 text-red-600" />
          <span>즉시 행동 지침 (한국어)</span>
        </div>
        {currentAlert.actionGuideKr.map((guide, idx) => (
          <p key={idx} className="text-[13px] font-medium text-gray-700 leading-snug">
            {guide}
          </p>
        ))}
      </div>

      {/* Emergency CTA */}
      <div className="pl-2 flex gap-2">
        <button
          onClick={onFindShelter}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-[15px]"
        >
          <Navigation className="w-5 h-5 fill-white" />
          <span>가장 가까운 대피소 즉시 찾기</span>
        </button>
      </div>
    </section>
  );
};
