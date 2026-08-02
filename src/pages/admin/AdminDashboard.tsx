import React, { useState, useEffect } from 'react';
import {
  Users, CreditCard, ShieldAlert, DollarSign, RefreshCw, Send,
  CheckCircle2, Clock, ShieldCheck, ArrowLeft, Search, Filter, AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  onBack?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments' | 'alerts'>('overview');

  // Emergency Alert Form State
  const [alertTitle, setAlertTitle] = useState('');
  const [alertBody, setAlertBody] = useState('');
  const [alertRegion, setAlertRegion] = useState('TOKYO');
  const [alertSeverity, setAlertSeverity] = useState('WARNING');
  const [alertSentMsg, setAlertSentMsg] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Admin stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSendEmergencyAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertBody) return;

    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleKr: alertTitle,
          bodyKr: alertBody,
          region: alertRegion,
          severity: alertSeverity
        })
      });
      const data = await res.json();
      if (data.success) {
        setAlertSentMsg(`[Firebase 브로드캐스트] ${alertTitle} 긴급 알림이 발송되었습니다.`);
        setAlertTitle('');
        setAlertBody('');
        fetchStats();
        setTimeout(() => setAlertSentMsg(null), 4000);
      }
    } catch (err) {
      alert('알림 발송 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 space-y-4 max-w-4xl mx-auto pb-24 font-sans text-gray-900">
      {/* Top Header Bar */}
      <div className="bg-[#091426] text-white p-4 rounded-2xl shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div>
            <h1 className="font-black text-[20px] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span>KJapan 어드민 센터</span>
            </h1>
            <p className="text-[12px] text-gray-300">Firebase Cloud Firestore DB & PayPal $1 통합 관리</p>
          </div>
        </div>

        <button
          onClick={fetchStats}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-extrabold transition-all ${
            activeTab === 'overview' ? 'bg-[#091426] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📊 개요 & KPI
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-extrabold transition-all ${
            activeTab === 'users' ? 'bg-[#091426] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          👥 유저 관리 ({stats?.users?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-extrabold transition-all ${
            activeTab === 'payments' ? 'bg-[#091426] text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          💳 결제 내역 ({stats?.payments?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-extrabold transition-all ${
            activeTab === 'alerts' ? 'bg-red-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🚨 긴급 푸시 발송
        </button>
      </div>

      {/* KPI Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Card 1: Total Users */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1">
              <div className="flex justify-between items-center text-gray-500">
                <span className="text-[12px] font-bold">전체 가입자</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[24px] font-black text-gray-900">{stats?.totalUsersCount || 0} 명</p>
              <p className="text-[11px] text-gray-500">Firebase Firestore 연동 유저</p>
            </div>

            {/* Card 2: Active 10-Day License Holders */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-1 bg-emerald-50/40">
              <div className="flex justify-between items-center text-emerald-700">
                <span className="text-[12px] font-bold">10일 활성 라이선스</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[24px] font-black text-emerald-900">{stats?.activeLicenseUsersCount || 0} 명</p>
              <p className="text-[11px] text-emerald-700">현재 유효 기간 내 유저</p>
            </div>

            {/* Card 3: Total Revenue */}
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs space-y-1 bg-blue-50/40">
              <div className="flex justify-between items-center text-blue-700">
                <span className="text-[12px] font-bold">PayPal 누적 매출</span>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[24px] font-black text-blue-900">${(stats?.totalRevenueUsd || 0).toFixed(2)} USD</p>
              <p className="text-[11px] text-blue-700">PayPal $1 결제 총액</p>
            </div>

            {/* Card 4: Payments Count */}
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-1 bg-amber-50/40">
              <div className="flex justify-between items-center text-amber-700">
                <span className="text-[12px] font-bold">총 결제 건수</span>
                <CreditCard className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-[24px] font-black text-amber-900">{stats?.totalPaymentsCount || 0} 건</p>
              <p className="text-[11px] text-amber-700">10일 1회성 결제 완료</p>
            </div>
          </div>

          {/* Quick Info Alert */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2">
            <h3 className="font-extrabold text-[15px] text-gray-800">🔥 시스템 작동 상태</h3>
            <div className="text-[13px] text-gray-600 space-y-1 font-medium">
              <p>• **Database**: Firebase Cloud Firestore 연결 상태 정상</p>
              <p>• **PayPal Gateway**: $1 USD 10일 라이선스 Capture 모듈 정상 연동</p>
              <p>• **Auth**: Kakao OAuth 2.0 및 Firebase Auth Custom Token 호환 연동</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden space-y-3 p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-[16px]">Firebase 사용자 목록</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="닉네임 / 이메일 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-[12px] rounded-lg border border-gray-300 w-48 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] font-medium text-gray-700">
              <thead className="bg-gray-50 text-gray-900 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">프로필 / 닉네임</th>
                  <th className="p-3">이메일</th>
                  <th className="p-3">권한</th>
                  <th className="p-3">10일 라이선스 상태</th>
                  <th className="p-3">만료 예정일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.users || [])
                  .filter((u: any) =>
                    !searchQuery ||
                    u.nickname?.includes(searchQuery) ||
                    u.email?.includes(searchQuery)
                  )
                  .map((u: any) => {
                    const isLive = u.premiumExpiresAt && new Date(u.premiumExpiresAt).getTime() > Date.now();

                    return (
                      <tr key={u.uid} className="hover:bg-gray-50">
                        <td className="p-3 flex items-center gap-2 font-bold text-gray-900">
                          {u.profileImage ? (
                            <img src={u.profileImage} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                              {u.nickname?.[0] || 'U'}
                            </div>
                          )}
                          <span>{u.nickname}</span>
                        </td>
                        <td className="p-3 text-gray-500">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                            {u.role || 'USER'}
                          </span>
                        </td>
                        <td className="p-3">
                          {isLive ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                              ✓ 10일 활성 중
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded text-[11px]">
                              무료 모드 (미결제)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-gray-500 font-mono text-[11px]">
                          {u.premiumExpiresAt ? new Date(u.premiumExpiresAt).toLocaleString('ko-KR') : '-'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Payments History Table */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden space-y-3 p-4">
          <h3 className="font-black text-[16px]">PayPal $1 USD 결제 기록</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] font-medium text-gray-700">
              <thead className="bg-gray-50 text-gray-900 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">PayPal Order ID</th>
                  <th className="p-3">유저 ID</th>
                  <th className="p-3">금액</th>
                  <th className="p-3">상태</th>
                  <th className="p-3">라이선스 만료일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(stats?.payments || []).map((p: any) => (
                  <tr key={p.paymentId} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-gray-900">{p.paymentId}</td>
                    <td className="p-3 font-mono text-gray-600">{p.paypalOrderId}</td>
                    <td className="p-3 font-semibold">{p.userId}</td>
                    <td className="p-3 font-extrabold text-blue-700">${p.amount} {p.currency}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold text-[10px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 font-mono text-[11px]">
                      {p.validUntil ? new Date(p.validUntil).toLocaleString('ko-KR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Emergency Alert Broadcaster */}
      {activeTab === 'alerts' && (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-black text-[18px] text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Firebase 긴급 재난 알림 수동 발송</span>
            </h3>
            <p className="text-[12px] text-gray-500 font-medium">
              모든 PWA 클라이언트에 Firebase Cloud Message 푸시 및 실시간 경보 배너를 송출합니다.
            </p>
          </div>

          {alertSentMsg && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 p-3 rounded-xl font-bold text-xs animate-bounce">
              {alertSentMsg}
            </div>
          )}

          <form onSubmit={handleSendEmergencyAlert} className="space-y-3">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1">알림 제목 (한글)</label>
              <input
                type="text"
                placeholder="예: [긴급] 도쿄 시부야 지진 경보 (진도 4.2)"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-300 font-medium focus:outline-hidden focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1">알림 내용 (한글)</label>
              <textarea
                rows={3}
                placeholder="예: 지진 진동 발생. 즉시 책상 밑으로 대피하고 오프라인 대피소 위치를 확인하세요."
                value={alertBody}
                onChange={(e) => setAlertBody(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-300 font-medium focus:outline-hidden focus:border-red-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">발송 지역</label>
                <select
                  value={alertRegion}
                  onChange={(e) => setAlertRegion(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 font-medium"
                >
                  <option value="ALL">전국 (일본 전역)</option>
                  <option value="TOKYO">도쿄 / 관동 지역</option>
                  <option value="OSAKA">오사카 / 관서 지역</option>
                  <option value="FUKUOKA">후쿠오카 / 규슈 지역</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1">위험도 (Severity)</label>
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 font-medium"
                >
                  <option value="WARNING">경보 (WARNING)</option>
                  <option value="CRITICAL">위험 (CRITICAL)</option>
                  <option value="INFO">안내 (INFO)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Firebase 긴급 경보 푸시 즉시 발송</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
