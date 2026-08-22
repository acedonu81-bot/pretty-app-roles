import { useEffect, useRef, useId } from 'react';

// Site key pública de Cloudflare Turnstile — no es secreta, va en el bundle
// cliente por diseño (la validación real ocurre server-side en Supabase Auth
// con la secret key, configurada aparte). Widget "XPEAK" en dash.cloudflare.com.
const SITE_KEY = '0x4AAAAAAES-SGRo3OYf-18L';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Turnstile'));
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

interface Props {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

/** Widget invisible/managed de Cloudflare Turnstile — anti-bot en login/registro. */
export default function TurnstileWidget({ onVerify, onExpire }: Props) {
  const containerId = `turnstile-${useId().replace(/:/g, '')}`;
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTurnstileScript().then(() => {
      if (cancelled || !window.turnstile) return;
      const el = document.getElementById(containerId);
      if (!el) return;
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        callback: onVerify,
        'expired-callback': onExpire,
      });
    }).catch(() => { /* si falla la carga, el submit fallará server-side con mensaje claro */ });
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId]);

  return <div id={containerId} className="flex justify-center my-2" />;
}
