import React, { useState } from 'react';
import { ShieldCheck, UserPlus, Trash2, Send, CheckCircle2, Heart, Users, MessageCircle, X } from 'lucide-react';

export interface DomesticContact {
  id: string;
  name: string;
  relation: '가족' | '친구' | '동료' | '기타';
  phoneOrKakao: string;
}

interface DomesticContactsModalProps {
  contacts: DomesticContact[];
  onUpdateContacts: (updated: DomesticContact[]) => void;
  onSendSafetyPing: (contactName: string) => void;
  onClose: () => void;
  isPremium: boolean;
  onOpenPayment: () => void;
}

export const DomesticContactsModal: React.FC<DomesticContactsModalProps> = ({
  contacts,
  onUpdateContacts,
  onSendSafetyPing,
  onClose,
  isPremium,
  onOpenPayment
}) => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<'가족' | '친구' | '동료' | '기타'>('가족');
  const [phoneOrKakao, setPhoneOrKakao] = useState('');
  const [pingSentMessage, setPingSentMessage] = useState<string | null>(null);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phoneOrKakao) return;

    const newContact: DomesticContact = {
      id: `CONTACT-${Date.now()}`,
      name,
      relation,
      phoneOrKakao
    };

    onUpdateContacts([...contacts, newContact]);
    setName('');
    setPhoneOrKakao('');
  };

  const handleRemoveContact = (id: string) => {
    onUpdateContacts(contacts.filter(c => c.id !== id));
  };

  const handlePing = (c: DomesticContact) => {
    if (!isPremium) {
      onOpenPayment();
      return;
    }
    onSendSafetyPing(c.name);
    setPingSentMessage(`[KJapan 안심 핑] ${c.name}님에게 "현재 안전하게 대피 완료함" 메시지가 발송되었습니다.`);
    setTimeout(() => setPingSentMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto font-sans text-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-black text-[17px] text-[#091426]">국내 안심 비상 연락처 지정</h3>
              <p className="text-[11px] text-gray-500 font-medium">한국의 가족, 친구, 동료에게 무사함 핑 전송</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isPremium && (
          <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl flex items-center justify-between text-[12px] font-bold text-amber-900">
            <span>💡 $1 10일 패스 구매 시 국내 안심 알림 전송이 무제한 해금됩니다.</span>
            <button
              onClick={onOpenPayment}
              className="bg-blue-600 text-white px-2.5 py-1 rounded-lg shrink-0 hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              $1 패스
            </button>
          </div>
        )}

        {pingSentMessage && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 p-3 rounded-xl text-xs font-bold animate-bounce">
            {pingSentMessage}
          </div>
        )}

        {/* Add Contact Form */}
        <form onSubmit={handleAddContact} className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
          <h4 className="font-extrabold text-[13px] text-gray-800 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>신규 안심 수신자 추가</span>
          </h4>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              placeholder="이름 (예: 엄마)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-1 p-2 rounded-lg border border-gray-300 font-medium"
              required
            />
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value as any)}
              className="col-span-1 p-2 rounded-lg border border-gray-300 font-medium"
            >
              <option value="가족">가족</option>
              <option value="친구">친구</option>
              <option value="동료">동료</option>
              <option value="기타">기타</option>
            </select>
            <input
              type="text"
              placeholder="연락처/카톡ID"
              value={phoneOrKakao}
              onChange={(e) => setPhoneOrKakao(e.target.value)}
              className="col-span-1 p-2 rounded-lg border border-gray-300 font-medium"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#091426] hover:bg-[#15233a] text-white font-bold py-2 rounded-lg text-xs transition-all shadow-xs cursor-pointer"
          >
            + 안심 수신자 등록하기
          </button>
        </form>

        {/* Registered Contacts List */}
        <div className="space-y-2">
          <h4 className="font-bold text-[13px] text-gray-700 flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-600" />
            <span>등록된 비상 연락처 ({contacts.length}명)</span>
          </h4>

          {contacts.length === 0 ? (
            <p className="text-[12px] text-gray-400 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              등록된 비상 연락처가 없습니다. 위 양식에서 가족이나 동료를 등록해 보세요!
            </p>
          ) : (
            contacts.map((c) => (
              <div
                key={c.id}
                className="bg-white p-3 rounded-xl border border-gray-200 card-shadow flex justify-between items-center text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-gray-900 text-[14px]">{c.name}</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {c.relation}
                    </span>
                  </div>
                  <p className="text-gray-500 font-mono text-[11px] mt-0.5">{c.phoneOrKakao}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePing(c)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>무사함 핑</span>
                  </button>
                  <button
                    onClick={() => handleRemoveContact(c.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
