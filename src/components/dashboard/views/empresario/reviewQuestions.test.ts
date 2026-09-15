import { describe, it, expect } from 'vitest';
import { canSubmitReview } from './HistorialTab';

describe('canSubmitReview', () => {
  it('requires all three answers to be non-null', () => {
    expect(canSubmitReview(5, 'Buen trabajo', null, true, true)).toBe(false);
    expect(canSubmitReview(5, 'Buen trabajo', true, null, true)).toBe(false);
    expect(canSubmitReview(5, 'Buen trabajo', true, true, null)).toBe(false);
  });

  it('requires rating >= 1 and comment >= 5 chars, same as before', () => {
    expect(canSubmitReview(0, 'Buen trabajo', true, true, true)).toBe(false);
    expect(canSubmitReview(5, 'abc', true, true, true)).toBe(false);
  });

  it('passes when rating, comment and all three answers are present', () => {
    expect(canSubmitReview(5, 'Buen trabajo', true, false, true)).toBe(true);
  });
});
