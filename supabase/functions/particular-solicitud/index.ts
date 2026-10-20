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
//
// 18 oct 2026: nada se reparte hasta que el particular confirma su email.
// Antes cualquiera ponía "r" de nombre y de ciudad y salía aviso a 10 DJs.
// Ahora el formulario exige fecha y ciudad, la función le manda un email con
// un botón "Confirmar y enviar" (enlace firmado a /solicitud-confirmada, que
// vale 48 h) y solo al pulsarlo se crean las solicitudes, a 5 como mucho.

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

// Último dato que se pide en el email de "faltan datos", según el oficio.
const ULTIMO_DATO: Record<string, string> = {
  'DJ': 'Estilo de música que te gusta',
  'Disco móvil': 'Estilo de música que te gusta',
  'Música en directo': 'Estilo de música que buscas',
  'Fotógrafo / vídeo': 'Si quieres foto, vídeo o las dos',
  'Camareros / catering': 'Si es comida, bebida o las dos, y cuántos servicios',
  'Food truck': 'Qué tipo de comida te gustaría',
  'Animación': 'Edad de los asistentes',
  'Alquiler de equipo': 'Qué equipo necesitas',
};

const MAX_PROFESIONALES = 5;
// Con poca oferta se manda a todos aunque no coincida la ciudad: el profesional
// decide si puede. Con mucha, sin ciudad que coincida, lo reparte el admin.
const OFERTA_PEQUENA = 5;
const MAX_FILAS_POR_EMAIL_DIA = 30;
const MAX_FILAS_GLOBAL_HORA = 150;

const limpio = (v: unknown, max: number) => String(v ?? '').replace(/<[^>]*>/g, '').trim().slice(0, max);

type Perfil = {
  user_id: string; display_name: string; role: string; zone: string | null; region: string | null;
  city_ref: string | null; is_seed: boolean | null; is_seed_profile: boolean | null;
};

type Datos = {
  name: string; email: string; eventType: string; service: string;
  date: string; location: string; budget: string; message: string; iat: number;
  // Obligatorios desde el 20 oct 2026; opcionales en el tipo para no invalidar enlaces ya enviados.
  personas?: string; horario?: string;
};

// Enlace de confirmación: los datos van en el propio enlace, firmados con
// HMAC (clave de servicio), así no hace falta tabla de pendientes.
const CADUCA_MS = 48 * 3600_000;
const enc = new TextEncoder();
const b64url = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deB64url = (s: string) => Uint8Array.from(
  atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0));
const clave = () => crypto.subtle.importKey('raw', enc.encode(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''),
  { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

async function firmar(d: Datos): Promise<string> {
  const datos = enc.encode(JSON.stringify(d));
  const firma = new Uint8Array(await crypto.subtle.sign('HMAC', await clave(), datos));
  return `${b64url(datos)}.${b64url(firma)}`;
}

async function leerToken(t: string): Promise<Datos | null> {
  try {
    const [a, b] = t.split('.');
    if (!a || !b) return null;
    const datos = deB64url(a);
    if (!(await crypto.subtle.verify('HMAC', await clave(), deB64url(b), datos))) return null;
    const d = JSON.parse(new TextDecoder().decode(datos)) as Datos;
    return Date.now() - d.iat > CADUCA_MS ? null : d;
  } catch { return null; }
}

const barajar = <T,>(xs: T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// Teclazos, repeticiones o palabras de prueba (mismo criterio que src/lib/solicitudCompleta.ts).
const textoBasura = (texto: string): boolean => {
  const t = texto.trim().toLowerCase();
  const letras = (t.match(/\p{L}/gu) ?? []).length;
  if (letras < 2) return true;
  const sinEsp = t.replace(/\s+/g, '');
  if (/^(.)\1{2,}$/u.test(sinEsp)) return true;
  if (sinEsp.length >= 4 && /^[jhaeiou]+$/u.test(sinEsp) && (sinEsp.match(/j/g) ?? []).length >= 2) return true;
  if (/\b(asdf|qwer|zxcv|xxxx|test|prueba|pruebas|probando|fake|nada|ninguno)\b/u.test(t)) return true;
  if (letras >= 4 && !/[aeiouáéíóúü]/u.test(t)) return true;
  return false;
};

const fechaValida = (f: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) return false;
  const dia = new Date(`${f}T23:59:59Z`).getTime();
  return dia >= Date.now() - 86_400_000 && dia <= Date.now() + 2 * 365 * 86_400_000;
};

const enviar = (type: string, data: Record<string, unknown>) =>
  fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''}` },
    body: JSON.stringify({ type, data }),
  }).catch(err => console.warn('[particular-solicitud] email', type, err));

// deno-lint-ignore no-explicit-any
async function limites(admin: any, email: string): Promise<Response | null> {
  const hace1h = new Date(Date.now() - 3600_000).toISOString();
  const hace24h = new Date(Date.now() - 86_400_000).toISOString();
  const { count: porEmail } = await admin.from('flash_bookings').select('id', { count: 'exact', head: true })
    .eq('requester_contact', email).gte('created_at', hace24h);
  if ((porEmail ?? 0) >= MAX_FILAS_POR_EMAIL_DIA) return json({ error: 'Demasiadas solicitudes hoy, escríbenos a info@xpeak.site' }, 429);
  const { count: global } = await admin.from('flash_bookings').select('id', { count: 'exact', head: true })
    .eq('source', 'particular').gte('created_at', hace1h);
  if ((global ?? 0) >= MAX_FILAS_GLOBAL_HORA) return json({ error: 'Ahora mismo no podemos atender más solicitudes, inténtalo en un rato' }, 429);
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    const body = await req.json();
    const admin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

    // Paso 2: el particular pulsó el botón del email.
    if (body.confirmar) {
      const d = await leerToken(String(body.confirmar));
      if (!d) return json({ error: 'El enlace ha caducado o no es válido. Vuelve a enviar la solicitud desde xpeak.es.' }, 400);
      // Pulsar dos veces no reparte dos veces.
      const { count: ya } = await admin.from('flash_bookings').select('id', { count: 'exact', head: true })
        .eq('requester_contact', d.email).eq('source', 'particular').gte('created_at', new Date(d.iat).toISOString());
      if (ya) return json({ ok: true, ya: true, servicio: d.service });
      const tope = await limites(admin, d.email);
      if (tope) return tope;
      return await repartir(admin, d);
    }

    // Paso 1: formulario. Se valida y se manda el email de confirmación.
    // Campo trampa: invisible para personas, los bots lo rellenan.
    if (body.website) return json({ ok: true, verificar: true });

    const d: Datos = {
      name: limpio(body.name, 60),
      email: limpio(body.email, 254).toLowerCase(),
      eventType: limpio(body.eventType, 40) || 'Otro',
      service: limpio(body.service, 40),
      date: limpio(body.date, 20),
      location: limpio(body.location, 80),
      personas: limpio(body.personas, 30).replace(/[\[\]]/g, ''),
      horario: limpio(body.horario, 40).replace(/[\[\]]/g, ''),
      budget: limpio(body.budget, 40),
      message: limpio(body.message, 600),
      iat: Date.now(),
    };

    if (d.name.length < 2 || !d.service) return json({ error: 'Faltan datos' }, 400);
    // Sin todos los datos no se manda nada a nadie (20 oct 2026): tampoco con texto de
    // prueba ("r", "jajaja", "test"...), que avisaba a profesionales reales.
    if (!limpio(body.eventType, 40)) return json({ error: 'Elige el tipo de evento' }, 400);
    if (!d.personas) return json({ error: 'Pon el número aproximado de personas' }, 400);
    if (!d.horario || d.horario.length < 4 || !/\d/.test(d.horario)) return json({ error: 'Pon el horario del evento (por ejemplo, de 22:00 a 03:00)' }, 400);
    if (textoBasura(d.name)) return json({ error: 'Pon tu nombre real para que los profesionales sepan con quién hablan' }, 400);
    if (textoBasura(d.location)) return json({ error: 'Pon la ciudad o el lugar del evento' }, 400);
    if (!fechaValida(d.date)) return json({ error: 'Pon la fecha del evento' }, 400);
    if (d.location.length < 3 || !/\p{L}{3}/u.test(d.location)) return json({ error: 'Pon la ciudad del evento' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return json({ error: 'Email no válido' }, 400);

    // Un profesional que usa este formulario con su propio correo (caso DJ DERRE, 20 oct):
    // primero que cree un perfil de organizador; si no, aquí todo el mundo prueba.
    try {
      const { data: esPro } = await admin.rpc('cuenta_profesional_sin_organizador', { p_email: d.email });
      if (esPro === true) {
        return json({ error: 'Este correo ya es de una cuenta de profesional. Para pedir un profesional entra en xpeak.es, ve a Ajustes, pulsa Añadir perfil y elige Empresa / Sala. Luego publica tu solicitud desde ahí.' }, 400);
      }
    } catch (e) { console.warn('[particular-solicitud] comprobación de profesional no disponible', e); }

    const chequeo = await comprobarEmail(admin, d.email);
    if (!chequeo.ok) return json({ error: chequeo.error }, 400);
    const tope = await limites(admin, d.email);
    if (tope) return tope;
    // Como mucho 5 emails de confirmación por dirección y hora.
    const { count: confirmaciones } = await admin.from('email_send_log').select('id', { count: 'exact', head: true })
      .eq('type', 'particular_confirmar').eq('to_email', d.email).gte('sent_at', new Date(Date.now() - 3600_000).toISOString());
    if ((confirmaciones ?? 0) >= 5) return json({ error: 'Ya te hemos mandado el email de confirmación, míralo en tu correo (también en spam)' }, 429);

    const url = `https://xpeak.es/solicitud-confirmada?t=${await firmar(d)}`;
    await enviar('particular_confirmar', { name: d.name, email: d.email, oficio: d.service, fecha: d.date, ciudad: d.location, url });
    return json({ ok: true, verificar: true });
  } catch (err) {
    console.error('[particular-solicitud]', err);
    return json({ error: 'No se pudo registrar la solicitud' }, 500);
  }
});

// deno-lint-ignore no-explicit-any
async function repartir(admin: any, d: Datos): Promise<Response> {
  const { name, email, eventType, service, date, location, budget, message } = d;

  // Cuenta del particular, confirmada y sin contraseña. Como ya ha demostrado
  // que el email es suyo (pulsó el enlace), si ya tenía cuenta se usa esa.
  let userId: string | null = null;
  const creado = await admin.auth.admin.createUser({
    email, email_confirm: true,
    user_metadata: { display_name: name, particular: 'true', role: 'pending' },
  });
  if (creado.data?.user) userId = creado.data.user.id;
  else if (/already|registered|exists/i.test(creado.error?.message ?? '')) {
    const { data: link } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
    userId = link?.user?.id ?? null;
  } else {
    console.error('[particular-solicitud] createUser:', creado.error);
    return json({ error: 'No se pudo registrar la solicitud' }, 500);
  }
  // Profesionales del oficio.
  const roles = ROLES_POR_SERVICIO[service] ?? [];
  let destinatarios: { user_id: string; display_name: string; role: string }[] = [];
  if (roles.length && userId) {
    const { data: perfiles } = await admin.from('profiles')
      .select('user_id, display_name, role, roles, zone, region, city_ref, is_seed, is_seed_profile')
      .eq('validation_status', 'approved')
      .or(roles.map(r => `role.eq.${r}`).join(','));
    const vistos = new Set<string>();
    const candidatos = ((perfiles ?? []) as Perfil[]).filter(p => {
      if (p.is_seed || p.is_seed_profile || vistos.has(p.user_id)) return false;
      vistos.add(p.user_id);
      return true;
    });
    // Un lugar de 1-2 letras ("r") coincidía por subcadena con casi cualquier zona
  // y el aviso salía a 10 profesionales: por debajo de 3 letras no cuenta como lugar.
  const q = location.length >= 3 ? location.toLowerCase() : '';
    const coinciden = q
      ? candidatos.filter(p => [p.city_ref, p.zone, p.region].some(c => (c ?? '').toLowerCase().includes(q) || (q.length > 3 && q.includes((c ?? '').toLowerCase()) && (c ?? '').length > 2)))
      : [];
    // Al azar entre los que encajan: antes salían siempre los 10 primeros que
    // devolvía la base de datos (los mismos DJs de Madrid en cada solicitud).
    const elegidos = barajar(coinciden.length ? coinciden : (candidatos.length <= OFERTA_PEQUENA ? candidatos : []));
    destinatarios = elegidos.slice(0, MAX_PROFESIONALES).map(p => ({ user_id: p.user_id, display_name: p.display_name, role: p.role }));
  }

  const extras = [budget && `Presupuesto: ${budget}`, message].filter(Boolean).join(' · ');
  const faltan = !date || location.length < 3;
  const detalle = d.personas && d.horario ? `[Personas: ${d.personas}] [Horario: ${d.horario}] ` : '';
  const descripcion = detalle + `Cliente particular que busca ${service.toLowerCase()} para un evento de tipo ${eventType}.`
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
         event_description: `${detalle}[Particular] [${eventType}] [${service}] ${extras}`.trim() }];

  const { error: errIns } = await admin.from('flash_bookings').insert(filas);
  if (errIns) { console.error('[particular-solicitud] insert:', errIns); return json({ error: 'No se pudo registrar la solicitud' }, 500); }

  // Avisos por email (admin y confirmación al particular) con la clave de servicio.
  const payload = {
    professional_name: `Solicitud particular: ${service}`, professional_role: 'general',
    requester_name: name, requester_contact: email,
    event_date: date || 'Por confirmar', event_location: location,
    event_description: `[Particular] [${eventType}] [${service}] ${extras}`.trim(),
    agreed_price: null, status: 'pending',
  };
  const envios: Promise<unknown>[] = [enviar('flash_booking', payload), enviar('flash_booking_confirm', payload)];
  // Faltan fecha o lugar (o el lugar es basura): le pedimos los datos por email
  // para que los profesionales puedan contestar con precio.
  if (faltan || location.length < 3) {
    envios.push(enviar('particular_aclarar_solicitud', {
      user_id: userId, name, email, oficio: service.toLowerCase(),
      n_profesionales: destinatarios.length || undefined,
      ultimo_dato: ULTIMO_DATO[service],
    }));
  }
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

  return json({ ok: true, enviadas: destinatarios.length, manual: destinatarios.length === 0, servicio: service });
}
