import { describe, it, expect } from 'vitest';
import { reviewQuestionStats } from './PublicProfile';

describe('reviewQuestionStats', () => {
  it('returns an empty array when there are no reviews', () => {
    expect(reviewQuestionStats([])).toEqual([]);
  });

  it('excludes reviews with null answers from that question\'s denominator', () => {
    const reviews = [
      { llego_puntual: true, cumplio_acordado: true, volveria_contratar: true },
      { llego_puntual: null, cumplio_acordado: null, volveria_contratar: null },
    ];
    expect(reviewQuestionStats(reviews)).toEqual([
      { label: 'dice que llegó puntual', percent: 100 },
      { label: 'cumplió lo acordado', percent: 100 },
      { label: 'repetiría', percent: 100 },
    ]);
  });

  it('omits a question entirely if every review has it null', () => {
    const reviews = [{ llego_puntual: null, cumplio_acordado: true, volveria_contratar: true }];
    const stats = reviewQuestionStats(reviews);
    expect(stats.find((s) => s.label.includes('puntual'))).toBeUndefined();
    expect(stats).toHaveLength(2);
  });

  it('computes a mixed percentage', () => {
    const reviews = [
      { llego_puntual: true, cumplio_acordado: true, volveria_contratar: true },
      { llego_puntual: false, cumplio_acordado: true, volveria_contratar: true },
    ];
    expect(reviewQuestionStats(reviews)[0]).toEqual({ label: 'dice que llegó puntual', percent: 50 });
  });
});
