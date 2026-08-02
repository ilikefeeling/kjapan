// DisasterGuard JP - Monetization & Auth Travel Pass Modal
import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle, CreditCard, Sparkles, Lock, Bell, Clock } from 'lucide-react';
import { TravelPass } from '../types/disaster';
import { createSimulatedJwtPass } from '../utils/jwt';

interface TravelPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPass: TravelPass | null;
  onPassUpdated: (newPass: TravelPass) => void;
}

export const TravelPassModal: React.FC<TravelPassModalProps> = ({
  isOpen,
  onClose,
  currentPass,
  onPassUpdated
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulatePayment = (pgProvider: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newPass = createSimulatedJwtPass('7_DAY');
      onPassUpdated({ ...newPass, passType: '10_DAY' as any });
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-4 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Atkinson_Hyperlegible_Next']">
                일본 여행 10일 안전 정액 패스
              </h3>
              <p className="text-xs text-slate-500">초저지연 Web Push 및 오프라인 대피소 오토싱크</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Current Active Pass Info if exists */}
        {currentPass && currentPass.isActive ? (
          <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                현재 활성화된 Pass
              </span>
              <span className="text-xs font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                10일 여행 패스
              </span>
            </div>
            <p className="text-xs text-slate-700">
              만료 예정: <span className="font-bold text-slate-900">{new Date(currentPass.expiresAt).toLocaleString('ko-KR')}</span>
            </p>
            <div className="text-[11px] text-amber-950 font-mono bg-white/80 p-2 rounded border border-amber-200 truncate">
              JWT Token: {currentPass.token.substring(0, 30)}...
            </div>
          </div>
        ) : (
          <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl space-y-1">
            <p className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>입국일 기준 10일 보장 패스</span>
            </p>
            <p className="text-[11.5px] text-slate-600">
              오늘 결제해도 서비스 10일 유효기간은 입력하신 <strong>'일본 입국(도착)일'부터 10일간</strong> 작동합니다.
            </p>
          </div>
        )}

        {/* 10-Day Plan Selector */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-['Plus_Jakarta_Sans']">
            단일 요금제 (Single Pass)
          </h4>

          <div className="p-3.5 rounded-xl border-2 border-[#091426] bg-slate-50 ring-2 ring-[#091426]/20 relative space-y-1">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                10일 전용 여행 패스
              </span>
              <span className="font-extrabold text-lg text-amber-600 font-mono">$1 USD</span>
            </div>
            <h5 className="font-extrabold text-sm text-slate-900">일본 전역 10일 안전 가드 라이선스</h5>
            <p className="text-[11px] text-slate-500">입국일 기준 10일간 유지 • 구독 없이 일시불 연장 가능</p>
          </div>
        </div>

        {/* Features Included */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <p className="font-bold text-amber-400 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Travel Pass 포함 핵심 특전
          </p>
          <ul className="space-y-1.5 text-slate-300">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>JMA 긴급속보 1초 이내 초저지연 한국어 FCM/Web Push</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>일본 전국 3,000+ 오프라인 대피소 IndexedDB 오토 싱크</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>입국일 전 오프라인 지도 패키지 미리 다운로드 받기</span>
            </li>
          </ul>
        </div>

        {/* PG Payment Simulator Buttons */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-bold text-slate-500 text-center">
            원터치 모바일 결제 (Toss / KakaoPay / PayPal)
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('TOSS')}
              className="py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>토스페이 결제 ($1)</span>
            </button>

            <button
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('KAKAOPAY')}
              className="py-2.5 bg-[#FEE500] hover:bg-amber-300 active:scale-95 text-[#191919] font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4 text-[#191919]" />
              <span>카카오페이 결제 ($1)</span>
            </button>
          </div>
        </div>

        {paymentSuccess && (
          <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 p-2.5 rounded-xl text-center text-xs font-bold animate-fade-in">
            🎉 10일 여행 안전 패스 결제가 정상 완료되었습니다! (입국일 기준 10일 산정)
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

