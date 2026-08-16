/**
 * Eventos personalizados: se mandan a Plausible (dashboard visual) y también a
 * Vercel Web Analytics (consultable por API/MCP sin salir de Claude Code).
 * Ambos gratis en el plan actual — Vercel solo cobra por volumen alto de eventos.
 */
import { track as vercelTrack } from '@vercel/analytics';

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export function track(eventName: string, props?: Record<string, string | number | boolean>) {
  window.plausible?.(eventName, props ? { props } : undefined);
  vercelTrack(eventName, props);
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
