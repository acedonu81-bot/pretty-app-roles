// Aviso de Stripe: lo único que cambia el plan de un usuario.
// Sin JWT (lo llama Stripe); lo que da paso es la firma del evento.
import Stripe from 'npm:stripe@17';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { procesarEventoStripe, type DbStripe } from '../_shared/procesarEventoStripe.ts';
import { aplicarDescuentoReferidos, cuponesReferido, type DepsReferidos } from '../_shared/referidos.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');
const cripto = Stripe.createSubtleCryptoProvider();
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const db: DbStripe = {
  async registrarEvento(id, tipo) {
    const { error } = await admin.from('stripe_eventos').insert({ id, tipo });
    if (!error) return true;
    if (error.code === '23505') return false; // ya procesado
    throw error;
  },
  async leerSuscripcion(userId) {
    const { data, error } = await admin.from('suscripciones').select('stripe_evento_at').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data;
  },
  async userIdDeCustomer(customerId) {
    const { data, error } = await admin.from('suscripciones').select('user_id').eq('stripe_customer_id', customerId).maybeSingle();
    if (error) throw error;
    return data?.user_id ?? null;
  },
  async guardarSuscripcion(fila) {
    const { error } = await admin.from('suscripciones').upsert({ ...fila, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
  async ponerTierEnPerfiles(userId, tier) {
    const { error } = await admin.from('profiles').update({ subscription_tier: tier }).eq('user_id', userId);
    if (error) throw error;
  },
};

const env = Deno.env.toObject();

// Descuento por amigos: lo que necesita aplicarDescuentoReferidos, con Stripe y la BD reales.
const referidos: DepsReferidos = {
  async suscripcionDe(userId) {
    const { data, error } = await admin.from('suscripciones').select('stripe_subscription_id, estado').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data;
  },
  async amigosQuePagan(userId) {
    const { data, error } = await admin.rpc('amigos_que_pagan', { p_padrino: userId });
    if (error) throw error;
    return (data as number) ?? 0;
  },
  async cuponReferidoActual(subId) {
    const sub = await stripe.subscriptions.retrieve(subId, { expand: ['discounts'] });
    const mios = cuponesReferido(env);
    const d = (sub.discounts as any[] ?? []).find(x => typeof x === 'object' && mios.includes(x?.coupon?.id));
    return d?.coupon?.id ?? null;
  },
  async ponerCuponReferido(subId, cupon) {
    // Se conservan los demás descuentos (p. ej. el del primer año) y se cambia solo el de referido.
    const sub = await stripe.subscriptions.retrieve(subId, { expand: ['discounts'] });
    const mios = cuponesReferido(env);
    const otros = (sub.discounts as any[] ?? [])
      .filter(x => typeof x === 'object' && !mios.includes(x?.coupon?.id))
      .map(x => ({ discount: x.id }));
    await stripe.subscriptions.update(subId, { discounts: [...otros, ...(cupon ? [{ coupon: cupon }] : [])] });
  },
};

// Recalcula el descuento de quien paga (por sus amigos) y el de su padrino (por él).
// Si falla no se tumba el aviso: se recalcula en el siguiente.
async function recalcularReferidos(s: any) {
  try {
    const { data: fila } = await admin.from('suscripciones').select('user_id').eq('stripe_subscription_id', s.id).maybeSingle();
    const userId = s.metadata?.user_id || fila?.user_id;
    if (!userId) return;
    const { data: padrino } = await admin.from('referrals').select('inviter_user_id').eq('invitee_user_id', userId).maybeSingle();
    for (const u of [userId, padrino?.inviter_user_id].filter(Boolean) as string[]) {
      console.log('[referidos]', u, await aplicarDescuentoReferidos(u, referidos, env));
    }
  } catch (e) {
    console.error('[referidos]', s?.id, e);
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Método no permitido', { status: 405 });
  const firma = req.headers.get('stripe-signature') ?? '';
  const cuerpo = await req.text();
  let evento;
  try {
    evento = await stripe.webhooks.constructEventAsync(cuerpo, firma, Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '', undefined, cripto);
  } catch {
    return new Response('Firma no válida', { status: 400 });
  }
  try {
    const resultado = await procesarEventoStripe(evento as any, db, env, id => stripe.subscriptions.retrieve(id, { expand: ['default_payment_method', 'customer.invoice_settings.default_payment_method'] }));
    if (resultado === 'procesado') await recalcularReferidos((evento as any).data.object);
    return Response.json({ resultado });
  } catch (e) {
    console.error('[stripe-webhook]', evento.id, e);
    return new Response('Error procesando el evento', { status: 500 });
  }
});
