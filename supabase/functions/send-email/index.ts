import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN = 'info@xpeak.es';
const FROM = 'XPEAK <info@xpeak.es>';

// Escape user-supplied strings before inserting into HTML to prevent injection
const esc = (s: unknown): string =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const UNSUB_PLACEHOLDER = '{{UNSUB_URL}}';

const base = (content: string) => `
<div style="font-family:sans-serif;background:#090909;color:#fff;padding:32px;max-width:520px;margin:0 auto;border-radius:12px;border:1px solid rgba(212,175,55,0.2)">
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
  `<a href="${esc(url)}" style="display:block;text-align:center;background:linear-gradient(135deg,#D4AF37,#B8941E);color:#000;font-weight:900;font-size:14px;padding:14px;border-radius:8px;text-decoration:none;margin:20px 0">${esc(text)}</a>`;

const rows = (pairs: [string, string][]) =>
  `<table style="width:100%;border-collapse:collapse">${pairs.map(([k, v]) =>
    `<tr><td style="padding:9px 0;color:rgba(255,255,255,0.35);font-size:12px;width:140px;border-bottom:1px solid rgba(255,255,255,0.05)">${esc(k)}</td><td style="padding:9px 0;font-size:13px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.05)">${esc(v) || '—'}</td></tr>`
  ).join('')}</table>`;

const TEMPLATES: Record<string, (d: any) => { subject: string; html: string; to: string; replyTo?: string }> = {

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
      ${btn('Ver en panel admin →', 'https://xpeak.es/admin-beta')}`),
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
      ${btn('Revisar perfil en admin →', 'https://xpeak.es/admin-beta')}`),
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
    to: d.email,
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
      ${btn('Ver solicitud en XPEAK →', 'https://xpeak.es/dashboard')}
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

async function sendMail(to: string, subject: string, html: string, replyTo?: string) {
  const client = new SMTPClient({
    connection: {
      hostname: 'smtp.hostinger.com',
      port: 465,
      tls: true,
      auth: {
        username: Deno.env.get('SMTP_USER') ?? 'info@xpeak.es',
        password: Deno.env.get('SMTP_PASS') ?? '',
      },
    },
  });
  await client.send({ from: FROM, to, replyTo: replyTo ?? ADMIN, subject, html });
  await client.close();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { type, data } = await req.json();

    // Resolve user_id → email and/or professional_user_id → professional_name + email
    if ((data?.user_id && !data?.email) || (data?.professional_user_id && (!data?.professional_name || !data?.email))) {
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      const targetId = data?.user_id ?? data?.professional_user_id;
      if (targetId && !data?.email) {
        const { data: userData } = await adminClient.auth.admin.getUserById(targetId);
        if (userData?.user?.email) data.email = userData.user.email;
      }
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
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      const { data: userData } = await adminClient.auth.admin.listUsers();
      const user = userData?.users?.find((u: any) => u.email?.toLowerCase() === to.toLowerCase());
      if (user) {
        const { data: profile } = await adminClient
          .from('profiles').select('email_opt_out').eq('user_id', user.id).single();
        if (profile?.email_opt_out) {
          return new Response(JSON.stringify({ ok: true, skipped: 'opt_out' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // Replace unsubscribe URL placeholder with recipient-specific link
    const unsubUrl = `https://xpeak.es/baja-emails?email=${encodeURIComponent(to)}`;
    const html = rawHtml.replaceAll(UNSUB_PLACEHOLDER, unsubUrl);

    await sendMail(to, subject, html, replyTo);

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('[send-email]', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
