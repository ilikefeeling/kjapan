import React, { useState, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { HeroSafetyCard } from '../../src/components/HeroSafetyCard';
import '../../src/index.css'; // Import the main app's Tailwind CSS

export const SimulationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create a mock alert for the simulation
  const mockAlert = {
    alertId: 'SIM-001',
    disasterType: 'EARTHQUAKE' as const,
    alertLevel: 'DANGER' as const,
    locationKr: '도쿄도 시부야구',
    intensityKr: '진도 5+',
    pushTitle: '[JMA 실시간 속보] 일본 현지 진도 5+ 지진 경보',
    pushBody: '강한 지진 진동 감지! 즉시 머리를 보호하고 오프라인 대피소 위치를 확인하세요.',
    actionGuideKr: [
      '머리를 방석이나 가방으로 보호하고 책상 밑으로 대피하세요.',
      '진동 정지 후 앱의 오프라인 지도에서 최단거리 대피소로 이동하세요.'
    ],
    timestamp: new Date().toISOString()
  };

  // State to toggle alert visibility to simulate the "pop-up" effect
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Show the alert at frame 30 (1 second in)
    if (frame >= 30) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#fbf8fa', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '400px', transform: 'scale(2.5)' }}>
        <HeroSafetyCard 
          currentAlert={showAlert ? mockAlert : null} 
          onFindShelter={() => {}} 
          onStopAudio={() => {}} 
          isAudioPlaying={showAlert} 
        />
      </div>
    </AbsoluteFill>
  );
};
