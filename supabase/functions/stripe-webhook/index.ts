// Aviso de Stripe: lo único que cambia el plan de un usuario.
// Sin JWT (lo llama Stripe); lo que da paso es la firma del evento.
import Stripe from 'npm:stripe@17';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { procesarEventoStripe, type DbStripe } from '../_shared/procesarEventoStripe.ts';

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
    const resultado = await procesarEventoStripe(evento as any, db, Deno.env.toObject(), id => stripe.subscriptions.retrieve(id));
    return Response.json({ resultado });
  } catch (e) {
    console.error('[stripe-webhook]', evento.id, e);
    return new Response('Error procesando el evento', { status: 500 });
  }
});
