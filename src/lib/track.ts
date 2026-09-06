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

/**
 * Categoría de dispositivo. NO es huella digital: solo tres valores fijos.
 *
 * Antes se decidía únicamente por window.innerWidth (768-1023 = tablet), y eso
 * mentía en los dos sentidos: un iPhone Pro Max girado mide 932 px y se
 * contaba como tablet, un portátil con la ventana a media pantalla también, y
 * un iPad Mini vertical (744 px) se contaba como móvil. Con pocas visitas al
 * día, esos falsos positivos cambian por completo la lectura del panel.
 *
 * Ahora manda el user-agent, que sí distingue el aparato, y el ancho solo
 * decide cuando el UA no dice nada (algunos navegadores de escritorio lo
 * recortan).
 */
function deviceType(): string {
  const ua = navigator.userAgent || '';

  // iPadOS 13+ se anuncia como Macintosh: se detecta por ser táctil, que un
  // Mac de verdad no es.
  const esIPadModerno = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || esIPadModerno) return 'tablet';

  // Android sin "Mobile" en el UA es tablet — así lo especifica Google.
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'tablet';

  if (/Mobi|iPhone|iPod|Windows Phone/i.test(ua)) return 'mobile';

  // Sistema de escritorio declarado: es un ordenador aunque la ventana esté
  // estrecha. Sin esto, alguien con el navegador a media pantalla (900 px) se
  // contaba como tablet — y ese caso es mucho más común que un iPad real.
  if (/Windows NT|Macintosh|X11|CrOS|Linux x86/i.test(ua)) return 'desktop';

  // Sin pistas en el UA: el ancho como último recurso.
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
  detalle?: string,
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
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
    };
    const base = {
      p_event_name: eventName,
      p_path: path,
      p_referrer: referrerHost(),
      p_device: deviceType(),
      p_session_id: sessionId(),
    };

    const r = await sb.rpc('log_analytics_event', { ...base, p_detalle: detalle ?? null });

    // Postgres identifica las funciones por su lista de parámetros, así que
    // mientras la migración que añade p_detalle no esté aplicada, la llamada
    // con ese argumento no encuentra ninguna función y el evento se perdería
    // entero. Se reintenta sin él: mejor registrar la visita sin su detalle
    // que no registrar nada.
    if (r?.error && /Could not find the function/i.test(r.error.message)) {
      await sb.rpc('log_analytics_event', base);
    }
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

/**
 * Búsqueda dentro de XPEAK. `resultados` distingue las que encuentran algo de
 * las que no: las segundas son la lista de lo que el catálogo no cubre, y ese
 * dato no lo da ni GA4 ni Search Console porque no es búsqueda de Google.
 *
 * Se descartan términos de 1 carácter (teclear a medias) y se recorta a 120
 * para no guardar textos largos pegados por error.
 */
export function logSearch(termino: string, resultados: number) {
  const q = termino.trim().slice(0, 120);
  if (q.length < 2) return;
  void logEvent(resultados === 0 ? 'search_sin_resultados' : 'search', location.pathname, q);
}

/**
 * Clic en un enlace de afiliado. Amazon informa de ventas, nunca de clics por
 * producto: sin esto no se puede distinguir "nadie lo pincha" (problema de
 * visibilidad) de "lo pinchan y no compran" (problema de producto).
 */
export function logAffiliateClick(producto: string) {
  void logEvent('affiliate_click', location.pathname, producto.slice(0, 120));
}

/** Ficha de profesional abierta. Mide si el directorio se explora de verdad. */
export function logProfileView(rolONombre: string) {
  void logEvent('profile_view', location.pathname, rolONombre.slice(0, 120));
}

/** Intento de contacto: el paso previo a que el negocio ocurra. */
export function logContactClick(contexto: string) {
  void logEvent('contact_click', location.pathname, contexto.slice(0, 120));
}

/** Alta y acceso, para cerrar el embudo visita → registro. */
export function logSignup(rol?: string) { void logEvent('signup', location.pathname, rol); }
export function logLogin() { void logEvent('login'); }

/** Filtro de rol usado en el directorio: qué categorías se buscan más. */
export function logFiltroRol(rol: string) {
  void logEvent('filtro_rol', location.pathname, rol.slice(0, 60));
}
