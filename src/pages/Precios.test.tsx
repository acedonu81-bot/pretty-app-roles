import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

vi.mock('@/components/FooterPublic', () => ({ default: () => null }));

import Precios from './Precios';
import { subscriptionPlans, PRECIOS_ANUALES } from '@/lib/subscriptions';

function pagina(cobros: 'true' | 'false') {
  vi.stubEnv('VITE_COBROS_ACTIVOS', cobros);
  return render(<HelmetProvider><MemoryRouter><Precios /></MemoryRouter></HelmetProvider>).container.textContent ?? '';
}

afterEach(() => vi.unstubAllEnvs());

describe('/precios', () => {
  it('con los cobros apagados queda como siempre', () => {
    const t = pagina('false');
    expect(t).toMatch(/para siempre/);
    expect(t).toMatch(/¿Cuándo habrá planes de pago\?/);
    expect(t).not.toMatch(/6,99|14,99/);
  });

  it('con los cobros activados enseña Esencial, Profesional, Premium y Organizadores con sus precios', () => {
    const t = pagina('true');
    for (const x of ['Esencial', 'Profesional', 'Premium', 'Organizadores', '6,99', '14,99', '75,49', '161,89', 'IVA incluido']) expect(t).toContain(x);
    expect(t).not.toMatch(/para siempre/);
    expect(t).not.toMatch(/¿Cuándo habrá planes de pago\?/);
  });

  it('Premium anuncia la posición destacada y Profesional no', () => {
    const t = pagina('true');
    expect(t).toMatch(/Posición destacada en el directorio, con aro dorado/);
    expect((t.match(/Posición destacada/g) ?? []).length).toBe(1);
  });

  it('no anuncia lo que no existe ni usa rayas largas o "gratis"', () => {
    const t = pagina('true');
    expect(t).not.toMatch(/WhatsApp|ampliada|Sorteos|comunicados|vídeo de fondo|Soporte prioritario|adelanto/i);
    expect(t).not.toMatch(/[—–]/);
    expect(t).not.toMatch(/gratis/i);
  });

  it('el PRECIO de la página es el mismo que el de Mi plan', () => {
    const t = pagina('true');
    const fmt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    expect(t).toContain(fmt(subscriptionPlans.find(p => p.id === 'starter')!.monthlyPrice));
    expect(t).toContain(fmt(subscriptionPlans.find(p => p.id === 'business')!.monthlyPrice));
    expect(t).toContain(fmt(PRECIOS_ANUALES.starter));
    expect(t).toContain(fmt(PRECIOS_ANUALES.business));
  });
});
