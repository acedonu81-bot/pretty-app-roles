// Cobros para el panel admin (23 nov 2026): suscripciones de XPEAK, cobros,
// devoluciones, pagos fallidos y disputas de Stripe, y el resumen del mes.
// Solo admin. Solo lectura: no cobra, no devuelve, no guarda datos de tarjetas.
import Stripe from 'npm:stripe@17';
import { admin, respuesta, usuarioDe, cabeceras } from '../_shared/cobrosHttp.ts';
import { construirMovimientos, ingresoMensual, resumenDelMes, type Persona } from '../_shared/resumenCobros.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cabeceras(req) });
  const user = await usuarioDe(req);
  if (!user) return respuesta(req, { error: 'sin_sesion' }, 401);
  const db = admin();
  const { data: esAdmin } = await db.rpc('has_role', { _user_id: user.id, _role: 'admin' });
  if (!esAdmin) return respuesta(req, { error: 'solo_admin' }, 403);

  try {
    const [{ data: filas }, { count: fundadores }, { data: config }] = await Promise.all([
      db.from('suscripciones').select('user_id, stripe_customer_id, plan, ciclo, estado, periodo_fin, cancela_al_final, updated_at'),
      db.from('redes_fundadores').select('profile_id', { count: 'exact', head: true }),
      db.from('cobros_config').select('lanzamiento').maybeSingle(),
    ]);
    const suscripciones = filas ?? [];
    const ids = [...new Set(suscripciones.map(s => s.user_id))];

    // Nombre (primer perfil) y correo de cada cliente.
    const personas = new Map<string, Persona>();
    if (ids.length) {
      const { data: perfiles } = await db.from('profiles').select('user_id, display_name').in('user_id', ids);
      await Promise.all(ids.map(async id => {
        const { data } = await db.auth.admin.getUserById(id);
        const nombre = perfiles?.find(p => p.user_id === id && p.display_name)?.display_name ?? null;
        personas.set(id, { user_id: id, nombre, email: data.user?.email ?? null });
      }));
    }
    const porCliente = new Map(suscripciones.filter(s => s.stripe_customer_id).map(s => [s.stripe_customer_id as string, personas.get(s.user_id) ?? null]));

    // Solo las cuentas de modo real: un customer de pruebas no existe aquí y no se lista.
    const [cargos, devoluciones, subs] = await Promise.all([
      stripe.charges.list({ limit: 100 }),
      stripe.refunds.list({ limit: 100 }),
      stripe.subscriptions.list({ status: 'all', limit: 100 }),
    ]);

    const movimientos = construirMovimientos(cargos.data as any, devoluciones.data as any, c => (c ? porCliente.get(c) ?? null : null));
    return respuesta(req, {
      resumen: {
        ...resumenDelMes(movimientos),
        ingresoMensual: ingresoMensual(subs.data as any),
        activas: {
          starter_mensual: suscripciones.filter(s => s.estado === 'active' && s.plan === 'starter' && s.ciclo === 'mensual').length,
          starter_anual: suscripciones.filter(s => s.estado === 'active' && s.plan === 'starter' && s.ciclo === 'anual').length,
          business_mensual: suscripciones.filter(s => s.estado === 'active' && s.plan === 'business' && s.ciclo === 'mensual').length,
          business_anual: suscripciones.filter(s => s.estado === 'active' && s.plan === 'business' && s.ciclo === 'anual').length,
        },
        conBaja: suscripciones.filter(s => s.estado === 'active' && s.cancela_al_final).length,
        impagadas: suscripciones.filter(s => s.estado === 'past_due' || s.estado === 'unpaid').length,
        fundadores: fundadores ?? 0,
        lanzamiento: config?.lanzamiento ?? null,
      },
      suscripciones: suscripciones
        .map(s => ({ ...s, stripe_customer_id: undefined, persona: personas.get(s.user_id) ?? null }))
        .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))),
      movimientos,
    });
  } catch (e) {
    console.error('[admin-cobros]', e instanceof Stripe.errors.StripeError ? `${e.type}:${e.code}` : String(e));
    return respuesta(req, { error: 'stripe' }, 500);
  }
});
