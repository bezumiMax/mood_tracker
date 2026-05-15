import React from 'react';
import { moodToScore } from '../utils/moodClassifier';

const W = 320;
const H = 120;
const PAD = 16;

export function MoodChart({ entries }) {
  if (entries.length < 2) {
    return (
      <div className="chart-placeholder">
        <span>Добавьте хотя бы 2 записи для графика</span>
      </div>
    );
  }

  const data = entries.slice(-10); // last 10 entries
  const scores = data.map((e) => moodToScore(e.moodLabel));
  const minS = 1;
  const maxS = 7;
  const chartW = W - PAD * 2;
  const chartH = H - PAD * 2;

  const toX = (i) => PAD + (i / (data.length - 1)) * chartW;
  const toY = (s) => PAD + chartH - ((s - minS) / (maxS - minS)) * chartH;

  const linePath = scores
    .map((s, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(s)}`)
    .join(' ');

  const areaPath =
    linePath +
    ` L ${toX(scores.length - 1)} ${H - PAD} L ${toX(0)} ${H - PAD} Z`;

  return (
    <svg className="mood-chart" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C83FD" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7C83FD" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid lines */}
      {[1, 2, 3, 4, 5, 6, 7].map((s) => (
        <line
          key={s}
          x1={PAD} y1={toY(s)}
          x2={W - PAD} y2={toY(s)}
          stroke="#ffffff18"
          strokeWidth="1"
        />
      ))}

      {/* area fill */}
      <path d={areaPath} fill="url(#chartGrad)" />

      {/* line */}
      <path d={linePath} fill="none" stroke="#7C83FD" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* dots */}
      {scores.map((s, i) => (
        <circle
          key={i}
          cx={toX(i)}
          cy={toY(s)}
          r="4"
          fill={data[i].color}
          stroke="#1a1a2e"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
