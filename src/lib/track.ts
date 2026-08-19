/**
 * Eventos personalizados: se mandan a Plausible (dashboard visual), Vercel
 * Web Analytics (consultable por API/MCP sin salir de Claude Code) y al
 * dataLayer de GTM (para que GA4 los reciba como eventos reales — antes
 * ningún track() llegaba a GA4, solo el page_view automático, por eso el
 * informe "Generar oportunidades de venta" marcaba 0 pese a haber usuarios
 * nuevos y registros reales).
 */
import { track as vercelTrack } from '@vercel/analytics';

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    dataLayer?: unknown[];
  }
}

export function track(eventName: string, props?: Record<string, string | number | boolean>) {
  window.plausible?.(eventName, props ? { props } : undefined);
  vercelTrack(eventName, props);
  window.dataLayer?.push({ event: eventName, ...props });
}

/**
 * Evento clave de GA4 para conversiones reales de negocio (registro
 * completado, solicitud Flash Booking enviada, contacto iniciado). Usa el
 * nombre estándar "generate_lead" que GA4 reconoce automáticamente como
 * evento de generación de oportunidades — sin esto, el informe "Generar
 * oportunidades de venta" no tiene ninguna señal que contar.
 */
export function trackLead(source: string, props?: Record<string, string | number | boolean>) {
  track('generate_lead', { source, ...props });
}

/**
 * Detecta si la visita procede de un motor generativo (ChatGPT, Perplexity,
 * Gemini, Claude, Copilot…) y lo registra como evento Plausible "AI Referral"
 * con la fuente. Permite medir el impacto del trabajo GEO/AEO: cuánto tráfico
 * llega porque una IA citó/recomendó XPEAK. Se llama una vez al arrancar la app.
 */
const AI_SOURCES: { test: RegExp; name: string }[] = [
  { test: /chatgpt\.com|openai\.com/i, name: 'ChatGPT' },
  { test: /perplexity\.ai/i, name: 'Perplexity' },
  { test: /gemini\.google\.com|bard\.google\.com/i, name: 'Gemini' },
  { test: /claude\.ai|anthropic\.com/i, name: 'Claude' },
  { test: /copilot\.microsoft\.com|bing\.com\/chat/i, name: 'Copilot' },
  { test: /you\.com|phind\.com|poe\.com/i, name: 'Otra IA' },
];

export function trackAIReferral() {
  try {
    const ref = document.referrer || '';
    if (!ref) return;
    const hit = AI_SOURCES.find(s => s.test.test(ref));
    if (hit) track('AI Referral', { source: hit.name, landing: location.pathname });
  } catch { /* referrer no disponible: sin efecto */ }
}
