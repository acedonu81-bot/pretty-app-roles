// Trayectoria verificada (22 nov 2026): respuesta a "¿se cerró el acuerdo?"
// desde el correo, sin cuenta. xpeak.es/acuerdo-cerrado llama aquí:
//   { t, accion: 'ver' }                         → qué evento se pregunta
//   { t, accion: 'responder', r: 'si' | 'no' }   → guarda la respuesta, una vez
//   { t, accion: 'anadir' }                      → el profesional que dijo Sí lo añade a su trayectoria
// Se responde solo por POST tras pulsar un botón. Cuando las DOS partes dicen
// Sí, el evento de la trayectoria del profesional pasa a "Contrato XPEAK".
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { acuerdoCerrado, leerAcuerdo } from '../_shared/trayectoria.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);
  try {
    const { t, accion, r } = await req.json();
    const d = typeof t === 'string' ? await leerAcuerdo(t) : null;
    if (!d) return json({ error: 'El enlace no es válido' }, 400);

    const db = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data: filas } = await db.from('acuerdo_respuestas')
      .select('user_id, respuesta, evento_id').eq('origen', d.o).eq('origen_id', d.i);
    const mia = (filas ?? []).find(f => f.user_id === d.u);
    if (!mia) return json({ error: 'El enlace no es válido' }, 400);

    // Datos del evento, según de dónde venga la contratación.
    let titulo = 'tu evento', fecha = '', profesionalId: string | null = null;
    if (d.o === 'flash') {
      const { data: b } = await db.from('flash_bookings')
        .select('event_description, professional_name, event_date, professional_user_id').eq('id', d.i).maybeSingle();
      if (b) { titulo = (b.event_description || `Evento con ${b.professional_name}`).slice(0, 80); fecha = b.event_date; profesionalId = b.professional_user_id; }
    } else {
      const { data: x } = await db.from('event_request_responses')
        .select('professional_user_id, event_requests!inner(event_type, city, event_date)').eq('id', d.i).maybeSingle();
      const q = x && ((Array.isArray((x as any).event_requests) ? (x as any).event_requests[0] : (x as any).event_requests));
      if (x && q) { titulo = ([q.event_type, q.city].filter(Boolean).join(' en ') || 'Evento').slice(0, 80); fecha = q.event_date; profesionalId = x.professional_user_id; }
    }
    const esProfesional = !!profesionalId && profesionalId === d.u;
    const base = { ok: true, titulo, fecha, respuesta: mia.respuesta, esProfesional, anadido: !!mia.evento_id };

    if (accion === 'ver') return json(base);

    if (accion === 'responder') {
      if (r !== 'si' && r !== 'no') return json({ error: 'Respuesta no válida' }, 400);
      if (mia.respuesta) return json(base); // ya contestó: no se pisa
      const ahora = new Date().toISOString();
      const { error } = await db.from('acuerdo_respuestas').update({ respuesta: r, respondido_at: ahora })
        .eq('origen', d.o).eq('origen_id', d.i).eq('user_id', d.u).is('respuesta', null);
      if (error) throw error;
      await db.from('analytics_events').insert({ event_name: 'acuerdo_respuesta', user_id: d.u, detalle: `${d.o}|${d.i}|${r}`, path: '/acuerdo-cerrado' });

      // ¿Las dos partes dicen Sí? Si el profesional ya tiene el evento en su trayectoria, sube a "Contrato XPEAK".
      const todas = (filas ?? []).map(f => (f.user_id === d.u ? r : f.respuesta) as 'si' | 'no' | null);
      if (acuerdoCerrado(todas)) {
        const evento = (filas ?? []).find(f => f.evento_id)?.evento_id;
        if (evento) await db.from('trayectoria_eventos').update({ origen: 'xpeak', estado: 'confirmado', confirmado_at: ahora }).eq('id', evento);
      }
      return json({ ...base, respuesta: r });
    }

    if (accion === 'anadir') {
      if (!esProfesional || mia.respuesta !== 'si') return json({ error: 'No se puede añadir' }, 403);
      if (mia.evento_id) return json({ ...base, anadido: true });
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !UUID.test(d.u)) return json({ error: 'Faltan datos del evento' }, 400);
      const { data: ev, error } = await db.from('trayectoria_eventos')
        .insert({ user_id: d.u, titulo: titulo.length >= 3 ? titulo : 'Evento', fecha }).select('id').single();
      if (error || !ev) throw error ?? new Error('Sin evento');
      await db.from('acuerdo_respuestas').update({ evento_id: ev.id }).eq('origen', d.o).eq('origen_id', d.i).eq('user_id', d.u);
      // Si el organizador ya había dicho Sí, el evento nace con el sello fuerte.
      const otra = (filas ?? []).filter(f => f.user_id !== d.u).map(f => f.respuesta as 'si' | 'no' | null);
      if (acuerdoCerrado(['si', ...otra])) {
        await db.from('trayectoria_eventos').update({ origen: 'xpeak', estado: 'confirmado', confirmado_at: new Date().toISOString() }).eq('id', ev.id);
      }
      return json({ ...base, anadido: true });
    }
    return json({ error: 'Respuesta no válida' }, 400);
  } catch (e) {
    console.error('[acuerdo-cerrado-responder]', e);
    return json({ error: 'Error inesperado' }, 500);
  }
});
