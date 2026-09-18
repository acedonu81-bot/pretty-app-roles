import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/capacitor', () => ({ isNative: false }));
vi.mock('@capacitor/haptics', () => ({
  Haptics: { impact: vi.fn() },
  ImpactStyle: { Light: 'LIGHT', Medium: 'MEDIUM' },
}));

import { haptics } from '../haptics';
import { Haptics } from '@capacitor/haptics';

describe('haptics en web', () => {
  it('no llama a Haptics.impact cuando no es nativo', async () => {
    await haptics.tap();
    expect(Haptics.impact).not.toHaveBeenCalled();
  });
});
