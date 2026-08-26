import { useEffect, useRef, useId, useState } from 'react';
import { RefreshCw } from 'lucide-react';

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

/**
 * Widget invisible/managed de Cloudflare Turnstile — anti-bot en login/registro.
 *
 * Sin timeout ni fallback, un usuario cuyo adblocker/VPN/red corporativa bloquea
 * challenges.cloudflare.com (o el script tarda/nunca resuelve) se queda mirando
 * un botón "Verificando seguridad…" deshabilitado para siempre, sin ninguna pista
 * de qué pasó ni qué hacer — probable causa de gente que entra a /auth y abandona
 * sin registrarse. Tras STALL_MS sin señal, se ofrece recargar el widget.
 */
const STALL_MS = 8000;

export default function TurnstileWidget({ onVerify, onExpire }: Props) {
  const containerId = `turnstile-${useId().replace(/:/g, '')}`;
  const widgetIdRef = useRef<string | null>(null);
  const [stalled, setStalled] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStalled(false);
    const stallTimer = setTimeout(() => { if (!cancelled) setStalled(true); }, STALL_MS);

    loadTurnstileScript().then(() => {
      if (cancelled || !window.turnstile) return;
      const el = document.getElementById(containerId);
      if (!el) return;
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: SITE_KEY,
        callback: (token: string) => { clearTimeout(stallTimer); setStalled(false); onVerify(token); },
        'expired-callback': onExpire,
        'error-callback': () => { if (!cancelled) setStalled(true); },
      });
    }).catch(() => { if (!cancelled) setStalled(true); });

    return () => {
      cancelled = true;
      clearTimeout(stallTimer);
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, retryKey]);

  return (
    <div className="flex flex-col items-center gap-2 my-2">
      <div id={containerId} className="flex justify-center" />
      {stalled && (
        <button
          type="button"
          onClick={() => setRetryKey(k => k + 1)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all hover:scale-105"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: '#8A6D0F' }}>
          <RefreshCw size={12} /> La verificación de seguridad no responde — pulsa para reintentar
        </button>
      )}
    </div>
  );
}
