// Trayectoria verificada (22 nov 2026): el profesional Premium pide al
// organizador de un evento que lo confirme. XPEAK envía el correo con su
// remitente, nunca en nombre del profesional. Del correo solo se guarda un hash.
// POST { evento_id, email_organizador } con la sesión del profesional.
import { admin, respuesta, usuarioDe, cabeceras } from '../_shared/cobrosHttp.ts';
import { correosDelUsuario, decidirSolicitud, firmarConfirmacion, hashEmail } from '../_shared/trayectoria.ts';

const ESTADO_HTTP: Record<string, number> = {
  cobros_apagados: 403, no_premium: 403, correo_invalido: 400, correo_propio: 400, limite_correo: 429, limite_diario: 429,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cabeceras(req) });
  if (req.method !== 'POST') return respuesta(req, { error: 'Método no permitido' }, 405);
  const user = await usuarioDe(req);
  if (!user) return respuesta(req, { error: 'Inicia sesión' }, 401);

  try {
    const { evento_id, email_organizador } = await req.json();
    if (typeof evento_id !== 'string' || typeof email_organizador !== 'string') {
      return respuesta(req, { error: 'Datos incompletos' }, 400);
    }
    const db = admin();
    const { data: evento } = await db.from('trayectoria_eventos')
      .select('id, user_id, titulo, fecha, estado').eq('id', evento_id).maybeSingle();
    if (!evento || evento.user_id !== user.id) return respuesta(req, { error: 'Evento no encontrado' }, 404);
    if (evento.estado === 'confirmado') return respuesta(req, { error: 'ya_confirmado' }, 409);

    const { data: perfil } = await db.from('profiles').select('display_name, subscription_tier')
      .eq('user_id', user.id).order('is_primary', { ascending: false }).limit(1).maybeSingle();

    // Los topes fallan cerrados: si una consulta de conteo falla, no se envía.
    // Por destinatario: solicitudes ENVIADAS este mes a ese correo (no solo las
    // confirmadas), para que nadie llene de correos el buzón de otra persona.
    const hash = await hashEmail(email_organizador);
    const inicioMes = new Date(); inicioMes.setUTCDate(1); inicioMes.setUTCHours(0, 0, 0, 0);
    const { count: delMes, error: errMes } = await db.from('trayectoria_confirmaciones').select('id', { count: 'exact', head: true })
      .eq('email_hash', hash).gte('enviado_at', inicioMes.toISOString());

    // Por remitente: solicitudes de este profesional en las últimas 24 horas y,
    // en ese periodo, ninguna repetida al mismo correo (da igual el evento).
    const hace24h = new Date(Date.now() - 24 * 3600_000).toISOString();
    const { count: hoy, error: errHoy } = await db.from('trayectoria_confirmaciones').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).gte('enviado_at', hace24h);
    const { count: repetidas, error: errRep } = await db.from('trayectoria_confirmaciones').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).eq('email_hash', hash).gte('enviado_at', hace24h);
    if (!errRep && (repetidas ?? 0) > 0) return respuesta(req, { error: 'ya_pendiente' }, 409);

    const decision = decidirSolicitud({
      cobrosActivos: Deno.env.get('COBROS_ACTIVOS') === 'true',
      tier: perfil?.subscription_tier ?? null,
      correoOrganizador: email_organizador,
      correosPropios: correosDelUsuario(user),
      confirmadosEsteMes: errMes || delMes === null ? null : delMes,
      solicitudesHoy: errHoy || errRep || hoy === null ? null : hoy,
    });
    if (decision !== 'ok') return respuesta(req, { error: decision }, ESTADO_HTTP[decision]);

    const { data: conf, error } = await db.from('trayectoria_confirmaciones')
      .insert({ evento_id: evento.id, user_id: user.id, email_hash: hash }).select('id').single();
    if (error || !conf) throw error ?? new Error('Sin confirmación');
    await db.from('trayectoria_eventos').update({ estado: 'pendiente' }).eq('id', evento.id);

    const url = Deno.env.get('SUPABASE_URL') ?? '';
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const envio = await fetch(`${url}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${service}`, 'x-internal-secret': Deno.env.get('INTERNAL_SECRET') ?? '' },
      body: JSON.stringify({
        type: 'confirmar_evento',
        data: {
          email: email_organizador.trim(),
          profesional: perfil?.display_name || 'Un profesional',
          titulo: evento.titulo,
          fecha: evento.fecha,
          enlace: await firmarConfirmacion(evento.id, conf.id),
        },
      }),
    });
    if (!envio.ok) {
      console.error('[trayectoria-solicitar] envío fallido', await envio.text());
      return respuesta(req, { error: 'No se pudo enviar el correo' }, 502);
    }
    return respuesta(req, { ok: true });
  } catch (e) {
    console.error('[trayectoria-solicitar]', e);
    return respuesta(req, { error: 'Error inesperado' }, 500);
  }
});
