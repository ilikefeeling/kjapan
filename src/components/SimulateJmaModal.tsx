import React from 'react';
import { JmaAlertPayload, TranslatedAlert } from '../types/jma';
import { translateJmaAlert } from '../data/jmaDictionary';
import { AlertTriangle, ShieldCheck, Waves, CloudRain, Volume2, X } from 'lucide-react';

interface SimulateJmaModalProps {
  onSelectAlert: (alert: TranslatedAlert | null) => void;
  onClose: () => void;
  currentAlert: TranslatedAlert | null;
}

export const SimulateJmaModal: React.FC<SimulateJmaModalProps> = ({
  onSelectAlert,
  onClose,
  currentAlert
}) => {
  const handleSimulate = (type: 'SAFETY' | 'EQ_TOKYO' | 'TSUNAMI_OSAKA' | 'RAIN_FUKUOKA') => {
    if (type === 'SAFETY') {
      onSelectAlert(null);
      onClose();
      return;
    }

    let payload: JmaAlertPayload;

    if (type === 'EQ_TOKYO') {
      payload = {
        alertId: `EEW-${Date.now()}`,
        disasterType: 'EARTHQUAKE',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        prefectureCode: "13", // Tokyo
        intensityCode: "5+", // 5강
        magnitude: 6.8,
        depthKm: 20,
        tsunamiWarning: false
      };
    } else if (type === 'TSUNAMI_OSAKA') {
      payload = {
        alertId: `TSUNAMI-${Date.now()}`,
        disasterType: 'TSUNAMI',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        prefectureCode: "27", // Osaka
        intensityCode: "6-",
        tsunamiWarning: true
      };
    } else {
      payload = {
        alertId: `RAIN-${Date.now()}`,
        disasterType: 'HEAVY_RAIN',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        prefectureCode: "40", // Fukuoka
        intensityCode: "4"
      };
    }

    const translated = translateJmaAlert(payload);
    onSelectAlert(translated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-black text-[18px] text-[#091426]">JMA 실시간 재난 시뮬레이터</h3>
            <p className="text-[12px] text-gray-500">Token Cost Zero 사전 엔진을 통해 10ms 이내 경보 파싱 시뮬레이션</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Option 1: Safety */}
          <button
            onClick={() => handleSimulate('SAFETY')}
            className="w-full p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <span className="font-extrabold text-[15px] text-emerald-900 block">정상 상태 (SAFETY)</span>
                <span className="text-[12px] text-emerald-700">"안전 - 현재 감지된 재난 정보가 없습니다"</span>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-emerald-600 text-white px-2 py-1 rounded">Green Card</span>
          </button>

          {/* Option 2: Tokyo Earthquake 5+ */}
          <button
            onClick={() => handleSimulate('EQ_TOKYO')}
            className="w-full p-3.5 rounded-xl border-2 border-red-500 bg-red-50 hover:bg-red-100 flex items-center justify-between text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 animate-bounce" />
              <div>
                <span className="font-extrabold text-[15px] text-red-900 block">[도쿄도] 진도 5강 지진 발생</span>
                <span className="text-[12px] text-red-700">EEW 긴급 지진 속보 + 한국어 사이렌 경보</span>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-red-600 text-white px-2 py-1 rounded">Red EEW</span>
          </button>

          {/* Option 3: Osaka Tsunami */}
          <button
            onClick={() => handleSimulate('TSUNAMI_OSAKA')}
            className="w-full p-3.5 rounded-xl border-2 border-indigo-500 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-between text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Waves className="w-6 h-6 text-indigo-600" />
              <div>
                <span className="font-extrabold text-[15px] text-indigo-900 block">[오사카부] 쓰나미 경보</span>
                <span className="text-[12px] text-indigo-700">해안가 고지대 및 3층 피난 빌딩 즉시 대피</span>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-indigo-600 text-white px-2 py-1 rounded">Tsunami</span>
          </button>

          {/* Option 4: Heavy Rain */}
          <button
            onClick={() => handleSimulate('RAIN_FUKUOKA')}
            className="w-full p-3.5 rounded-xl border-2 border-amber-500 bg-amber-50 hover:bg-amber-100 flex items-center justify-between text-left transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <CloudRain className="w-6 h-6 text-amber-600" />
              <div>
                <span className="font-extrabold text-[15px] text-amber-900 block">[후쿠오카현] 호우 경보</span>
                <span className="text-[12px] text-amber-700">지하 상가 및 산사태 위험지 출입 통제</span>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-amber-600 text-white px-2 py-1 rounded">Heavy Rain</span>
          </button>
        </div>
      </div>
    </div>
  );
};
