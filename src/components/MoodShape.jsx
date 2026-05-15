import React from 'react';

// Renders the colored shape next to each mood entry
export function MoodShape({ color, shape, size = 24 }) {
  if (shape === 'star') {
    const r = size / 2;
    const cx = r;
    const cy = r;
    const points = Array.from({ length: 5 }, (_, i) => {
      const outer = ((i * 72 - 90) * Math.PI) / 180;
      const inner = ((i * 72 - 90 + 36) * Math.PI) / 180;
      const ox = cx + r * Math.cos(outer);
      const oy = cy + r * Math.sin(outer);
      const ix = cx + (r * 0.4) * Math.cos(inner);
      const iy = cy + (r * 0.4) * Math.sin(inner);
      return `${ox},${oy} ${ix},${iy}`;
    }).join(' ');

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon points={points} fill={color} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill={color} />
    </svg>
  );
}
