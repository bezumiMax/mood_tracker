// Simple keyword-based mood classifier
const MOOD_MAP = [
  {
    label: 'радость',
    color: '#4CAF50',
    shape: 'circle',
    keywords: ['хорошее', 'радость', 'радостное', 'счастливое', 'счастье', 'отличное', 'прекрасное', 'весёлое', 'весело', 'классное', 'супер', 'замечательное', 'позитивное'],
  },
  {
    label: 'восторг',
    color: '#FFD700',
    shape: 'star',
    keywords: ['восторг', 'восторженное', 'воодушевление', 'великолепное', 'восхитительное', 'эйфория'],
  },
  {
    label: 'спокойствие',
    color: '#90CAF9',
    shape: 'circle',
    keywords: ['спокойное', 'спокойствие', 'нейтральное', 'обычное', 'нормальное', 'ровное', 'стабильное'],
  },
  {
    label: 'грусть',
    color: '#2196F3',
    shape: 'circle',
    keywords: ['грустное', 'грусть', 'плохое', 'тоскливое', 'тоска', 'печаль', 'печальное', 'унылое', 'уныние'],
  },
  {
    label: 'злость',
    color: '#F44336',
    shape: 'circle',
    keywords: ['злое', 'злость', 'раздражение', 'раздражённое', 'сердитое', 'злостное', 'агрессивное', 'ярость', 'бешенство'],
  },
  {
    label: 'тревога',
    color: '#FF9800',
    shape: 'circle',
    keywords: ['тревожное', 'тревога', 'беспокойное', 'беспокойство', 'нервное', 'нервозное', 'волнение', 'напряжённое'],
  },
  {
    label: 'усталость',
    color: '#9C27B0',
    shape: 'circle',
    keywords: ['усталое', 'усталость', 'вымотанное', 'утомлённое', 'разбитое', 'опустошённое'],
  },
];

const DEFAULT_MOOD = {
  label: 'нейтральное',
  color: '#9E9E9E',
  shape: 'circle',
};

export function classifyMood(text) {
  if (!text) return DEFAULT_MOOD;
  const lower = text.toLowerCase().trim();
  for (const mood of MOOD_MAP) {
    for (const kw of mood.keywords) {
      if (lower.includes(kw)) {
        return { label: mood.label, color: mood.color, shape: mood.shape };
      }
    }
  }
  return DEFAULT_MOOD;
}

// Map mood label to a numeric score for the chart (1-7, higher = more positive)
export function moodToScore(label) {
  const scores = {
    'злость': 1,
    'грусть': 2,
    'тревога': 3,
    'усталость': 3,
    'нейтральное': 4,
    'спокойствие': 5,
    'радость': 6,
    'восторг': 7,
  };
  return scores[label] ?? 4;
}
