// Trayectoria verificada (22 nov 2026): a los 3 días del evento XPEAK pregunta
// a cada parte de una contratación "¿se cerró el acuerdo?" (Sí / No). Sirve para
// medir cuántos acuerdos salen de XPEAK y cuántos coinciden entre las dos partes.
// Lo lanza el cron (secreto interno, ver _shared/soloInterno.ts). Cada parte
// recibe UNA sola pregunta por contratación. Todo sale como XPEAK.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { esLlamadaInterna, noAutorizado } from '../_shared/soloInterno.ts';
import { contratacionesParaPreguntar, firmarAcuerdo, type Contratacion } from '../_shared/trayectoria.ts';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const esDemo = (e: string) => e.trim().toLowerCase().startsWith('demo.') && e.trim().toLowerCase().endsWith('@xpeak.es');

Deno.serve(async (req) => {
  if (!esLlamadaInterna(req)) return noAutorizado();
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const db = createClient(url, service);

  const ahora = new Date();
  const dia = (d: number) => new Date(ahora.getTime() - d * 24 * 3600_000).toISOString().slice(0, 10);
  const desde = dia(60), hasta = dia(3);

  const contrataciones: Contratacion[] = [];

  // Contrataciones por Flash Booking (sin los autorregistros: son pruebas propias).
  const { data: flash, error: errFlash } = await db.from('flash_bookings')
    .select('id, created_by, professional_user_id, professional_name, event_description, event_date, es_autorregistro')
    .in('status', ['confirmed', 'completed'])
    .gte('event_date', desde).lte('event_date', hasta)
    .not('professional_user_id', 'is', null).not('created_by', 'is', null);
  if (errFlash) { console.error('[acuerdo-cerrado-reminder] flash', errFlash); return json({ error: errFlash.message }, 500); }
  for (const b of flash ?? []) {
    if (b.es_autorregistro) continue;
    contrataciones.push({
      origen: 'flash', origen_id: b.id, fecha: b.event_date,
      titulo: (b.event_description || `Evento con ${b.professional_name}`).slice(0, 80),
      partes: [b.created_by, b.professional_user_id],
    });
  }

  // Contrataciones por solicitud de evento (el organizador eligió y contrató).
  const { data: resp, error: errResp } = await db.from('event_request_responses')
    .select('id, professional_user_id, event_requests!inner(client_user_id, event_type, city, event_date)')
    .not('hired_at', 'is', null)
    .gte('event_requests.event_date', desde).lte('event_requests.event_date', hasta);
  if (errResp) { console.error('[acuerdo-cerrado-reminder] solicitudes', errResp); return json({ error: errResp.message }, 500); }
  for (const r of (resp ?? []) as any[]) {
    const q = Array.isArray(r.event_requests) ? r.event_requests[0] : r.event_requests;
    if (!q || !UUID.test(q.client_user_id ?? '')) continue;
    contrataciones.push({
      origen: 'solicitud', origen_id: r.id, fecha: q.event_date,
      titulo: [q.event_type, q.city].filter(Boolean).join(' en ').slice(0, 80) || 'Evento',
      partes: [q.client_user_id, r.professional_user_id],
    });
  }
  if (!contrataciones.length) return json({ ok: true, preguntadas: 0 });

  const { data: hechas } = await db.from('acuerdo_respuestas').select('origen, origen_id, user_id')
    .in('origen_id', contrataciones.map(c => c.origen_id));
  const ya = new Set((hechas ?? []).map(h => `${h.origen}:${h.origen_id}:${h.user_id}`));

  let enviadas = 0;
  const errores: string[] = [];
  for (const p of contratacionesParaPreguntar(ahora, contrataciones, ya)) {
    // Sin correo real (cuenta demo o sin correo) no se pregunta ni se cuenta como "preguntada".
    const { data: u } = await db.auth.admin.getUserById(p.user_id);
    const email = u?.user?.email;
    if (!email || esDemo(email)) continue;

    // Se reserva la fila antes de enviar: si dos ejecuciones coinciden, solo una envía.
    // Solo un duplicado (23505) se salta en silencio; cualquier otro error se anota.
    const { error: errIns } = await db.from('acuerdo_respuestas')
      .insert({ origen: p.origen, origen_id: p.origen_id, user_id: p.user_id });
    if (errIns) {
      if (errIns.code !== '23505') { console.error('[acuerdo-cerrado-reminder] reserva', errIns); errores.push(p.user_id); }
      continue;
    }
    const { data: perfil } = await db.from('profiles').select('display_name')
      .eq('user_id', p.user_id).order('is_primary', { ascending: false }).limit(1).maybeSingle();
    const res = await fetch(`${url}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${service}`, 'x-internal-secret': Deno.env.get('INTERNAL_SECRET') ?? '' },
      body: JSON.stringify({
        type: 'acuerdo_cerrado',
        data: { email, name: perfil?.display_name || 'Hola', titulo: p.titulo, fecha: p.fecha, enlace: await firmarAcuerdo(p.origen, p.origen_id, p.user_id) },
      }),
    });
    if (res.ok) { enviadas++; continue; }
    // El envío falló: se libera la fila para que mañana se reintente y no cuente como "sin respuesta".
    errores.push(p.user_id);
    await db.from('acuerdo_respuestas').delete()
      .eq('origen', p.origen).eq('origen_id', p.origen_id).eq('user_id', p.user_id).is('respuesta', null);
  }
  return json({ ok: errores.length === 0, preguntadas: enviadas, errores: errores.length });
});
