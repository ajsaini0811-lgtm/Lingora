export interface SM2Card {
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date;
}

export function sm2(card: SM2Card, quality: 0 | 1 | 2 | 3 | 4 | 5): SM2Card {
  let { interval, repetitions, easeFactor } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, repetitions, easeFactor, nextReview };
}
