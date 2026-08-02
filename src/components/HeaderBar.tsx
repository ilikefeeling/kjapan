import React from 'react';
import { Languages, UserCheck, LogIn, LogOut, CreditCard } from 'lucide-react';

interface HeaderBarProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenTranslate: () => void;
  onOpenPass: () => void;
  onOpenSimulate: () => void;
  onOpenAiAssist: () => void;
  onOpenLogin: () => void;
  onOpenPayment: () => void;
  onOpenAdmin: () => void;
  onLogout?: () => void;
  user: any;
  alertLevel: 'SAFETY' | 'WARNING' | 'DANGER';
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isOnline,
  onToggleOnline,
  onOpenTranslate,
  onOpenPass,
  onOpenSimulate,
  onOpenAiAssist,
  onOpenLogin,
  onOpenPayment,
  onOpenAdmin,
  onLogout,
  user,
  alertLevel
}) => {
  const isPremiumActive = user?.isPremium && user?.premiumExpiresAt && new Date(user.premiumExpiresAt).getTime() > Date.now();

  return (
    <div className="fixed top-0 left-0 right-0 w-full z-40 bg-[#fbf8fa]">
      {/* Main App Bar */}
      <header className="w-full bg-[#fbf8fa] shadow-sm border-b border-[#c5c6cd]/30 flex justify-between items-center px-4 h-[88px]">
        <button
          onClick={onOpenTranslate}
          className="p-2 sm:p-2.5 rounded-lg text-[#091426] hover:bg-[#f0edef] active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
          title="일본어 응급 회화"
        >
          <Languages className="w-7 h-7 sm:w-9 sm:h-9" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <h1 className="font-bold text-[22px] sm:text-[28px] text-[#091426] tracking-tight">KJapan</h1>
          {isPremiumActive ? (
            <span className="text-[12px] sm:text-[14px] font-black bg-emerald-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded uppercase whitespace-nowrap">
              10일 패스
            </span>
          ) : (
            <span className="text-[12px] sm:text-[14px] font-extrabold bg-[#091426] text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded uppercase whitespace-nowrap">
              FREE
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PayPal $1 10-Day Pass Button */}
          {!isPremiumActive && (
            <button
              onClick={onOpenPayment}
              className="px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-[13px] sm:text-[15px] flex items-center gap-1 sm:gap-2 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
              title="PayPal $1 10일 라이선스 결제"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              <span className="hidden sm:inline">$1 패스</span>
              <span className="sm:hidden">$1</span>
            </button>
          )}

          {/* Kakao User Profile & Logout button */}
          {user ? (
            <div className="flex items-center gap-1 bg-gray-100 p-1 sm:p-1.5 rounded-lg border border-gray-200 shrink-0">
              <button
                onClick={onOpenPass}
                className="p-1 sm:p-1.5 rounded-md hover:bg-gray-200 flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[15px] font-bold text-gray-800 cursor-pointer whitespace-nowrap shrink-0"
                title="프로필 및 이용권 보기"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-gray-300 object-cover shrink-0" />
                ) : (
                  <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 shrink-0" />
                )}
                <span className="hidden sm:inline text-[15px] font-extrabold px-1">{user.nickname || '여행자'}</span>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700 font-extrabold text-[12px] sm:text-[14px] flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  title="로그아웃"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">로그아웃</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-black text-[13px] sm:text-[15px] flex items-center gap-1.5 sm:gap-2 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
              title="카카오톡 로그인"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>로그인</span>
            </button>
          )}
        </div>
      </header>
    </div>
  );
};
