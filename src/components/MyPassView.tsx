import React, { useState, useEffect } from 'react';
import { UserPass } from '../types/jma';
import { UserCheck, ShieldCheck, QrCode, Bell, Clock, Database, RefreshCw, CheckCircle2, Lock, Download, Plane, MapPin, Sparkles } from 'lucide-react';

interface MyPassViewProps {
  pass: UserPass;
  onUpdatePass: (newPass: UserPass) => void;
  onTriggerTestPush: () => void;
  onLogout?: () => void;
}

export const MyPassView: React.FC<MyPassViewProps> = ({
  pass,
  onUpdatePass,
  onTriggerTestPush,
  onLogout
}) => {
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [statusBadge, setStatusBadge] = useState<{ text: string; bg: string }>({ text: '', bg: '' });
  const [showQr, setShowQr] = useState<boolean>(false);
  const [downloadingMap, setDownloadingMap] = useState<boolean>(false);
  const [mapDownloaded, setMapDownloaded] = useState<boolean>(pass.offlineMapDownloaded ?? true);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  // Status & Countdown effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const arrivalTime = pass.arrivalDate ? new Date(pass.arrivalDate).getTime() : new Date(pass.passStartsAt).getTime();
      const expireTime = new Date(pass.passExpiresAt).getTime();

      // Check if PRE_ACTIVE state (before arrival)
      if (now < arrivalTime) {
        const diffPre = arrivalTime - now;
        const days = Math.floor(diffPre / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffPre % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diffPre % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffPre % (1000 * 60)) / 1000);

        setTimeLeftStr(`입국까지 D-${days}일 ${hours}시간 ${mins}분 ${secs}초`);
        setStatusBadge({
          text: '⏳ 사전 예약 완료 (입국 대기중)',
          bg: 'bg-amber-100 text-amber-900 border border-amber-300'
        });
        return;
      }

      // ACTIVE or EXPIRED
      const diffActive = expireTime - now;

      if (diffActive <= 0) {
        setTimeLeftStr('10일 패스 만료됨 (EXPIRED)');
        setStatusBadge({
          text: '● 기간 만료 (EXPIRED)',
          bg: 'bg-red-100 text-red-800 border border-red-300'
        });
        if (pass.status !== 'EXPIRED') {
          onUpdatePass({ ...pass, status: 'EXPIRED' });
        }
        return;
      }

      const days = Math.floor(diffActive / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffActive % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diffActive % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffActive % (1000 * 60)) / 1000);

      setTimeLeftStr(`남은 혜택: ${days}일 ${hours}시간 ${mins}분 ${secs}초`);
      setStatusBadge({
        text: '● 정상 개통 활성 (ACTIVE)',
        bg: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [pass]);

  const handleDownloadMap = () => {
    setDownloadingMap(true);
    setTimeout(() => {
      setDownloadingMap(false);
      setMapDownloaded(true);
      onUpdatePass({ ...pass, offlineMapDownloaded: true });
    }, 1500);
  };

  const handleRenew10DayPass = () => {
    alert("안심하세요! 당사 서비스는 자동 결제가 없습니다.\n추가 10일 연장을 원하시면 상단 메뉴의 '$1 패스' 버튼을 눌러 안전하게 재결제를 진행하실 수 있습니다.");
  };

  const formatDateStr = (isoStr?: string) => {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Badge */}
      <div className="bg-[#091426] text-white p-4 rounded-xl flex justify-between items-center shadow-md">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500">
            JWT 인증 권한 활성
          </span>
          <h2 className="font-black text-[20px] mt-1">{pass.userName} 님의 안전 패스</h2>
          <p className="text-[12px] text-gray-300">{pass.userEmail} • {pass.provider.toUpperCase()} 연동</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
          <ShieldCheck className="w-7 h-7" />
        </div>
      </div>

      {/* Pass Status Card */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 card-shadow space-y-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-[12px] font-bold text-gray-500">10일 패스 생애주기 (Pass Lifecycle)</span>
          <span className={`text-[12px] font-extrabold px-2.5 py-0.5 rounded-full ${statusBadge.bg}`}>
            {statusBadge.text}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[13px]">
          <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <span className="text-gray-500 text-[11px] block">패스 상품</span>
            <span className="font-bold text-gray-900">10일 여행 전용 패스 ($1)</span>
          </div>
          <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <span className="text-gray-500 text-[11px] block">여권 인증 상태</span>
            <span className="font-bold text-emerald-700">✓ 외교부 여권 검증 완료</span>
          </div>
        </div>

        {/* Flight & Airport Summary Card */}
        <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 space-y-2 text-[12px]">
          <div className="flex justify-between items-center font-bold text-blue-900 border-b border-blue-200/60 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-blue-600" />
              <span>등록된 입출국 일정 & 공항 정보</span>
            </span>
            <span className="text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
              도착일부터 패스 10일 산정
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11.5px]">
            <div>
              <span className="text-gray-500 block font-medium">🛫 입국 (도착)</span>
              <span className="font-extrabold text-gray-900 block">{formatDateStr(pass.arrivalDate)}</span>
              <span className="font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded inline-block mt-0.5">
                {pass.arrivalAirport || 'NRT (나리타)'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block font-medium">🛬 출국 (귀국)</span>
              <span className="font-extrabold text-gray-900 block">{formatDateStr(pass.departureDate)}</span>
              <span className="font-bold text-gray-700 bg-gray-200/80 px-1.5 py-0.2 rounded inline-block mt-0.5">
                {pass.departureAirport || 'NRT (나리타)'}
              </span>
            </div>
          </div>
        </div>

        {/* Expiration or Countdown Timer */}
        <div className="bg-[#091426]/5 p-3 rounded-xl border border-[#091426]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
            <div>
              <span className="text-[11px] font-bold text-gray-600 block">패스 시간 상태</span>
              <span className="text-[16px] font-black text-blue-900">{timeLeftStr}</span>
            </div>
          </div>

          <button
            onClick={() => setShowQr(!showQr)}
            className="px-3 py-1.5 bg-[#091426] text-white rounded-lg text-[12px] font-bold flex items-center gap-1 hover:bg-[#15233a]"
          >
            <QrCode className="w-4 h-4" />
            <span>{showQr ? 'QR 숨기기' : 'QR 보기'}</span>
          </button>
        </div>

        {/* Emergency Verification QR */}
        {showQr && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-2 animate-fade-in">
            <p className="text-[12px] font-bold text-gray-700">현지 대피소 / 영사관 오프라인 신원 확인 QR</p>
            <div className="w-36 h-36 bg-white mx-auto border-2 border-gray-300 p-2 rounded-lg flex items-center justify-center">
              <svg className="w-full h-full text-gray-900" viewBox="0 0 100 100">
                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="currentColor" />
                <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                <rect x="35" y="10" width="10" height="30" fill="currentColor" />
                <rect x="50" y="70" width="20" height="20" fill="currentColor" />
              </svg>
            </div>
            <p className="text-[11px] font-mono text-gray-500">PASS-UUID: {pass.id}</p>
          </div>
        )}

        {/* Offline Map Pre-download Card */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-extrabold text-amber-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-amber-600" />
              <span>오프라인 대피소 지도 사전 다운로드</span>
            </span>
            {mapDownloaded ? (
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>캐싱 완료</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                다운로드 권장
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-amber-800 leading-tight">
            현지 데이터 로밍 장애 시에도 오프라인 지도로 주변 대피소를 즉시 탐색할 수 있도록 사전 다운로드해 두세요.
          </p>
          <button
            onClick={handleDownloadMap}
            disabled={downloadingMap}
            className={`w-full py-2.5 rounded-xl text-[12.5px] font-bold flex items-center justify-center gap-2 border transition-all ${
              mapDownloaded
                ? 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow'
            }`}
          >
            {downloadingMap ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>오프라인 지도를 다운로드하는 중...</span>
              </>
            ) : mapDownloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>오프라인 지도 패키지 저장 완료 (재다운로드)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Wi-Fi 오프라인 지도 패키지 받기 (52MB)</span>
              </>
            )}
          </button>
        </div>

        {/* Renew / Additional Purchase button */}
        <div className="pt-1">
          <button
            onClick={handleRenew10DayPass}
            className="w-full py-3 bg-[#091426] hover:bg-[#15233a] text-white rounded-xl text-[13px] font-bold shadow flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>10일 안전 패스 추가 구매하기 ($1 USD)</span>
          </button>
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
                  onTriggerTestPush();
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

    </div>
  );
};

