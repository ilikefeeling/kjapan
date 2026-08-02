import React from 'react';
import { MapPin, BookOpen, ChevronRight, HeartHandshake } from 'lucide-react';

interface MainActionButtonsProps {
  onFindShelter: () => void;
  onOpenManual: () => void;
  onOpenContacts: () => void;
}

export const MainActionButtons: React.FC<MainActionButtonsProps> = ({
  onFindShelter,
  onOpenManual,
  onOpenContacts
}) => {
  return (
    <div className="space-y-2.5">
      {/* Primary Action: Find Shelter */}
      <button
        onClick={onFindShelter}
        className="w-full h-[60px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2.5 shadow-lg active:scale-98 transition-all duration-150 cursor-pointer group"
      >
        <MapPin className="w-6 h-6 text-white fill-white/20 group-hover:scale-110 transition-transform" />
        <span className="text-[20px] font-extrabold tracking-tight">통신 끊겨도 대피소 가기</span>
      </button>

      {/* Secondary Action: Family Safety Ping */}
      <button
        onClick={onOpenContacts}
        className="w-full h-[52px] bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-between px-4 shadow-md active:scale-98 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <HeartHandshake className="w-6 h-6 text-amber-300 animate-pulse" />
          <span className="text-[16px] font-black">한국 가족/동향 안심 핑 전송</span>
        </div>
        <span className="text-[11px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
          무사함 알림
        </span>
      </button>

      {/* Tertiary Action: Disaster Manual */}
      <button
        onClick={onOpenManual}
        className="w-full h-[50px] bg-white border-2 border-[#091426] text-[#091426] rounded-xl flex items-center justify-between px-4 active:scale-98 transition-all cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-[#091426]" />
          <span className="text-[16px] font-bold">재난 행동 요령</span>
        </div>
        <ChevronRight className="w-5 h-5 text-[#091426]" />
      </button>
    </div>
  );
};
