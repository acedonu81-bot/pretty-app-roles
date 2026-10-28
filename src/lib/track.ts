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
  // Los pasos de /auth (auth_view, auth_submit, auth_error, auth_captcha_*…)
  // también van a la analítica propia: GA4 no recibe eventos custom (falta la
  // etiqueta en GTM) y además solo cuenta a quien acepta cookies, así que el
  // embudo de registro de la campaña de Instagram era invisible (11 oct 2026).
  if (eventName.startsWith('auth_')) {
    const extra = props ? Object.entries(props).map(([k, v]) => `${k}=${v}`).join(' ') : '';
    void logEvent('auth_paso', '/auth', `${eventName.slice(5)} ${extra}`.trim().slice(0, 120));
  }
  // La tarjeta que pide los avisos, igual (Ficha XDS 25 oct 2026): sin esto no
  // hay forma de saber cuántos la ven y cuántos activan.
  if (eventName.startsWith('push_ask_')) {
    const extra = props ? Object.entries(props).map(([k, v]) => `${k}=${v}`).join(' ') : '';
    void logEvent('cta_click', location.pathname, `push_ask ${eventName.slice(9)} ${extra}`.trim().slice(0, 120));
  }
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

/**
 * Detecta bots/crawlers conocidos por su user-agent, para no contarlos como
 * visitas reales en el panel de admin. logPageView se dispara en un
 * useEffect de React, así que requiere que el JS de la SPA se ejecute
 * completo — y muchos crawlers modernos (Googlebot, headless Chrome de
 * herramientas SEO, scrapers) sí lo hacen, contaminando "Visitas" y
 * "¿A qué hora entra tu gente?" con patrones que no son personas (ej. visitar
 * solo /aviso-legal y /terminos, o picos justo a medianoche).
 *
 * No cambia lo que se guarda en la tabla (sigue sin IP ni UA completo, por
 * RGPD): solo evita ENVIAR el evento cuando el UA matchea un patrón conocido.
 */
const BOT_UA = /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|lighthouse|pagespeed|gtmetrix|ahrefs|semrush|mj12bot|dotbot|petalbot|bytespider|yandex|baiduspider|facebookexternalhit|whatsapp|telegrambot|discordbot|slackbot|preview/i;

// Además de los bots por UA (14 oct 2026): las pruebas de Claude con
// Playwright/Chrome DevTools usan un Chrome normal, sin "headless" en el UA,
// y salían en "Quién está online" como visitantes en /auth. Todo navegador
// automatizado marca navigator.webdriver. Y el servidor local (localhost)
// escribía en la misma base de datos que producción.
// Pero el navegador de pruebas de Claude viene configurado para ocultar
// navigator.webdriver y se presenta como un Chrome normal: desde la página no
// hay forma de distinguirlo. Por eso hay además una marca a mano: entrar una
// vez con ?interno=1 deja ese navegador marcado (localStorage) y deja de
// contar; ?interno=0 lo desmarca. Sirve también para los móviles y
// ordenadores del equipo, cuyas visitas sin sesión iniciada no había forma
// de separar (no se guarda IP).
const INTERNO_KEY = 'xpeak_interno';
function esInterno(): boolean {
  try {
    const marca = new URLSearchParams(location.search).get('interno');
    if (marca === '1') localStorage.setItem(INTERNO_KEY, '1');
    else if (marca === '0') localStorage.removeItem(INTERNO_KEY);
    return marca === '1' || localStorage.getItem(INTERNO_KEY) === '1';
  } catch {
    return false;
  }
}

function esBot(): boolean {
  try {
    if (esInterno()) return true;
    if (navigator.webdriver) return true;
    if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return true;
    return BOT_UA.test(navigator.userAgent || '');
  } catch {
    return false;
  }
}

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

/** Sistema del aparato, para saber si la PWA está en iPhone o Android. Va en `detalle` de los eventos pwa_*. */
function sistemaOperativo(): string {
  const ua = navigator.userAgent || '';
  if (/iPhone|iPod/i.test(ua)) return 'iphone';
  // iPadOS 13+ se anuncia como Macintosh: se distingue por ser táctil.
  if (/iPad/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ipad';
  if (/Android/i.test(ua)) return 'android';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Macintosh/i.test(ua)) return 'mac';
  return 'otro';
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
  if (esBot()) return;
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

/**
 * Visita de página. Se llama en cada cambio de ruta.
 *
 * En /auth se guarda el query string (mode/role) como detalle: es la única
 * ruta donde ese dato distingue acciones muy distintas para el panel "Quién
 * está online" (alta de profesional vs. login de organizador), así que no
 * compensa arrastrarlo en `path` para todas las rutas y romper las vistas SQL
 * que agrupan por path exacto.
 */
export function logPageView(path: string = location.pathname, search: string = location.search) {
  // En el directorio se guarda el género con el que se entra desde los chips
  // de /contratar-dj: es la única forma de saber qué estilos se buscan, porque
  // log_analytics_event solo admite una lista cerrada de event_name.
  const genero = path.startsWith('/directorio/') ? new URLSearchParams(search).get('genero') : null;
  const detalle = path === '/auth' && search ? search.replace(/^\?/, '') : genero ? `genero=${genero}` : undefined;
  void logEvent('page_view', path, detalle);
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

/**
 * Alta y acceso, para cerrar el embudo visita → registro.
 *
 * También van a GA4 vía track(): el comentario de arriba del archivo decía
 * que GA4-vía-GTM era "la única fuente de analítica del proyecto", pero
 * logSignup/logLogin solo llamaban a logEvent (tabla propia). GA4 nunca
 * recibió un solo sign_up — el informe de registros en GA4 estaba
 * permanentemente a 0 pese a haber altas reales (detectado 5 oct 2026).
 * Nombres "sign_up" y "login" son los estándar que GA4 reconoce.
 */
export function logSignup(rol?: string) {
  void logEvent('signup', location.pathname, rol);
  track('sign_up', rol ? { method: rol } : undefined);
}
export function logLogin() {
  void logEvent('login');
  track('login');
}

/** Ventana de consejo del panel (ConsejosPanel): cuántas se ven y cuántas llevan al apartado. */
export function logConsejo(accion: 'visto' | 'ir' | 'cerrar', id: string) {
  void logEvent('cta_click', location.pathname, `consejo_${accion}:${id}`);
}

/** Filtro de rol usado en el directorio: qué categorías se buscan más. */
export function logFiltroRol(rol: string) {
  void logEvent('filtro_rol', location.pathname, rol.slice(0, 60));
}
/**
 * Último campo del formulario de /auth con el que interactuó alguien que
 * nunca llegó a enviar. El único rastro que había de un registro abandonado
 * era "page_view" seguido de silencio — sin saber si se fue nada más entrar,
 * a mitad del email, o ya con el formulario lleno pero sin pulsar el botón.
 * Se llama en el blur de cada campo; Auth.tsx para de llamarlo en cuanto el
 * submit sale adelante, así que el último valor guardado es justo donde se
 * quedó quien abandonó.
 */
export function logAuthFieldTouched(campo: string) {
  void logEvent('auth_field_touched', '/auth', campo);
}

/**
 * Sistema + id del aparato para los eventos pwa_* ("android#k3j9..."). Sin él,
 * cada apertura anónima salía en el panel como un "Visitante anónimo" distinto
 * y no se sabía si eran la misma persona (19 oct 2026). El id es aleatorio, no
 * se saca del aparato, y solo se guarda si aceptó las cookies de analítica:
 * un identificador persistente sí pide consentimiento (ver nota de arriba).
 */
const PWA_APARATO_KEY = 'xpeak_pwa_aparato';
function sistemaYAparato(): string {
  const sistema = sistemaOperativo();
  try {
    const consentimiento = JSON.parse(localStorage.getItem('xpeak-cookie-consent') || '{}');
    if (!consentimiento.analytics) return sistema;
    let id = localStorage.getItem(PWA_APARATO_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2, 12);
      localStorage.setItem(PWA_APARATO_KEY, id);
    }
    return `${sistema}#${id}`;
  } catch {
    return sistema;
  }
}

/**
 * Instalación de la PWA completada (evento nativo `appinstalled` del
 * navegador). Solo Chrome/Edge lo disparan — Safari (iOS) nunca, ni siquiera
 * tras "Añadir a pantalla de inicio" manual, así que esto no cuenta
 * instalaciones en iOS.
 */
export function logPwaInstalled() {
  void logEvent('pwa_installed', location.pathname, sistemaYAparato());
  track('pwa_installed');
}

/**
 * Sesión abierta ya en modo app instalada (display-mode: standalone / iOS
 * navigator.standalone). Complementa a logPwaInstalled: ese solo captura el
 * MOMENTO de instalar (y nunca en iOS), así que no sirve para medir cuánta
 * gente YA tenía la PWA puesta antes de que ese evento existiera. Una vez por
 * sesión (sessionStorage), no en cada cambio de ruta.
 */
const PWA_SESSION_KEY = 'xpeak_pwa_session_logged';
export function logPwaSessionIfStandalone() {
  try {
    if (sessionStorage.getItem(PWA_SESSION_KEY)) return;
    const standalone = ('standalone' in navigator && (navigator as any).standalone)
      || window.matchMedia('(display-mode: standalone)').matches;
    if (!standalone) return;
    sessionStorage.setItem(PWA_SESSION_KEY, '1');
    void logEvent('pwa_session', location.pathname, sistemaYAparato());
  } catch { /* storage bloqueado: sin efecto, no es crítico */ }
}

/**
 * Clic en el Instagram/TikTok de un profesional (28 oct 2026). Las redes se
 * enseñan como escaparate, pero cada clic es alguien que puede acabar
 * escribiéndole por fuera de XPEAK: contarlo dice cuánto pesa esa fuga frente
 * al contacto dentro de la app. Va como cta_click ("redes <red> <origen>
 * <user_id>") porque log_analytics_event solo acepta una lista cerrada de
 * nombres y así no hace falta migración.
 */
export function clicRedSocial(
  red: 'instagram' | 'tiktok',
  origen: 'perfil_publico' | 'panel',
  profesionalUserId: string,
) {
  track('social_click', { red, origen });
  void logEvent('cta_click', location.pathname, `redes ${red} ${origen} ${profesionalUserId}`);
}
