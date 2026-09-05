/**
 * Eventos personalizados: van al dataLayer de GTM para que GA4 los reciba como
 * eventos reales — antes ningún track() llegaba a GA4, solo el page_view
 * automático, por eso el informe "Generar oportunidades de venta" marcaba 0
 * pese a haber usuarios nuevos y registros reales.
 *
 * GA4 vía GTM es la única fuente de analítica del proyecto.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(eventName: string, props?: Record<string, string | number | boolean>) {
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
 * Gemini, Claude, Copilot…) y lo registra como evento GA4 "AI Referral" con la
 * fuente. Permite medir el impacto del trabajo GEO/AEO: cuánto tráfico llega
 * porque una IA citó/recomendó XPEAK. Se llama una vez al arrancar la app.
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

/* ---------------------------------------------------------------------------
 * Analítica propia (tabla analytics_events en Supabase).
 *
 * GA4 se queda los datos y Vercel Analytics exige plan Pro, así que el panel
 * de admin no tenía forma de responder "cuánta gente entró ayer y a qué hora".
 * Esto guarda una copia mínima en la base de datos del propio proyecto.
 *
 * Deliberadamente NO se registra IP ni user-agent completo: solo ruta, origen
 * y categoría de dispositivo. Así el registro no es un fichero de datos
 * personales y no exige consentimiento previo de cookies.
 * ------------------------------------------------------------------------- */

const SESSION_KEY = 'xpeak_sid';

/** Id de sesión efímero: distingue "1 persona viendo 8 páginas" de "8 personas". */
function sessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    // Modo privado o storage bloqueado: sin sesión, la visita cuenta igual.
    return 'no-session';
  }
}

function deviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

/** Solo el hostname del referrer: la URL completa puede llevar términos de búsqueda. */
function referrerHost(): string {
  try {
    if (!document.referrer) return '';
    const h = new URL(document.referrer).hostname;
    return h === location.hostname ? '' : h;
  } catch {
    return '';
  }
}

/**
 * Registra un evento en la analítica propia. Nunca lanza ni bloquea: si la
 * llamada falla (sin red, función no desplegada, RLS), la app sigue igual —
 * la analítica jamás debe romper una pantalla al usuario.
 */
export async function logEvent(
  eventName: string,
  path: string = location.pathname,
) {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    // Cast: los tipos generados de Supabase (types.ts) no incluyen todavía las
    // funciones de analítica; regenerarlos arrastraría el desfase que ya
    // existe con contracts/leads/calendar_events y no toca hacerlo aquí.
    //
    // OJO: el cast se aplica al OBJETO y .rpc se invoca sobre él. Extraer el
    // método a una variable suelta (const rpc = supabase.rpc) lo desliga de su
    // `this` y la llamada revienta por dentro — y como aquí abajo hay un catch
    // silencioso, el fallo no dejaba ni rastro en consola ni petición de red.
    const sb = supabase as unknown as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<unknown>;
    };
    await sb.rpc('log_analytics_event', {
      p_event_name: eventName,
      p_path: path,
      p_referrer: referrerHost(),
      p_device: deviceType(),
      p_session_id: sessionId(),
    });
  } catch (e) {
    // La analítica nunca rompe la app: en producción se traga el fallo. Pero
    // en desarrollo se avisa — un catch totalmente mudo aquí ya ocultó un bug
    // real (llamada rpc desligada de su `this`): ni error en consola ni
    // petición de red, así que parecía que el tracking "no hacía nada".
    if (import.meta.env.DEV) console.warn('[analytics] evento no registrado:', e);
  }
}

/** Visita de página. Se llama en cada cambio de ruta. */
export function logPageView(path: string = location.pathname) {
  void logEvent('page_view', path);
}
