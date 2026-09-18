import { useEffect, useRef } from 'react';
import { isNative, isIOS } from '@/lib/capacitor';

const EDGE_ZONE_PX = 24;
const SWIPE_THRESHOLD_PX = 80;

/**
 * Gesto de swipe-back desde el borde izquierdo, equivalente al back
 * gesture nativo de iOS. En Android el botón físico ya lo cubre
 * initCapacitor's backButton listener — este hook es solo iOS.
 */
export function useSwipeBack(onBack: () => void): void {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!isNative || !isIOS) return;

    function handleStart(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch.clientX <= EDGE_ZONE_PX) {
        startX.current = touch.clientX;
        startY.current = touch.clientY;
      } else {
        startX.current = null;
      }
    }

    function handleEnd(e: TouchEvent) {
      if (startX.current === null) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = Math.abs(touch.clientY - (startY.current ?? 0));
      if (deltaX > SWIPE_THRESHOLD_PX && deltaY < 60) {
        onBack();
      }
      startX.current = null;
    }

    window.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('touchend', handleEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [onBack]);
}
