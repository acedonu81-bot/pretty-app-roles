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
const FROM = 'XPEAK <info@xpeak.site>';

// Escape user-supplied strings before inserting into HTML to prevent injection
const esc = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const UNSUB_PLACEHOLDER = '{{UNSUB_URL}}';

const base = (content: string) => `
<div style="font-family:sans-serif;background:#0d0d0d;color:#fff;padding:32px;max-width:520px;margin:0 auto;border-radius:12px;border:1px solid rgba(212,175,55,0.2)">
  <div style="text-align:center;margin-bottom:24px">
    <a href="https://xpeak.es" style="text-decoration:none;font-size:26px;font-weight:900;letter-spacing:2px;color:#fff">X<span style="color:#D4AF37">PEAK</span></a>
  </div>
  ${content}
  <div style="margin-top:28px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.07);text-align:center">
    <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0 0 6px">XPEAK · <a href="mailto:info@xpeak.es" style="color:rgba(255,255,255,0.2)">info@xpeak.es</a> · <a href="https://xpeak.es" style="color:rgba(255,255,255,0.2)">xpeak.es</a></p>
    <p style="color:rgba(255,255,255,0.15);font-size:10px;margin:0">¿No quieres recibir más emails? <a href="${UNSUB_PLACEHOLDER}" style="color:rgba(255,255,255,0.3);text-decoration:underline">Anular suscripción</a></p>
  </div>
</div>`;

const badge = (text: string, color = '#D4AF37') =>
  `<span style="background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.25);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:1px">${esc(text)}</span>`;

const btn = (text: string, url: string) =>
  `<a href="${esc(url)}" style="display:block;text-align:center;background:linear-gradient(135deg,#D4AF37,#B8941E);color:#000;font-weight:900;font-size:14px;padding:15px;border-radius:10px;text-decoration:none;margin:20px 0;box-shadow:0 4px 16px rgba(212,175,55,0.25)">${esc(text)}</a>`;

// Círculo con inicial/emoji — para remitentes de mensajes, avisos de perfil, etc.
const avatarCircle = (initialOrEmoji: string) =>
  `<div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,rgba(212,175,55,0.18),rgba(212,175,55,0.06));border:1px solid rgba(212,175,55,0.3);display:table;margin:0 auto 18px"><div style="display:table-cell;text-align:center;vertical-align:middle;font-size:22px;font-weight:900;color:#D4AF37">${esc(initialOrEmoji)}</div></div>`;

const rows = (pairs: [string, string][]) =>
  `<table style="width:100%;border-collapse:collapse">${pairs.map(([k, v]) =>
    `<tr><td style="padding:9px 0;color:rgba(255,255,255,0.35);font-size:12px;width:140px;border-bottom:1px solid rgba(255,255,255,0.05)">${esc(k)}</td><td style="padding:9px 0;font-size:13px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.05)">${esc(v) || '—'}</td></tr>`
  ).join('')}</table>`;

const TEMPLATES: Record<string, (d: any) => { subject: string; html: string; to: string; replyTo?: string }> = {

  // 0. Early Adopter — primeros 20 profesionales
  early_adopter: (d) => ({
    subject: `🏆 ${esc(d.name)}, eres Early Adopter de XPEAK — posición Elite 6 meses gratis`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#D4AF37">🏆 Eres Early Adopter de XPEAK</h2>
      <p style="color:rgba(255,255,255,0.8);font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>, eres uno de los primeros profesionales en confiar en XPEAK desde el primer día. Eso tiene valor real para nosotros y queremos recompensarte.
      </p>
      <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.3);border-radius:8px;padding:20px;margin:20px 0">
        <p style="color:#D4AF37;font-weight:700;font-size:15px;margin:0 0 12px">Tu recompensa — válida hasta diciembre 2026:</p>
        <ul style="color:rgba(255,255,255,0.85);line-height:2.2;margin:0;padding-left:20px;font-size:14px">
          <li>Posición <strong style="color:#D4AF37">Elite</strong> en el directorio — 6 meses gratis</li>
          <li>Apareces el <strong style="color:#D4AF37">primero en todas las búsquedas</strong> de tu ciudad</li>
          <li>Badge exclusivo <strong style="color:#D4AF37">⭐ Early Adopter</strong> en tu ficha</li>
          <li>Acceso prioritario a todas las nuevas funciones</li>
          <li>Línea directa con el equipo — responde a este email</li>
        </ul>
      </div>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.7;margin:0 0 24px">
        Solo hay <strong style="color:#fff">20 plazas Early Adopter</strong> en toda España. La tuya está asegurada. Gracias por estar desde el principio.
      </p>
      ${btn('Ver mi perfil en XPEAK →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;margin-top:16px">¿Tienes dudas o sugerencias? Responde directamente a este email.</p>
    `),
  }),

  // 1. Bienvenida al nuevo usuario
  welcome: (d) => ({
    subject: `Bienvenido a XPEAK, ${esc(d.name)} 👋`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px">Hola, ${esc(d.name)} 👋</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu perfil como <strong style="color:#D4AF37">${esc(d.role)}</strong> ya está activo en XPEAK.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa tu información para aparecer en el directorio y empezar a recibir contactos de empresarios de toda España.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`),
  }),

  // 1a2. Recordatorio a las ~24-48h si el perfil sigue incompleto — solo se
  // manda una vez (dedupe vía email_logs), nunca si ya se completó.
  profile_incomplete_reminder: (d) => ({
    subject: `${esc(d.name)}, tu perfil no aparece en el directorio todavía`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px">Te faltan ${esc(String(d.missingCount))} pasos</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 6px">
        Tu perfil como <strong style="color:#D4AF37">${esc(d.role)}</strong> está al ${esc(String(d.percent))}% — hasta que lo completes, los organizadores no pueden encontrarte en el directorio.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Solo te queda: ${esc(d.missingLabels)}.
      </p>
      ${btn('Terminar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">Cualquier duda, responde a este email.</p>`),
  }),

  // 1b. Anuncio del programa de referidos — a profesionales ya registrados
  referral_announcement: (d) => ({
    subject: `${esc(d.name)}, invita a otro profesional y gana 6 meses de prioridad`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px;color:#2563eb">Invita y gana prioridad</h2>
      <p style="color:rgba(255,255,255,0.8);font-size:14px;line-height:1.7;margin:0 0 16px">
        Hola <strong>${esc(d.name)}</strong>, tienes disponible tu propio enlace de invitación en XPEAK — y cada profesional que invites y complete su perfil te da <strong style="color:#2563eb">+6 meses de badge azul de prioridad</strong>, apareciendo antes que el resto en el directorio de tu ciudad.
      </p>
      <div style="background:rgba(37,99,235,0.06);border:1px solid rgba(37,99,235,0.25);border-radius:8px;padding:20px;margin:20px 0">
        <p style="color:#2563eb;font-weight:700;font-size:15px;margin:0 0 12px">Tu enlace de invitación:</p>
        <p style="color:rgba(255,255,255,0.85);font-family:monospace;font-size:13px;background:rgba(0,0,0,0.3);border-radius:6px;padding:10px 12px;margin:0 0 8px;word-break:break-all">https://xpeak.es/auth?mode=register&amp;ref=${esc(d.referral_code)}</p>
        <p style="color:rgba(255,255,255,0.5);font-size:12px;line-height:1.6;margin:0">Compártelo con otros DJs, fotógrafos, camareros o cualquier profesional del sector que conozcas. Cuando complete su perfil (foto, bio y algún media), el premio se activa solo.</p>
      </div>
      ${btn('Ver mi enlace en mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;margin-top:16px">¿Tienes dudas? Responde directamente a este email.</p>
    `),
  }),

  // 2. Flash Booking — aviso a admin
  flash_booking: (d) => ({
    subject: `⚡ Flash Booking — ${esc(d.professional_name)} — ${esc(d.event_date ?? 'Sin fecha')}`,
    to: ADMIN,
    replyTo: d.requester_contact?.includes('@') ? d.requester_contact : ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
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
      <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:16px">Responder a este email contacta directamente al solicitante.</p>`),
  }),

  // 3. Flash Booking — confirmación al solicitante
  flash_booking_confirm: (d) => ({
    subject: `Solicitud enviada a ${esc(d.professional_name)} ✓`,
    to: d.requester_contact,
    html: base(`
      <h2 style="font-size:20px;font-weight:900;margin:0 0 10px">Solicitud recibida ✓</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Tu solicitud para <strong style="color:#D4AF37">${esc(d.professional_name)}</strong> ha sido enviada. El profesional se pondrá en contacto contigo pronto.
      </p>
      ${rows([
        ['Evento', d.event_date],
        ['Lugar', d.event_location],
      ])}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:20px;text-align:center">
        Si tienes dudas, escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a>
      </p>`),
  }),

  // 4. Empresario registrado — aviso admin
  empresario_registered: (d) => ({
    subject: `🏢 Nuevo empresario registrado — ${esc(d.name)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:16px;margin-bottom:20px">
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

  // 5. Empresario — confirmación pendiente aprobación
  empresario_pending: (d) => ({
    subject: 'Tu cuenta empresario está pendiente de aprobación',
    to: d.email,
    html: base(`
      <h2 style="font-size:20px;font-weight:900;margin:0 0 10px">Solicitud recibida</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Hola <strong>${esc(d.name)}</strong>, hemos recibido tu solicitud de cuenta empresario en XPEAK.<br><br>
        Nuestro equipo revisará tu perfil en las próximas <strong style="color:#D4AF37">24-48 horas</strong> y te notificaremos cuando esté activo.
      </p>
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
        ¿Tienes prisa? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a>
      </p>`),
  }),

  // 6. Cancelación de suscripción — aviso admin
  subscription_cancelled: (d) => ({
    subject: `❌ Cancelación — ${esc(d.name)} — Plan ${esc(d.plan)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(255,95,86,0.06);border:1px solid rgba(255,95,86,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
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
    subject: `⭐ Nuevo fan — ${esc(d.fan_name)} se ha suscrito a tu perfil`,
    to: ADMIN, // hasta que haya email del profesional en DB
    html: base(`
      <h2 style="font-size:18px;font-weight:900;margin:0 0 10px">Nuevo suscriptor ⭐</h2>
      ${rows([
        ['Profesional', d.professional_name],
        ['Fan', d.fan_name],
      ])}`),
  }),

  // 8. Formulario de contacto
  contact_form: (d) => ({
    subject: `📬 Contacto web — ${esc(d.subject ?? 'Sin asunto')}`,
    to: ADMIN,
    replyTo: d.email,
    html: base(`
      <div style="background:rgba(212,175,55,0.04);border:1px solid rgba(212,175,55,0.15);border-radius:8px;padding:16px;margin-bottom:20px">
        <p style="margin:0 0 4px">${badge('Formulario de contacto')}</p>
        <p style="font-size:18px;font-weight:900;margin:6px 0 0">${esc(d.subject ?? 'Mensaje de contacto')}</p>
      </div>
      ${rows([
        ['Nombre', d.name],
        ['Email', d.email],
        ['Teléfono', d.phone || '—'],
        ['Asunto', d.subject || '—'],
      ])}
      <div style="margin-top:16px;padding:14px;background:rgba(255,255,255,0.03);border-radius:8px">
        <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Mensaje</p>
        <p style="font-size:14px;line-height:1.6;margin:0">${esc(d.message)}</p>
      </div>`),
  }),

  // 9. Solicitud de verificación sello dorado — aviso admin
  verification_request: (d) => ({
    subject: `🔰 Solicitud verificación — ${esc(d.name)}`,
    to: ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
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
      <h2 style="font-size:18px;font-weight:900;margin:0 0 10px">Gracias por tu sugerencia 💡</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 16px">
        Hemos recibido tu propuesta: <strong style="color:#D4AF37">${esc(d.feature)}</strong>.<br>
        La analizaremos y si entra en el roadmap te avisaremos.
      </p>
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
        XPEAK está en fase beta — tu feedback es fundamental.
      </p>`),
  }),

  // 9. Validación aprobada — profesional
  admin_approved: (d) => ({
    subject: `✅ Perfil aprobado — Bienvenido a XPEAK, ${esc(d.name)}`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px">¡Perfil aprobado! ✅</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#fff">${esc(d.name)}</strong>, tu perfil como <strong style="color:#D4AF37">${esc(d.role)}</strong> ha sido verificado y ya apareces en el directorio de XPEAK.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa tu bio, sube tu audio y activa tu disponibilidad para empezar a recibir contactos.
      </p>
      ${btn('Ir a mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">¿Dudas? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a></p>`),
  }),

  // 10. Validación rookie
  admin_rookie: (d) => ({
    subject: `🌱 Acceso Rookie activado — XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px">Bienvenido como Rookie 🌱</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#fff">${esc(d.name)}</strong>, hemos activado tu acceso con categoría <strong style="color:#D4AF37">Rookie</strong>.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Completa tu perfil y sube contenido de calidad. Cuando tengas suficiente historial podrás solicitar la validación como Profesional.
      </p>
      ${btn('Completar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">¿Dudas? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a></p>`),
  }),

  // 11. Validación rechazada
  admin_rejected: (d) => ({
    subject: `Actualización sobre tu perfil XPEAK`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px">Sobre tu solicitud de validación</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 6px">
        Hola <strong style="color:#fff">${esc(d.name)}</strong>, hemos revisado tu perfil y en este momento no cumple los criterios mínimos para aparecer en el directorio.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Puedes completar tu perfil con más información (audio, bio, zona) y volver a solicitar validación cuando esté listo.
      </p>
      ${btn('Mejorar mi perfil →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">¿Tienes preguntas? Escríbenos a <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a></p>`),
  }),

  // 12. Flash Booking — aviso al profesional (nueva solicitud recibida)
  booking_received: (d) => ({
    subject: `⚡ Nueva solicitud Flash Booking — ${esc(d.event_date ?? 'Fecha por confirmar')}`,
    to: d.email ?? ADMIN,
    html: base(`
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:16px;margin-bottom:20px">
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
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">Acepta o rechaza la solicitud desde tu panel de Flash Booking.</p>`),
  }),

  // 14. Aniversario 6 meses
  six_months_anniversary: (d) => ({
    subject: `¡Llevas 6 meses en XPEAK, ${esc(d.name)}! 🎉`,
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 6px">¡6 meses ya! 🎉</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Hola <strong style="color:#fff">${esc(d.name)}</strong>, hace exactamente 6 meses creaste tu perfil en XPEAK como <strong style="color:#D4AF37">${esc(d.role)}</strong>.<br><br>
        ${d.views > 0 ? `Tu ficha ha recibido <strong style="color:#D4AF37">${esc(String(d.views))} visitas</strong> hasta hoy.` : 'Tu perfil está activo y listo para que lo encuentren.'}
      </p>
      <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.15);border-radius:10px;padding:16px;margin-bottom:20px;text-align:center">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Consejo del momento</p>
        <p style="font-size:14px;font-weight:600;margin:0;line-height:1.6">Actualiza tu foto y bio — los perfiles actualizados reciben hasta 3× más contactos.</p>
      </div>
      ${btn('Ver mi perfil y actualizarlo →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
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
      ? `<p style="color:rgba(255,255,255,0.3);font-size:11px;text-align:center;margin-top:8px">Este email se generó desde el artículo <a href="https://xpeak.es${esc(d.article_path)}" style="color:rgba(212,175,55,0.5)">${esc(d.article_path)}</a></p>`
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
        <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.75;margin:0 0 20px">${esc(body)}</p>
        ${isPlantilla ? `
        <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.2);border-radius:10px;padding:16px;margin-bottom:20px;text-align:center">
          <p style="color:#D4AF37;font-size:13px;font-weight:700;margin:0 0 8px">📄 Plantilla de contrato DJ</p>
          <a href="https://xpeak.es/plantilla-contrato-dj" style="color:rgba(255,255,255,0.7);font-size:13px">xpeak.es/plantilla-contrato-dj</a>
        </div>` : ''}
        ${btn(ctaText, ctaUrl)}
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:14px;margin-top:4px">
          <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Por qué XPEAK</p>
          <p style="font-size:12px;color:rgba(255,255,255,0.5);margin:0;line-height:1.6">✓ Directorio verificado · ✓ Contratos automáticos · ✓ Flash Booking en 1h · ✓ 0€ comisión</p>
        </div>
        ${articleNote}
      `),
    };
  },

  // 13b. Nuevo mensaje en chat
  new_message: (d) => ({
    subject: `💬 ${esc(d.sender_name)} te ha enviado un mensaje en XPEAK`,
    to: d.email,
    html: base(`
      <div style="text-align:center">
        ${avatarCircle(esc(d.sender_name).charAt(0).toUpperCase())}
        <h2 style="font-size:20px;font-weight:900;margin:0 0 8px">Mensaje nuevo de <span style="color:#D4AF37">${esc(d.sender_name)}</span></h2>
        <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 6px">
          Tienes una conversación esperando respuesta en XPEAK.
        </p>
      </div>
      ${btn('Ver mensaje →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.25);font-size:11px;text-align:center;margin:0">
        Puedes desactivar estas notificaciones en Ajustes → Privacidad.
      </p>`),
  }),

  // 14. Badge Respuesta Rápida — notificación al profesional
  fast_responder_badge: (d) => ({
    subject: '⚡ ¡Has ganado el badge Respuesta Rápida en XPEAK!',
    to: d.email,
    html: base(`
      <h2 style="font-size:22px;font-weight:900;margin:0 0 10px">¡Badge desbloqueado! ⚡</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 6px">
        Has respondido a una solicitud Flash Booking en <strong style="color:#D4AF37">menos de 1 hora</strong>.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Como recompensa, durante los próximos <strong style="color:#fff">30 días</strong> disfrutas de:
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        ${[
          ['⚡ Badge visible', 'El badge "Respuesta rápida" aparece en tu ficha del directorio.'],
          ['🔝 Posición destacada', 'Subes posiciones en los resultados del directorio frente a profesionales sin badge.'],
          ['📈 Más visibilidad', 'Los organizadores ven tu badge antes de contactar — genera más confianza y más bookings.'],
        ].map(([k, v]) => `
        <tr>
          <td style="padding:10px 14px;background:rgba(212,175,55,0.07);border-radius:8px;vertical-align:top;width:40%">
            <span style="font-size:13px;font-weight:700;color:#D4AF37">${k}</span>
          </td>
          <td style="padding:10px 14px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.5">${v}</td>
        </tr>`).join('')}
      </table>
      <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 20px">
        Cada vez que respondas rápido, el contador sube. Los organizadores podrán ver cuántas veces has respondido en tiempo récord.
        ${d.fast_responder_count > 1 ? `<br>Llevas ya <strong style="color:#D4AF37">${d.fast_responder_count} respuestas rápidas</strong>.` : ''}
      </p>
      ${btn('Ver mi ficha →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;margin-top:16px">
        El badge se renueva automáticamente cada vez que vuelvas a responder en menos de 1h.
      </p>`),
  }),

  // 13. Flash Booking — respuesta del profesional al solicitante
  booking_status_update: (d) => ({
    subject: d.status === 'confirmed'
      ? `✅ ${esc(d.professional_name ?? 'El profesional')} ha aceptado tu solicitud`
      : `Tu solicitud Flash Booking — actualización`,
    to: d.email,
    html: base(d.status === 'confirmed' ? `
      <h2 style="font-size:20px;font-weight:900;margin:0 0 10px">¡Solicitud aceptada! ✅</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        <strong style="color:#D4AF37">${esc(d.professional_name ?? 'El profesional')}</strong> ha aceptado tu solicitud de Flash Booking.<br>
        Os ponéis en contacto directamente para cerrar los detalles.
      </p>
      ${rows([
        ['Fecha del evento', d.event_date],
        ['Lugar', d.event_location ?? '—'],
      ])}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:20px;text-align:center">
        ¿Necesitas ayuda? <a href="mailto:info@xpeak.es" style="color:#D4AF37">info@xpeak.es</a>
      </p>` : `
      <h2 style="font-size:20px;font-weight:900;margin:0 0 10px">Solicitud no disponible</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Lamentablemente <strong style="color:#fff">${esc(d.professional_name ?? 'el profesional')}</strong> no está disponible para tu evento del <strong>${esc(d.event_date ?? '—')}</strong>.
      </p>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 20px">
        Puedes buscar otros profesionales disponibles en el directorio de XPEAK.
      </p>
      ${btn('Buscar otros profesionales →', 'https://xpeak.es/dashboard')}
      <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center">
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

async function sendMail(to: string, subject: string, html: string, replyTo?: string) {
  html = minifyHtml(html);
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
