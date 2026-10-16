import { useEffect } from 'react';
import { track } from '@/lib/track';

// Por qué se va la gente del anuncio de Instagram (12 oct 2026): la mitad sale
// de /auth en menos de 3 s y la otra mitad mira y se va sin tocar nada, pero
// solo se veía el page_view. Esto deja en analytics_events (vía auth_paso,
// ver track.ts) cuánto aguantan, hasta dónde bajan, qué tocan y qué hacen con
// el aviso de cookies. De un campo solo se guarda su nombre, nunca lo escrito.
// 1, 2 y 3 s (16 oct 2026): 103 de 365 sesiones no dejaron ni hito de 5 s ni
// salida (cierran el navegador de Instagram antes de que salga la petición),
// así que no se sabía si se iban a 1 s o a 4 s.
const HITOS_SEG = [1, 2, 3, 5, 10, 20, 40, 60];
const MAX_TOQUES = 8;

export function estadoCookies(): string {
  try {
    const raw = localStorage.getItem('xpeak-cookie-consent');
    if (!raw) return 'pendiente';
    return JSON.parse(raw)?.marketing ? 'todas' : 'necesarias';
  } catch {
    return 'desconocido';
  }
}

// Texto corto del elemento tocado. track() une las props con espacios, así
// que los espacios del texto pasan a "_" para poder separarlas luego.
export function etiquetaToque(el: Element | null): string {
  const t = el?.closest('button, a, input, select, textarea, label, [role="button"]');
  if (!t) return 'fondo';
  if (t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement) {
    return `campo:${t.name || t.id || t.getAttribute('autocomplete') || t.type}`;
  }
  const texto = (t.getAttribute('aria-label') || (t as HTMLElement).innerText || t.textContent || '').replace(/\s+/g, '_').replace(/^_|_$/g, '');
  return (texto || t.tagName.toLowerCase()).slice(0, 30);
}

export function useMedirPermanencia() {
  useEffect(() => {
    const t0 = performance.now();
    let scrollMax = 0;
    let toques = 0;
    let salidaEnviada = false;
    const seg = () => Math.round((performance.now() - t0) / 1000);
    const resumen = () => ({ seg: seg(), scroll: scrollMax, cookies: estadoCookies(), toques });

    const onScroll = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      if (alto > 0) scrollMax = Math.max(scrollMax, Math.min(100, Math.round((window.scrollY / alto) * 100)));
    };
    const onToque = (e: PointerEvent) => {
      toques += 1;
      if (toques <= MAX_TOQUES) track('auth_toque', { en: etiquetaToque(e.target as Element), seg: seg() });
    };
    // Al cerrar el navegador de Instagram la petición puede no llegar: por eso
    // los hitos de "sigue" son la medida fiable y esto solo afina.
    const salir = () => {
      if (salidaEnviada) return;
      salidaEnviada = true;
      track('auth_salida', resumen());
    };
    const onVisibilidad = () => { if (document.visibilityState === 'hidden') salir(); };

    const timers = HITOS_SEG.map(s => window.setTimeout(() => {
      if (document.visibilityState === 'visible') track('auth_sigue', resumen());
    }, s * 1000));
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerdown', onToque, { capture: true, passive: true });
    document.addEventListener('visibilitychange', onVisibilidad);
    window.addEventListener('pagehide', salir);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', onToque, { capture: true });
      document.removeEventListener('visibilitychange', onVisibilidad);
      window.removeEventListener('pagehide', salir);
    };
  }, []);
}
