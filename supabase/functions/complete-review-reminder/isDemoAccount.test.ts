import { describe, it, expect } from 'vitest';
import { isDemoAccount } from './isDemoAccount';

describe('isDemoAccount', () => {
  it('flags the known Apple review demo accounts', () => {
    expect(isDemoAccount('demo.organizador@xpeak.es')).toBe(true);
    expect(isDemoAccount('demo.profesional@xpeak.es')).toBe(true);
  });

  it('flags any email starting with demo. on the xpeak.es domain', () => {
    expect(isDemoAccount('demo.otro@xpeak.es')).toBe(true);
  });

  it('does not flag a real user email', () => {
    expect(isDemoAccount('gonzalo.dj@gmail.com')).toBe(false);
    expect(isDemoAccount('organizador.real@xpeak.es')).toBe(false);
  });
});
