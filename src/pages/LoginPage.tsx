import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, CheckCircle2, ArrowRight, User } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userData: any) => void;
  onClose?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  // URL에 ?admin=true 가 있을 때만 관리자(테스트) 로그인 버튼 표시
  const isAdminMode = window.location.search.includes('admin=true');

  const handleKakaoLogin = async (type: 'real' | 'mock_admin') => {
    if (type === 'real') {
      // 실제 카카오 OAuth 2.0 리다이렉트 (일반 사용자 및 실제 카카오 계정 연동용)
      const KAKAO_CLIENT_ID = "3c8d45aa1143c9b29875812ad721d97f";
      const KAKAO_REDIRECT_URI = window.location.origin + "/";
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
      window.location.href = kakaoAuthUrl;
      return;
    }

    // 관리자(테스트) 모드 (Mock)
    setLoading(true);
    const mockUser = {
      uid: 'kakao_admin_999',
      kakaoId: 'admin_999',
      nickname: '시스템 관리자',
      email: 'admin@disasterguard.jp',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
      role: 'ADMIN',
      isPremium: true,
      premiumExpiresAt: '2099-12-31T23:59:59.000Z'
    };

    try {
      const res = await fetch('/api/auth/kakao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mockUser })
      });

      const data = await res.json();
      setLoading(false);
      onLoginSuccess(data?.user || mockUser);
    } catch (err) {
      setLoading(false);
      onLoginSuccess(mockUser);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 card-shadow space-y-6 max-w-sm mx-auto text-center">
      {/* Icon & Title Header */}
      <div className="space-y-2">
        <div className="w-14 h-14 bg-[#FEE500] text-gray-900 rounded-2xl mx-auto flex items-center justify-center font-black shadow-md">
          <MessageCircle className="w-8 h-8 fill-gray-900" />
        </div>
        <h2 className="font-black text-[20px] text-[#091426]">카카오 간편 로그인</h2>
        <p className="text-[12px] font-semibold text-gray-500">
          복잡한 가입 없이 1초 만에 카카오로 시작하세요.<br/>오프라인 대피소 다운로드와 10일 프리미엄 라이선스를 안전하게 보관합니다.
        </p>
      </div>

      {/* Benefits checklist */}
      <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 border border-gray-100 text-[12px] font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>오프라인 대피소 DB 및 비상 연락처 자동 저장</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>PayPal $1 USD 10일 프리미엄 라이선스 연동</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>기기 분실 시에도 100% 안전한 클라우드 동기화</span>
        </div>
      </div>

      {/* Kakao Login Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleKakaoLogin('real')}
          disabled={loading}
          className="w-full bg-[#FEE500] hover:bg-[#FADA0A] active:scale-[0.98] text-[#191919] font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-[#191919]" />
          <span>{loading ? '연결 중...' : '카카오로 1초만에 시작하기'}</span>
        </button>
        
        {isAdminMode && (
          <button
            onClick={() => handleKakaoLogin('mock_admin')}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-900 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm">관리자 전용 우회 로그인 (테스트용)</span>
          </button>
        )}
      </div>

      {onClose && (
        <button onClick={onClose} className="text-[12px] font-bold text-gray-400 hover:text-gray-600">
          다음에 로그인하기
        </button>
      )}
    </div>
  );
};
