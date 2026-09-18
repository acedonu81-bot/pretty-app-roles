import { describe, it, expect } from 'vitest';
import { clay } from '../clayTokens';

describe('clay tokens', () => {
  it('define radios crecientes', () => {
    expect(clay.radius.sm).toBeLessThan(clay.radius.md);
    expect(clay.radius.md).toBeLessThan(clay.radius.lg);
    expect(clay.radius.lg).toBeLessThan(clay.radius.xl);
  });

  it('usa los colores de marca existentes, no inventa nuevos', () => {
    expect(clay.accent.gold).toBe('#D4AF37');
    expect(clay.accent.goldDeep).toBe('#B8941E');
    expect(clay.accent.green).toBe('#16a34a');
  });
});
