// Portal de Stripe: cambiar de plan, ver facturas o darse de baja.
// Sin el interruptor COBROS_ACTIVOS a propósito: quien ya paga tiene que poder
// cancelar siempre, aunque se apaguen los cobros nuevos.
import Stripe from 'npm:stripe@17';
import { admin, respuesta, usuarioDe, cabeceras, URL_WEB } from '../_shared/cobrosHttp.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cabeceras(req) });
  const user = await usuarioDe(req);
  if (!user) return respuesta(req, { error: 'sin_sesion' }, 401);
  const { data } = await admin().from('suscripciones').select('stripe_customer_id').eq('user_id', user.id).maybeSingle();
  if (!data?.stripe_customer_id) return respuesta(req, { error: 'sin_suscripcion' }, 404);
  try {
    const s = await stripe.billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: `${URL_WEB}/dashboard` });
    return respuesta(req, { url: s.url });
  } catch (e) {
    console.error('[portal-cliente]', user.id, e instanceof Stripe.errors.StripeError ? `${e.type}:${e.code}` : String(e));
    return respuesta(req, { error: 'stripe' }, 500);
  }
});
