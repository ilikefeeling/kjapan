// DisasterGuard JP - Primary Emergency Action CTA Buttons
import React from 'react';
import { MapPin, BookOpen, PhoneCall, Phone, Flame, HeartPulse } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/japanShelters';

interface EmergencyCtaButtonsProps {
  onOpenShelters: () => void;
  onOpenGuides: () => void;
  onOpenSosModal: () => void;
}

export const EmergencyCtaButtons: React.FC<EmergencyCtaButtonsProps> = ({
  onOpenShelters,
  onOpenGuides,
  onOpenSosModal
}) => {
  return (
    <div className="space-y-3">
      {/* 64px Bento Primary Action: Find Offline Shelters */}
      <button
        onClick={onOpenShelters}
        className="w-full h-16 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl flex items-center justify-between px-5 shadow-lg border border-blue-500 transition-all duration-150 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-lg tracking-tight font-['Atkinson_Hyperlegible_Next'] block text-white">
              통신 끊겨도 대피소 가기
            </span>
            <span className="text-xs text-blue-100">
              네트워크 미연결 시 최단거리 3곳 GPS 가이드
            </span>
          </div>
        </div>
        <span className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-md font-semibold border border-slate-700">
          GPS 지도
        </span>
      </button>

      {/* Secondary Action: Disaster Action Guides */}
      <button
        onClick={onOpenGuides}
        className="w-full p-3.5 bg-white border-2 border-[#091426] text-[#091426] hover:bg-slate-50 active:scale-[0.98] rounded-xl flex items-center justify-between shadow-sm transition-all"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#091426]" />
          <span className="font-bold text-base font-['Atkinson_Hyperlegible_Next']">
            재난 유형별 행동 요령
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          지진·쓰나미·폭우
        </span>
      </button>

      {/* Emergency Contacts Cards */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-['Plus_Jakarta_Sans']">
            현지 긴급 연락망
          </h3>
          <button
            onClick={onOpenSosModal}
            className="text-xs text-red-600 font-bold hover:underline"
          >
            전체 보기 & 일본어 회화
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Diplomatic Call Center */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-full bg-blue-100 text-blue-700">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-800">외교부 영사콜센터 (24시간)</p>
                <p className="text-[11px] text-slate-500">+82-2-3210-0404</p>
              </div>
            </div>
            <a
              href="tel:+82232100404"
              className="w-9 h-9 rounded-full bg-[#DC2626] text-white flex items-center justify-center hover:bg-red-700 active:scale-95 shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>

          {/* Japan 119 Ambulance / Fire */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-full bg-red-100 text-red-700">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-800">일본 119 (화재·구급)</p>
                <p className="text-[11px] text-slate-500">Emergency Ambulance / Fire</p>
              </div>
            </div>
            <a
              href="tel:119"
              className="w-9 h-9 rounded-full bg-[#DC2626] text-white flex items-center justify-center hover:bg-red-700 active:scale-95 shadow-sm transition-all"
            >
              <Flame className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
