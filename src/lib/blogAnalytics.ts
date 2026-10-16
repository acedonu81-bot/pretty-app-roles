// Eventos de conversión de los CTAs de blog (top, inline, scroll sticky, email capture).
// Empuja a dataLayer (GTM-PHXTFGXK, ver index.html) igual que CookieBanner.tsx —
// no se añade gtag propio, se reusa el mismo GTM que ya manda a GA4.
import { logEvent } from '@/lib/track';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type BlogCtaComponent = 'top' | 'inline' | 'scroll' | 'email_capture';

interface BlogCtaEventParams {
  component: BlogCtaComponent;
  /** rol/intent del CTA, ej. 'dj', 'staff_pro', 'contratar-dj', 'general' */
  role?: string;
  /** variante de copy, ej. 'default' | 'upgrade' | 'presupuestos' | 'plantilla' | 'guia' */
  variant?: string;
  /** destino del CTA, ej. '/auth?mode=register&role=dj' */
  href?: string;
  article_path?: string;
}

function pushDataLayer(event: string, params: Record<string, unknown>) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch {
    // no bloquear el flujo del CTA si dataLayer no está disponible
  }
}

/** Clic en cualquier botón/enlace de un CTA de blog. */
export function trackBlogCtaClick(params: BlogCtaEventParams) {
  pushDataLayer('blog_cta_click', params);
  // También a analytics_events (16 oct 2026): hasta hoy los clics de blog solo
  // iban a GTM/GA4 (con consentimiento) y no se sabía qué botón de qué
  // artículo funcionaba. 'cta_click' ya está en la lista de eventos de la BD.
  const detalle = `blog ${params.component} ${params.role ?? '-'} ${params.variant ?? '-'} > ${params.href ?? '-'}`;
  void logEvent('cta_click', params.article_path || location.pathname, detalle.slice(0, 120));
}

/** Envío de email en BlogEmailCapture (éxito real, ya insertado en `leads`). */
export function trackBlogLeadSubmit(params: BlogCtaEventParams) {
  pushDataLayer('blog_lead_submit', params);
}
