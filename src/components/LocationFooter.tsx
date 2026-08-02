import React, { useState, useEffect, useRef } from 'react';
import { Navigation, RefreshCw, MapPin, Globe as GlobeIcon } from 'lucide-react';

interface LocationFooterProps {
  locationKr: string;
  locationJp: string;
  lat: number;
  lng: number;
  onRefreshGps: () => void;
  onChangeLocationPreset?: (city: 'tokyo' | 'osaka' | 'kyoto' | 'fukuoka') => void;
}

export const LocationFooter: React.FC<LocationFooterProps> = ({
  locationKr,
  locationJp,
  lat,
  lng,
  onRefreshGps,
  onChangeLocationPreset
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic script loader to bypass npm install network errors
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    let mounted = true;
    
    // Load three.js then globe.gl
    Promise.all([
      loadScript('https://unpkg.com/three@0.147.0/build/three.min.js'),
    ]).then(() => {
      return loadScript('https://unpkg.com/globe.gl@2.28.0/dist/globe.gl.min.js');
    }).then(() => {
      if (!mounted || !containerRef.current) return;
      
      const Globe = (window as any).Globe;
      if (!Globe) return;
      
      if (!globeInstanceRef.current) {
        // Initialize vanilla Globe
        const myGlobe = Globe()(containerRef.current)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
          .pointLat('lat')
          .pointLng('lng')
          .pointColor('color')
          .pointAltitude(0.1)
          .pointRadius(0.5)
          .pointsMerge(false);
          
        globeInstanceRef.current = myGlobe;
        
        // Match container size
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight || 250;
        myGlobe.width(width).height(height);
        
        // Resize observer
        const resizeObserver = new ResizeObserver(entries => {
          if (entries[0] && entries[0].contentRect) {
            myGlobe.width(entries[0].contentRect.width).height(entries[0].contentRect.height);
          }
        });
        resizeObserver.observe(containerRef.current);
        (myGlobe as any).__resizeObserver = resizeObserver; // Stash it for cleanup
      }
      
      // Update location and autoRotate
      const myGlobe = globeInstanceRef.current;
      myGlobe.pointsData([{ lat, lng, size: 20, color: 'red' }]);
      myGlobe.pointOfView({ lat, lng, altitude: 0.8 }, 1200);
      myGlobe.controls().autoRotate = true;
      myGlobe.controls().autoRotateSpeed = 0.5;
    });

    return () => {
      mounted = false;
      if (globeInstanceRef.current) {
        const obs = (globeInstanceRef.current as any).__resizeObserver;
        if (obs) obs.disconnect();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        globeInstanceRef.current = null;
      }
    };
  }, []);

  // Sync location changes when lat/lng changes after initial load
  useEffect(() => {
    if (globeInstanceRef.current) {
      const myGlobe = globeInstanceRef.current;
      myGlobe.pointsData([{ lat, lng, size: 20, color: 'red' }]);
      myGlobe.pointOfView({ lat, lng, altitude: 0.8 }, 1200);
    }
  }, [lat, lng]);

  return (
    <footer className="pt-6 pb-6 flex flex-col items-center gap-3 border-t border-[#c5c6cd]/30 mt-6 w-full">
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-1.5 text-[#45474c]">
          <GlobeIcon className="w-4 h-4 text-amber-600" />
          <span className="font-bold text-[13px]">실시간 3D 위치 트래킹</span>
        </div>
        <button
          onClick={onRefreshGps}
          className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-full text-[11px] font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <RefreshCw className="w-3 h-3" />
          <span>위치 갱신</span>
        </button>
      </div>

      {/* 3D Globe Container */}
      <div className="w-full h-[250px] rounded-2xl overflow-hidden bg-black shadow-inner relative flex justify-center items-center pointer-events-auto">
        <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-move" />
        
        {/* Overlay Location Text */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20 flex flex-col items-center text-center transition-all pointer-events-none">
          <p className="font-extrabold text-[18px] text-[#091426] tracking-tight">{locationKr}</p>
          <p className="text-[11px] font-medium text-gray-600">{locationJp} ({lat.toFixed(4)}, {lng.toFixed(4)})</p>
        </div>
      </div>

      {/* Travel Preset Switcher for testing offline shelters in different cities */}
      {onChangeLocationPreset && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 bg-gray-100 p-2 rounded-xl text-[11px] font-bold text-gray-700 w-full">
          <MapPin className="w-3.5 h-3.5 text-gray-500 mr-1" />
          <button
            onClick={() => onChangeLocationPreset('tokyo')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${locationKr.includes('도쿄') ? 'bg-[#091426] text-white shadow' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
          >
            도쿄 시부야
          </button>
          <button
            onClick={() => onChangeLocationPreset('osaka')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${locationKr.includes('오사카') ? 'bg-[#091426] text-white shadow' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
          >
            오사카 난바
          </button>
          <button
            onClick={() => onChangeLocationPreset('fukuoka')}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${locationKr.includes('후쿠오카') ? 'bg-[#091426] text-white shadow' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
          >
            후쿠오카
          </button>
        </div>
      )}
    </footer>
  );
};
