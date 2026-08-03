/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TranslatedAlert, UserPass } from './types/jma';
import { HeaderBar } from './components/HeaderBar';
import { HeroSafetyCard } from './components/HeroSafetyCard';
import { MainActionButtons } from './components/MainActionButtons';
import { SosQuickDial } from './components/SosQuickDial';
import { LocationFooter } from './components/LocationFooter';
import { BottomNav, NavTab } from './components/BottomNav';
import { ShelterMapModal } from './components/ShelterMapModal';
import { DisasterManualView } from './components/DisasterManualView';
import { MyPassView } from './components/MyPassView';
import { SimulateJmaModal } from './components/SimulateJmaModal';
import { LanguageTranslateModal } from './components/LanguageTranslateModal';
import { GeminiAiModal } from './components/GeminiAiModal';
import { LoginPage } from './pages/LoginPage';
import { PaymentPage } from './pages/PaymentPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DomesticContactsModal, DomesticContact } from './components/DomesticContactsModal';
import { initOfflineIndexedDB } from './utils/offlineShelter';
import { playEmergencySirenTone, stopEmergencySirenTone, speakEmergencyKoreanGuide } from './utils/audioAlert';
import { Bell, ShieldCheck, Sparkles, LogIn, CreditCard } from 'lucide-react';

export default function App() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [currentAlert, setCurrentAlert] = useState<TranslatedAlert | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Main View Navigation Mode: 'main' | 'login' | 'payment' | 'admin'
  const initialViewMode = window.location.search.includes('admin_dashboard=true') ? 'admin' : 'main';
  const [viewMode, setViewMode] = useState<'main' | 'login' | 'payment' | 'admin'>(initialViewMode);

  // Modals
  const [showSimulateModal, setShowSimulateModal] = useState<boolean>(false);
  const [showTranslateModal, setShowTranslateModal] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showContactsModal, setShowContactsModal] = useState<boolean>(false);
  const [showMainWarningModal, setShowMainWarningModal] = useState<boolean>(false);
  const [pushNotificationMessage, setPushNotificationMessage] = useState<string | null>(null);

  // Registered Domestic Emergency Contacts
  const [domesticContacts, setDomesticContacts] = useState<DomesticContact[]>([
    { id: 'c1', name: '엄마', relation: '가족', phoneOrKakao: '010-1234-5678' },
    { id: 'c2', name: '김팀장', relation: '동료', phoneOrKakao: 'kakao_team_lead' }
  ]);

  // User & Firebase Account State (Load from localStorage if available)
  const [user, setUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('kJapanUser');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // User location state (default Shibuya, Tokyo)
  const [location, setLocation] = useState({
    lat: 35.6620,
    lng: 139.7022,
    locationKr: "도쿄도 시부야구",
    locationJp: "Shibuya-ku, Tokyo, Japan"
  });

  const [userPass, setUserPass] = useState<UserPass>({
    id: "PASS-2026-KR-ADMIN",
    provider: "kakao",
    passType: "10_DAYS",
    purchasedAt: new Date().toISOString(),
    passStartsAt: new Date().toISOString(),
    passExpiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE",
    fcmPushToken: "fcm_token_admin_999",
    userName: "sinmyung9",
    userEmail: "ilikepeople@icloud.com",
    passportVerified: true,
    arrivalDate: new Date().toISOString(),
    departureDate: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(),
    arrivalAirport: "NRT (도쿄 나리타)",
    departureAirport: "NRT (도쿄 나리타)",
    offlineMapDownloaded: true,
  });

  // Seed IndexedDB Offline Shelters
  useEffect(() => {
    initOfflineIndexedDB().then(() => {
      console.log("IndexedDB Offline Shelter Database Initialized");
    });
  }, []);

  // Handle Kakao OAuth Redirect Callback
  const isAuthProcessing = useRef(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    
    if (code && !isAuthProcessing.current) {
      isAuthProcessing.current = true;
      setViewMode('main');
      setPushNotificationMessage("카카오 서버에서 인증 중입니다...");
      
      fetch('/api/auth/kakao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          redirectUri: window.location.origin + "/" 
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          handleLoginSuccess(data.user);
        } else {
          setPushNotificationMessage("카카오 로그인 실패: " + (data.error || "알 수 없는 오류"));
          setTimeout(() => setPushNotificationMessage(null), 3000);
        }
      })
      .catch(err => {
        setPushNotificationMessage("로그인 통신 오류가 발생했습니다.");
        setTimeout(() => setPushNotificationMessage(null), 3000);
      })
      .finally(() => {
        // 인증 코드가 남아있지 않도록 URL 정리
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, []);

  // Premium user check: BYPASSED FOR VIDEO RECORDING
  const isPaidUser = true;

  // Subscribe to JMA Live Realtime Pipeline API (ONLY for paid users)
  useEffect(() => {
    // Guard: Do NOT poll or deliver alerts to non-paid users
    if (!isPaidUser) {
      // Clear any existing alert if user logs out or pass expires
      if (currentAlert) {
        setCurrentAlert(null);
      }
      return;
    }

    const fetchJmaLive = async () => {
      try {
        const res = await fetch('/api/jma/live');
        const contentType = res.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && data.liveAlert) {
            if (data.liveAlert.alertLevel !== 'SAFETY') {
              setCurrentAlert(data.liveAlert);
            }
          }
        } else {
          // Direct JMA Open Data Feed Polling Fallback
          const jmaRes = await fetch('https://www.jma.go.jp/bosai/quake/data/list.json');
          if (jmaRes.ok) {
            const data: any = await jmaRes.json();
            if (Array.isArray(data) && data.length > 0) {
              const recent = data[0];
              const intensity = recent.maxi || "3";
              const isDanger = ["5-", "5+", "6-", "6+", "7"].includes(intensity);
              if (isDanger) {
                setCurrentAlert({
                  alertId: recent.eid || `JMA-${Date.now()}`,
                  disasterType: 'EARTHQUAKE',
                  alertLevel: 'DANGER',
                  locationKr: '일본 관동/관서 지역',
                  intensityKr: `진도 ${intensity}`,
                  pushTitle: `[JMA 실시간 속보] 일본 현지 진도 ${intensity} 지진 경보`,
                  pushBody: '강한 지진 진동 감지! 즉시 머리를 보호하고 오프라인 대피소 위치를 확인하세요.',
                  actionGuideKr: [
                    '머리를 방석이나 가방으로 보호하고 책상 밑으로 대피하세요.',
                    '진동 정지 후 앱의 오프라인 지도에서 최단거리 대피소로 이동하세요.'
                  ],
                  timestamp: recent.at || new Date().toISOString()
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('JMA Live polling notice:', err);
      }
    };

    fetchJmaLive();
    const interval = setInterval(fetchJmaLive, 10000);
    return () => clearInterval(interval);
  }, [isPaidUser]);

  // Play audio siren when emergency alert triggers (ONLY for paid users)
  useEffect(() => {
    if (isPaidUser && currentAlert && currentAlert.alertLevel !== 'SAFETY') {
      playEmergencySirenTone();
      setIsAudioPlaying(true);
      speakEmergencyKoreanGuide(currentAlert.pushTitle + ". " + currentAlert.pushBody);
    } else {
      stopEmergencySirenTone();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
    }
  }, [currentAlert, isPaidUser]);

  const handleStopAudio = () => {
    stopEmergencySirenTone();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsAudioPlaying(false);
  };

  // Location presets for testing different Japanese travel destinations
  const handleChangeLocationPreset = (city: 'tokyo' | 'osaka' | 'kyoto' | 'fukuoka') => {
    if (city === 'tokyo') {
      setLocation({
        lat: 35.6620,
        lng: 139.7022,
        locationKr: "도쿄도 시부야구",
        locationJp: "Shibuya-ku, Tokyo, Japan"
      });
    } else if (city === 'osaka') {
      setLocation({
        lat: 34.6618,
        lng: 135.5015,
        locationKr: "오사카부 난바구",
        locationJp: "Namba, Chuo-ku, Osaka, Japan"
      });
    } else if (city === 'fukuoka') {
      setLocation({
        lat: 33.5902,
        lng: 130.4017,
        locationKr: "후쿠오카현 텐진구",
        locationJp: "Tenjin, Chuo-ku, Fukuoka, Japan"
      });
    } else if (city === 'kyoto') {
      setLocation({
        lat: 35.0037,
        lng: 135.7681,
        locationKr: "교토부 가와라마치",
        locationJp: "Kawaramachi, Kyoto, Japan"
      });
    }
  };

  // Device Geolocation
  const handleRefreshGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            locationKr: "현재 기기 GPS 위치",
            locationJp: "Current GPS Coordinates"
          });
          setPushNotificationMessage("GPS 좌표 갱신 완료: 대피소 최단거리가 새로 계산되었습니다.");
          setTimeout(() => setPushNotificationMessage(null), 3000);
        },
        () => {
          setPushNotificationMessage("GPS 수신 권한 확인 필요. 기본 위치(도쿄 시부야)를 유지합니다.");
          setTimeout(() => setPushNotificationMessage(null), 3000);
        }
      );
    }
  };

  // FCM Test Push Notification (Simulation)
  const handleTriggerTestPush = () => {
    const pushMsg = "🚨 [긴급 지진 속보] 도쿄 나리타 공항 인근 진도 6 강진 발생! 예상 도달 시간 12초. 즉시 책상 밑으로 피하세요!";
    setPushNotificationMessage(pushMsg);
    
    // 실제 사이렌 및 한국어 음성 재생 시뮬레이션
    playEmergencySirenTone();
    setIsAudioPlaying(true);
    speakEmergencyKoreanGuide("긴급 지진 속보. 도쿄 나리타 공항 인근 진도 6 강진 발생. 예상 도달 시간 12초. 즉시 책상 밑으로 피하세요!");

    // 8초 후 자동 종료 (시뮬레이션 끝)
    setTimeout(() => {
      setPushNotificationMessage(null);
      handleStopAudio();
    }, 8000);
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    try {
      localStorage.setItem('kJapanUser', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
    setUserPass({
      id: `PASS-${userData.kakaoId || '77492'}`,
      provider: "kakao",
      passType: "10_DAYS",
      purchasedAt: new Date().toISOString(),
      passStartsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      passExpiresAt: userData.premiumExpiresAt || new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
      status: "PRE_ACTIVE",
      fcmPushToken: "fcm_token_eew_kr_japan_pwa_994",
      userName: userData.nickname || "여행자",
      userEmail: userData.email || "user@kakao.com",
      passportVerified: true,
      arrivalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      arrivalAirport: "NRT (도쿄 나리타)",
      departureAirport: "NRT (도쿄 나리타)",
      offlineMapDownloaded: true,
    });
    setViewMode('main');
    setPushNotificationMessage(`[카카오/Firebase] ${userData.nickname}님 환영합니다!`);
    setTimeout(() => setPushNotificationMessage(null), 3000);
  };

  const handlePaymentComplete = (updatedUser: any) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('kJapanUser', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
    setUserPass({
      ...userPass,
      passType: '10_DAYS',
      status: updatedUser.status || 'PRE_ACTIVE',
      arrivalDate: updatedUser.arrivalDate,
      departureDate: updatedUser.departureDate,
      arrivalAirport: updatedUser.arrivalAirport,
      departureAirport: updatedUser.departureAirport,
      passStartsAt: updatedUser.passStartsAt || updatedUser.arrivalDate,
      passExpiresAt: updatedUser.passExpiresAt || updatedUser.premiumExpiresAt,
      offlineMapDownloaded: true,
    });
    setPushNotificationMessage("💳 PayPal $1 결제 승인 완료! 입국일 기준 10일 라이선스가 사전 활성화되었습니다.");
    setTimeout(() => setPushNotificationMessage(null), 4000);
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('kJapanUser');
    } catch (e) {
      console.error('Failed to remove user from localStorage', e);
    }
    setActiveTab('home');
    setPushNotificationMessage("안전하게 로그아웃 되었습니다.");
    setTimeout(() => setPushNotificationMessage(null), 3000);
  };

  return (
    <div className="bg-[#fbf8fa] text-[#1b1b1d] min-h-screen flex flex-col font-sans selection:bg-red-500 selection:text-white pb-[90px]">
      {/* Top Header Bar */}
      <HeaderBar
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        onOpenTranslate={() => setShowTranslateModal(true)}
        onOpenPass={() => { setActiveTab('pass'); setViewMode('main'); }}
        onOpenSimulate={() => setShowSimulateModal(true)}
        onOpenAiAssist={() => setShowAiModal(true)}
        onOpenLogin={() => setViewMode('login')}
        onOpenPayment={() => setViewMode('payment')}
        onOpenAdmin={() => setViewMode('admin')}
        onLogout={handleLogout}
        user={user}
        alertLevel={currentAlert ? currentAlert.alertLevel : 'SAFETY'}
      />

      {/* FCM Simulated Push Notification Banner */}
      {pushNotificationMessage && (
        <div className="fixed top-[108px] left-4 right-4 z-50 bg-[#091426] text-white p-3 rounded-xl shadow-2xl border border-amber-400/50 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2 text-[13px] font-bold">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>{pushNotificationMessage}</span>
          </div>
          <button onClick={() => setPushNotificationMessage(null)} className="text-gray-400 hover:text-white font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mt-[108px] px-4 pt-2 space-y-4 max-w-md mx-auto w-full">
        {/* View Mode: Admin Dashboard */}
        {viewMode === 'admin' && (
          <AdminDashboard onBack={() => setViewMode('main')} />
        )}

        {/* View Mode: Kakao Login */}
        {viewMode === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setViewMode('main')}
          />
        )}

        {/* View Mode: PayPal $1 10-Day License Payment */}
        {viewMode === 'payment' && (
          <PaymentPage
            user={user}
            onPaymentComplete={handlePaymentComplete}
            onBack={() => setViewMode('main')}
            onTriggerTestPush={handleTriggerTestPush}
            onGoLogin={() => setViewMode('login')}
          />
        )}

        {/* View Mode: Main App Tabs */}
        {viewMode === 'main' && (
          <>
            {activeTab === 'home' && (
              <>
                {/* Hero Safety Status Card */}
                <HeroSafetyCard
                  currentAlert={currentAlert}
                  onFindShelter={() => setActiveTab('map')}
                  onStopAudio={handleStopAudio}
                  isAudioPlaying={isAudioPlaying}
                />

                {/* Primary & Secondary Action Buttons */}
                <MainActionButtons
                  onFindShelter={() => setActiveTab('map')}
                  onOpenManual={() => setActiveTab('manual')}
                  onOpenContacts={() => setShowContactsModal(true)}
                  onOpenSimulate={() => setShowMainWarningModal(true)}
                />

                {/* Emergency SOS Quick Dial Bar */}
                <SosQuickDial
                  userLocationKr={location.locationKr}
                  userLocationJp={location.locationJp}
                />

                {/* Current GPS Location Footer */}
                <LocationFooter
                  locationKr={location.locationKr}
                  locationJp={location.locationJp}
                  lat={location.lat}
                  lng={location.lng}
                  onRefreshGps={handleRefreshGps}
                  onChangeLocationPreset={handleChangeLocationPreset}
                />
              </>
            )}

            {/* Tab 2: Offline Map & Shelters */}
            {activeTab === 'map' && (
              <ShelterMapModal
                userLat={location.lat}
                userLng={location.lng}
                userLocationKr={location.locationKr}
                isOnline={isOnline}
              />
            )}

            {/* Tab 3: Disaster Action Guides */}
            {activeTab === 'manual' && (
              <DisasterManualView />
            )}

            {/* Tab 4: My Pass Lifecycle */}
            {activeTab === 'pass' && (
              user ? (
                <MyPassView
                  pass={userPass}
                  onUpdatePass={setUserPass}
                  onTriggerTestPush={handleTriggerTestPush}
                  onLogout={handleLogout}
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-24 space-y-5">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🔒</span>
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">로그인이 필요합니다</h2>
                    <p className="text-[13px] text-gray-500">
                      안전 패스를 확인하고 혜택을 이용하려면<br />먼저 로그인해 주세요.
                    </p>
                  </div>
                  <button
                    onClick={() => setViewMode('login')}
                    className="mt-4 px-6 py-3 bg-[#091426] text-white rounded-xl font-bold text-[14px] shadow-lg hover:bg-[#15233a] active:scale-95 transition-all"
                  >
                    로그인하러 가기
                  </button>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Bottom Fixed Navigation Bar */}
      {viewMode === 'main' && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Modals */}
      {showSimulateModal && (
        <SimulateJmaModal
          onSelectAlert={(alert) => {
            if (alert && alert.alertLevel !== 'SAFETY' && !isPaidUser) {
              // Block alert for non-paid users: show payment prompt
              setPushNotificationMessage('⚠️ 재난 경보 수신은 $1 10일 패스 결제 사용자 전용 기능입니다. 패스를 구매해 주세요.');
              setTimeout(() => setPushNotificationMessage(null), 5000);
              setShowSimulateModal(false);
              setViewMode('payment');
              return;
            }
            setCurrentAlert(alert);
          }}
          onClose={() => setShowSimulateModal(false)}
          currentAlert={currentAlert}
        />
      )}

      {showTranslateModal && (
        <LanguageTranslateModal
          onClose={() => setShowTranslateModal(false)}
        />
      )}

      {showAiModal && (
        <GeminiAiModal
          onClose={() => setShowAiModal(false)}
          currentAlert={currentAlert}
        />
      )}

      {showContactsModal && (
        <DomesticContactsModal
          contacts={domesticContacts}
          onUpdateContacts={setDomesticContacts}
          onSendSafetyPing={(name) => {
            setPushNotificationMessage(`[KJapan 안심 핑] ${name}님에게 "현재 안전 대피 완료" 메시지가 발송되었습니다.`);
            setTimeout(() => setPushNotificationMessage(null), 4000);
          }}
          onClose={() => setShowContactsModal(false)}
          isPremium={Boolean(user?.isPremium && user?.premiumExpiresAt && new Date(user.premiumExpiresAt).getTime() > Date.now())}
          onOpenPayment={() => {
            setShowContactsModal(false);
            setViewMode('payment');
          }}
        />
      )}

      {/* Main Screen Warning Modal for Simulation */}
      {showMainWarningModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in border border-gray-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-inner">
                <Bell className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-gray-900 mb-2">실제 재난 사이렌 주의</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  매우 큰 재난 사이렌 소리와 한국어 음성 안내가 기기 스피커로 <strong>즉시 재생</strong>됩니다.<br/><br/>
                  공공장소나 조용한 곳에서는 주변에 피해가 갈 수 있으니 사용을 주의해 주세요!
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowMainWarningModal(false);
                  handleTriggerTestPush();
                }}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[14px] transition-all shadow-md active:scale-[0.98]"
              >
                소리 켜고 체험하기
              </button>
              <button
                onClick={() => setShowMainWarningModal(false)}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-[14px] transition-all active:scale-[0.98]"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
