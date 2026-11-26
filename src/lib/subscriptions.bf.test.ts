import { describe, it, expect } from 'vitest';
import { diasRestantesBlackFriday } from './subscriptions';

describe('diasRestantesBlackFriday', () => {
  it('26 nov por la tarde: quedan 4 días', () => {
    expect(diasRestantesBlackFriday(new Date('2026-11-26T14:14:00Z'))).toBe('Quedan 4 días');
  });
  it('29 nov a media tarde: queda 1 día', () => {
    expect(diasRestantesBlackFriday(new Date('2026-11-29T20:00:00Z'))).toBe('Queda 1 día');
  });
  it('30 nov: último día', () => {
    expect(diasRestantesBlackFriday(new Date('2026-11-30T10:00:00Z'))).toBe('Último día');
  });
});
