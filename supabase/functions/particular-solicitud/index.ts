import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { comprobarEmail } from '../_shared/comprobarEmail.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// "Soy particular" de la landing (17 oct 2026). El particular no se registra:
// deja su email y lo que necesita. Esta función le crea una cuenta sin
// contraseña (solo entra por el enlace que recibe cuando un profesional
// acepta), manda la solicitud directa a los profesionales aprobados de ese
// oficio y avisa al admin. Si no hay a quién mandársela, queda como lead
// general para repartirla a mano, igual que antes.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

// Servicio del formulario -> roles de profesional que lo ofrecen.
const ROLES_POR_SERVICIO: Record<string, string[]> = {
  'DJ': ['dj'],
  'Disco móvil': ['disco-movil'],
  'Música en directo': ['grupo-musical'],
  'Fotógrafo / vídeo': ['media'],
  'Camareros / catering': ['catering', 'camarero'],
  'Food truck': ['food-truck'],
  'Animación': ['animador'],
  'Alquiler de equipo': ['alquiler'],
};

const MAX_PROFESIONALES = 10;
// Con poca oferta se manda a todos aunque no coincida la ciudad: el profesional
// decide si puede. Con mucha, sin ciudad que coincida, lo reparte el admin.
const OFERTA_PEQUENA = 5;
const MAX_FILAS_POR_EMAIL_DIA = 30;
const MAX_FILAS_GLOBAL_HORA = 150;

const limpio = (v: unknown, max: number) => String(v ?? '').replace(/<[^>]*>/g, '').trim().slice(0, max);

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const body = await req.json();
    // Campo trampa: invisible para personas, los bots lo rellenan.
    if (body.website) return json({ ok: true });

    const name = limpio(body.name, 60);
    const email = limpio(body.email, 254).toLowerCase();
    const eventType = limpio(body.eventType, 40);
    const service = limpio(body.service, 40);
    const date = limpio(body.date, 20);
    const location = limpio(body.location, 80);
    const budget = limpio(body.budget, 40);
    const message = limpio(body.message, 600);

    if (!name || !eventType || !service) return json({ error: 'Faltan datos' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: 'Email no válido' }, 400);

    const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

    const chequeo = await comprobarEmail(admin, email);
    if (!chequeo.ok) return json({ error: chequeo.error }, 400);

    const hace1h = new Date(Date.now() - 3600_000).toISOString();
    const hace24h = new Date(Date.now() - 86_400_000).toISOString();
    const { count: porEmail } = await admin.from('flash_bookings').select('id', { count: 'exact', head: true })
      .eq('requester_contact', email).gte('created_at', hace24h);
    if ((porEmail ?? 0) >= MAX_FILAS_POR_EMAIL_DIA) return json({ error: 'Demasiadas solicitudes hoy, escríbenos a info@xpeak.site' }, 429);
    const { count: global } = await admin.from('flash_bookings').select('id', { count: 'exact', head: true })
      .eq('source', 'particular').gte('created_at', hace1h);
    if ((global ?? 0) >= MAX_FILAS_GLOBAL_HORA) return json({ error: 'Ahora mismo no podemos atender más solicitudes, inténtalo en un rato' }, 429);

    // Cuenta del particular: se crea ya confirmada y sin contraseña. Si el
    // email ya tiene cuenta, se reutiliza (generateLink la devuelve).
    // Solo se asocia a la cuenta que crea esta misma petición. Si el email ya
    // tiene cuenta, NO se ata la solicitud a ella: cualquiera podría mandarla
    // con el email de otro y hacerle aparecer solicitudes y avisos que no pidió.
    // Esa solicitud queda como lead general sin cuenta, para repartir a mano.
    let userId: string | null = null;
    const creado = await admin.auth.admin.createUser({
      email, email_confirm: true,
      user_metadata: { display_name: name, particular: 'true', role: 'pending' },
    });
    if (creado.data?.user) userId = creado.data.user.id;
    else if (!/already|registered|exists/i.test(creado.error?.message ?? '')) {
      console.error('[particular-solicitud] createUser:', creado.error);
      return json({ error: 'No se pudo registrar la solicitud' }, 500);
    }

    // Profesionales del oficio.
    const roles = ROLES_POR_SERVICIO[service] ?? [];
    let destinatarios: { user_id: string; display_name: string; role: string }[] = [];
    // Sin cuenta propia (el email ya existía) no hay a quién devolver el chat: no se reparte.
    if (roles.length && userId) {
      const { data: perfiles } = await admin.from('profiles')
        .select('user_id, display_name, role, roles, zone, region, city_ref, is_seed, is_seed_profile')
        .eq('validation_status', 'approved')
        .or(roles.map(r => `role.eq.${r}`).join(','));
      const vistos = new Set<string>();
      const candidatos = (perfiles ?? []).filter(p => {
        if (p.is_seed || p.is_seed_profile || vistos.has(p.user_id)) return false;
        vistos.add(p.user_id);
        return true;
      });
      const q = location.toLowerCase();
      const coinciden = q
        ? candidatos.filter(p => [p.city_ref, p.zone, p.region].some(c => (c ?? '').toLowerCase().includes(q) || (q.length > 3 && q.includes((c ?? '').toLowerCase()) && (c ?? '').length > 2)))
        : [];
      const elegidos = coinciden.length ? coinciden : (candidatos.length <= OFERTA_PEQUENA ? candidatos : []);
      destinatarios = elegidos.slice(0, MAX_PROFESIONALES).map(p => ({ user_id: p.user_id, display_name: p.display_name, role: p.role }));
    }

    const extras = [budget && `Presupuesto: ${budget}`, message].filter(Boolean).join(' · ');
    const faltan = !date || !location;
    const descripcion = `Cliente particular que busca ${service.toLowerCase()} para un evento de tipo ${eventType}.`
      + (extras ? ` ${extras}.` : '')
      + (faltan ? ' Falta ' + [!date && 'la fecha', !location && 'el lugar'].filter(Boolean).join(' y ') + ': escríbele para concretarlo.' : '');

    const base = {
      requester_name: name, requester_contact: email,
      event_date: date || 'Por confirmar', event_location: location,
      status: 'pending', created_by: userId, source: 'particular',
    };
    const filas = destinatarios.length
      ? destinatarios.map(d => ({ ...base, professional_name: d.display_name, professional_role: d.role, professional_user_id: d.user_id, event_description: descripcion }))
      // Sin a quién mandarla: lead general para repartir a mano (como antes).
      : [{ ...base, professional_name: `Solicitud particular: ${service}`, professional_role: 'general', professional_user_id: null,
           event_description: `[Particular] [${eventType}] [${service}] ${extras}`.trim() }];

    const { error: errIns } = await admin.from('flash_bookings').insert(filas);
    if (errIns) { console.error('[particular-solicitud] insert:', errIns); return json({ error: 'No se pudo registrar la solicitud' }, 500); }

    // Avisos por email (admin y confirmación al particular) con la clave de servicio.
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const payload = {
      professional_name: `Solicitud particular: ${service}`, professional_role: 'general',
      requester_name: name, requester_contact: email,
      event_date: date || 'Por confirmar', event_location: location,
      event_description: `[Particular] [${eventType}] [${service}] ${extras}`.trim(),
      agreed_price: null, status: 'pending',
    };
    const enviar = (type: string, data: Record<string, unknown>) =>
      fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ type, data }),
      }).catch(err => console.warn('[particular-solicitud] email', type, err));
    const envios: Promise<unknown>[] = [enviar('flash_booking', payload), enviar('flash_booking_confirm', payload)];
    // Email a cada profesional del oficio, solo con nombre del cliente, fecha,
    // lugar y qué pide: el contacto del cliente no sale de XPEAK.
    for (const d of destinatarios) {
      envios.push(enviar('booking_received', {
        professional_user_id: d.user_id, requester_name: name,
        event_date: date || 'Por confirmar', event_location: location || 'Por confirmar',
        event_description: descripcion, agreed_price: null,
      }));
    }
    await Promise.all(envios);

    return json({ ok: true, enviadas: destinatarios.length, manual: destinatarios.length === 0 });
  } catch (err) {
    console.error('[particular-solicitud]', err);
    return json({ error: 'No se pudo registrar la solicitud' }, 500);
  }
});
