// Utilidades comunes de crear-checkout y portal-cliente.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ORIGENES = ['https://xpeak.es', 'https://www.xpeak.es', 'http://localhost:5173'];

export function cabeceras(req: Request): Record<string, string> {
  const origen = req.headers.get('Origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ORIGENES.includes(origen) ? origen : ORIGENES[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
    Vary: 'Origin',
  };
}

export const respuesta = (req: Request, cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: cabeceras(req) });

export const admin = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

// Usuario de la sesión a partir del JWT de la petición.
export async function usuarioDe(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (!token) return null;
  const { data } = await admin().auth.getUser(token);
  return data.user ?? null;
}

export const URL_WEB = 'https://xpeak.es';
