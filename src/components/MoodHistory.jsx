import React from 'react';
import { MoodShape } from './MoodShape';

export function MoodHistory({ entries }) {
  if (!entries.length) {
    return (
      <div className="history-empty">
        <p>История пуста. Скажите «добавь хорошее настроение»</p>
      </div>
    );
  }

  return (
    <ul className="history-list">
      {[...entries].reverse().map((entry) => (
        <li key={entry.id} className="history-item">
          <MoodShape color={entry.color} shape={entry.shape} size={28} />
          <div className="history-item__info">
            <span className="history-item__text">{entry.text}</span>
            <span className="history-item__label" style={{ color: entry.color }}>
              {entry.moodLabel}
            </span>
          </div>
          <span className="history-item__time">{entry.time}</span>
        </li>
      ))}
    </ul>
  );
}
