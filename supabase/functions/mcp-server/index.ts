import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * MCP server de XPEAK — expone el directorio de profesionales de eventos
 * a agentes de IA (Claude, ChatGPT, Perplexity...) vía el Model Context
 * Protocol (JSON-RPC 2.0 sobre HTTP). Tres herramientas:
 *   - buscar_profesionales: lectura pública, sin fricción.
 *   - consultar_precio_medio: promedio en vivo sobre profiles.hourly_rate,
 *     sin dataset propio — cubre el patrón de búsqueda "cuánto cuesta un
 *     DJ en Madrid" directamente vía tool-use (auditoría GEO 22 sep 2026).
 *   - solicitar_presupuesto: mismo insert en flash_bookings que ya usa
 *     el formulario web (mismos emails). Rate-limit propio, más estricto
 *     que el del formulario web: este endpoint no puede exigir el registro
 *     que sí exige el resto de la web desde el 09 sep 2026 (un agente de IA
 *     no tiene forma de autenticarse como un usuario XPEAK real), así que
 *     se trata como lead sin calificar — email obligatorio, origen marcado.
 *
 * Cada llamada queda registrada en mcp_query_log — es el activo de
 * retroalimentación: qué pregunta la gente vía IA, si eso convierte.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Misma lista que KNOWN_ROLES en src/pages/Auth.tsx (fuente de verdad del
// signup) — las edge functions no comparten build con el frontend, así que
// se duplica a mano. Si se añade un rol nuevo al signup y no aquí, el MCP
// responde "rol no reconocido" a profesionales que sí existen (bug real
// encontrado en la auditoría del 10 sep 2026).
const KNOWN_ROLES = ['dj', 'grupo-musical', 'media', 'makeup', 'peluqueria', 'staff', 'azafata', 'promotor', 'empresario', 'catering', 'mago', 'humorista', 'animador', 'bailarin', 'speaker', 'vestuario', 'photo-booth', 'tecnico', 'local_eventos'];

// Alias de rol — misma fuente que ROLE_ALIASES en src/lib/constants.ts.
// Sin esto, buscar_profesionales con rol="staff" no encontraba a quien está
// guardado en BD como "camarero" (y viceversa para makeup/peluqueria).
const ROLE_ALIASES: Record<string, string[]> = {
  staff: ['staff', 'camarero'],
  makeup: ['makeup', 'peluqueria'],
};
const expandRole = (dbRole: string): string[] => ROLE_ALIASES[dbRole] ?? [dbRole];

const TOOLS = [
  {
    name: 'buscar_profesionales',
    title: 'Buscar profesionales de eventos en XPEAK',
    description: 'Busca profesionales de eventos disponibles en XPEAK (DJs, fotógrafos, staff, catering, animación, etc.) por rol, ciudad y presupuesto. Devuelve perfiles reales con precio por hora, valoración y disponibilidad inmediata (Flash Booking).',
    annotations: {
      title: 'Buscar profesionales de eventos en XPEAK',
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: true,
    },
    inputSchema: {
      type: 'object',
      properties: {
        rol: { type: 'string', description: `Tipo de profesional buscado. Uno de: ${KNOWN_ROLES.join(', ')}` },
        ciudad: { type: 'string', description: 'Ciudad o zona de España donde se necesita el profesional (ej. "Madrid", "Valencia")' },
        presupuesto_max: { type: 'number', description: 'Presupuesto máximo por hora en euros, opcional' },
      },
      required: ['rol'],
    },
  },
  {
    name: 'solicitar_presupuesto',
    title: 'Solicitar presupuesto a un profesional de XPEAK',
    description: 'Crea una solicitud real de presupuesto ("Flash Booking") a un profesional concreto de XPEAK. El profesional recibe la solicitud por email y contacta directamente al organizador — esto NO reserva ni cobra nada automáticamente, solo inicia el contacto, igual que el botón "Solicitar presupuesto" de la web.',
    annotations: {
      title: 'Solicitar presupuesto a un profesional de XPEAK',
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: true,
    },
    inputSchema: {
      type: 'object',
      properties: {
        professional_user_id: { type: 'string', description: 'user_id del profesional elegido, obtenido de buscar_profesionales' },
        professional_name: { type: 'string', description: 'Nombre del profesional, obtenido de buscar_profesionales' },
        professional_role: { type: 'string', description: 'Rol del profesional, obtenido de buscar_profesionales' },
        nombre_solicitante: { type: 'string', description: 'Nombre de la persona u organización que pide el presupuesto' },
        contacto_solicitante: { type: 'string', description: 'Email o teléfono real donde el profesional puede contactar al solicitante' },
        fecha_evento: { type: 'string', description: 'Fecha del evento (formato libre, ej. "2026-09-12" o "próximo sábado")' },
        ubicacion_evento: { type: 'string', description: 'Ciudad o lugar del evento' },
        descripcion: { type: 'string', description: 'Detalles adicionales del evento (tipo, horas, público esperado...)' },
      },
      required: ['professional_user_id', 'professional_name', 'professional_role', 'nombre_solicitante', 'contacto_solicitante', 'fecha_evento'],
    },
  },
  {
    name: 'consultar_precio_medio',
    title: 'Consultar precio medio de un profesional de eventos en XPEAK',
    description: 'Calcula en vivo el precio medio por hora de un tipo de profesional (opcionalmente filtrado por ciudad), a partir de los perfiles reales publicados en XPEAK. Devuelve también el mínimo, el máximo y el tamaño de la muestra — con pocos perfiles el dato es orientativo, no una media de mercado.',
    annotations: {
      title: 'Consultar precio medio de un profesional de eventos en XPEAK',
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: true,
    },
    inputSchema: {
      type: 'object',
      properties: {
        rol: { type: 'string', description: `Tipo de profesional. Uno de: ${KNOWN_ROLES.join(', ')}` },
        ciudad: { type: 'string', description: 'Ciudad o zona de España, opcional. Sin ciudad, calcula sobre toda España.' },
      },
      required: ['rol'],
    },
  },
];

async function logQuery(entry: {
  session_id?: string; action: string; role_requested?: string; city_requested?: string;
  budget_requested?: number; result_count?: number; raw_params: unknown;
}) {
  try {
    await supabase.from('mcp_query_log').insert(entry);
  } catch (err) {
    console.warn('[mcp-server] log failed (non-fatal):', err);
  }
}

async function buscarProfesionales(args: Record<string, unknown>, sessionId: string) {
  const rol = typeof args.rol === 'string' ? args.rol.toLowerCase().trim() : '';
  const ciudad = typeof args.ciudad === 'string' ? args.ciudad.trim() : '';
  const presupuestoMax = typeof args.presupuesto_max === 'number' ? args.presupuesto_max : null;

  if (!rol || !KNOWN_ROLES.includes(rol)) {
    return { content: [{ type: 'text', text: `Rol no reconocido. Roles válidos: ${KNOWN_ROLES.join(', ')}` }], isError: true };
  }

  let query = supabase.from('profiles')
    .select('user_id, display_name, role, specialty, zone, city_ref, hourly_rate, is_flash_active, is_verified, photo_url')
    .in('role', expandRole(rol))
    // Un profesional que se ocultó del directorio (is_public=false) no debe
    // aparecer tampoco vía agentes de IA — mismo filtro que fetchDirectorioProfiles
    // en DirectorioPublico.tsx. Bug real encontrado el 10 sep 2026: el MCP
    // exponía y permitía "reservar" un perfil que su dueño había ocultado.
    .eq('is_public', true)
    .order('is_flash_active', { ascending: false })
    .limit(10);

  // Coincide por la zona literal o por city_ref, la ciudad grande de referencia
  // que deriva la BD. Con solo el ilike el bot respondia "no hay nadie en X" a
  // ciudades donde si hay profesionales de pueblos cercanos.
  // ciudad es texto libre de un agente de IA (sin whitelist, a diferencia de
  // DirectorioPublico.tsx/CityLanding.tsx) y se interpola dentro de un filtro
  // .or() de PostgREST: sin sanear, una coma o paréntesis en el valor inyecta
  // condiciones extra al filtro (auditoría de seguridad 17 sep 2026).
  const ciudadSegura = ciudad.replace(/[,()."*]/g, '').slice(0, 80);
  if (ciudadSegura) query = query.or(`zone.ilike.%${ciudadSegura}%,city_ref.eq.${ciudadSegura}`);
  if (presupuestoMax) query = query.lte('hourly_rate', presupuestoMax);

  const { data, error } = await query;

  await logQuery({
    session_id: sessionId, action: 'buscar_profesionales',
    role_requested: rol, city_requested: ciudad || undefined,
    budget_requested: presupuestoMax ?? undefined,
    result_count: data?.length ?? 0, raw_params: args,
  });

  if (error) {
    return { content: [{ type: 'text', text: 'Error buscando profesionales. Inténtalo de nuevo.' }], isError: true };
  }
  if (!data || data.length === 0) {
    return { content: [{ type: 'text', text: `No se encontraron profesionales de tipo "${rol}"${ciudad ? ` en "${ciudad}"` : ''}. Prueba con otra ciudad o amplía el presupuesto.` }] };
  }

  const resumen = data.map(p =>
    `- ${p.display_name} (${p.specialty || p.role}) — ${p.zone} — ${p.hourly_rate}€/hora` +
    `${p.is_flash_active ? ' — disponibilidad inmediata (Flash Booking)' : ''}` +
    `${p.is_verified ? ' — verificado' : ''} — user_id: ${p.user_id}` +
    ` — perfil: https://xpeak.es/p/${p.user_id}`
  ).join('\n');

  return { content: [{ type: 'text', text: `${data.length} profesionales encontrados:\n\n${resumen}\n\nPara solicitar presupuesto a uno, usa la herramienta solicitar_presupuesto con su professional_user_id.` }] };
}

async function consultarPrecioMedio(args: Record<string, unknown>, sessionId: string) {
  const rol = typeof args.rol === 'string' ? args.rol.toLowerCase().trim() : '';
  const ciudad = typeof args.ciudad === 'string' ? args.ciudad.trim() : '';

  if (!rol || !KNOWN_ROLES.includes(rol)) {
    return { content: [{ type: 'text', text: `Rol no reconocido. Roles válidos: ${KNOWN_ROLES.join(', ')}` }], isError: true };
  }

  let query = supabase.from('profiles')
    .select('hourly_rate')
    .in('role', expandRole(rol))
    .eq('is_public', true)
    .not('hourly_rate', 'is', null)
    .gt('hourly_rate', 0);

  // Mismo saneado que buscarProfesionales — ciudad es texto libre de un
  // agente de IA interpolado en un filtro .or() de PostgREST.
  const ciudadSegura = ciudad.replace(/[,()."*]/g, '').slice(0, 80);
  if (ciudadSegura) query = query.or(`zone.ilike.%${ciudadSegura}%,city_ref.eq.${ciudadSegura}`);

  const { data, error } = await query;

  await logQuery({
    session_id: sessionId, action: 'consultar_precio_medio',
    role_requested: rol, city_requested: ciudad || undefined,
    result_count: data?.length ?? 0, raw_params: args,
  });

  if (error) {
    return { content: [{ type: 'text', text: 'Error consultando precios. Inténtalo de nuevo.' }], isError: true };
  }
  if (!data || data.length === 0) {
    return { content: [{ type: 'text', text: `No hay perfiles de tipo "${rol}"${ciudad ? ` en "${ciudad}"` : ''} con tarifa publicada. Prueba sin ciudad o con otro rol.` }] };
  }

  const rates = data.map(p => p.hourly_rate as number);
  const avg = Math.round(rates.reduce((s, r) => s + r, 0) / rates.length);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const muestraPequena = rates.length < 3;

  const texto = `Precio medio de "${rol}"${ciudad ? ` en "${ciudad}"` : ' en España'}: ${avg}€/hora ` +
    `(rango ${min}€–${max}€/hora, calculado sobre ${rates.length} perfil${rates.length === 1 ? '' : 'es'} publicado${rates.length === 1 ? '' : 's'} en XPEAK).` +
    (muestraPequena ? ' Aviso: con menos de 3 perfiles la muestra es pequeña — trátalo como orientativo, no como precio de mercado.' : '');

  return { content: [{ type: 'text', text: texto }] };
}

async function solicitarPresupuesto(args: Record<string, unknown>, sessionId: string) {
  const required = ['professional_user_id', 'professional_name', 'professional_role', 'nombre_solicitante', 'contacto_solicitante', 'fecha_evento'];
  for (const key of required) {
    if (!args[key] || typeof args[key] !== 'string' || !(args[key] as string).trim()) {
      return { content: [{ type: 'text', text: `Falta el campo requerido: ${key}` }], isError: true };
    }
  }

  // El MCP es un endpoint anónimo (un agente de IA no puede autenticarse
  // como un usuario XPEAK real, no hay login desde ChatGPT/Perplexity), así
  // que no puede cumplir el mismo gate de registro que se exige al resto de
  // la web desde el 09 sep 2026 (ver migración
  // 20260909150000_flash_bookings_require_auth_for_professional.sql).
  // En vez de romper la herramienta (que XPEAK promueve activamente para
  // GEO), se trata como un lead sin calificar: se exige al menos un email
  // de contacto verificable en forma, y se etiqueta el origen sin ambigüedad
  // en el email al profesional/admin (ver event_description más abajo).
  const contacto = String(args.contacto_solicitante).trim();
  if (!contacto.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto)) {
    return { content: [{ type: 'text', text: 'contacto_solicitante debe ser un email válido — un agente de IA no puede verificar un teléfono, y sin email el profesional no puede confirmar quién pregunta.' }], isError: true };
  }

  const professionalUserId = String(args.professional_user_id).trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(professionalUserId)) {
    return { content: [{ type: 'text', text: 'No se pudo validar el profesional seleccionado.' }], isError: true };
  }
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_id, display_name, role, is_seed_profile, is_public, validation_status')
    .eq('user_id', professionalUserId)
    .eq('is_primary', true)
    .maybeSingle();
  if (profileError || !profile || profile.is_seed_profile || profile.is_public === false || profile.validation_status !== 'approved') {
    return { content: [{ type: 'text', text: 'El profesional seleccionado no está disponible para recibir solicitudes.' }], isError: true };
  }
  const requestedName = String(args.professional_name).trim();
  const requestedRole = String(args.professional_role).trim();
  if ((profile.display_name && requestedName.toLowerCase() !== profile.display_name.trim().toLowerCase())
      || (profile.role && requestedRole.toLowerCase() !== profile.role.trim().toLowerCase())) {
    return { content: [{ type: 'text', text: 'Los datos del profesional seleccionado no coinciden con su perfil publicado.' }], isError: true };
  }

  const payload = {
    professional_name: profile.display_name || requestedName.slice(0, 100),
    professional_role: profile.role || requestedRole.slice(0, 50),
    professional_user_id: professionalUserId,
    requester_name: String(args.nombre_solicitante).trim().slice(0, 100),
    requester_contact: contacto.slice(0, 150),
    event_date: String(args.fecha_evento).trim().slice(0, 100),
    event_location: typeof args.ubicacion_evento === 'string' ? args.ubicacion_evento.trim().slice(0, 150) : '',
    event_description: `[Lead vía agente IA, sin verificar] ${typeof args.descripcion === 'string' ? args.descripcion.trim().slice(0, 480) : ''}`.trim(),
    status: 'pending',
    created_by: null,
    source: 'mcp_agent',
  };

  const { error } = await supabase.from('flash_bookings').insert(payload);

  await logQuery({
    session_id: sessionId, action: 'solicitar_presupuesto',
    role_requested: payload.professional_role, raw_params: args,
  });

  if (error) {
    // Mismo mensaje de rate-limit que ve un humano, no lo ocultamos al agente.
    const msg = error.message.includes('rate_limit_exceeded')
      ? 'Se ha alcanzado el límite de solicitudes recientes para este contacto. Espera unos minutos antes de volver a intentarlo.'
      : 'No se pudo crear la solicitud. Verifica los datos e inténtalo de nuevo.';
    return { content: [{ type: 'text', text: msg }], isError: true };
  }

  supabase.functions.invoke('send-email', { body: { type: 'flash_booking', data: payload } })
    .catch((err: unknown) => console.warn('[mcp-server] admin email failed:', err));
  if (payload.requester_contact.includes('@')) {
    supabase.functions.invoke('send-email', { body: { type: 'flash_booking_confirm', data: payload } })
      .catch((err: unknown) => console.warn('[mcp-server] confirm email failed:', err));
  }
  supabase.functions.invoke('send-email', { body: { type: 'booking_received', data: payload } })
    .catch((err: unknown) => console.warn('[mcp-server] professional email failed:', err));

  return { content: [{ type: 'text', text: `Solicitud enviada a ${payload.professional_name}. Le llegará por email y contactará directamente a ${payload.requester_contact} para confirmar disponibilidad y precio final.` }] };
}

// SEC-06: rate-limit por IP para la operación con efectos secundarios
// (solicitar_presupuesto crea un flash_booking y dispara 3 emails). La
// búsqueda de solo lectura queda sin fricción. Mismo mecanismo y tabla que
// chat-ai, para que un endpoint público sin JWT no pueda martillear la
// creación de solicitudes ni el envío de correos.
// Bajado de 8 a 4 el 10 sep 2026: este endpoint no exige el registro que sí
// exige el resto de la web desde el 09 sep, así que el límite por IP es la
// única barrera real contra abuso — se aprieta a la vez que se añade el
// requisito de email válido.
const MCP_RATE_LIMIT_MAX = 4;
const MCP_RATE_LIMIT_WINDOW_MIN = 10;

async function isRateLimited(clientIp: string): Promise<boolean> {
  const since = new Date(Date.now() - MCP_RATE_LIMIT_WINDOW_MIN * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('edge_function_rate_limit_log' as any)
    .select('id', { count: 'exact', head: true })
    .eq('endpoint', 'mcp-solicitar')
    .eq('client_ip', clientIp)
    .gte('created_at', since);
  // Registrar el intento ANTES de cualquier corte, para que fallos repetidos
  // no impidan que el contador suba (mismo criterio que chat-ai).
  try {
    await supabase.from('edge_function_rate_limit_log' as any).insert({ endpoint: 'mcp-solicitar', client_ip: clientIp });
  } catch { /* no crítico */ }
  return typeof count === 'number' && count >= MCP_RATE_LIMIT_MAX;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { id, method, params } = body ?? {};
  const sessionId = req.headers.get('mcp-session-id') || crypto.randomUUID();

  const respond = (result: unknown) =>
    new Response(JSON.stringify({ jsonrpc: '2.0', id, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'mcp-session-id': sessionId } });

  try {
    switch (method) {
      case 'initialize':
        return respond({
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'xpeak-mcp', version: '1.0.0' },
        });

      case 'tools/list':
        return respond({ tools: TOOLS });

      case 'tools/call': {
        const toolName = params?.name;
        const args = params?.arguments ?? {};
        if (toolName === 'buscar_profesionales') return respond(await buscarProfesionales(args, sessionId));
        if (toolName === 'consultar_precio_medio') return respond(await consultarPrecioMedio(args, sessionId));
        if (toolName === 'solicitar_presupuesto') {
          const clientIp = req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
            ?? req.headers.get('x-real-ip')
            ?? 'unknown';
          if (await isRateLimited(clientIp)) {
            return respond({ content: [{ type: 'text', text: 'Se ha alcanzado el límite de solicitudes recientes. Espera unos minutos antes de volver a intentarlo.' }], isError: true });
          }
          return respond(await solicitarPresupuesto(args, sessionId));
        }
        return new Response(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: `Herramienta desconocida: ${toolName}` } }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      default:
        return new Response(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: `Método no soportado: ${method}` } }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    console.error('[mcp-server] error:', err);
    return new Response(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32603, message: 'Internal error' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
