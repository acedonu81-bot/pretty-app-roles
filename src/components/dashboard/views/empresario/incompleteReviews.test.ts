import { describe, it, expect } from 'vitest';
import { isReviewIncomplete } from './HistorialTab';

describe('isReviewIncomplete', () => {
  it('is incomplete if any of the three answers is null', () => {
    expect(isReviewIncomplete({ llego_puntual: null, cumplio_acordado: true, volveria_contratar: true })).toBe(true);
  });

  it('is complete when all three answers are present', () => {
    expect(isReviewIncomplete({ llego_puntual: true, cumplio_acordado: false, volveria_contratar: true })).toBe(false);
  });
});
