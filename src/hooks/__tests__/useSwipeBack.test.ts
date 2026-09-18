import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('@/lib/capacitor', () => ({ isNative: true, isIOS: true }));

import { useSwipeBack } from '../useSwipeBack';

describe('useSwipeBack', () => {
  it('llama onBack cuando el swipe supera el umbral desde el borde izquierdo', () => {
    const onBack = vi.fn();
    renderHook(() => useSwipeBack(onBack));

    const start = new TouchEvent('touchstart', {
      touches: [{ clientX: 5, clientY: 300 } as Touch],
    });
    const end = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 140, clientY: 300 } as Touch],
    });
    window.dispatchEvent(start);
    window.dispatchEvent(end);

    expect(onBack).toHaveBeenCalled();
  });

  it('no llama onBack si el swipe no empieza en el borde', () => {
    const onBack = vi.fn();
    renderHook(() => useSwipeBack(onBack));

    const start = new TouchEvent('touchstart', {
      touches: [{ clientX: 200, clientY: 300 } as Touch],
    });
    const end = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 340, clientY: 300 } as Touch],
    });
    window.dispatchEvent(start);
    window.dispatchEvent(end);

    expect(onBack).not.toHaveBeenCalled();
  });
});
