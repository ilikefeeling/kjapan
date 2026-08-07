import React from 'react';
import { MapPin, BookOpen, ChevronRight, HeartHandshake, Volume2, ShieldAlert } from 'lucide-react';

interface MainActionButtonsProps {
  onFindShelter: () => void;
  onOpenManual: () => void;
  onOpenContacts: () => void;
  onOpenSimulate: () => void;
}

export const MainActionButtons: React.FC<MainActionButtonsProps> = ({
  onFindShelter,
  onOpenManual,
  onOpenContacts,
  onOpenSimulate
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Top Hero Card: Value Proposition */}
      <button
        onClick={onOpenSimulate}
        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-xl flex items-center justify-between shadow-lg active:scale-98 transition-all cursor-pointer border border-amber-500/30 group overflow-hidden relative"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-left flex flex-col">
            <span className="text-[12px] font-bold text-amber-400 mb-0.5 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              핵심 안전 기능
            </span>
            <span className="text-[17px] font-extrabold tracking-tight">일본 재난 속보 한국말로 들으세요</span>
          </div>
        </div>
        <div className="relative z-10 bg-white/10 p-2 rounded-full">
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </div>
      </button>

      {/* Middle Card: Find Shelter */}
      <button
        onClick={onFindShelter}
        className="w-full h-[68px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-98 transition-all duration-150 cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 bg-emerald-500 text-[9px] font-black px-2 py-0.5 rounded-bl-lg tracking-widest uppercase">
          100% OFFLINE
        </div>
        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6 text-white fill-white/20 group-hover:scale-110 transition-transform" />
          <span className="text-[20px] font-extrabold tracking-tight">통신 끊겨도 대피소 가기</span>
        </div>
        <span className="text-[11px] font-medium text-blue-200">인터넷 없이도 GPS로 가까운 피난소 안내</span>
      </button>

      {/* Bottom Cards: Grid Layout (50% / 50%) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Left: Family Safety Ping */}
        <button
          onClick={onOpenContacts}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex flex-col items-center justify-center p-3 shadow-md active:scale-98 transition-all cursor-pointer h-[84px]"
        >
          <HeartHandshake className="w-7 h-7 text-amber-300 animate-pulse mb-1" />
          <span className="text-[15px] font-black leading-tight text-center">가족 안심 핑 전송</span>
          <span className="text-[11px] font-bold bg-white/20 px-2 py-[2px] rounded-full mt-1.5 leading-none">무사함 알림</span>
        </button>

        {/* Right: Disaster Manual */}
        <button
          onClick={onOpenManual}
          className="bg-white border-2 border-[#091426] text-[#091426] rounded-xl flex flex-col items-center justify-center p-3 active:scale-98 transition-all cursor-pointer hover:bg-gray-50 h-[84px]"
        >
          <BookOpen className="w-7 h-7 text-[#091426] mb-1.5" />
          <span className="text-[15px] font-bold text-center">재난 행동 요령</span>
        </button>
      </div>
    </div>
  );
};
