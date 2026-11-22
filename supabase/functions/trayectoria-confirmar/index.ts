// Trayectoria verificada (22 nov 2026): el organizador confirma desde el
// correo, sin cuenta. La página xpeak.es/confirmar-evento llama aquí:
//   { t, accion: 'ver' }       → qué evento y qué profesional (no cambia nada)
//   { t, accion: 'confirmar' } → marca el evento como confirmado, una sola vez
// Solo se confirma por POST tras pulsar el botón: abrir el enlace (o que lo
// abra un antivirus) no confirma nada.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { leerConfirmacion } from '../_shared/trayectoria.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);
  try {
    const { t, accion } = await req.json();
    const d = typeof t === 'string' ? await leerConfirmacion(t) : null;
    if (!d) return json({ error: 'El enlace no es válido' }, 400);

    const db = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { data: conf } = await db.from('trayectoria_confirmaciones')
      .select('id, evento_id, confirmado_at').eq('id', d.c).maybeSingle();
    if (!conf || conf.evento_id !== d.e) return json({ error: 'El enlace no es válido' }, 400);
    const { data: evento } = await db.from('trayectoria_eventos')
      .select('id, user_id, titulo, fecha, ciudad, lugar').eq('id', d.e).maybeSingle();
    if (!evento) return json({ error: 'El evento ya no existe' }, 404);
    const { data: pro } = await db.from('profiles').select('display_name, photo_url, specialty')
      .eq('user_id', evento.user_id).order('is_primary', { ascending: false }).limit(1).maybeSingle();

    const datos = {
      nombre: pro?.display_name || 'El profesional', foto: pro?.photo_url ?? null, oficio: pro?.specialty ?? null,
      titulo: evento.titulo, fecha: evento.fecha, ciudad: evento.ciudad, lugar: evento.lugar,
    };
    if (accion === 'ver') return json({ ok: true, ...datos, ya: !!conf.confirmado_at });
    if (accion !== 'confirmar') return json({ error: 'Respuesta no válida' }, 400);
    if (conf.confirmado_at) return json({ ok: true, ...datos, ya: true });

    const ahora = new Date().toISOString();
    await db.from('trayectoria_confirmaciones').update({ confirmado_at: ahora }).eq('id', conf.id).is('confirmado_at', null);
    await db.from('trayectoria_eventos').update({ estado: 'confirmado', confirmado_at: ahora }).eq('id', evento.id);
    await db.from('analytics_events').insert({
      event_name: 'evento_confirmado_por_organizador', user_id: evento.user_id, detalle: evento.id, path: '/confirmar-evento',
    });
    return json({ ok: true, ...datos, ya: true });
  } catch (e) {
    console.error('[trayectoria-confirmar]', e);
    return json({ error: 'Error inesperado' }, 500);
  }
});
