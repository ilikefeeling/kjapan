// DisasterGuard JP - One-Touch Emergency SOS Modal & Japanese Phrase Flashcards
import React, { useState } from 'react';
import { PhoneCall, Volume2, ShieldAlert, Phone, Copy, Check } from 'lucide-react';
import { EMERGENCY_CONTACTS, EMERGENCY_FLASHCARDS } from '../data/japanShelters';
import { speakTextJa } from '../utils/audioAlert';

interface SosDialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosDialModal: React.FC<SosDialModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-4 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600 text-white rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Atkinson_Hyperlegible_Next']">
                원터치 긴급 SOS & 현지 회화
              </h3>
              <p className="text-xs text-slate-500">언어 장벽 없는 신속 전화 연결 및 일어 음성 가이드</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* 1. Emergency Contacts Quick Dial List */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-['Plus_Jakarta_Sans']">
            원터치 긴급 다이얼 (Immediate Tel Link)
          </h4>

          <div className="grid grid-cols-1 gap-2">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-xs text-slate-900">{contact.titleKo}</p>
                    {contact.is24h && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                        24시간
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{contact.subTitleKo}</p>
                  <p className="text-[11px] text-slate-700 font-mono font-bold mt-1">
                    {contact.phone}
                  </p>
                </div>

                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-11 h-11 rounded-full bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-md transition-all shrink-0"
                  title="바로 전화 걸기"
                >
                  <PhoneCall className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Essential Emergency Japanese Flashcards */}
        <div className="space-y-2 pt-2 border-t">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-['Plus_Jakarta_Sans']">
            현지 필수 긴급 일어 음성 및 문장 카드
          </h4>

          <div className="space-y-2">
            {EMERGENCY_FLASHCARDS.map((card) => (
              <div
                key={card.id}
                className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                      {card.category}
                    </span>
                    <p className="font-bold text-xs text-slate-100 mt-1">{card.korean}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* TTS Audio Button */}
                    <button
                      onClick={() => speakTextJa(card.audioText)}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white active:scale-95 transition-all"
                      title="음성으로 들려주기"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Copy Text Button */}
                    <button
                      onClick={() => handleCopy(card.japaneseKanji, card.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all border border-slate-700"
                      title="일어 복사"
                    >
                      {copiedId === card.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="font-mono text-amber-300 font-bold text-sm">
                  {card.japaneseKanji}
                </p>
                <p className="text-[11px] text-slate-400">
                  발음: <span className="text-slate-200">{card.japanesePronunciation}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
