// DisasterGuard JP - Offline Compass & Bearing Needle Guide Component
import React, { useState, useEffect } from 'react';
import { Compass, Navigation, ArrowUpRight } from 'lucide-react';
import { JapanShelter } from '../types/disaster';

interface OfflineCompassProps {
  shelter: JapanShelter;
  userLat: number;
  userLng: number;
}

export const OfflineCompass: React.FC<OfflineCompassProps> = ({
  shelter,
  userLat,
  userLng
}) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasOrientationSensor, setHasOrientationSensor] = useState<boolean>(false);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = e.alpha || 0;
      if ((e as any).webkitCompassHeading) {
        // iOS Safari webkitCompassHeading
        heading = (e as any).webkitCompassHeading;
      }
      setDeviceHeading(heading);
      setHasOrientationSensor(true);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const targetBearing = shelter.bearingDegrees || 0;
  // Needle rotation relative to device heading
  const needleRotation = (targetBearing - deviceHeading + 360) % 360;

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold text-sm text-slate-100 font-['Atkinson_Hyperlegible_Next']">
            오프라인 나침반 방위 가이드
          </h4>
        </div>
        <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
          방위각 {targetBearing}° ({shelter.bearingDirectionKo || '북'})
        </span>
      </div>

      {/* Visual Compass Circle */}
      <div className="flex flex-col items-center justify-center py-3">
        <div className="relative w-40 h-40 rounded-full border-4 border-slate-700 bg-slate-950 flex items-center justify-center shadow-inner">
          {/* Compass Dial Cardinal Marks */}
          <span className="absolute top-1 text-[11px] font-bold text-red-500">N</span>
          <span className="absolute bottom-1 text-[11px] font-bold text-slate-400">S</span>
          <span className="absolute left-2 text-[11px] font-bold text-slate-400">W</span>
          <span className="absolute right-2 text-[11px] font-bold text-slate-400">E</span>

          {/* Inner Grid Rings */}
          <div className="w-28 h-28 rounded-full border border-slate-800 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-slate-800/80" />
          </div>

          {/* Target Bearing Pointer Needle */}
          <div
            className="absolute w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${needleRotation}deg)` }}
          >
            <div className="flex flex-col items-center -mt-10">
              <Navigation className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-transparent" />
            </div>
          </div>

          {/* Center Pivot */}
          <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-red-600 z-10 shadow" />
        </div>

        <p className="text-xs text-slate-400 mt-2 text-center">
          목표 대피소: <span className="font-bold text-white">{shelter.nameKo}</span>
        </p>
      </div>

      {!hasOrientationSensor && (
        <p className="text-[11px] text-slate-400 text-center bg-slate-800/80 p-1.5 rounded">
          💡 나침반 센서 미작동 시 지정된 방위각({targetBearing}°) 방향으로 진행하세요.
        </p>
      )}
    </div>
  );
};
