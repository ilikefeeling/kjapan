import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

export const TypingText: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => {
  const frame = useCurrentFrame();
  const textLength = text.length;
  // Type 1 character every 2 frames
  const charactersToShow = Math.floor(frame / 2);
  const visibleText = text.substring(0, charactersToShow);

  return (
    <div style={{ fontFamily: 'sans-serif', ...style }}>
      {visibleText}
    </div>
  );
};
