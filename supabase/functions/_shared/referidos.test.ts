// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { aplicarDescuentoReferidos, cuponReferidoPara, type DepsReferidos } from './referidos';

const env = { STRIPE_CUPON_REFERIDO_10: 'ref10', STRIPE_CUPON_REFERIDO_20: 'ref20' };

function deps(o: { sub?: string | null; estado?: string; amigos?: number; actual?: string | null }) {
  const puestos: Array<string | null> = [];
  const d: DepsReferidos = {
    async suscripcionDe() { return o.sub === undefined ? null : { stripe_subscription_id: o.sub, estado: o.estado ?? 'active' }; },
    async amigosQuePagan() { return o.amigos ?? 0; },
    async cuponReferidoActual() { return o.actual ?? null; },
    async ponerCuponReferido(_s, c) { puestos.push(c); },
  };
  return { d, puestos };
}

describe('referidos', () => {
  it('10 % con un amigo, 20 % con dos o más, nada sin amigos', () => {
    expect(cuponReferidoPara(0, env)).toBeNull();
    expect(cuponReferidoPara(1, env)).toBe('ref10');
    expect(cuponReferidoPara(2, env)).toBe('ref20');
    expect(cuponReferidoPara(5, env)).toBe('ref20');
  });

  it('pone el 10 % al primer amigo que paga', async () => {
    const t = deps({ sub: 'sub_1', amigos: 1 });
    expect(await aplicarDescuentoReferidos('u1', t.d, env)).toBe('cambiado');
    expect(t.puestos).toEqual(['ref10']);
  });

  it('sube al 20 % con el segundo amigo', async () => {
    const t = deps({ sub: 'sub_1', amigos: 2, actual: 'ref10' });
    expect(await aplicarDescuentoReferidos('u1', t.d, env)).toBe('cambiado');
    expect(t.puestos).toEqual(['ref20']);
  });

  it('quita el descuento si el amigo se da de baja', async () => {
    const t = deps({ sub: 'sub_1', amigos: 0, actual: 'ref10' });
    expect(await aplicarDescuentoReferidos('u1', t.d, env)).toBe('cambiado');
    expect(t.puestos).toEqual([null]);
  });

  it('no toca Stripe si ya tiene el cupón correcto (evita bucles)', async () => {
    const t = deps({ sub: 'sub_1', amigos: 1, actual: 'ref10' });
    expect(await aplicarDescuentoReferidos('u1', t.d, env)).toBe('igual');
    expect(t.puestos).toEqual([]);
  });

  it('quien está en Esencial guarda sus amigos: no hay suscripción a la que aplicarlo todavía', async () => {
    const t = deps({ amigos: 2 });
    expect(await aplicarDescuentoReferidos('u1', t.d, env)).toBe('sin_suscripcion');
    const c = deps({ sub: 'sub_1', estado: 'canceled', amigos: 2 });
    expect(await aplicarDescuentoReferidos('u1', c.d, env)).toBe('sin_suscripcion');
  });

  it('sin los cupones configurados no hace nada', async () => {
    const t = deps({ sub: 'sub_1', amigos: 1 });
    expect(await aplicarDescuentoReferidos('u1', t.d, {})).toBe('sin_cupones');
    expect(t.puestos).toEqual([]);
  });
});
