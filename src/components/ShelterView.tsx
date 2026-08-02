// DisasterGuard JP - Offline Shelter Finder & Navigation View
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, AlertCircle, Building2, School, Trees, Waves, ShieldAlert, Filter, Search } from 'lucide-react';
import { JapanShelter, UserLocation } from '../types/disaster';
import { JAPAN_OFFLINE_SHELTERS } from '../data/japanShelters';
import { offlineDb } from '../lib/offlineDb';
import { getSortedSheltersByDistance, formatDistanceString } from '../utils/haversine';
import { OfflineCompass } from './OfflineCompass';

interface ShelterViewProps {
  userLocation: UserLocation;
  onChangeUserLocation: (lat: number, lng: number, prefName: string) => void;
}

const PREFECTURE_PRESETS = [
  { code: '13', name: '도쿄도 (Shibuya/Shinjuku)', lat: 35.6620, lng: 139.7022 },
  { code: '27', name: '오사카부 (Namba/Dotonbori)', lat: 34.6611, lng: 135.4952 },
  { code: '26', name: '교토부 (Kyoto Station)', lat: 34.9868, lng: 135.7483 },
  { code: '40', name: '후쿠오카현 (Hakata/Tenjin)', lat: 33.5960, lng: 130.4072 },
  { code: '01', name: '홋카이도 (Sapporo Odori)', lat: 43.0601, lng: 141.3533 },
  { code: '47', name: '오키나와현 (Naha)', lat: 26.2085, lng: 127.7020 }
];

export const ShelterView: React.FC<ShelterViewProps> = ({
  userLocation,
  onChangeUserLocation
}) => {
  const [shelters, setShelters] = useState<JapanShelter[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>('ALL');
  const [selectedShelter, setSelectedShelter] = useState<JapanShelter | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCompass, setShowCompass] = useState<boolean>(false);

  useEffect(() => {
    async function loadShelterData() {
      await offlineDb.seedDatabaseIfEmpty();
      const loaded = await offlineDb.getAllShelters();
      setShelters(loaded);
    }
    loadShelterData();
  }, []);

  // Compute Haversine distances & sort
  const sortedShelters = getSortedSheltersByDistance(
    userLocation.lat,
    userLocation.lng,
    shelters
  );

  const filteredShelters = sortedShelters.filter((s) => {
    const matchesPref = selectedPrefecture === 'ALL' || s.prefectureCode === selectedPrefecture;
    const matchesSearch =
      s.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameJa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cityKo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPref && matchesSearch;
  });

  const top3Shelters = sortedShelters.slice(0, 3);

  const getShelterIcon = (type: JapanShelter['shelterType']) => {
    switch (type) {
      case 'PARK':
        return <Trees className="w-5 h-5 text-emerald-600" />;
      case 'SCHOOL':
        return <School className="w-5 h-5 text-blue-600" />;
      case 'TSUNAMI_TOWER':
        return <Waves className="w-5 h-5 text-cyan-600" />;
      default:
        return <Building2 className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Banner & Current Location Selector */}
      <div className="bg-[#091426] text-white p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <h2 className="font-extrabold text-base font-['Atkinson_Hyperlegible_Next'] text-white">
              오프라인 대피소 (IndexedDB GeoJSON)
            </h2>
          </div>
          <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-800">
            {shelters.length}곳 오프라인 DB 저장됨
          </span>
        </div>

        {/* GPS Position Selector Switcher */}
        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
          <p className="text-[11px] text-slate-400 font-medium">현재 GPS 설정 위치:</p>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {PREFECTURE_PRESETS.map((p) => (
              <button
                key={p.code}
                onClick={() => onChangeUserLocation(p.lat, p.lng, p.name)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all border ${
                  userLocation.prefectureKo.includes(p.name.split(' ')[0])
                    ? 'bg-red-600 text-white border-red-500 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Nearest Shelters Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-['Plus_Jakarta_Sans'] flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-red-600" />
            현재 위치 기준 최단거리 오프라인 대피소 Top 3
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {top3Shelters.map((shelter, idx) => (
            <div
              key={shelter.id}
              onClick={() => setSelectedShelter(shelter)}
              className="bg-white rounded-xl p-3.5 border-2 border-slate-200 hover:border-[#091426] transition-all cursor-pointer shadow-sm relative overflow-hidden"
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  최단거리 추천
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {getShelterIcon(shelter.shelterType)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 font-['Atkinson_Hyperlegible_Next']">
                      {shelter.nameKo}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">{shelter.nameJa}</p>
                    <p className="text-xs text-slate-600 mt-1">{shelter.addressKo}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-[#DC2626] font-mono block">
                    {formatDistanceString(shelter.distanceMeters || 0)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    방위 {shelter.bearingDirectionKo} ({shelter.bearingDegrees}°)
                  </span>
                </div>
              </div>

              {/* Facility Chips */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1 text-[11px] text-slate-600">
                {shelter.facilities.aed && (
                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                    AED 보유
                  </span>
                )}
                {shelter.facilities.waterSupply && (
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                    비상급수
                  </span>
                )}
                {shelter.facilities.powerGenerator && (
                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                    자가발전
                  </span>
                )}
                {shelter.facilities.multilingualStaff && (
                  <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">
                    다국어 지원
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Full Shelter List */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="대피소 이름 또는 지역 검색 (예: 시부야, 난바)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#091426]"
            />
          </div>

          {/* Prefecture Dropdown */}
          <select
            value={selectedPrefecture}
            onChange={(e) => setSelectedPrefecture(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium"
          >
            <option value="ALL">전체 지역 (전국)</option>
            <option value="13">도쿄도 (Tokyo)</option>
            <option value="27">오사카부 (Osaka)</option>
            <option value="26">교토부 (Kyoto)</option>
            <option value="40">후쿠오카현 (Fukuoka)</option>
            <option value="01">홋카이도 (Sapporo)</option>
            <option value="47">오키나와현 (Okinawa)</option>
          </select>
        </div>

        {/* List of Shelters */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredShelters.map((shelter) => (
            <div
              key={shelter.id}
              onClick={() => setSelectedShelter(shelter)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                selectedShelter?.id === shelter.id
                  ? 'border-[#091426] bg-slate-50 ring-1 ring-[#091426]'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-100">
                  {getShelterIcon(shelter.shelterType)}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">{shelter.nameKo}</h5>
                  <p className="text-[11px] text-slate-500">{shelter.addressKo}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-extrabold text-xs text-red-600 font-mono block">
                  {formatDistanceString(shelter.distanceMeters || 0)}
                </span>
                <span className="text-[10px] text-slate-500">
                  {shelter.bearingDirectionKo}방향
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Shelter Modal / Compass Drawer */}
      {selectedShelter && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-4 space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-2">
              <div>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {selectedShelter.shelterType === 'PARK'
                    ? '광역 공원 대피소'
                    : selectedShelter.shelterType === 'TSUNAMI_TOWER'
                    ? '긴급 쓰나미 대피 타워'
                    : '지정 방재 대피소'}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1 font-['Atkinson_Hyperlegible_Next']">
                  {selectedShelter.nameKo}
                </h3>
                <p className="text-xs text-slate-500 font-mono">{selectedShelter.nameJa}</p>
              </div>
              <button
                onClick={() => setSelectedShelter(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Distance & Compass Button */}
            <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">현재 위치 기준 거리에 따른 이동</p>
                <p className="text-xl font-extrabold text-red-500 font-mono">
                  {formatDistanceString(selectedShelter.distanceMeters || 0)}
                  <span className="text-xs text-slate-300 ml-2 font-normal">
                    (방위각 {selectedShelter.bearingDegrees}° {selectedShelter.bearingDirectionKo})
                  </span>
                </p>
              </div>

              <button
                onClick={() => setShowCompass(!showCompass)}
                className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Compass className="w-4 h-4" />
                <span>{showCompass ? '나침반 닫기' : '나침반 보기'}</span>
              </button>
            </div>

            {/* Compass Embed if active */}
            {showCompass && (
              <OfflineCompass
                shelter={selectedShelter}
                userLat={userLocation.lat}
                userLng={userLocation.lng}
              />
            )}

            {/* Address & Facilities */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-700">
                📍 <span className="font-semibold">주소:</span> {selectedShelter.addressKo}
              </p>
              <p className="text-slate-700 font-mono">
                🏠 <span className="font-semibold">일어 주소:</span> {selectedShelter.addressJa}
              </p>
              <p className="text-slate-700">
                👥 <span className="font-semibold">수용 인원:</span> 약 {selectedShelter.capacity.toLocaleString()}명
              </p>

              <div className="pt-2 border-t">
                <p className="font-bold text-slate-800 mb-1.5">보유 구호 시설 및 장비:</p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AED 자동심장충격기</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>비상 급수시설</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>자가 비상발전기</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>응급 처치키트</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedShelter(null)}
              className="w-full py-2.5 bg-[#091426] text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
