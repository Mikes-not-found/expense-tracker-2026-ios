/**
 * FloatingEmojis — CSS animated floating emoji background layer.
 * Recreates the kawaii float-up animation using CSS @keyframes.
 */
import React, { useMemo } from 'react';

const EMOJIS = [
  '\u{1F375}', '\u{1F338}', '\u{1F496}', '\u2728', '\u{1F33F}',
  '\u{1F343}', '\u{1F33A}', '\u{1F49D}', '\u{1F337}', '\u{1F380}',
  '\u{1F33C}', '\u{1F497}', '\u{1F33B}', '\u{1F390}', '\u{1F308}',
  '\u{1F4AB}', '\u{1F98B}', '\u{1F340}', '\u2B50', '\u{1F319}',
];

interface EmojiConfig {
  emoji: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

export const FloatingEmojis: React.FC = () => {
  const configs = useMemo<EmojiConfig[]>(() =>
    EMOJIS.map((emoji) => ({
      emoji,
      left: `${Math.random() * 95}%`,
      size: 14 + Math.random() * 14,
      duration: 25 + Math.random() * 25,
      delay: 5 + Math.random() * 20,
    })),
    []
  );

  return (
    <div style={containerStyle}>
      {configs.map((config, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: config.left,
            bottom: '-40px',
            fontSize: config.size,
            animation: `floatUp ${config.duration}s ${config.delay}s linear infinite`,
            pointerEvents: 'none',
          }}
        >
          {config.emoji}
        </span>
      ))}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  zIndex: 1,
  pointerEvents: 'none',
};
