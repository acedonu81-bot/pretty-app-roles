// Funciones que solo debe lanzar el cron (recordatorios, recálculos).
// Auditoría 10 nov 2026: se podían ejecutar con un POST cualquiera (o con la
// clave anon, que es pública). Ahora exigen el secreto interno, el mismo que
// usa send-email, o la clave de servicio. Los crons lo leen del vault
// ('send_email_internal_secret') y lo mandan en x-internal-secret.
const iguales = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
};

export function esLlamadaInterna(req: Request): boolean {
  const secreto = Deno.env.get('INTERNAL_SECRET') ?? '';
  const recibido = req.headers.get('x-internal-secret') ?? '';
  if (secreto && recibido && iguales(recibido, secreto)) return true;
  const servicio = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const auth = req.headers.get('Authorization') ?? '';
  return !!servicio && iguales(auth, `Bearer ${servicio}`);
}

export const noAutorizado = () =>
  new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
