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
    <p style="color:#9CA3AF;font-size:11px;margin:0 0 6px">XPEAK · <a href="mailto:info@xpeak.es" style="color:#9CA3AF">info@xpeak.es</a> · <a href="https://xpeak.es" style="color:#9CA3AF">xpeak.es</a></p>
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

const rows = (pairs: [string, string][]) =>
  `<table style="width:100%;border-collapse:collapse">${pairs.map(([k, v]) =>
    `<tr><td style="padding:10px 0;color:#9CA3AF;font-size:12px;width:140px;border-bottom:1px solid rgba(10,9,8,0.06)">${esc(k)}</td><td style="padding:10px 0;color:#0a0908;font-size:13px;font-weight:600;border-bottom:1px solid rgba(10,9,8,0.06)">${esc(v) || '—'}</td></tr>`
  ).join('')}</table>`;

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
  welcome: (d) => ({
    subject: `Bienvenido a XPEAK, ${esc(d.name)}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Hola, ${esc(d.name)}</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> ya está activo en XPEAK.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa tu información para aparecer en el directorio y empezar a recibir contactos de empresarios de toda España.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`),
  }),

  // 1a2. Recordatorio si el perfil sigue incompleto — solo se manda una vez
  // (dedupe vía email_logs), nunca si ya se completó. El perfil SÍ aparece
  // en el directorio (no hay gate de visibilidad), pero incompleto pierde
  // oportunidades reales frente a organizadores que ya están buscando.
  profile_incomplete_reminder: (d) => ({
    subject: `${esc(d.name)}, te faltan ${esc(String(d.missingCount))} pasos para que te contraten`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#0a0908">Te faltan ${esc(String(d.missingCount))} pasos</h2>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 6px">
        Ahora mismo hay organizadores buscando profesionales como tú en XPEAK, y tu perfil como <strong style="color:#D4AF37">${esc(rolLegible(d.role))}</strong> está al ${esc(String(d.percent))}% — les cuesta más confiar en contratarte sin esta información, y algunos directamente pasan al siguiente perfil.
      </p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Solo te queda: ${esc(d.missingLabels)}.
      </p>
      ${btn('Terminar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`),
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
    `, `${esc(d.role_needed ?? 'Profesional')} — ${esc(d.location ?? 'España')} — ${esc(d.pay ?? 'A consultar')}`),
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
        Si tienes dudas, escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a>
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
        ¿Tienes prisa? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a>
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
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Dudas? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a></p>`),
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
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Dudas? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a></p>`),
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
      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px">
        Puedes completar tu perfil con más información (audio, bio, zona) y volver a solicitar validación cuando esté listo.
      </p>
      ${btn('Mejorar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:#9CA3AF;font-size:12px;text-align:center">¿Tienes preguntas? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a></p>`),
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
        ¿Quieres darte de baja de estos emails? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a>
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
        ¿Necesitas ayuda? <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a>
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
        ¿Ayuda? <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a>
      </p>`),
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
// (Camarero y personal de sala, Madrid)": 82 caracteres que codificados son
// 109. Cada carácter no-ASCII ocupa 3 (=C3=B3), así que el límite hay que
// medirlo sobre la longitud CODIFICADA, no sobre la del texto.
const SUBJECT_MAX_ENCODED = 60;
function clampSubject(subject: string): string {
  const encodedLen = (s: string) =>
    [...s].reduce((n, ch) => n + (ch.charCodeAt(0) < 128 ? 1 : 3), 0);
  if (encodedLen(subject) <= SUBJECT_MAX_ENCODED) return subject;
  let out = '';
  for (const ch of subject) {
    if (encodedLen(out + ch) > SUBJECT_MAX_ENCODED - 1) break;
    out += ch;
  }
  return out.trimEnd() + '…';
}

async function sendMail(to: string, subject: string, html: string, replyTo?: string) {
  html = minifyHtml(html);
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
    client.send({ from: FROM, to, replyTo: replyTo ?? ADMIN, subject, html }).then(() => client.close()),
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

    // Check email opt-out (skip for admin-only emails sent to info@xpeak.es)
    if (to !== ADMIN) {
      const optOutClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      // Use profile's user_id if already resolved; otherwise look up by email
      const resolvedUserId = data?.user_id ?? data?.professional_user_id ?? null;
      if (resolvedUserId) {
        const { data: profile } = await optOutClient
          .from('profiles').select('email_opt_out').eq('user_id', resolvedUserId).single();
        if (profile?.email_opt_out) {
          return new Response(JSON.stringify({ ok: true, skipped: 'opt_out' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // Replace unsubscribe URL with signed token (prevents email enumeration)
    const token = await signEmail(to);
    const unsubUrl = `https://xpeak.es/baja-emails?token=${token}&e=${encodeURIComponent(to)}`;
    const html = rawHtml.replaceAll(UNSUB_PLACEHOLDER, unsubUrl);

    await sendMail(to, subject, html, replyTo);

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('[send-email]', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
