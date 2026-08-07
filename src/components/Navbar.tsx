// DisasterGuard JP - Header Navbar
import React from 'react';
import { Shield, Wifi, WifiOff, PhoneCall, Award, Volume2 } from 'lucide-react';
import { TravelPass } from '../types/disaster';
import { playEmergencySirenTone } from '../utils/audioAlert';

interface NavbarProps {
  isOnline: boolean;
  pass: TravelPass | null;
  onOpenPassModal: () => void;
  onOpenSosModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isOnline,
  pass,
  onOpenPassModal,
  onOpenSosModal
}) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#091426] text-white z-50 shadow-md border-b border-slate-800">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#DC2626] flex items-center justify-center text-white shadow-sm font-bold">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg tracking-tight font-['Atkinson_Hyperlegible_Next'] text-white">
                KJapan
              </h1>
              <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                한국어
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5">일본 여행 모국어 재난 PWA</p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-2">
          {/* Audio Test Chime Button */}
          <button
            onClick={() => playEmergencySirenChime()}
            title="경보음 테스트"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 border border-slate-700 transition-all"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Network Indicator */}
          <div
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md border ${
              isOnline
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-rose-950/80 text-rose-300 border-rose-800'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>온라인</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-rose-400" />
                <span>오프라인</span>
              </>
            )}
          </div>

          {/* Pass Badge */}
          <button
            onClick={onOpenPassModal}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border transition-all active:scale-95 ${
              pass && pass.isActive
                ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{pass && pass.isActive ? `${pass.passType === '3_DAY' ? '3일' : '7일'}패스` : '이용권'}</span>
          </button>

          {/* Quick SOS Trigger */}
          <button
            onClick={onOpenSosModal}
            className="bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white p-2 rounded-lg shadow-sm font-bold flex items-center justify-center transition-all"
            title="긴급 SOS"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
