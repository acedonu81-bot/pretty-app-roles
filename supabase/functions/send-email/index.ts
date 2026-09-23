import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGIN = 'https://xpeak.es';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HMAC-SHA256 token for unsubscribe links (prevents email enumeration)
async function signEmail(email: string): Promise<string> {
  const key = Deno.env.get('UNSUB_SECRET');
  if (!key) throw new Error('UNSUB_SECRET not configured');
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(email));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const ADMIN = 'info@xpeak.site';

// Los emails recibian el slug interno del rol: "Tu perfil como **staff** ya
// esta activo". Un camarero no se llama staff a si mismo, y menos uno que
// acaba de salir de una escuela de hosteleria. Mismo vocabulario que ROLE_ES
// del frontend (no se puede importar: esta funcion corre en Deno, aislada).
const ROL_ES: Record<string, string> = {
  dj: 'DJ', staff: 'Sala & Barra', camarero: 'Sala & Barra', azafata: 'Azafata',
  event_manager: 'Encargada de Eventos', promotor: 'Promotor & RRPP',
  catering: 'Catering', makeup: 'Maquillaje', peluqueria: 'Peluquería',
  media: 'Media & Fotografía', 'grupo-musical': 'Grupo Musical', mago: 'Mago',
  humorista: 'Humorista', animador: 'Animador', bailarin: 'Bailarín',
  speaker: 'Speaker', vestuario: 'Estilismo', 'photo-booth': 'Photo Booth',
  empresario: 'Organizador',
};
const rolLegible = (r: unknown): string => {
  const k = String(r ?? '').trim();
  return ROL_ES[k] ?? (k ? k.charAt(0).toUpperCase() + k.slice(1) : 'profesional');
};
const FROM = 'XPEAK <info@xpeak.site>';

// Escape user-supplied strings before inserting into HTML to prevent injection
const esc = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const UNSUB_PLACEHOLDER = '{{UNSUB_URL}}';

const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

/**
 * Texto de vista previa (preheader): lo que la bandeja muestra junto al asunto
 * ANTES de abrir el correo. Sin él, Gmail rellena ese hueco con el primer
 * texto que encuentre en el HTML — normalmente basura del layout.
 *
 * Va oculto en el cuerpo (los &zwnj;&nbsp; empujan cualquier resto para que no
 * se cuele detrás) y solo lo lee el cliente de correo.
 */
const preheader = (texto: string) => `
  <div style="display:none;font-size:1px;color:#FFFFFF;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">
    ${esc(texto)}
    ${'&zwnj;&nbsp;'.repeat(60)}
  </div>`;

/**
 * Los clientes de correo (iOS Mail y Gmail sobre todo) convierten en enlaces
 * lo que les parece un teléfono, una fecha o una dirección: "697417407" o
 * "20:00 a 23:00" salían en azul y subrayados sin que nadie los pusiera así.
 *
 * No hay <head> donde meter <meta name="format-detection">, así que se
 * neutraliza con el truco que funciona en todos: envolver el cuerpo en un
 * <a> inerte cuyo color hereda el texto. El autolink sigue creándose, pero
 * hereda el color del contenedor en vez del azul por defecto.
 */
const noAutolink = (html: string) =>
  `<a href="#" style="color:inherit;text-decoration:none;pointer-events:none;cursor:default" tabindex="-1">${html}</a>`;

const base = (content: string, preview?: string) => `
<div style="background:#E8E9EB;padding:40px 16px;font-family:${FONT}">
${preview ? preheader(preview) : ''}
<div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:16px;box-shadow:0 1px 3px rgba(10,9,8,0.06),0 12px 32px rgba(10,9,8,0.16),0 32px 64px rgba(10,9,8,0.14);overflow:hidden">
  <div style="text-align:center;padding:32px 32px 20px;border-bottom:1px solid rgba(212,175,55,0.25)">
    <a href="https://xpeak.es" style="text-decoration:none;display:inline-block">
      <img src="https://xpeak.es/xpeak-icon-512.png" width="40" height="40" alt="XPEAK"
        style="display:block;margin:0 auto 10px;border-radius:9px;border:0;outline:none;text-decoration:none">
      <span style="font-size:24px;font-weight:800;letter-spacing:1.5px;color:#0a0908">X<span style="color:#D4AF37">PEAK</span></span>
    </a>
  </div>
  <div style="padding:32px">
    ${content}
  </div>
  <div style="padding:20px 32px 28px;text-align:center;border-top:1px solid rgba(10,9,8,0.06)">
    <p style="color:#9CA3AF;font-size:11px;margin:0 0 6px">XPEAK · <a href="mailto:info@xpeak.site" style="color:#9CA3AF">info@xpeak.site</a> · <a href="https://xpeak.es" style="color:#9CA3AF">xpeak.es</a></p>
    <p style="color:#C4C7CB;font-size:10px;margin:0">¿No quieres recibir más emails? <a href="${UNSUB_PLACEHOLDER}" style="color:#B0B3B8;text-decoration:underline">Anular suscripción</a></p>
  </div>
</div>
</div>`;

const badge = (text: string, color = '#7a6216') =>
  `<span style="background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.3);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:1px;box-shadow:0 1px 2px rgba(212,175,55,0.15)">${esc(text)}</span>`;

const btn = (text: string, url: string) =>
  `<a href="${esc(url)}" style="display:block;text-align:center;background:linear-gradient(135deg,#E0BC4B,#B8941E);color:#0a0908;font-weight:700;font-size:14px;padding:15px;border-radius:10px;text-decoration:none;margin:24px 0 4px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.4),0 6px 14px rgba(212,175,55,0.35),0 16px 32px rgba(184,148,30,0.28)">${esc(text)}</a>`;

// Círculo con inicial/emoji — para remitentes de mensajes, avisos de perfil, etc.
const avatarCircle = (initialOrEmoji: string) =>
  `<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,rgba(212,175,55,0.18),rgba(212,175,55,0.06));border:1px solid rgba(212,175,55,0.35);box-shadow:0 6px 16px rgba(212,175,55,0.25);display:table;margin:0 auto 18px"><div style="display:table-cell;text-align:center;vertical-align:middle;font-size:22px;font-weight:800;color:#7a6216">${esc(initialOrEmoji)}</div></div>`;

// Sello de check animado — confirmaciones de alto valor (solicitud enviada/aceptada).
// @keyframes se anima en Apple Mail/iOS Mail; Gmail/Outlook lo ignoran y muestran el
// sello estático (degradación segura, sin roturas). prefers-reduced-motion respetado.
const confirmSeal = () => `
  <style>
    @keyframes xpk-pop { 0% { transform:scale(0.5); opacity:0 } 65% { transform:scale(1.15); opacity:1 } 100% { transform:scale(1) } }
    @keyframes xpk-ring { 0% { transform:scale(0.8); opacity:0.75 } 100% { transform:scale(2.2); opacity:0 } }
    @media (prefers-reduced-motion: reduce) { .xpk-pop, .xpk-ring { animation:none !important } }
  </style>
  <div style="position:relative;width:64px;height:64px;margin:0 auto 18px">
    <div class="xpk-ring" style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(212,175,55,0.7);animation:xpk-ring 1.6s ease-out infinite"></div>
    <div class="xpk-ring" style="position:absolute;inset:0;border-radius:50%;border:2px solid rgba(212,175,55,0.7);animation:xpk-ring 1.6s ease-out infinite;animation-delay:0.8s"></div>
    <div class="xpk-pop" style="position:relative;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,rgba(212,175,55,0.22),rgba(212,175,55,0.08));border:1px solid rgba(212,175,55,0.45);box-shadow:0 8px 20px rgba(212,175,55,0.32);display:table;animation:xpk-pop 0.55s cubic-bezier(0.34,1.56,0.64,1)"><div style="display:table-cell;text-align:center;vertical-align:middle;font-size:26px;font-weight:800;color:#7a6216">✓</div></div>
  </div>`;

/**
 * Tabla etiqueta/valor de los correos.
 *
 * La etiqueta ocupaba 140px fijos y el valor el resto, así que un texto largo
 * (la descripción de un evento, por ejemplo) se aplastaba en una columna
 * estrecha y salía partido en dos palabras por línea — ilegible en móvil, que
 * es donde se leen casi todos.
 *
 * Ahora, si el valor pasa de 60 caracteres, la etiqueta va encima y el texto
 * ocupa el ancho completo. Los valores cortos (fecha, lugar, pago) siguen en
 * dos columnas, que para ellos se lee mejor.
 */
const rows = (pairs: [string, string][]) =>
  `<table style="width:100%;border-collapse:collapse">${pairs.map(([k, v]) => {
    const val = esc(v) || '—';
    const borde = 'border-bottom:1px solid rgba(10,9,8,0.06)';
    if (val.length > 60) {
      return `<tr><td colspan="2" style="padding:10px 0;${borde}">`
        + `<div style="color:#9CA3AF;font-size:12px;margin-bottom:4px">${esc(k)}</div>`
        + `<div style="color:#0a0908;font-size:13px;font-weight:600;line-height:1.6">${noAutolink(val)}</div>`
        + `</td></tr>`;
    }
    return `<tr><td style="padding:10px 12px 10px 0;color:#9CA3AF;font-size:12px;white-space:nowrap;${borde}">${esc(k)}</td>`
      + `<td style="padding:10px 0;color:#0a0908;font-size:13px;font-weight:600;line-height:1.6;${borde}">${noAutolink(val)}</td></tr>`;
  }).join('')}</table>`;

const TEMPLATES: Record<string, (d: any) => { subject: string; html: string; to: string; replyTo?: string }> = {

  // Nueva reseña pendiente de aprobar — sin esto, la moderación depende de
  // entrar manualmente al Panel Admin sin ningún aviso de que hay algo que
  // revisar. Va al admin, no al profesional (es quien puede aprobar/rechazar).
  new_review_pending: (d) => ({
    subject: `Nueva reseña pendiente — ${esc(d.professionalName)} (${d.rating}★)`,
    to: ADMIN,
    html: base(`
      ${avatarCircle(String(d.rating))}
      <h2 style="font-size:20px;font-weight:900;margin:0 0 4px;text-align:center;color:#0a0908">Nueva reseña pendiente de aprobar</h2>
      <p style="color:#6B7280;font-size:13px;text-align:center;margin:0 0 20px">Para: <strong style="color:#D4AF37">${esc(d.professionalName)}</strong></p>
      <div style="background:rgba(10,9,8,0.03);border:1px solid rgba(10,9,8,0.06);border-radius:10px;padding:18px;margin:0 0 20px;box-shadow:0 4px 14px rgba(10,9,8,0.08)">
        ${rows([
          ['De', d.reviewerName],
          ['Rol', d.reviewerRole],
          ['Evento', d.eventType || '—'],
          ['Valoración', `${'★'.repeat(d.rating)}${'☆'.repeat(5 - d.rating)}`],
        ])}
        <p style="color:#0a0908;font-size:13px;line-height:1.6;margin:14px 0 0;padding-top:14px;border-top:1px solid rgba(10,9,8,0.05)">"${esc(d.comment)}"</p>
      </div>
      ${btn('Revisar en el Panel Admin →', 'https://xpeak.es/dashboard?view=admin')}
    `),
  }),

  // 0. Early Adopter — primeros 20 profesionales
  early_adopter: (d) => ({
    subject: `${esc(d.name)}, eres Early Adopter de XPEAK — posición Elite 6 meses gratis`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#D4AF37">Eres Early Adopter de XPEAK</h2>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>, eres uno de los primeros profesionales en confiar en XPEAK desde el primer día. Eso tiene valor real para nosotros y queremos recompensarte.
      </p>
      <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.3);border-radius:8px;padding:20px;margin:20px 0;box-shadow:0 8px 22px rgba(212,175,55,0.2)">
        <p style="color:#D4AF37;font-weight:700;font-size:15px;margin:0 0 12px">Tu recompensa — válida hasta diciembre 2026:</p>
        <ul style="color:#0a0908;line-height:2.2;margin:0;padding-left:20px;font-size:14px">
          <li>Posición <strong style="color:#D4AF37">Elite</strong> en el directorio — 6 meses gratis</li>
          <li>Apareces el <strong style="color:#D4AF37">primero en todas las búsquedas</strong> de tu ciudad</li>
          <li>Badge exclusivo <strong style="color:#D4AF37">Early Adopter</strong> en tu ficha</li>
          <li>Acceso prioritario a todas las nuevas funciones</li>
          <li>Línea directa con el equipo — responde a este email</li>
        </ul>
      </div>
      <p style="color:#4b5563;font-size:13px;line-height:1.7;margin:0 0 24px">
        Solo hay <strong style="color:#0a0908">20 plazas Early Adopter</strong> en toda España. La tuya está asegurada. Gracias por estar desde el principio.
      </p>
      ${btn('Ver mi perfil en XPEAK →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:16px">¿Tienes dudas o sugerencias? Responde directamente a este email.</p>
    `),
  }),

  // 1. Bienvenida al nuevo usuario
  // Registro directo sin aprobación manual desde el 22 sep 2026: el texto ya
  // no habla de revisión. Un profesional solo aparece en el directorio con
  // foto (filtro de foto obligatoria); un empresario no aparece, contrata.
  welcome: (d) => {
    const esEmpresa = d.role === 'empresario';
    return {
    subject: `Bienvenido a XPEAK, ${esc(d.name)}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Hola, ${esc(d.name)}</h2>
      ${esEmpresa ? `
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu cuenta de organizador ya está activa. Puedes buscar DJs, fotógrafos, camareros y otros profesionales por zona, escribirles directamente o publicar una oferta con Flash Booking para que te respondan los que estén disponibles.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Añade un logo y una breve descripción de tu negocio: los profesionales miran quién les escribe antes de responder.
      </p>
      ${btn('Buscar profesionales →', 'https://xpeak.es/dashboard')}` : `
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> ya está activo. En cuanto subas una foto de perfil, aparecerás en el directorio y los organizadores de toda España podrán encontrarte y contactarte.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa también tu descripción, tarifa y ejemplos de tu trabajo: cuanto más completo esté tu perfil, más fácil es que te contraten.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard')}`}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`),
    };
  },

  // 1a2. Recordatorio si el perfil sigue incompleto — solo se manda una vez
  // (dedupe vía email_logs), nunca si ya se completó. El perfil SÍ aparece
  // en el directorio (no hay gate de visibilidad), pero incompleto pierde
  // oportunidades reales frente a organizadores que ya están buscando.
  profile_incomplete_reminder: (d) => {
    // El organizador NO busca que le contraten: contrata él. El texto del
    // profesional ("para que te contraten") le sonaría a error, así que la
    // plantilla cambia el motivo — un perfil de sala vacío hace que su oferta
    // parezca spam y baja la respuesta de los profesionales.
    const esEmpresa = d.role === 'empresario';
    return {
    subject: esEmpresa
      ? `${esc(d.name)}, completa tu perfil para que los profesionales confíen en tus ofertas`
      : `${esc(d.name)}, te faltan ${esc(String(d.missingCount))} pasos para que te contraten`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Te faltan ${esc(String(d.missingCount))} pasos</h2>
      ${esEmpresa ? `
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Cuando envías una oferta, el profesional entra a ver quién se la manda. Tu perfil está al ${esc(String(d.percent))}%: sin logo ni descripción, muchos lo toman por spam y ni responden.
      </p>` : `
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Ahora mismo hay organizadores buscando profesionales como tú en XPEAK, y tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> está al ${esc(String(d.percent))}% — les cuesta más confiar en contratarte sin esta información, y algunos directamente pasan al siguiente perfil.
      </p>`}
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Solo te queda: ${esc(d.missingLabels)}.
      </p>
      ${btn(esEmpresa ? 'Completar mi perfil de empresa →' : 'Terminar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`,
      esEmpresa
        ? `Te faltan ${esc(String(d.missingCount))} datos: ${esc(d.missingLabels)}`
        : `Perfil al ${esc(String(d.percent))}% — te faltan ${esc(String(d.missingCount))} pasos`),
    };
  },

  // 1a2a. Aviso puntual (23 sep 2026) a profesionales recientes: ya se
  // cierran contrataciones y un perfil completo recibe más oportunidades.
  // Sin cifras: el volumen real aún es bajo y no se inventan números.
  oportunidades_contrataciones: (d) => ({
    subject: `${esc(d.name)}, ya se están cerrando contrataciones en XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Hola, ${esc(d.name)}</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Organizadores de eventos ya están contratando profesionales a través de XPEAK. Cuando buscan, comparan perfiles y escriben primero a los que tienen la información completa: foto, descripción, tarifa y ejemplos de su trabajo.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Para que tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> tenga más oportunidades, te falta añadir: ${esc(d.missingLabels)}. Son pocos minutos.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`,
      'Los perfiles completos reciben más contactos de organizadores'),
  }),

  // 1a2a2. Empresario que en realidad ofrece servicios (23 sep 2026, caso
  // Vulcano Grill): se le añade un perfil profesional en la misma cuenta y se
  // le avisa de que ya aparece en el directorio de su categoría.
  perfil_profesional_anadido: (d) => ({
    subject: `${esc(d.name)}, ya apareces en el directorio de ${esc(rolLegible(d.role))}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Hola, ${esc(d.name)}</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Como ofreces tus servicios para eventos, hemos activado en tu cuenta un perfil de <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> con tu foto y tu descripción. Ya apareces en el directorio y los organizadores que buscan ${esc(rolLegible(d.role)).toLowerCase()} en ${esc(d.zone)} pueden encontrarte y escribirte.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu cuenta de organizador sigue igual, por si también quieres contratar. Puedes cambiar de un perfil a otro en <strong>Ajustes → Mis perfiles</strong>.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Para recibir más contactos, añade tu precio orientativo y algunas fotos de tu trabajo.
      </p>
      ${btn('Ver mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`,
      'Los organizadores ya pueden encontrarte en XPEAK'),
  }),

  // 1a2b. Foto subida pero no válida (textura/producto/imagen borrosa en vez
  // de una foto real) — caso puntual, sin cron asociado. Distinto de
  // profile_incomplete_reminder porque ahí SÍ hay una imagen en photo_url, el
  // problema no es que falte sino que no sirve para el directorio.
  photo_invalid_reminder: (d) => ({
    subject: `${esc(d.name)}, tu foto de perfil no se ve bien en XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Revisa tu foto de perfil</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Hemos visto que la imagen subida a tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> no muestra tu cara — parece un fondo o una foto de producto en vez de tu foto real. Los organizadores confían más en perfiles con una foto clara de la persona con la que van a trabajar.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Sube una foto tuya real desde tu panel para que tu perfil vuelva a estar completo.
      </p>
      ${btn('Cambiar mi foto →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`,
      'Tu foto de perfil no muestra tu cara'),
  }),

  // 1a2c. Último aviso — solo a perfiles SIN foto (no confundir con
  // profile_incomplete_reminder, que cubre cualquier dato que falte y no
  // amenaza con nada). Envío puntual, un único disparo manual, 14 sep 2026:
  // la base de usuarios ya está creciendo y las primeras contrataciones
  // reales han empezado, así que un perfil sin cara empieza a perder
  // oportunidades de verdad frente a los que sí tienen foto.
  photo_last_call: (d) => ({
    subject: `${esc(d.name)}, último aviso: tu perfil sigue sin foto`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Tu perfil sigue sin foto</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        XPEAK está creciendo muy rápido y ya se han cerrado las primeras contrataciones a través de la plataforma. Cada vez más organizadores entran a buscar profesionales como tú.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> todavía no tiene foto, y sin ella un organizador no confía en contratarte: pasa directamente al siguiente perfil.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Sube tu foto y completa la información que se te pide en el panel — es lo único que falta para que tu perfil siga apareciendo en el directorio. Si no se actualiza, tu perfil se ocultará del panel hasta que subas contenido.
      </p>
      ${btn('Completar mi perfil ahora →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`,
      'Último aviso: sube tu foto para seguir apareciendo'),
  }),

  // 1a3. Recordatorio de trabajo mañana — cron diario (bolo-reminder-24h),
  // dedupe vía email_logs (una fila por evento, no por usuario). Type name
  // conserva "bolo" por compatibilidad con la función ya desplegada; el
  // copy visible ya no menciona bolos (aplica a cualquier rol).
  bolo_reminder_24h: (d) => ({
    subject: `Mañana tienes: ${esc(d.title)}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Trabajo mañana</h2>
      <p style="color:#0a0908;font-size:15px;line-height:1.7;margin:0 0 6px">
        <strong style="color:#D4AF37">${esc(d.title)}</strong>
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        ${esc(new Date(String(d.date) + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }))}${d.location ? ` — ${esc(d.location)}` : ''}
      </p>
      ${btn('Ver mi calendario →', 'https://xpeak.es/dashboard?view=calendar')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Puedes desactivar este aviso desde tu Calendario en XPEAK.</p>`),
  }),

  // 1a4. Confirmación de trabajo nuevo — se dispara al cerrar un acuerdo
  // real: aceptar una solicitud de Flash Booking (SolicitudesTab.tsx) o
  // generar un contrato con fecha de evento (ContractModal.tsx). Ya no se
  // dispara al añadir un evento a mano al calendario.
  bolo_new_confirmation: (d) => ({
    subject: `Trabajo confirmado: ${esc(d.title)}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Trabajo añadido a tu calendario</h2>
      <p style="color:#0a0908;font-size:15px;line-height:1.7;margin:0 0 6px">
        <strong style="color:#D4AF37">${esc(d.title)}</strong>
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        ${esc(new Date(String(d.date) + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }))}${d.location ? ` — ${esc(String(d.location))}` : ''}
      </p>
      ${btn('Ver mi calendario →', 'https://xpeak.es/dashboard?view=calendar')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Puedes desactivar este aviso desde tu Calendario en XPEAK.</p>`),
  }),

  // 1b. Anuncio del programa de referidos — a profesionales ya registrados
  referral_announcement: (d) => ({
    subject: `${esc(d.name)}, invita a otro profesional y gana 6 meses de prioridad`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#2563eb">Invita y gana prioridad</h2>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>, tienes disponible tu propio enlace de invitación en XPEAK — y cada profesional que invites y complete su perfil te da <strong style="color:#2563eb">+6 meses de badge azul de prioridad</strong>, apareciendo antes que el resto en el directorio de tu ciudad.
      </p>
      <div style="background:rgba(37,99,235,0.06);border:1px solid rgba(37,99,235,0.25);border-radius:8px;padding:20px;margin:20px 0;box-shadow:0 8px 22px rgba(37,99,235,0.18)">
        <p style="color:#2563eb;font-weight:700;font-size:15px;margin:0 0 12px">Tu enlace de invitación:</p>
        <p style="color:#0a0908;font-family:monospace;font-size:13px;background:#F3F4F1;border-radius:6px;padding:10px 12px;margin:0 0 8px;word-break:break-all">https://xpeak.es/auth?mode=register&amp;ref=${esc(d.referral_code)}</p>
        <p style="color:#6B7280;font-size:12px;line-height:1.6;margin:0">Compártelo con otros DJs, fotógrafos, camareros o cualquier profesional del sector que conozcas. Cuando complete su perfil (foto, bio y algún media), el premio se activa solo.</p>
      </div>
      ${btn('Ver mi enlace en mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:16px">¿Tienes dudas? Responde directamente a este email.</p>
    `),
  }),

  // 2c. La oferta se cubrió — aviso a quien se apuntó y no salió elegido.
  //
  // 10 sep 2026: dos DJs se apuntaron al Burger Gourmet Fest en 17 minutos y el
  // organizador cerró el bolo por teléfono con otro de fuera. Solo se les avisó
  // por campana, que ninguno vio. Quien responde rápido y se queda esperando sin
  // noticias es el que deja de responder la próxima vez.
  oferta_cubierta: (d) => ({
    subject: `La oferta de ${esc(d.titulo)} ya está cubierta`,
    to: d.email,
    html: base(`
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>, gracias por responder tan rápido a la oferta
        de <strong>${esc(d.titulo)}</strong>.
      </p>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        La plaza ya está cubierta, así que puedes liberar esa fecha. Te avisamos para que
        no te quedes esperando.
      </p>
      <p style="color:#0a0908;font-size:13px;line-height:1.6;margin:0 0 8px">
        Responder de los primeros es justo lo que hay que hacer: en las próximas ofertas
        cuenta a tu favor.
      </p>
      ${Array.isArray(d.falta) && d.falta.length > 0 ? `
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin:20px 0">
        <p style="font-size:13px;font-weight:700;margin:0 0 8px;color:#0a0908">
          Para la próxima, súbete estas posibilidades
        </p>
        <p style="font-size:13px;line-height:1.6;margin:0 0 10px;color:#0a0908">
          Cuando varios se apuntan al mismo bolo, el organizador ve primero los perfiles
          más completos. En el tuyo falta:
        </p>
        <ul style="margin:0;padding-left:18px;color:#0a0908;font-size:13px;line-height:1.9">
          ${d.falta.map((f: string) => `<li>${esc(f)}</li>`).join('')}
        </ul>
      </div>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard?view=perfil')}
      ` : btn('Ver ofertas abiertas →', 'https://xpeak.es/dashboard?view=flashbooking')}
    `, `El bolo se ha cerrado con otro profesional`),
  }),

  // 2d. Contratación cerrada — aviso al profesional elegido.
  contratado: (d) => ({
    subject: `¡Te han contratado para ${esc(d.titulo)}!`,
    to: d.email,
    html: base(`
      <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.25);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="font-size:20px;font-weight:900;margin:0;color:#0a0908">¡El bolo es tuyo!</p>
      </div>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>, <strong>${esc(d.titulo)}</strong> te ha elegido
        para el evento. Entra en XPEAK para ver los detalles y hablar directamente con quien
        te contrata.
      </p>
      ${rows([
        ['Dónde', esc(d.lugar ?? 'Por concretar')],
        ['Cuándo', esc(d.fecha ?? 'Por concretar')],
      ])}
      ${btn('Ver los detalles →', 'https://xpeak.es/dashboard?view=flashbooking')}
    `, `${esc(d.titulo)} te ha elegido para el evento`),
  }),

  // 2d2. Preselección: el organizador eligió, pero el bolo NO es firme hasta
  // que el profesional confirma dentro de la app (doble aceptación, 11 sep
  // 2026) — a diferencia de "contratado", aquí falta un paso, así que el
  // texto y el CTA insisten en "confirma" y no en "ya es tuyo".
  preseleccionado: (d) => ({
    subject: `${esc(d.titulo)} quiere contratarte — confirma tu plaza`,
    to: d.email,
    html: base(`
      <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.3);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="font-size:20px;font-weight:900;margin:0;color:#0a0908">¡Te han elegido!</p>
      </div>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        <strong>${esc(d.titulo)}</strong> quiere contratarte, pero el bolo todavía no es firme:
        entra en XPEAK y confirma tu plaza antes de que elija a otro profesional.
      </p>
      ${btn('Confirmar ahora →', 'https://xpeak.es/dashboard?view=flashbooking')}
    `, `${esc(d.titulo)} quiere contratarte — confirma tu plaza`),
  }),

  // 2e. Al día siguiente del bolo: pedir la valoración.
  //
  // Es el momento con más probabilidad de respuesta: el evento está fresco.
  // Se pide a las dos partes, y se les invita a contar cómo fue — una reseña
  // con historia vale mucho más que cinco estrellas sueltas.
  pedir_valoracion: (d) => ({
    subject: `¿Cómo fue ${esc(d.titulo)}?`,
    to: d.email,
    html: base(`
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>, ayer fue <strong>${esc(d.titulo)}</strong>.
        ${d.es_organizador
          ? `¿Qué tal salió con <strong>${esc(d.otra_parte)}</strong>?`
          : `¿Qué tal la experiencia con <strong>${esc(d.otra_parte)}</strong>?`}
      </p>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Cuéntanoslo en dos líneas. ${d.es_organizador
          ? 'Tu valoración ayuda a otros organizadores a elegir con criterio.'
          : 'Las valoraciones son lo que hace que te contraten la próxima vez.'}
      </p>
      ${d.es_organizador
        ? btn('Dejar mi valoración →', `https://xpeak.es/p/${esc(d.ref ?? '')}`)
        : btn('Valorar al organizador →', 'https://xpeak.es/dashboard?view=flashbooking&tab=solicitudes')}
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-top:20px">
        <p style="color:#0a0908;font-size:13px;line-height:1.6;margin:0 0 10px">
          <strong>¿Te está funcionando XPEAK?</strong> ${d.es_organizador
            ? 'Aprovecha y coméntaselo a otros organizadores que conozcas. Cuanta más gente organice sus eventos aquí, más fácil es que crezca la comunidad y mejor la oferta de profesionales.'
            : 'Aprovecha y coméntaselo a otros profesionales que conozcas: DJs, fotógrafos, camareros, maquilladores, cualquier oficio de eventos. Cuantos más seamos, más bolos hay para repartir entre todos.'}
        </p>
        <p style="color:#0a0908;font-size:13px;line-height:1.6;margin:0">
          Y si nos quieres seguir la pista: <a href="https://www.instagram.com/xpeaksite" style="color:#B8941E;font-weight:700;text-decoration:none">@xpeaksite en Instagram</a>.
        </p>
      </div>
      <p style="color:#9CA3AF;font-size:12px;margin-top:20px">
        Un minuto de tu tiempo. Si prefieres no valorar, ignora este correo.
      </p>
    `, `Cuéntanos qué tal fue ${esc(d.titulo)}`),
  }),

  // 2f. Reseña antigua sin las 3 preguntas nuevas: invitar a completarla.
  //
  // Reseñas aprobadas antes de añadir llego_puntual / cumplio_acordado /
  // volveria_contratar se quedaron incompletas. Se recuerda al empresario
  // que puede volver a la ficha del profesional y terminarla.
  completar_valoracion: (d) => ({
    subject: 'Termina tu valoración en XPEAK',
    to: d.email,
    html: base(`
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola, dejaste una valoración en XPEAK pero desde entonces añadimos tres
        preguntas nuevas que ayudan mucho más a otros organizadores: si el
        profesional llegó puntual, si cumplió lo acordado y si volverías a
        contratarlo.
      </p>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Solo te llevará un minuto completarla.
      </p>
      ${btn('Completar mi valoración →', `https://xpeak.es/dashboard?view=empresario&tab=historial`)}
      <p style="color:#9CA3AF;font-size:12px;margin-top:20px">
        Si prefieres no completarla, ignora este correo.
      </p>
    `, 'Termina tu valoración en XPEAK'),
  }),

  // 2a. Oferta Flash publicada — aviso al PROFESIONAL del rol buscado.
  //
  // Antes, publicar una oferta solo escribía una fila en flash_jobs: el toast
  // decía "visible 24h para todos los profesionales" pero nadie recibía aviso,
  // así que la oferta dependía de que alguien entrase al panel por casualidad.
  // Es el mismo agujero del caso Ramón (22 ago: 5 profesionales, 0 respuestas,
  // nadie se enteró en 12 días) por el otro lado del flujo.
  flash_job_nuevo: (d) => ({
    subject: `Nueva oferta para ti: ${esc(d.title)}${d.location ? ` — ${esc(d.location)}` : ''}`,
    to: d.email,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Oferta urgente')}</p>
        <p style="font-size:20px;font-weight:900;margin:6px 0 0;color:#0a0908">${esc(d.title)}</p>
      </div>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>, un organizador busca <strong>${esc(rolLegible(d.role_needed))}</strong> y tu perfil encaja.
      </p>
      ${rows([
        ['Qué buscan', esc(d.role_needed ?? '—')],
        ['Dónde', esc(d.location ?? 'Por concretar')],
        ['Pago', esc(d.pay ?? 'A consultar')],
        ['Detalles', esc(d.description ?? '—')],
      ])}
      <p style="color:#0a0908;font-size:13px;line-height:1.6;margin:16px 0 0">
        Las ofertas Flash caducan rápido: quien responde primero suele llevarse el bolo.
      </p>
      ${btn('Ver la oferta →', 'https://xpeak.es/dashboard?view=flashbooking')}
      ${d.sin_foto ? `
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-top:20px">
        <p style="color:#0a0908;font-size:13px;font-weight:700;line-height:1.6;margin:0 0 6px">Tu perfil todavía no tiene foto</p>
        <p style="color:#4b5563;font-size:13px;line-height:1.6;margin:0 0 14px">
          Esta oferta te ha llegado por tu rol, pero sin foto tu perfil no aparece en el directorio — el organizador nunca podrá encontrarte ni ver tu propuesta. Súbela ahora para no perderte la próxima.
        </p>
        ${btn('Subir mi foto →', 'https://xpeak.es/dashboard')}
      </div>` : ''}
    `, `${esc(d.role_needed ?? 'Profesional')} — ${esc(d.location ?? 'España')} — ${esc(d.pay ?? 'A consultar')}`),
  }),

  // 1b. Reseña nueva pendiente de aprobar — aviso a admin (13 sep 2026).
  // Antes solo se veía entrando a la pestaña "Reseñas" del panel: si el admin
  // no navegaba ahí, una reseña podía quedar semanas sin aprobar/rechazar sin
  // que nadie se enterara. Complementa el badge en AdminView.tsx (ver
  // admin_reviews_badge_trigger.sql), no lo sustituye — el badge es para
  // cuando ya estás en el panel, este email es para cuando no lo estás.
  resena_pendiente: (d) => ({
    subject: `Nueva reseña pendiente — ${esc(d.reviewer_name)} → ${esc(d.professional_name)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Reseña pendiente')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.reviewer_name)} → ${esc(d.professional_name)}</p>
      </div>
      ${rows([
        ['Puntuación', `${'★'.repeat(Number(d.rating) || 0)}${'☆'.repeat(5 - (Number(d.rating) || 0))}`],
        ['Comentario', d.comment],
      ])}
      ${btn('Revisar en el panel →', 'https://xpeak.es/dashboard?view=admin')}
    `, `Nueva reseña de ${esc(d.reviewer_name)} pendiente de aprobación`),
  }),

  // 2. Flash Booking — aviso a admin
  flash_booking: (d) => ({
    subject: `Flash Booking — ${esc(d.professional_name)} — ${esc(d.event_date ?? 'Sin fecha')}`,
    to: ADMIN,
    replyTo: d.requester_contact?.includes('@') ? d.requester_contact : ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 6px 16px rgba(212,175,55,0.16)">
        <p style="margin:0 0 4px">${badge('Flash Booking')}</p>
        <p style="font-size:20px;font-weight:900;margin:6px 0 0">Para: ${esc(d.professional_name)}</p>
      </div>
      ${rows([
        ['Solicitante', d.requester_name],
        ['Contacto', d.requester_contact],
        ['Fecha', d.event_date],
        ['Lugar', d.event_location],
        ['Descripción', d.event_description],
      ])}
      <p style="color:#9CA3AF;font-size:12px;margin-top:16px">Responder a este email contacta directamente al solicitante.</p>`),
  }),

  // 3. Flash Booking — confirmación al solicitante
  flash_booking_confirm: (d) => ({
    subject: `Solicitud enviada a ${esc(d.professional_name)} ✓`,
    to: d.requester_contact,
    html: base(`
      ${confirmSeal()}
      <h2 style="font-size:22px;font-weight:900;margin:0 0 8px;text-align:center;color:#0a0908">Solicitud enviada</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 24px;text-align:center">
        <strong style="color:#D4AF37">${esc(d.professional_name)}</strong> ha recibido tu solicitud y se pondrá en contacto contigo en breve.
      </p>
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:10px;padding:18px;margin:0 0 20px;box-shadow:0 6px 16px rgba(212,175,55,0.14)">
        ${rows([
          ['Profesional', d.professional_name],
          ['Evento', d.event_date],
          ['Lugar', d.event_location],
        ])}
      </div>
      <p style="color:#9CA3AF;font-size:12px;margin-top:20px;text-align:center">
        Si tienes dudas, escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a>
      </p>`),
  }),

  // 4. Empresario registrado — aviso admin
  empresario_registered: (d) => ({
    subject: `Nuevo empresario registrado — ${esc(d.name)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(10,9,8,0.03);border:1px solid rgba(10,9,8,0.06);border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 4px 14px rgba(10,9,8,0.08)">
        <p style="margin:0 0 4px">${badge('Nuevo Empresario', '#8E8EA0')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.name)}</p>
      </div>
      ${rows([
        ['Email', d.email],
        ['Nombre', d.name],
        ['Fecha registro', new Date().toLocaleDateString('es-ES')],
      ])}
      ${btn('Ver en panel admin →', 'https://xpeak.es/dashboard?view=admin')}`),
  }),

  // 4-bis. Profesional — aviso al admin de cada alta nueva.
  // Existia empresario_registered pero no su equivalente para profesionales,
  // asi que un alta con datos raros podia pasar dias sin que nadie la viera:
  // el 2 sep 2026 una cantante se registro con rol 'rookie' y zona Benidorm y
  // quedo invisible en el directorio hasta que se detecto por casualidad.
  // Incluye rol y zona precisamente para poder revisarlo el mismo dia.
  profesional_registered: (d) => ({
    subject: `Nuevo profesional — ${esc(d.name)} (${esc(rolLegible(d.role))}, ${esc(d.zone)})`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(10,9,8,0.03);border:1px solid rgba(10,9,8,0.06);border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 4px 14px rgba(10,9,8,0.08)">
        <p style="margin:0 0 4px">${badge('Nuevo Profesional', '#D4AF37')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.name)}</p>
      </div>
      ${rows([
        ['Email', d.email],
        ['Rol', d.role],
        ['Zona', d.zone],
        ['Fecha registro', new Date().toLocaleDateString('es-ES')],
      ])}
      <p style="font-size:13px;color:#6b6b6b;margin:18px 0 0">
        Revisa que el rol y la zona sean correctos: un rol equivocado deja el
        perfil fuera del directorio donde la gente lo busca.
      </p>
      ${btn('Ver en panel admin →', 'https://xpeak.es/dashboard?view=admin')}`),
  }),

  // Aviso a un profesional de que su ficha ya esta publicada.
  // Se enmarca como fin del proceso de validacion, nunca como fallo nuestro:
  // admitir un error resta credibilidad, una validacion suma profesionalidad.
  // Se firma como XPEAK, sin nombre propio, y sin invitar a reportar problemas.
  perfil_visible_disculpa: (d) => ({
    subject: 'Tu perfil ya está activo en XPEAK',
    to: d.email,
    html: base(`
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px">Hola ${esc(d.name)},</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px">
        Ya hemos terminado de validar tu ficha y está publicada. Apareces en el
        directorio y en las búsquedas de ${esc(d.city)}${d.city_ref ? ' y ' + esc(d.city_ref) : ''}.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 14px">
        Si te animas a subir algún audio o vídeo cantando, es lo que más ayuda a
        que un local se decida.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0">Un saludo,<br>XPEAK</p>
      ${btn('Ver mi perfil →', 'https://xpeak.es/dashboard')}`),
  }),

  // 5. Empresario — confirmación pendiente aprobación
  empresario_pending: (d) => ({
    subject: 'Tu cuenta empresario está pendiente de aprobación',
    to: d.email,
    html: base(`
      <h2 style="font-size:20px;font-weight:900;margin:0 0 10px;color:#0a0908">Solicitud recibida</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Hola <strong>${esc(d.name)}</strong>, hemos recibido tu solicitud de cuenta empresario en XPEAK.<br><br>
        Nuestro equipo revisará tu perfil en las próximas <strong style="color:#D4AF37">24-48 horas</strong> y te notificaremos cuando esté activo.
      </p>
      <p style="color:#9CA3AF;font-size:12px;text-align:center">
        ¿Tienes prisa? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a>
      </p>`),
  }),

  // 6. Cancelación de suscripción — aviso admin
  subscription_cancelled: (d) => ({
    subject: `Cancelación — ${esc(d.name)} — Plan ${esc(d.plan)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(255,95,86,0.06);border:1px solid rgba(255,95,86,0.2);border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 6px 16px rgba(255,95,86,0.18)">
        <p style="margin:0 0 4px">${badge('Cancelación', '#ff5f56')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.name)} — ${esc(d.plan)}</p>
      </div>
      ${rows([
        ['Email', d.email],
        ['Plan cancelado', d.plan],
        ['Motivo', d.reason || '—'],
        ['Comentario', d.comment || '—'],
      ])}`),
  }),

  // 7. Fan se suscribe — aviso al profesional (in-app por ahora, email futuro)
  fan_subscribed: (d) => ({
    subject: `Nuevo fan — ${esc(d.fan_name)} se ha suscrito a tu perfil`,
    to: ADMIN, // hasta que haya email del profesional en DB
    html: base(`
      <h2 style="font-size:18px;font-weight:900;margin:0 0 10px;color:#0a0908">Nuevo suscriptor</h2>
      ${rows([
        ['Profesional', d.professional_name],
        ['Fan', d.fan_name],
      ])}`),
  }),

  // 8. Formulario de contacto
  contact_form: (d) => ({
    subject: `Contacto web — ${esc(d.subject ?? 'Sin asunto')}`,
    to: ADMIN,
    replyTo: d.email,
    html: base(`
      <div style="background:rgba(212,175,55,0.04);border:1px solid rgba(212,175,55,0.15);border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 6px 16px rgba(212,175,55,0.14)">
        <p style="margin:0 0 4px">${badge('Formulario de contacto')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.subject ?? 'Mensaje de contacto')}</p>
      </div>
      ${rows([
        ['Nombre', d.name],
        ['Email', d.email],
        ['Teléfono', d.phone || '—'],
        ['Asunto', d.subject || '—'],
      ])}
      <div style="margin-top:16px;padding:14px;background:rgba(10,9,8,0.03);border-radius:8px">
        <p style="color:#9CA3AF;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Mensaje</p>
        <p style="font-size:14px;line-height:1.6;margin:0">${esc(d.message)}</p>
      </div>`),
  }),

  // 9. Solicitud de verificación sello dorado — aviso admin
  verification_request: (d) => ({
    subject: `Solicitud verificación — ${esc(d.name)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 6px 16px rgba(212,175,55,0.16)">
        <p style="margin:0 0 4px">${badge('Verificación Sello Dorado')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.name)}</p>
      </div>
      ${rows([
        ['Email', d.email],
        ['Rol', d.role],
        ['Zona', d.zone || '—'],
      ])}
      ${btn('Revisar perfil en admin →', 'https://xpeak.es/dashboard?view=admin')}`),
  }),

  // 10. Feature request — confirmación al usuario
  feature_request: (d) => ({
    subject: `Sugerencia recibida — XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:18px;font-weight:900;margin:0 0 10px">Gracias por tu sugerencia</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hemos recibido tu propuesta: <strong style="color:#D4AF37">${esc(d.feature)}</strong>.<br>
        La analizaremos y si entra en el roadmap te avisaremos.
      </p>
      <p style="color:#9CA3AF;font-size:12px;text-align:center">
        XPEAK está en fase beta — tu feedback es fundamental.
      </p>`),
  }),

  // 9. Validación aprobada — profesional
  admin_approved: (d) => ({
    subject: `Perfil aprobado — Bienvenido a XPEAK, ${esc(d.name)}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">¡Perfil aprobado!</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#0a0908">${esc(d.name)}</strong>, tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> ha sido verificado y ya apareces en el directorio de XPEAK.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa tu bio, sube tu audio y activa tu disponibilidad para empezar a recibir contactos.
      </p>
      ${btn('Ir a mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Dudas? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a></p>`),
  }),

  // 10. Validación rookie
  admin_rookie: (d) => ({
    subject: `Acceso Rookie activado — XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Bienvenido como Rookie</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#0a0908">${esc(d.name)}</strong>, hemos activado tu acceso con categoría <strong style="color:#D4AF37">Rookie</strong>.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa tu perfil y sube contenido de calidad. Cuando tengas suficiente historial podrás solicitar la validación como Profesional.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Dudas? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a></p>`),
  }),

  // 11. Validación rechazada
  admin_rejected: (d) => ({
    subject: `Actualización sobre tu perfil XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Sobre tu solicitud de validación</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#0a0908">${esc(d.name)}</strong>, hemos revisado tu perfil y en este momento no cumple los criterios mínimos para aparecer en el directorio.
      </p>
      ${d.reason ? `<p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px"><strong>Motivo:</strong> ${esc(d.reason)}</p>` : ''}
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Puedes completar tu perfil con más información (audio, bio, zona) y volver a solicitar validación cuando esté listo.
      </p>
      ${btn('Mejorar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Tienes preguntas? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a></p>`),
  }),

  // 11b. Foto de portada retirada por política de contacto (16 sep 2026):
  // la imagen incluía un teléfono visible, saltándose el contacto interno
  // que XPEAK garantiza a quien contrata. Tono: nunca "hemos detectado un
  // fallo tuyo", sino explicar la política y agradecer, sin admitir fallos.
  photo_policy_violation: (d) => ({
    subject: `Tu foto de perfil en XPEAK — acción necesaria`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Sobre tu foto de perfil</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#0a0908">${esc(d.name)}</strong>, estamos encantados de contar contigo en XPEAK.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Nuestras políticas no permiten que la foto de portada del perfil muestre datos de contacto (teléfono, redes, webs externas): todo el contacto entre profesionales y organizadores pasa por dentro de XPEAK, así queda protegido para ambas partes.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Hemos retirado temporalmente tu foto de portada. Puedes subir una nueva sin datos de contacto visibles en cualquier momento desde tu panel.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
        <tr>
          <td width="48%" style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-radius:8px;padding:12px;vertical-align:top">
            <p style="margin:0 0 4px;font-size:12px;font-weight:900;color:#DC2626">✗ Evitar</p>
            <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5">Teléfono, WhatsApp, Instagram o web escritos sobre la foto</p>
          </td>
          <td width="4%"></td>
          <td width="48%" style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.25);border-radius:8px;padding:12px;vertical-align:top">
            <p style="margin:0 0 4px;font-size:12px;font-weight:900;color:#16A34A">✓ Correcto</p>
            <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5">Tu foto o cartel, sin datos de contacto visibles</p>
          </td>
        </tr>
      </table>
      ${btn('Subir nueva foto →', 'https://xpeak.es/dashboard?view=settings')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Dudas? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a></p>`),
  }),

  // 12. Flash Booking — aviso al profesional (nueva solicitud recibida)
  booking_received: (d) => ({
    subject: `Nueva solicitud Flash Booking — ${esc(d.event_date ?? 'Fecha por confirmar')}`,
    to: d.email ?? ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 6px 16px rgba(212,175,55,0.16)">
        <p style="margin:0 0 4px">${badge('Flash Booking — Nueva solicitud')}</p>
        <p style="font-size:20px;font-weight:900;margin:6px 0 0">De: ${esc(d.requester_name ?? 'Empresario')}</p>
      </div>
      ${rows([
        ['Solicitante', d.requester_name],
        ['Contacto', d.requester_contact],
        ['Fecha', d.event_date],
        ['Lugar', d.event_location],
        ['Descripción', d.event_description],
        ['Caché acordado', d.agreed_price ? `${d.agreed_price}€` : '—'],
      ])}
      ${btn('Ver solicitud en XPEAK →', 'https://xpeak.es/dashboard?view=flashbooking&tab=solicitudes')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Acepta o rechaza la solicitud desde tu panel de Flash Booking.</p>`),
  }),

  // 13b. Contrato generado — avisa al profesional de que existe un contrato con su nombre
  contract_generated: (d) => ({
    subject: `Se ha generado un contrato contigo — ${esc(d.event_type ?? 'evento')}`,
    to: d.email,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 6px 16px rgba(212,175,55,0.16)">
        <p style="margin:0 0 4px">${badge('Contrato generado')}</p>
        <p style="font-size:20px;font-weight:900;margin:6px 0 0">Ref. ${esc(d.ref ?? '—')}</p>
      </div>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Hola <strong style="color:#0a0908">${esc(d.professional_name)}</strong>, <strong style="color:#D4AF37">${esc(d.contratante_nombre ?? 'un contratante')}</strong> ha generado un contrato contigo en XPEAK para el evento del <strong style="color:#0a0908">${esc(d.event_date ?? 'fecha por confirmar')}</strong>.
      </p>
      ${rows([
        ['Contratante', d.contratante_nombre],
        ['Fecha del evento', d.event_date],
        ['Tipo de evento', d.event_type],
        ['Importe', d.amount ? `${d.amount}€` : '—'],
      ])}
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:16px">
        Revisa el documento con calma antes de firmar. XPEAK no gestiona el envío del PDF — pídeselo directamente al contratante si no lo has recibido.
      </p>`),
  }),

  // 14. Aniversario 6 meses
  six_months_anniversary: (d) => ({
    subject: `¡Llevas 6 meses en XPEAK, ${esc(d.name)}!`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 6px;color:#0a0908">¡6 meses ya!</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Hola <strong style="color:#0a0908">${esc(d.name)}</strong>, hace exactamente 6 meses creaste tu perfil en XPEAK como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong>.<br><br>
        ${d.views > 0 ? `Tu ficha ha recibido <strong style="color:#D4AF37">${esc(String(d.views))} visitas</strong> hasta hoy.` : 'Tu perfil está activo y listo para que lo encuentren.'}
      </p>
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.15);border-radius:10px;padding:16px;margin-bottom:20px;text-align:center;box-shadow:0 6px 16px rgba(212,175,55,0.16)">
        <p style="color:#6B7280;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Consejo del momento</p>
        <p style="font-size:14px;font-weight:600;margin:0;line-height:1.6">Actualiza tu foto y bio — los perfiles actualizados reciben hasta 3× más contactos.</p>
      </div>
      ${btn('Ver mi perfil y actualizarlo →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">
        ¿Quieres darte de baja de estos emails? Escríbenos a <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a>
      </p>`),
  }),

  // 15. Lead blog — email automático tras capturar email en artículo
  lead_welcome: (d) => {
    const isProf = d.intent === 'ser-profesional';
    const isPresupuesto = d.variant === 'presupuestos' || !d.variant;
    const isPlantilla = d.variant === 'plantilla';
    const isGuia = d.variant === 'guia';

    const headline = isProf
      ? '¿Quieres conseguir más contratos como profesional?'
      : isPlantilla
      ? 'Tu plantilla de contrato DJ está lista'
      : isGuia
      ? 'Tu guía de precios DJ 2026 está lista'
      : 'Conectamos con los mejores profesionales para tu evento';

    const body = isProf
      ? `Crear tu perfil en XPEAK es gratis y te permite aparecer en el directorio, recibir ofertas de Flash Booking y firmar contratos digitales directamente con los clientes. Sin comisiones.`
      : isPlantilla
      ? `Adjuntamos el enlace a la plantilla de contrato para DJ con todas las cláusulas legales. Puedes editarla directamente o usarla para contratar tu DJ en XPEAK sin coste extra.`
      : isGuia
      ? `En XPEAK puedes comparar precios reales de DJs verificados en toda España — por ciudad, tipo de evento y horas. Todo transparente, sin llamadas ni intermediarios.`
      : `En XPEAK encuentras DJs, fotógrafos, camareros y staff verificados en toda España. Tarifas públicas, contratos automáticos y Flash Booking en menos de 1h. Completamente gratis para organizadores.`;

    const ctaText = isProf ? 'Crear mi perfil gratis →' : 'Ver profesionales disponibles →';
    const ctaUrl = isProf
      ? 'https://xpeak.es/auth?mode=register&role=profesional'
      : 'https://xpeak.es/auth?mode=register&role=empresario';

    const articleNote = d.article_path
      ? `<p style="color:#9CA3AF;font-size:11px;text-align:center;margin-top:8px">Este email se generó desde el artículo <a href="https://xpeak.es${esc(d.article_path)}" style="color:rgba(212,175,55,0.5)">${esc(d.article_path)}</a></p>`
      : '';

    return {
      subject: isProf
        ? 'Crea tu perfil en XPEAK y empieza a conseguir contratos'
        : isPlantilla
        ? 'Tu plantilla de contrato DJ — XPEAK'
        : isGuia
        ? 'Guía de precios DJ 2026 — XPEAK'
        : 'Tu consulta sobre profesionales para eventos — XPEAK',
      to: d.email,
      html: base(`
        <h2 style="font-size:20px;font-weight:900;margin:0 0 12px;line-height:1.3">${esc(headline)}</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.75;margin:0 0 20px">${esc(body)}</p>
        ${isPlantilla ? `
        <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:10px;padding:16px;margin-bottom:20px;text-align:center;box-shadow:0 6px 16px rgba(212,175,55,0.16)">
          <p style="color:#D4AF37;font-size:13px;font-weight:700;margin:0 0 8px">Plantilla de contrato DJ</p>
          <a href="https://xpeak.es/plantilla-contrato-dj" style="color:#4b5563;font-size:13px">xpeak.es/plantilla-contrato-dj</a>
        </div>` : ''}
        ${btn(ctaText, ctaUrl)}
        <div style="background:rgba(10,9,8,0.03);border:1px solid rgba(10,9,8,0.05);border-radius:8px;padding:14px;margin-top:4px">
          <p style="color:#9CA3AF;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Por qué XPEAK</p>
          <p style="font-size:12px;color:#6B7280;margin:0;line-height:1.6">✓ Directorio verificado · ✓ Contratos automáticos · ✓ Flash Booking en 1h · ✓ 0€ comisión</p>
        </div>
        ${articleNote}
      `),
    };
  },

  // Aviso a un lead (email capturado en una búsqueda del panel sin
  // resultados, DirectoryView) cuando se completa un perfil que encaja con lo
  // que buscaba. No se expone el perfil ni contacto directo: el CTA fuerza
  // crear cuenta de organizador, mismo embudo que lead_welcome — nunca se
  // saca el contacto de un profesional fuera de la app.
  // Aviso puntual (13 sep 2026): el sistema de reseñas estuvo bloqueado por
  // un bug de RLS todo el día — se envía a los dos usuarios reales afectados
  // (Burguer Gourmet Festival I y Gonzalo DJ) para que sepan que ya pueden
  // valorar con normalidad. No es una plantilla recurrente/automatizada.
  // Cuando el admin aprueba una reseña, se avisa a quien la recibió y se le
  // invita a dejar la suya también — cierra el ciclo de reciprocidad en vez
  // de que cada parte solo se entere entrando por su cuenta al panel.
  //
  // Gancho deliberado (13 sep 2026): no se muestra el rating ni el
  // comentario en el email — solo dentro del panel, tras entrar. Enseñarlo
  // aquí mataría la razón de hacer clic; el objetivo es tráfico real al
  // dashboard, no informar por email.
  te_han_dejado_una_resena: (d) => ({
    subject: `${esc(d.reviewer_name)} te ha dejado una reseña en XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:20px;font-weight:900;margin:0 0 12px;line-height:1.3">Te han dejado una reseña</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.75;margin:0 0 20px">
        Hola ${esc(d.name || '')}, <strong>${esc(d.reviewer_name)}</strong> acaba de valorar tu colaboración en XPEAK. Entra a tu panel para verla.
      </p>
      ${btn('Ver mi reseña →', 'https://xpeak.es/dashboard')}
      <p style="color:#4b5563;font-size:13px;line-height:1.75;margin:20px 0 0;text-align:center">
        ¿Por qué no dejas tú también la tuya? Ayudas a que la comunidad de XPEAK siga creciendo con confianza real entre organizadores y profesionales.
      </p>
    `),
  }),

  resenas_ya_disponibles: (d) => ({
    subject: 'Las reseñas ya funcionan con normalidad — XPEAK',
    to: d.email,
    html: base(`
      <h2 style="font-size:20px;font-weight:900;margin:0 0 12px;line-height:1.3">Ya puedes dejar tu reseña</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.75;margin:0 0 20px">
        Hola ${esc(d.name || '')}, debido a unos problemas técnicos, el sistema de reseñas de XPEAK ha estado fuera de servicio durante el día de hoy. Ya está solucionado y puedes valorar tu contratación con total normalidad, igual que la otra parte implicada.
      </p>
      ${btn('Ir a mi panel →', 'https://xpeak.es/dashboard')}
    `),
  }),

  lead_match_found: (d) => {
    const rol = rolLegible(d.role);
    const zona = esc(d.zone || 'España');
    return {
      subject: `Ya hay un ${rol} en ${zona} — XPEAK`,
      to: d.email,
      html: base(`
        <h2 style="font-size:20px;font-weight:900;margin:0 0 12px;line-height:1.3">Buenas noticias: ya hay disponibilidad</h2>
        <p style="color:#4b5563;font-size:14px;line-height:1.75;margin:0 0 20px">
          Buscabas ${esc(rol)} en ${zona} y no había nadie en XPEAK. Ya se ha registrado un profesional que encaja — puedes verlo y contactarlo creando tu cuenta de organizador, gratis.
        </p>
        ${btn('Ver profesional disponible →', 'https://xpeak.es/auth?mode=register&role=empresario')}
        <div style="background:rgba(10,9,8,0.03);border:1px solid rgba(10,9,8,0.05);border-radius:8px;padding:14px;margin-top:4px">
          <p style="color:#9CA3AF;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Por qué XPEAK</p>
          <p style="font-size:12px;color:#6B7280;margin:0;line-height:1.6">✓ Directorio verificado · ✓ Contratos automáticos · ✓ Flash Booking en 1h · ✓ 0€ comisión</p>
        </div>
      `),
    };
  },

  // 13a-bis. El DJ que ademas organiza: perfil de Organizador con la misma cuenta.
  //
  // Muchos DJs no solo pinchan: montan la fiesta entera y contratan camareros,
  // fotografo o azafatas. Hasta ahora nadie les habia dicho que pueden tener
  // ese segundo perfil sin registrarse otra vez ni dar otro correo.
  //
  // Es la via mas directa a mas organizadores: gente que ya esta dentro, que
  // ya monta eventos y que ya sabe lo que cuesta encontrar personal.
  organizador_segundo_perfil: (d) => ({
    subject: `${esc(d.name)}, si montas eventos puedes contratar desde tu cuenta`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">¿Montas eventos además de pinchar?</h2>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>. Muchos DJs no solo pinchan: montan la fiesta entera y necesitan
        camareros, fotógrafo o azafatas. Si es tu caso, puedes tener un perfil de
        <strong>Organizador</strong> en la misma cuenta que ya usas — sin registrarte otra vez y sin dar otro correo.
      </p>
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.25);border-radius:8px;padding:20px;margin:20px 0;box-shadow:0 8px 22px rgba(212,175,55,0.16)">
        <p style="color:#7a6216;font-weight:700;font-size:15px;margin:0 0 12px">Cómo se hace (30 segundos):</p>
        <p style="color:#0a0908;font-size:14px;line-height:1.9;margin:0">
          <strong>1.</strong> Entra en XPEAK y abre <strong>Ajustes</strong>.<br>
          <strong>2.</strong> Baja hasta <strong>Mis perfiles</strong> y pulsa <strong>Añadir perfil</strong>.<br>
          <strong>3.</strong> Ponle nombre, elige el rol <strong>Empresa / Sala</strong> (última de la lista) y tu ciudad.<br>
          <strong>4.</strong> Listo. Con el botón <strong>Cambiar</strong> pasas de uno a otro cuando quieras.
        </p>
      </div>
      <p style="color:#0a0908;font-size:14px;line-height:1.7;margin:0 0 16px">
        Tu perfil de DJ <strong>no se toca</strong>: sigue igual en el directorio, con tus géneros, tu tarifa y tus sesiones.
        El de Organizador es aparte, y es el que te deja buscar profesionales por ciudad, ver quién está disponible
        y mandar solicitudes.
      </p>
      ${btn('Crear mi perfil de Organizador →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:16px">¿Alguna duda? Responde a este email.</p>
    `),
  }),

  // 13b. Nuevo mensaje en chat
  new_message: (d) => ({
    subject: `${esc(d.sender_name)} te ha enviado un mensaje en XPEAK`,
    to: d.email,
    html: base(`
      <div style="text-align:center">
        ${avatarCircle(esc(d.sender_name).charAt(0).toUpperCase())}
        <h2 style="font-size:20px;font-weight:900;margin:0 0 8px;color:#0a0908">Mensaje nuevo de <span style="color:#D4AF37">${esc(d.sender_name)}</span></h2>
        <p style="color:#6B7280;font-size:14px;line-height:1.7;margin:0 0 6px">
          Tienes una conversación esperando respuesta en XPEAK.
        </p>
      </div>
      ${btn('Ver mensaje →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:11px;text-align:center;margin:0">
        Puedes desactivar estas notificaciones en Ajustes → Privacidad.
      </p>`),
  }),

  // 13c. Mensaje sin responder pasadas ~24h — segundo aviso, más directo
  unread_message_reminder: (d) => ({
    subject: `Aún no has respondido a ${esc(d.sender_name)} en XPEAK`,
    to: d.email,
    html: base(`
      <div style="text-align:center">
        ${avatarCircle(esc(d.sender_name).charAt(0).toUpperCase())}
        <h2 style="font-size:20px;font-weight:900;margin:0 0 8px;color:#0a0908"><span style="color:#D4AF37">${esc(d.sender_name)}</span> sigue esperando respuesta</h2>
        <p style="color:#6B7280;font-size:14px;line-height:1.7;margin:0 0 6px">
          Te escribió ayer y aún no has entrado a verlo. Una respuesta rápida marca la diferencia.
        </p>
      </div>
      ${btn('Responder ahora →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:11px;text-align:center;margin:0">
        Puedes desactivar estas notificaciones en Ajustes → Privacidad.
      </p>`),
  }),

  // 13d. Digest semanal al admin: perfiles sin foto 7+ días después del
  // aviso automático. No se manda al usuario — decide el admin cuándo
  // disparar photo_last_call a mano (amenaza con ocultar el perfil, no se
  // automatiza sin criterio humano).
  photo_missing_digest: (d) => ({
    subject: `${esc(String(d.count))} perfiles sin foto llevan 7+ días sin subirla`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Digest semanal')}</p>
        <p style="font-size:20px;font-weight:900;margin:6px 0 0;color:#0a0908">${esc(String(d.count))} perfiles sin foto</p>
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${(d.profiles as Array<{ name: string; role: string; zone: string; days: number }>).map((p) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(10,9,8,0.06);font-size:13px;color:#0a0908;font-weight:600">${esc(p.name)}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(10,9,8,0.06);font-size:13px;color:#6B7280">${esc(rolLegible(p.role))} · ${esc(p.zone)}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(10,9,8,0.06);font-size:12px;color:#9CA3AF;text-align:right;white-space:nowrap">${esc(String(p.days))}d</td>
        </tr>`).join('')}
      </table>
      <p style="color:#6B7280;font-size:12px;line-height:1.6;margin:16px 0 0">
        Ya recibieron el aviso automático de perfil incompleto hace más de una semana. Si quieres mandarles el último aviso (photo_last_call), dispáralo a mano desde el panel — no se envía solo.
      </p>
      ${btn('Ver en panel admin →', 'https://xpeak.es/dashboard?view=admin')}`),
  }),

  // 14. Badge Respuesta Rápida — notificación al profesional
  fast_responder_badge: (d) => ({
    subject: '¡Has ganado el badge Respuesta Rápida en XPEAK!',
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">¡Badge desbloqueado!</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Has respondido a una solicitud Flash Booking en <strong style="color:#D4AF37">menos de 1 hora</strong>.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Como recompensa, durante los próximos <strong style="color:#0a0908">30 días</strong> disfrutas de:
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        ${[
          ['Badge visible', 'El badge "Respuesta rápida" aparece en tu ficha del directorio.'],
          ['Posición destacada', 'Subes posiciones en los resultados del directorio frente a profesionales sin badge.'],
          ['Más visibilidad', 'Los organizadores ven tu badge antes de contactar — genera más confianza y más bookings.'],
        ].map(([k, v]) => `
        <tr>
          <td style="padding:10px 14px;background:rgba(212,175,55,0.07);border-radius:8px;vertical-align:top;width:40%">
            <span style="font-size:13px;font-weight:700;color:#D4AF37">${k}</span>
          </td>
          <td style="padding:10px 14px;font-size:13px;color:#4b5563;line-height:1.5">${v}</td>
        </tr>`).join('')}
      </table>
      <p style="color:#6B7280;font-size:12px;margin:0 0 20px">
        Cada vez que respondas rápido, el contador sube. Los organizadores podrán ver cuántas veces has respondido en tiempo récord.
        ${d.fast_responder_count > 1 ? `<br>Llevas ya <strong style="color:#D4AF37">${d.fast_responder_count} respuestas rápidas</strong>.` : ''}
      </p>
      ${btn('Ver mi ficha →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:16px">
        El badge se renueva automáticamente cada vez que vuelvas a responder en menos de 1h.
      </p>`),
  }),

  // 13. Flash Booking — respuesta del profesional al solicitante
  booking_status_update: (d) => ({
    subject: d.status === 'confirmed'
      ? `${esc(d.professional_name ?? 'El profesional')} ha aceptado tu solicitud`
      : `Tu solicitud Flash Booking — actualización`,
    to: d.email,
    html: base(d.status === 'confirmed' ? `
      ${confirmSeal()}
      <h2 style="font-size:22px;font-weight:900;margin:0 0 8px;text-align:center;color:#0a0908">Solicitud aceptada</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 24px;text-align:center">
        <strong style="color:#D4AF37">${esc(d.professional_name ?? 'El profesional')}</strong> ha aceptado tu solicitud de Flash Booking. Poneos en contacto directamente para cerrar los detalles.
      </p>
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:10px;padding:18px;margin:0 0 20px;box-shadow:0 6px 16px rgba(212,175,55,0.14)">
        ${rows([
          ['Profesional', d.professional_name],
          ['Fecha del evento', d.event_date],
          ['Lugar', d.event_location ?? '—'],
        ])}
      </div>
      <p style="color:#9CA3AF;font-size:12px;margin-top:20px;text-align:center">
        ¿Necesitas ayuda? <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a>
      </p>` : `
      <h2 style="font-size:20px;font-weight:900;margin:0 0 10px;color:#0a0908">Solicitud no disponible</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Lamentablemente <strong style="color:#0a0908">${esc(d.professional_name ?? 'el profesional')}</strong> no está disponible para tu evento del <strong>${esc(d.event_date ?? '—')}</strong>.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Puedes buscar otros profesionales disponibles en el directorio de XPEAK.
      </p>
      ${btn('Buscar otros profesionales →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">
        ¿Ayuda? <a href="mailto:info@xpeak.site" style="color:#D4AF37">info@xpeak.site</a>
      </p>`),
  }),

  // Aviso puntual a un local externo (no usuario de XPEAK) de que aparece en
  // la guía de locales del blog. Usa el mismo layout base() que el resto de
  // plantillas: un email nuevo sin la identidad visual de marca ya asentada
  // del dominio (logo, footer, estructura reconocible) cae en spam mucho más
  // fácil, aunque DKIM/SPF/DMARC estén correctos — lo comprobamos en vivo el
  // 21 sep con la primera versión en texto plano. Sí lleva List-Unsubscribe
  // aunque el destinatario no tenga perfil en el sistema: ayuda a la
  // entregabilidad y es la práctica esperada por los proveedores de correo.
  outreach_local: (d: any) => ({
    to: d.email,
    subject: 'Os hemos incluido en nuestra guía de locales para eventos en Madrid',
    replyTo: ADMIN,
    html: base(`
      <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 16px">Hola,</p>
      <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 16px">Somos XPEAK, un directorio de profesionales para eventos como DJs, camareros y fotógrafos en España.</p>
      <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 16px">Acabamos de publicar una guía de locales para fiestas y eventos en Madrid, y os hemos incluido porque nos parece un espacio que encaja muy bien.</p>
      <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 16px">Enlace al post: <a href="https://xpeak.es/blog/locales-para-eventos-madrid" style="color:#0D9488">xpeak.es/blog/locales-para-eventos-madrid</a></p>
      <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 16px">No es un directorio de pago ni os pedimos nada a cambio.</p>
      <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 16px">Un detalle de transparencia. Como no queríamos usar ninguna foto vuestra sin permiso, de momento tenéis puesta una foto genérica del tipo de local. Si nos mandáis una foto real vuestra, la cambiamos encantados.</p>
      <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 16px">Si tenéis curiosidad, también podéis echar un vistazo a nuestro <a href="https://xpeak.es/descubrir" style="color:#0D9488">directorio de profesionales</a>, por si os sirve de referencia para vuestros propios eventos o para recomendarlo a quien organice algo en vuestro local.</p>
      <p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0">Un saludo<br>Daniel, XPEAK</p>
    `, 'Os hemos incluido en nuestra guía de locales para eventos en Madrid'),
  }),
};

// denomailer codifica el body en quoted-printable y convierte todo "espacio +
// salto de línea" en "=20\r\n" (comportamiento correcto del estándar). Nuestros
// templates HTML son template literals indentados con muchos saltos de línea
// arrastrando espacios — algunos clientes de correo no decodifican bien esa
// secuencia y muestran "=20" literal. Colapsar los saltos/espacios entre tags
// antes de enviar elimina las líneas problemáticas sin tocar el contenido.
function minifyHtml(html: string): string {
  return html.replace(/>\s+</g, '><').replace(/[ \t]*\n[ \t]*/g, ' ').trim();
}

// RFC 2047 limita cada línea de cabecera codificada a 75 caracteres, y
// denomailer no la pliega: mete un salto de línea crudo en mitad del
// "=?utf-8?Q?...?=". El servidor lo lee como fin de cabeceras, así que el
// resto del asunto y TODAS las cabeceras siguientes (From, To, Content-Type)
// se derraman al cuerpo y el correo llega como texto plano con el MIME a la
// vista. Pasó el 4 sep 2026 con "Nuevo profesional — Aitana López Montealegre
// (Camarero y personal de sala, Madrid)" y de nuevo el 11 sep con "...David
// Anderson González Franco (DJ,…" — el límite anterior (60, contando 3 por
// carácter no-ASCII) subestimaba el Q-encoding real: éste codifica por BYTE
// UTF-8, no por carácter, así que un guion largo "—" (3 bytes) pesa 9
// caracteres codificados (=E2=80=94), no 3. Con el cálculo viejo, un asunto
// "válido" a 60 podía superar los 75 de línea real y denomailer lo partía
// a mitad de un carácter multi-byte, dejando bytes huérfanos ilegibles.
// Límite real: 75 (línea) − 12 (overhead fijo de "=?UTF-8?Q?" + "?=") = 63,
// medido sobre bytes UTF-8 codificados, no caracteres.
const SUBJECT_MAX_ENCODED = 63;
function qEncodedByteLen(s: string): number {
  const bytes = new TextEncoder().encode(s);
  let n = 0;
  for (const b of bytes) {
    // Imprimible ASCII no reservado por Q-encoding va literal (1 char);
    // todo lo demás (incluido el espacio, que se codifica "_" pero cuenta
    // igual) sale como "=XX" (3 chars).
    if (b >= 33 && b <= 126 && b !== 0x3D && b !== 0x3F && b !== 0x5F) n += 1;
    else n += b === 0x20 ? 1 : 3;
  }
  return n;
}
function clampSubject(subject: string): string {
  if (qEncodedByteLen(subject) <= SUBJECT_MAX_ENCODED) return subject;
  // El "…" final también pesa (3 bytes UTF-8 → 9 caracteres Q-encoded):
  // reservarle sitio de antemano, no añadirlo después del recorte.
  const ELLIPSIS_COST = qEncodedByteLen('…');
  const budget = SUBJECT_MAX_ENCODED - ELLIPSIS_COST;
  let out = '';
  for (const ch of subject) {
    if (qEncodedByteLen(out + ch) > budget) break;
    out += ch;
  }
  return out.trimEnd() + '…';
}

// SpamAssassin penaliza un correo que SOLO trae HTML (MIME_HTML_ONLY,
// HTML_MIME_NO_HTML_TAG, MPART_ALT_DIFF) — detectado el 21 sep vía
// mail-tester en la plantilla `welcome`, la más enviada del sistema. Un
// texto plano fiel, aunque tosco, basta para que el cliente lo reconozca
// como multipart/alternative real en vez de "HTML disfrazado de texto".
// No hace falta preservar el layout, solo dar una alternativa legible.
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (_m, href, text) => {
      const label = text.replace(/<[^>]+>/g, '').trim();
      return label && label !== href ? `${label} (${href})` : href;
    })
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function sendMail(to: string, subject: string, html: string, replyTo?: string, unsubUrl?: string) {
  html = minifyHtml(html);
  const content = htmlToPlainText(html);
  subject = clampSubject(subject);
  const smtpPass = Deno.env.get('SMTP_PASS');
  if (!smtpPass) throw new Error('SMTP_PASS not configured');
  const client = new SMTPClient({
    connection: {
      hostname: 'smtp.hostinger.com',
      port: 465,
      tls: true,
      auth: {
        username: Deno.env.get('SMTP_USER') ?? 'info@xpeak.site',
        password: smtpPass,
      },
    },
  });
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP timeout')), 10000));
  await Promise.race([
    client.send({
      from: FROM,
      to,
      replyTo: replyTo ?? ADMIN,
      subject,
      html,
      content,
      // Gmail/Yahoo exigen List-Unsubscribe + one-click desde feb 2024 en envíos
      // automatizados; sin estas cabeceras penalizan la entrega aunque el enlace
      // de baja esté en el HTML. Reutiliza el mismo token HMAC firmado.
      ...(unsubUrl
        ? {
            headers: {
              'List-Unsubscribe': `<${unsubUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }
        : {}),
    }).then(() => client.close()),
    timeout,
  ]);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // Verify request comes from our app (JWT or internal secret)
  const authHeader = req.headers.get('authorization') ?? '';
  const internalSecret = Deno.env.get('INTERNAL_SECRET') ?? '';
  const isInternal = internalSecret && req.headers.get('x-internal-secret') === internalSecret;
  const hasAuth = authHeader.startsWith('Bearer ') || isInternal;
  if (!hasAuth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  // Rate-limit por IP. El check de arriba NO es una barrera real contra
  // spam — el anon key de Supabase es público por diseño (visible en
  // cualquier bundle JS) y hay flujos legítimos sin sesión (formularios
  // públicos como PublicContactModal), así que validar el JWT no serviría:
  // cualquiera puede mandar el anon key real y sería indistinguible de un
  // visitante genuino. La mitigación real contra "cualquiera puede invocar
  // esto y mandar spam a terceros" es limitar volumen, no autenticar.
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';
  if (!isInternal) {
    const adminClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await adminClient
      .from('edge_function_rate_limit_log' as any)
      .select('id', { count: 'exact', head: true })
      .eq('endpoint', 'send-email')
      .eq('client_ip', clientIp)
      .gte('created_at', since);
    if (typeof count === 'number' && count >= 20) {
      return new Response(JSON.stringify({ error: 'rate_limit_exceeded' }), { status: 429, headers: corsHeaders });
    }
    try {
      await adminClient.from('edge_function_rate_limit_log' as any).insert({ endpoint: 'send-email', client_ip: clientIp });
    } catch { /* non-critical */ }
  }

  try {
    const { type, data } = await req.json();

    // Resolve email of the target user. IMPORTANTE: en avisos AL profesional
    // (booking_received), el email destino es el del PROFESIONAL, no el del
    // solicitante. El payload trae requester_contact (email de quien contacta),
    // que NO debe usarse como destino. Resolvemos data.email desde el user_id
    // del destinatario real (professional_user_id o user_id).
    const targetUserId = data?.professional_user_id ?? data?.user_id;
    if (targetUserId && !data?.email) {
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      const { data: userData } = await adminClient.auth.admin.getUserById(targetUserId);
      if (userData?.user?.email) data.email = userData.user.email;

      if (data?.professional_user_id && !data?.professional_name) {
        const { data: prof } = await adminClient
          .from('profiles').select('display_name').eq('user_id', data.professional_user_id).single();
        if (prof?.display_name) data.professional_name = prof.display_name;
      }
    }
    if (!type || typeof type !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing type' }), { status: 400, headers: corsHeaders });
    }
    const tmpl = TEMPLATES[type];
    if (!tmpl) return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), { status: 400, headers: corsHeaders });

    const { subject, html: rawHtml, to, replyTo } = tmpl(data);

    // Validate destination email before sending
    if (!to || !to.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid recipient email' }), { status: 400, headers: corsHeaders });
    }

    // Check email opt-out (skip for admin-only emails sent to info@xpeak.site)
    if (to !== ADMIN) {
      const optOutClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      // Por user_id si viene resuelto; si no, por email del destinatario (los
      // crons solo mandan el email). Antes solo se miraba con user_id y con
      // .single(), que falla con varios perfiles: el opt-out se ignoraba.
      const resolvedUserId = data?.user_id ?? data?.professional_user_id ?? null;
      const { data: optedOut } = await optOutClient
        .rpc('email_opted_out', { p_user_id: resolvedUserId, p_email: to });
      if (optedOut) {
        return new Response(JSON.stringify({ ok: true, skipped: 'opt_out' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Replace unsubscribe URL with signed token (prevents email enumeration)
    const token = await signEmail(to);
    const unsubUrl = `https://xpeak.es/baja-emails?token=${token}&e=${encodeURIComponent(to)}`;
    const html = rawHtml.replaceAll(UNSUB_PLACEHOLDER, unsubUrl);

    await sendMail(to, subject, html, replyTo, to !== ADMIN ? unsubUrl : undefined);

    // Log para el panel admin ("control absoluto" — 12 sep 2026): qué email
    // se le mandó a quién, con el HTML tal cual salió. No debe tumbar el
    // envío si falla — el correo ya salió, perder solo el registro es un mal
    // menor frente a decirle al usuario que su email no se envió.
    try {
      const logClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      await logClient.from('email_send_log' as any).insert({
        user_id: data?.user_id ?? data?.professional_user_id ?? null,
        to_email: to,
        type,
        subject,
        html,
      });
    } catch (logErr) {
      console.warn('[send-email] log failed:', logErr);
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('[send-email]', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
