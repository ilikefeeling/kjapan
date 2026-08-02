import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, AlertCircle, RefreshCw, X } from 'lucide-react';
import { TranslatedAlert } from '../types/jma';

interface GeminiAiModalProps {
  onClose: () => void;
  currentAlert: TranslatedAlert | null;
}

export const GeminiAiModal: React.FC<GeminiAiModalProps> = ({ onClose, currentAlert }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: '안녕하세요! KJapan AI 긴급 도우미입니다. 현지 재난 상황, 지하철 대피 수칙, 일본어 상황 설명 등 궁금한 점을 편하게 질문하세요.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/disaster-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          alertContext: currentAlert ? `${currentAlert.locationKr} ${currentAlert.intensityKr}` : "정상 안전 상태"
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '재난 긴급 상황 안내: 지진/쓰나미 발생 시 즉시 머리를 보호하고 고지대나 오프라인 대피소로 이동하세요.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "지하철에 탈출할 때 뭐라고 해야 하나요?",
    "지진 후 물이 끊겼을 때 대피소에서 물 받는 법",
    "편의점에서 응급 처치약 요청하는 일본어"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 flex flex-col h-[80vh] shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-[17px] text-[#091426]">AI 긴급 재난 도우미</h3>
              <p className="text-[11px] text-gray-500">Google Gemini 2.5 Flash 연동</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 my-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl max-w-[82%] text-[13px] leading-relaxed font-medium ${
                  m.sender === 'user'
                    ? 'bg-[#091426] text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-500 text-[12px] font-bold p-2 bg-gray-50 rounded-lg w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span>AI가 맞춤 재난 안내를 작성하고 있습니다...</span>
            </div>
          )}
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex gap-1 overflow-x-auto py-1 border-t border-gray-100">
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => { setInput(sp); }}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-[11px] font-bold shrink-0 cursor-pointer"
            >
              + {sp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="질문을 입력하세요..."
            className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#091426]"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#091426] text-white p-3 rounded-xl hover:bg-[#15233a] disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
