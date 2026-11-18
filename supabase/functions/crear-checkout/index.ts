// Abre el pago de Stripe para un plan, o el portal si ya tiene uno vivo.
import Stripe from 'npm:stripe@17';
import { decidirCheckout } from '../_shared/decidirCheckout.ts';
import { priceIdDe, cuponDe, type PlanPago, type Ciclo } from '../_shared/stripePlanes.ts';
import { admin, respuesta, usuarioDe, cabeceras, URL_WEB } from '../_shared/cobrosHttp.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cabeceras(req) });
  const user = await usuarioDe(req);
  if (!user) return respuesta(req, { error: 'sin_sesion' }, 401);

  const { plan, ciclo } = await req.json().catch(() => ({}));
  const db = admin();
  const [{ data: perfiles }, { data: suscripcion }] = await Promise.all([
    db.from('profiles').select('role, roles').eq('user_id', user.id),
    db.from('suscripciones').select('estado, stripe_customer_id, stripe_subscription_id').eq('user_id', user.id).maybeSingle(),
  ]);

  const decision = decidirCheckout({
    cobrosActivos: Deno.env.get('COBROS_ACTIVOS') === 'true',
    perfiles: perfiles ?? [],
    suscripcion,
    plan,
    ciclo,
  });
  if (decision.tipo === 'error') return respuesta(req, { error: decision.codigo }, decision.codigo === 'cobros_apagados' ? 403 : 400);

  try {
    if (decision.tipo === 'portal') {
      const s = await stripe.billingPortal.sessions.create({ customer: suscripcion!.stripe_customer_id, return_url: `${URL_WEB}/dashboard` });
      return respuesta(req, { url: s.url });
    }

    let customer = suscripcion?.stripe_customer_id;
    if (!customer) {
      const c = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
      customer = c.id;
      const { error } = await db.from('suscripciones').insert({ user_id: user.id, stripe_customer_id: customer });
      if (error) throw error;
    }

    const env = Deno.env.toObject();
    const cupon = cuponDe(plan as PlanPago, ciclo as Ciclo, new Date(), env, !!suscripcion?.stripe_subscription_id);
    const sesion = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      client_reference_id: user.id,
      subscription_data: { metadata: { user_id: user.id } },
      line_items: [{ price: priceIdDe(plan as PlanPago, ciclo as Ciclo, env), quantity: 1, tax_rates: [env.STRIPE_TAX_RATE_IVA] }],
      ...(cupon ? { discounts: [{ coupon: cupon }] } : {}),
      locale: 'es',
      consent_collection: { terms_of_service: 'required' },
      custom_text: {
        terms_of_service_acceptance: {
          message: `Acepto las [condiciones de suscripción](${URL_WEB}/condiciones-suscripcion) y pido que el servicio empiece ya. Sé que, una vez prestado por completo, pierdo el derecho de desistimiento de 14 días.`,
        },
      },
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      customer_update: { address: 'auto', name: 'auto' },
      success_url: `${URL_WEB}/dashboard?pago=ok`,
      cancel_url: `${URL_WEB}/dashboard?pago=cancelado`,
    });
    return respuesta(req, { url: sesion.url });
  } catch (e) {
    console.error('[crear-checkout]', user.id, e instanceof Stripe.errors.StripeError ? `${e.type}:${e.code}` : String(e));
    return respuesta(req, { error: 'stripe' }, 500);
  }
});
