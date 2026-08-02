import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';

export const PopText: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
    },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        fontFamily: 'sans-serif',
        textAlign: 'center',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
