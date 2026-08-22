import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * MCP server de XPEAK — expone el directorio de profesionales de eventos
 * a agentes de IA (Claude, ChatGPT, Perplexity...) vía el Model Context
 * Protocol (JSON-RPC 2.0 sobre HTTP). Dos herramientas:
 *   - buscar_profesionales: lectura pública, sin fricción.
 *   - solicitar_presupuesto: mismo insert en flash_bookings que ya usa
 *     el formulario web (mismo rate-limit, misma RLS, mismos emails).
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

const KNOWN_ROLES = ['dj', 'staff', 'makeup', 'promotor', 'fotografo', 'catering', 'mago', 'humorista', 'animador', 'bailarin', 'speaker', 'vestuario', 'photo-booth'];

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
    .select('user_id, display_name, role, specialty, zone, hourly_rate, is_flash_active, is_verified, photo_url')
    .eq('role', rol)
    .order('is_flash_active', { ascending: false })
    .limit(10);

  if (ciudad) query = query.ilike('zone', `%${ciudad}%`);
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

async function solicitarPresupuesto(args: Record<string, unknown>, sessionId: string) {
  const required = ['professional_user_id', 'professional_name', 'professional_role', 'nombre_solicitante', 'contacto_solicitante', 'fecha_evento'];
  for (const key of required) {
    if (!args[key] || typeof args[key] !== 'string' || !(args[key] as string).trim()) {
      return { content: [{ type: 'text', text: `Falta el campo requerido: ${key}` }], isError: true };
    }
  }

  const payload = {
    professional_name: String(args.professional_name).trim().slice(0, 100),
    professional_role: String(args.professional_role).trim().slice(0, 50),
    professional_user_id: String(args.professional_user_id).trim(),
    requester_name: String(args.nombre_solicitante).trim().slice(0, 100),
    requester_contact: String(args.contacto_solicitante).trim().slice(0, 150),
    event_date: String(args.fecha_evento).trim().slice(0, 100),
    event_location: typeof args.ubicacion_evento === 'string' ? args.ubicacion_evento.trim().slice(0, 150) : '',
    event_description: typeof args.descripcion === 'string' ? args.descripcion.trim().slice(0, 500) : '',
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
        if (toolName === 'solicitar_presupuesto') return respond(await solicitarPresupuesto(args, sessionId));
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
