import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ShelterGeoJSON } from '../types/jma';
import { findNearestSheltersOffline } from '../utils/offlineShelter';
import { JAPAN_SHELTERS_DATA } from '../data/shelters';
import { Navigation, MapPin, Shield, Compass, Phone, Sparkles, Filter, CheckCircle2, Download } from 'lucide-react';

interface ShelterMapModalProps {
  userLat: number;
  userLng: number;
  userLocationKr: string;
  isOnline: boolean;
  onClose?: () => void;
}

export const ShelterMapModal: React.FC<ShelterMapModalProps> = ({
  userLat,
  userLng,
  userLocationKr,
  isOnline,
  onClose
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [nearestShelters, setNearestShelters] = useState<ShelterGeoJSON[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<ShelterGeoJSON | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'EARTHQUAKE' | 'TSUNAMI'>('ALL');
  const [offlineCached, setOfflineCached] = useState<boolean>(true);

  // Initialize shelters based on Haversine distance
  useEffect(() => {
    let filtered = JAPAN_SHELTERS_DATA;
    if (filterType !== 'ALL') {
      filtered = JAPAN_SHELTERS_DATA.filter(s => s.shelterType === filterType || s.shelterType === 'GENERAL');
    }
    const computed = findNearestSheltersOffline(userLat, userLng, filtered, 6);
    setNearestShelters(computed);
    if (computed.length > 0 && !selectedShelter) {
      setSelectedShelter(computed[0]);
    }
  }, [userLat, userLng, filterType]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLng],
        zoom: 15,
        zoomControl: false,
        preferCanvas: true
      });

      // Add OpenStreetMap raster tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap & KJapan'
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([userLat, userLng], 15);
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom Icons
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `<div class="relative flex items-center justify-center">
        <div class="status-pulse absolute w-10 h-10 rounded-full bg-blue-500/30"></div>
        <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    // Add User Location Marker
    const userMarker = L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup(`<div class="font-bold text-xs">📍 현재 위치: ${userLocationKr}</div>`);
    markersRef.current.push(userMarker);

    // Add Shelter Markers
    nearestShelters.forEach((shelter) => {
      const isSelected = selectedShelter?.id === shelter.id;
      const markerColor = shelter.shelterType === 'TSUNAMI' ? 'bg-indigo-600' : 'bg-red-600';

      const shelterIcon = L.divIcon({
        className: 'custom-shelter-marker',
        html: `<div class="cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'scale-100'}">
          <div class="${markerColor} text-white font-extrabold text-[11px] px-2 py-1 rounded-lg border-2 border-white shadow-lg flex items-center gap-1">
            <span>🛡️ ${shelter.nameKr.slice(0, 8)}</span>
          </div>
        </div>`,
        iconSize: [120, 30],
        iconAnchor: [60, 15]
      });

      const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedShelter(shelter);
        });

      markersRef.current.push(marker);
    });

    // Draw routing line if shelter selected
    if (selectedShelter) {
      const line = L.polyline([
        [userLat, userLng],
        [selectedShelter.lat, selectedShelter.lng]
      ], {
        color: '#e02928',
        weight: 4,
        dashArray: '8, 8'
      }).addTo(map);

      markersRef.current.push(line as any);
    }

  }, [userLat, userLng, nearestShelters, selectedShelter]);

  return (
    <div className="space-y-4 pb-20">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-gray-200 card-shadow">
        <div>
          <h2 className="font-black text-[18px] text-[#091426] flex items-center gap-1.5">
            <Navigation className="w-5 h-5 text-red-600 fill-red-100" />
            <span>오프라인 대피소 지도</span>
          </h2>
          <p className="text-[12px] font-semibold text-gray-500">
            인터넷 끊김 시에도 로컬 IndexedDB 최단거리 알고리즘 동작
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>오프라인 캐시됨</span>
          </span>
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType('ALL')}
          className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-bold transition-all ${
            filterType === 'ALL' ? 'bg-[#091426] text-white shadow' : 'bg-white border border-gray-200 text-gray-700'
          }`}
        >
          전체 대피소 ({JAPAN_SHELTERS_DATA.length})
        </button>
        <button
          onClick={() => setFilterType('EARTHQUAKE')}
          className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-bold transition-all ${
            filterType === 'EARTHQUAKE' ? 'bg-red-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-700'
          }`}
        >
          지진 지정 대피소
        </button>
        <button
          onClick={() => setFilterType('TSUNAMI')}
          className={`flex-1 py-2 px-3 rounded-xl text-[12px] font-bold transition-all ${
            filterType === 'TSUNAMI' ? 'bg-indigo-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-700'
          }`}
        >
          쓰나미 대피 빌딩
        </button>
      </div>

      {/* Leaflet Map Canvas Box */}
      <div className="relative w-full h-[320px] rounded-xl overflow-hidden border-2 border-gray-300 card-shadow">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Offline Badge on Map */}
        <div className="absolute top-3 left-3 z-[400] bg-[#091426]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>오프라인 방위각 나침반 활성</span>
        </div>
      </div>

      {/* Selected Shelter Highlight Detail Card */}
      {selectedShelter && (
        <div className="bg-red-50/80 border-2 border-red-500 p-4 rounded-xl space-y-2 card-shadow">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                최단거리 {selectedShelter.distanceKm} km ({selectedShelter.bearing})
              </span>
              <h3 className="font-black text-[18px] text-gray-900 mt-1">{selectedShelter.nameKr}</h3>
              <p className="text-[12px] font-medium text-gray-600">{selectedShelter.nameJp} • {selectedShelter.addressJp}</p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShelter.lat},${selectedShelter.lng}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#091426] hover:bg-[#15233a] text-white font-bold text-[13px] px-3 py-2 rounded-lg flex items-center gap-1 shadow shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>길안내</span>
            </a>
          </div>

          {/* Facilities Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] font-bold bg-white text-gray-800 px-2 py-1 rounded border border-gray-200">
              👥 수용 인원: {selectedShelter.capacity.toLocaleString()}명
            </span>
            {selectedShelter.facilities.map((fac, idx) => (
              <span key={idx} className="text-[11px] font-bold bg-white text-emerald-800 px-2 py-1 rounded border border-emerald-200">
                ✓ {fac}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nearest Shelters List */}
      <div className="space-y-2">
        <h3 className="font-bold text-[14px] text-gray-700 px-1">
          📍 근처 대피소 목록 (Haversine 알고리즘 순)
        </h3>
        {nearestShelters.map((shelter) => {
          const isSelected = selectedShelter?.id === shelter.id;

          return (
            <div
              key={shelter.id}
              onClick={() => setSelectedShelter(shelter)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                isSelected
                  ? 'bg-red-50 border-red-500 card-shadow'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[15px] text-gray-900">{shelter.nameKr}</span>
                  <span className="text-[11px] font-bold text-gray-500">
                    {shelter.shelterType === 'TSUNAMI' ? '🌊 쓰나미 대피' : '🏢 지정 대피소'}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500">{shelter.addressJp}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-black text-[16px] text-red-600">{shelter.distanceKm} km</p>
                <p className="text-[11px] font-bold text-gray-500">{shelter.bearing}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
