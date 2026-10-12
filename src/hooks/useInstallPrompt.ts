import { useEffect, useState } from 'react';

/**
 * iOS Safari nunca dispara 'beforeinstallprompt' (ni en móvil ni en Mac) —
 * solo Chrome/Edge lo hacen, en escritorio y Android por igual. Por eso
 * platform distingue 'ios' (solo instrucciones manuales) de 'other'
 * (prompt nativo cuando el navegador lo soporta).
 */
export type InstallPlatform = 'ios' | 'other';

/**
 * En iOS los pasos cambian según el navegador: Safari tiene Compartir abajo
 * (o dentro de "···" en iOS 26), Chrome/Edge arriba junto a la dirección, y
 * los navegadores dentro de otras apps (Google, Instagram, TikTok, Facebook…)
 * no permiten añadir a pantalla de inicio en absoluto — ahí solo cabe pedir
 * que abran la web en Safari.
 */
export type IosBrowser = 'safari' | 'chrome' | 'inapp';

interface InstallPromptState {
  platform: InstallPlatform;
  iosBrowser: IosBrowser;
  isStandalone: boolean;
  /** Listo para disparar `promptInstall()` — solo aplica a 'other'. */
  canPromptInstall: boolean;
  promptInstall: () => Promise<void>;
}

const IN_APP_UA = /GSA\/|Instagram|FBAN|FBAV|FBIOS|musical_ly|TikTok|BytedanceWebview|LinkedInApp|Twitter|Snapchat|Pinterest|Line\/|FxiOS|DuckDuckGo/;

function detectIosBrowser(ua: string): IosBrowser {
  if (IN_APP_UA.test(ua)) return 'inapp';
  if (/CriOS|EdgiOS/.test(ua)) return 'chrome';
  // Un WebView embebido sin token propio tampoco lleva "Safari/" en el UA.
  if (!/Safari\//.test(ua)) return 'inapp';
  return 'safari';
}

export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // iPadOS 13+ se anuncia como Mac: se distingue por la pantalla táctil.
  const [platform] = useState<InstallPlatform>(() =>
    /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : 'other');

  const [iosBrowser] = useState<IosBrowser>(() => detectIosBrowser(navigator.userAgent));

  // Calculado una vez: no hay evento que avise de un cambio de display-mode
  // durante la vida de la pestaña, así que recalcularlo en cada render no
  // gana nada.
  const [isStandalone] = useState(() =>
    ('standalone' in navigator && (navigator as any).standalone)
    || window.matchMedia('(display-mode: standalone)').matches);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return { platform, iosBrowser, isStandalone, canPromptInstall: !!deferredPrompt, promptInstall };
}
