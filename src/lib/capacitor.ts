import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';

export const isNative = Capacitor.isNativePlatform();
export const isIOS = Capacitor.getPlatform() === 'ios';
export const isAndroid = Capacitor.getPlatform() === 'android';

/**
 * Call once on app mount. Sets up native chrome, keyboard behavior,
 * and the Android hardware back button.
 */
export async function initCapacitor(onBack?: () => boolean) {
  if (!isNative) return;

  // Status bar — dark background to match XPEAK theme
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#080808' });
    if (isAndroid) {
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch { /* ignore on web */ }

  // Keyboard — push content up instead of overlapping
  try {
    await Keyboard.setAccessoryBarVisible({ isVisible: false });
  } catch { /* ignore on web */ }

  // Android hardware back button
  App.addListener('backButton', ({ canGoBack }) => {
    const handled = onBack?.();
    if (!handled) {
      if (canGoBack) {
        window.history.back();
      } else {
        App.minimizeApp();
      }
    }
  });

  // Hide splash after app is ready
  await SplashScreen.hide({ fadeOutDuration: 300 });
}

/**
 * Returns safe-area insets as CSS custom properties string.
 * Use on the root element when running natively.
 */
export function safeAreaStyle(): React.CSSProperties {
  if (!isNative) return {};
  return {
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  } as React.CSSProperties;
}
