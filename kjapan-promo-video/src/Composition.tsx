import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { PopText } from './components/PopText';
import { SimulationScene } from './SimulationScene';

export const Main: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      
      {/* CUT 1: Actual App Simulation (0 to 8s = 240 frames) */}
      <Sequence from={0} durationInFrames={240}>
        <SimulationScene />
      </Sequence>

      {/* CUT 2: End Card (8 to 11s = 90 frames) */}
      <Sequence from={240} durationInFrames={90}>
        <AbsoluteFill style={{ backgroundColor: '#091426', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <PopText text="일본 간다고?" style={{ color: '#ccc', fontSize: '60px', marginBottom: '20px' }} />
          <PopText text="이 어플은 깔고 가자" style={{ color: '#fff', fontSize: '90px', fontWeight: 'bold', marginBottom: '80px' }} />
          
          <div style={{ color: '#fff', fontSize: '50px', textDecoration: 'underline', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
            www.kjapan.site
          </div>
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
