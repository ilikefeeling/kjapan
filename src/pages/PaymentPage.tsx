import React, { useState, useMemo } from 'react';
import { PayPalButton } from '../components/PayPalButton';
import { ShieldCheck, Sparkles, Check, Clock, Calendar, ArrowLeft, Plane, MapPin, CheckCircle2, AlertTriangle, Bell } from 'lucide-react';

interface PaymentPageProps {
  user: any;
  onPaymentComplete: (updatedUser: any) => void;
  onBack?: () => void;
  onTriggerTestPush?: () => void;
  onGoLogin?: () => void;
}

const JAPAN_AIRPORTS = [
  { code: 'NRT', name: '도쿄 나리타 공항 (NRT)' },
  { code: 'HND', name: '도쿄 하네다 공항 (HND)' },
  { code: 'KIX', name: '오사카 간사이 공항 (KIX)' },
  { code: 'FUK', name: '후쿠오카 공항 (FUK)' },
  { code: 'CTS', name: '삿포로 신치토세 공항 (CTS)' },
  { code: 'NGO', name: '나고야 중부국제공항 (NGO)' },
  { code: 'OKA', name: '오키나와 나하 공항 (OKA)' },
  { code: 'OTHER', name: '기타 일본 공항' },
];

export const PaymentPage: React.FC<PaymentPageProps> = ({ user, onPaymentComplete, onBack, onTriggerTestPush, onGoLogin }) => {
  const [successData, setSuccessData] = useState<any>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  // Default dates: arrival 3 days later 10:00, departure 7 days later 18:00
  const defaultArrival = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  }, []);

  const defaultDeparture = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  }, []);

  const [arrivalDate, setArrivalDate] = useState<string>(defaultArrival);
  const [departureDate, setDepartureDate] = useState<string>(defaultDeparture);
  const [arrivalAirport, setArrivalAirport] = useState<string>('NRT');
  const [departureAirport, setDepartureAirport] = useState<string>('NRT');

  // Service calculated dates
  const serviceStartDate = useMemo(() => {
    return new Date(arrivalDate);
  }, [arrivalDate]);

  const serviceEndDate = useMemo(() => {
    const start = new Date(arrivalDate);
    return new Date(start.getTime() + 10 * 24 * 60 * 60 * 1000);
  }, [arrivalDate]);

  // Trip duration & coverage check
  const tripDurationDays = useMemo(() => {
    const arr = new Date(arrivalDate).getTime();
    const dep = new Date(departureDate).getTime();
    const diffHours = (dep - arr) / (1000 * 60 * 60);
    return Math.max(1, Math.ceil(diffHours / 24));
  }, [arrivalDate, departureDate]);

  const isFullyCovered = useMemo(() => {
    const dep = new Date(departureDate).getTime();
    return dep <= serviceEndDate.getTime();
  }, [departureDate, serviceEndDate]);

  const formatDateStr = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  };

  const handlePaymentSuccess = (data: any) => {
    setSuccessData(data);
    setIsPaid(true);
    onPaymentComplete({
      ...user,
      isPremium: true,
      passType: '10_DAYS',
      status: 'PRE_ACTIVE',
      arrivalDate: new Date(arrivalDate).toISOString(),
      departureDate: new Date(departureDate).toISOString(),
      arrivalAirport,
      departureAirport,
      passStartsAt: serviceStartDate.toISOString(),
      passExpiresAt: serviceEndDate.toISOString(),
      premiumExpiresAt: serviceEndDate.toISOString(),
      offlineMapDownloaded: true,
    });
  };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200 card-shadow">
        <div className="flex items-center gap-2">
          {onBack && !isPaid && (
            <button onClick={onBack} className="p-1 rounded-lg hover:bg-gray-100 font-bold">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <h2 className="font-black text-[18px] text-[#091426] flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-300" />
            <span>10일 안전 여행 패스</span>
          </h2>
        </div>
        <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
          $1 USD (단일 패스)
        </span>
      </div>

      {!user ? (
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center space-y-4 shadow-sm mt-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-[17px] font-black text-blue-900 mb-1">안전한 결제를 위해 로그인해 주세요</h3>
            <p className="text-[13px] text-blue-700 leading-relaxed">
              고객님의 소중한 라이선스를 계정에 안전하게 보관하기 위해<br />단 1초 만에 카카오로 간편하게 시작해 보세요!
            </p>
          </div>
          {onGoLogin && (
            <button
              onClick={onGoLogin}
              className="mt-2 w-full py-3.5 bg-[#091426] hover:bg-[#15233a] active:scale-95 text-white rounded-xl font-bold text-[14px] shadow-lg transition-all"
            >
              간편 로그인하러 가기
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Plan Hero Card */}
      <div className="bg-gradient-to-br from-[#091426] to-[#1e3a8a] text-white p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />

        <div className="flex justify-between items-start">
          <div>
            <span className="bg-amber-400 text-gray-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              10-Day Single Pass
            </span>
            <h3 className="font-black text-[22px] mt-1 text-white">일본 여행 10일 라이선스</h3>
            <p className="text-[12px] text-gray-300">입국일부터 10일간 유지 • 자동 구독 없음</p>
          </div>
          <div className="text-right">
            <span className="text-[28px] font-black text-amber-400">$1</span>
            <span className="text-[12px] font-semibold text-gray-300 block">USD / 10일전용</span>
          </div>
        </div>

        {/* Dynamic Assurance Banner */}
        <div className="bg-amber-400/20 border border-amber-400/30 p-3 rounded-xl flex items-start gap-2.5 text-[12px]">
          <Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-amber-300 block">사전 결제 안심 카운트 보장!</span>
            <p className="text-gray-200 text-[11.5px] leading-tight">
              오늘 결제하셔도 패스 10일(240시간) 유효기간은 결제일이 아닌 <strong>입력하신 '일본 도착(입국)일'부터 차감</strong>됩니다.
            </p>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2 pt-2 border-t border-white/10 text-[13px] font-medium">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-amber-300">국내 가족/지인 비상 안심 핑 무제한</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>JMA 지진 초저지연 경보 + 한국어 음성 사이렌</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>오프라인 대피소 지도 & 통역 사전 캐싱 다운로드</span>
          </div>
        </div>
      </div>

      {/* Flight & Airport Schedule Input Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 card-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h4 className="font-extrabold text-[15px] text-gray-900 flex items-center gap-2">
            <Plane className="w-4 h-4 text-blue-600" />
            <span>여행 입출국 일정 및 공항 정보 입력</span>
          </h4>
          <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">필수 입력</span>
        </div>

        <div className="space-y-3 text-[13px]">
          {/* Arrival Date & Airport */}
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>일본 입국 (도착) 정보</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">입국 일시</label>
                <input
                  type="datetime-local"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-[12px] font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">입국 공항명</label>
                <select
                  value={arrivalAirport}
                  onChange={(e) => setArrivalAirport(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-[12px] font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {JAPAN_AIRPORTS.map((ap) => (
                    <option key={ap.code} value={ap.code}>
                      {ap.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Departure Date & Airport */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              <Plane className="w-4 h-4 text-gray-600 rotate-45" />
              <span>일본 출국 (귀국) 정보</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">출국 일시</label>
                <input
                  type="datetime-local"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-[12px] font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">출국 공항명</label>
                <select
                  value={departureAirport}
                  onChange={(e) => setDepartureAirport(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-[12px] font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {JAPAN_AIRPORTS.map((ap) => (
                    <option key={ap.code} value={ap.code}>
                      {ap.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Service Coverage & Expiration Preview Card */}
        <div className="bg-[#091426] text-white p-4 rounded-xl space-y-2.5 border border-gray-800 shadow-md">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>실시간 서비스 유효기간 산정 결과</span>
            </span>
            <span className="text-[11px] font-extrabold bg-blue-600 px-2 py-0.5 rounded-full text-white">
              여행 {tripDurationDays}일간 일정
            </span>
          </div>

          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between items-center text-gray-300">
              <span>🛡️ 서비스 시작일 (입국일):</span>
              <span className="font-extrabold text-white font-mono">{formatDateStr(serviceStartDate)}</span>
            </div>
            <div className="flex justify-between items-center text-amber-300">
              <span className="font-bold">🏁 서비스 종료일 (10일 만료):</span>
              <span className="font-black text-amber-400 font-mono text-[13px]">{formatDateStr(serviceEndDate)}</span>
            </div>
          </div>

          {/* Coverage status */}
          <div className="pt-1">
            {isFullyCovered ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-2 rounded-lg flex items-center gap-2 text-[11.5px] text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>고객님의 여행 기간({tripDurationDays}일) 전체가 10일 패스로 100% 완벽히 보호됩니다!</span>
              </div>
            ) : (
              <div className="bg-amber-500/20 border border-amber-500/40 p-2 rounded-lg flex items-center gap-2 text-[11.5px] text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>여행 기간({tripDurationDays}일)이 10일을 초과합니다. 10일 후 앱에서 쉽게 추가 연장하실 수 있습니다.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FCM Simulated Push Trigger */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 card-shadow">
        <p className="text-[14px] font-black text-red-600 text-center mb-3 bg-red-50 py-3 rounded-xl border border-red-200 animate-pulse flex items-center justify-center gap-1.5 shadow-sm">
          ⚠️ <span>주의: 누르는 즉시 매우 큰 재난 사이렌이 울립니다!</span>
        </p>
        <button
          onClick={() => setShowWarningModal(true)}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow cursor-pointer active:scale-95 transition-all"
        >
          <Bell className="w-4 h-4" />
          <span>긴급 재난 방송 한국어 수신 테스트</span>
        </button>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in border border-gray-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-inner">
                <Bell className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-gray-900 mb-2">실제 재난 사이렌 주의</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  매우 큰 재난 사이렌 소리와 한국어 음성 안내가 기기 스피커로 <strong>즉시 재생</strong>됩니다.<br/><br/>
                  공공장소나 조용한 곳에서는 주변에 피해가 갈 수 있으니 사용을 주의해 주세요!
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowWarningModal(false);
                  if (onTriggerTestPush) {
                    onTriggerTestPush();
                  } else {
                    alert("결제 전이라 시뮬레이션 권한이 제한될 수 있습니다.");
                  }
                }}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[14px] transition-all shadow-md active:scale-[0.98]"
              >
                네, 테스트를 시작하겠습니다
              </button>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-[14px] transition-all active:scale-[0.98]"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Action Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 card-shadow space-y-4">
        <h4 className="font-extrabold text-[15px] text-gray-900 flex items-center gap-1.5">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>$1 USD 안전 결제 진행 (PayPal)</span>
        </h4>

        <PayPalButton
          userId={user?.uid || 'kakao_77492100'}
          passStartsAt={serviceStartDate.toISOString()}
          passExpiresAt={serviceEndDate.toISOString()}
          onSuccess={handlePaymentSuccess}
          onGoHome={onBack}
        />

        {onBack && !isPaid && (
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 active:scale-[0.99] text-gray-500 rounded-xl font-bold text-[13px] shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            홈 화면으로 돌아가기
          </button>
        )}
      </div>
      </>
      )}
    </div>
  );
};

