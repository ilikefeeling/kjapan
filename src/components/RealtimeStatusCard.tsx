// DisasterGuard JP - Realtime High-Contrast Status Card
import React from 'react';
import { AlertTriangle, ShieldCheck, Volume2, Radio, RefreshCw, Zap } from 'lucide-react';
import { JmaAlertRaw, KoreanRuleTemplate, UserLocation } from '../types/disaster';
import { playEmergencySirenChime, speakTextKo } from '../utils/audioAlert';

interface RealtimeStatusCardProps {
  currentAlert: JmaAlertRaw;
  translatedRule: KoreanRuleTemplate;
  userLocation: UserLocation;
  onSimulateScenario: (scenario: string) => void;
  isLoading: boolean;
}

export const RealtimeStatusCard: React.FC<RealtimeStatusCardProps> = ({
  currentAlert,
  translatedRule,
  userLocation,
  onSimulateScenario,
  isLoading
}) => {
  const isNormal = translatedRule.bgSeverity === 'NORMAL';
  const isEmergency = translatedRule.bgSeverity === 'EMERGENCY';

  const handlePlayVoice = () => {
    playEmergencySirenChime();
    setTimeout(() => {
      speakTextKo(translatedRule.audioGuideKo);
    }, 1200);
  };

  return (
    <div className="space-y-3">
      {/* High-Contrast Status Card */}
      <div
        className={`relative bg-white rounded-xl p-4 border shadow-sm overflow-hidden transition-all duration-300 ${
          isEmergency
            ? 'border-red-600 bg-red-50/50 ring-2 ring-red-500/30'
            : isNormal
            ? 'border-emerald-200 bg-white'
            : 'border-amber-400 bg-amber-50/50'
        }`}
      >
        {/* Left Status Accent Stripe */}
        <div
          className={`absolute top-0 left-0 w-2.5 h-full ${
            isEmergency
              ? 'bg-[#DC2626]'
              : isNormal
              ? 'bg-[#16A34A]'
              : 'bg-[#F59E0B]'
          }`}
        />

        <div className="pl-2 space-y-3">
          {/* Card Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Radio className={`w-4 h-4 ${isEmergency ? 'text-red-600 animate-pulse' : 'text-emerald-600'}`} />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500 font-['Plus_Jakarta_Sans']">
                JMA Realtime Monitoring
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {new Date(currentAlert.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Main Status Headline */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isEmergency
                      ? 'bg-red-600 text-white animate-bounce'
                      : isNormal
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isEmergency ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : isNormal ? (
                    <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  )}
                </div>
              </div>
              <div>
                <h2
                  className={`font-extrabold text-lg leading-tight font-['Atkinson_Hyperlegible_Next'] ${
                    isEmergency
                      ? 'text-[#DC2626]'
                      : isNormal
                      ? 'text-[#16A34A]'
                      : 'text-amber-800'
                  }`}
                >
                  {translatedRule.titleKo}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  감지 위치: <span className="font-semibold">{currentAlert.prefectureNameKo}</span>
                  {currentAlert.maxSeismicIntensity && ` (${currentAlert.maxSeismicIntensity})`}
                </p>
              </div>
            </div>

            {/* Audio Alert Trigger */}
            <button
              onClick={handlePlayVoice}
              className={`p-2.5 rounded-lg flex items-center justify-center shrink-0 transition-all active:scale-95 shadow-sm ${
                isEmergency
                  ? 'bg-red-600 hover:bg-red-700 text-white font-bold animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
              title="음성 경보 재생"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Summary */}
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {translatedRule.summaryKo}
          </p>

          {/* Action Items preview if emergency */}
          {!isNormal && translatedRule.actionItemsKo && (
            <div className="bg-red-100/60 border border-red-200 p-3 rounded-lg space-y-1.5">
              <p className="text-xs font-bold text-red-900 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-red-600" />
                긴급 수칙 (즉시 행동)
              </p>
              <ul className="text-xs text-red-950 space-y-1 list-disc list-inside font-medium">
                {translatedRule.actionItemsKo.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* JMA Live Simulator Tester Control Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1">
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
            JMA 재난 테스트 시뮬레이터 (Developer & Tester)
          </span>
          <span className="text-[10px] text-slate-400">Token Cost Zero</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
          <button
            onClick={() => onSimulateScenario('NORMAL')}
            className={`px-2.5 py-1.5 rounded font-semibold transition-all border ${
              isNormal
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            🟢 정상 (Normal)
          </button>
          <button
            onClick={() => onSimulateScenario('EARTHQUAKE_TOKYO_5U')}
            className={`px-2.5 py-1.5 rounded font-semibold transition-all border ${
              currentAlert.jmaCode === 'EQ_5U'
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            🔴 도쿄 진도 5강
          </button>
          <button
            onClick={() => onSimulateScenario('TSUNAMI_OSAKA_WARN')}
            className={`px-2.5 py-1.5 rounded font-semibold transition-all border ${
              currentAlert.jmaCode === 'TSUNAMI_WARN'
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            🌊 오사카 쓰나미
          </button>
          <button
            onClick={() => onSimulateScenario('HEAVY_RAIN_KYOTO')}
            className={`px-2.5 py-1.5 rounded font-semibold transition-all border ${
              currentAlert.jmaCode === 'RAIN_EMERGENCY'
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            🌧️ 교토 폭우특보
          </button>
        </div>
      </div>
    </div>
  );
};
