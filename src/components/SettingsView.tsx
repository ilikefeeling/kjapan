// DisasterGuard JP - App Settings & PWA Status Component
import React, { useState, useEffect } from 'react';
import { Download, Volume2, Database, Shield, Bell, CheckCircle, RefreshCw, Cpu, Award, Smartphone } from 'lucide-react';
import { TravelPass, UserLocation } from '../types/disaster';
import { playEmergencySirenChime } from '../utils/audioAlert';
import { offlineDb } from '../lib/offlineDb';

interface SettingsViewProps {
  isOnline: boolean;
  pass: TravelPass | null;
  userLocation: UserLocation;
  onOpenPassModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isOnline,
  pass,
  userLocation,
  onOpenPassModal
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [dbCount, setDbCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    async function checkDb() {
      const shelters = await offlineDb.getAllShelters();
      setDbCount(shelters.length);
    }
    checkDb();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted PWA install prompt');
      }
      setDeferredPrompt(null);
    } else {
      alert('PWA 설치 안내: 브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치"를 누르면 앱으로 설치됩니다.');
    }
  };

  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      alert('이 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
      return;
    }

    const permission = await Notification.requestPermission();
    setPushPermission(permission);

    if (permission === 'granted') {
      new Notification('KJapan 긴급 알림 수신 설정 완료', {
        body: '일본 재난 발생 시 초저지연 긴급 알림이 전송됩니다.',
        icon: '/icon-192.png'
      });
    }
  };

  const handleManualSyncDb = async () => {
    setIsSyncing(true);
    await offlineDb.seedDatabaseIfEmpty();
    const loaded = await offlineDb.getAllShelters();
    setDbCount(loaded.length);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* App & PWA Status Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#091426] text-white rounded-xl">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 font-['Atkinson_Hyperlegible_Next']">
              PWA 오프라인 앱 설치 & 기기 상태
            </h3>
            <p className="text-xs text-slate-500">Service Worker & Caching Engine</p>
          </div>
        </div>

        {/* Install PWA Button */}
        <button
          onClick={handleInstallPwa}
          className="w-full py-3 bg-[#DC2626] hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>KJapan 홈 화면에 설치 (PWA)</span>
        </button>
      </div>

      {/* Web Push Notification Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-sm text-slate-900">긴급 Web Push 알림 설정</h4>
          </div>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              pushPermission === 'granted'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {pushPermission === 'granted' ? '알림 허용됨' : '권한 필요'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          지진 속보 및 쓰나미 주의보 발생 시 1초 이내에 사용자 기기로 한국어 알림을 브로드캐스팅합니다.
        </p>

        {pushPermission !== 'granted' && (
          <button
            onClick={handleRequestNotification}
            className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all"
          >
            푸시 알림 수신 권한 허용하기
          </button>
        )}
      </div>

      {/* Offline Database (IndexedDB) Manager */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-sm text-slate-900">오프라인 대피소 IndexedDB Caching</h4>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {dbCount}개 대피소
          </span>
        </div>

        <p className="text-xs text-slate-600">
          통신이 완전히 끊긴 상황에서도 로컬 브라우저 IndexedDB 데이터를 통해 최단거리 대피소를 실시간 계산합니다.
        </p>

        <button
          onClick={handleManualSyncDb}
          disabled={isSyncing}
          className="w-full py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          <span>{isSyncing ? '동기화 중...' : '대피소 DB 강제 동기화'}</span>
        </button>
      </div>

      {/* Audio Siren Test */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#DC2626]" />
          <h4 className="font-bold text-sm text-slate-900">Web Audio API 경보음 테스트</h4>
        </div>

        <p className="text-xs text-slate-600">
          스마트폰 무음 모드 환경에서도 비상 경보음을 정상 출력할 수 있는지 테스트합니다.
        </p>

        <button
          onClick={() => playEmergencySirenChime()}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
        >
          <Volume2 className="w-4 h-4" />
          <span>최대 음량 사이렌 경보음 테스트 재생</span>
        </button>
      </div>

      {/* Travel Pass Status */}
      <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-sm text-slate-100">이용권 및 인증 관리</h4>
          </div>
          <button
            onClick={onOpenPassModal}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            패스 구매/변경
          </button>
        </div>

        {pass && pass.isActive ? (
          <div className="text-xs space-y-1 bg-slate-800 p-2.5 rounded-lg border border-slate-700">
            <p className="text-emerald-400 font-bold">✓ 이용권 정상 적용 중 ({pass.passType})</p>
            <p className="text-slate-300">유효기간: {new Date(pass.expiresAt).toLocaleString('ko-KR')}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            현재 미인증 상태입니다. 출국 전 4,900원 패스 등록을 권장합니다.
          </p>
        )}
      </div>
    </div>
  );
};
