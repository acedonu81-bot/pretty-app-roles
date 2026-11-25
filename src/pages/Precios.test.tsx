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

  it('con los cobros activados enseña solo Profesional y Premium con sus precios, y ninguna tarjeta de organizadores', () => {
    const t = pagina('true');
    for (const x of ['Profesional', 'Premium', '6,99', '14,99', '69,90', '149,90', 'ahorras 2 meses', 'IVA incluido']) expect(t).toContain(x);
    expect(t).not.toMatch(/para siempre|Esencial/);
    expect(t).not.toMatch(/¿Cuándo habrá planes de pago\?/);
    expect(t).not.toMatch(/Organizadores|Salas, promotoras/);
  });

  it('Premium anuncia la posición destacada y Profesional no', () => {
    const t = pagina('true');
    expect(t).toMatch(/Posición destacada en el directorio, con aro dorado/);
    expect((t.match(/Posición destacada/g) ?? []).length).toBe(1);
  });

  it('no anuncia lo que no existe ni usa rayas largas o "gratis"', () => {
    const t = pagina('true');
    expect(t).not.toMatch(/WhatsApp|ampliada|comunicados|vídeo de fondo|adelanto/i);
    expect(t).not.toMatch(/[—–]/);
    expect(t).not.toMatch(/gratis/i);
  });

  it('"Todo lo de Profesional, más:" va en dorado y sin check, como en Mi plan', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'true');
    const { getByText } = render(<HelmetProvider><MemoryRouter><Precios /></MemoryRouter></HelmetProvider>);
    const el = getByText('Todo lo de Profesional, más:');
    expect(el.closest('li')?.querySelector('svg')).toBeNull();
    expect(el.getAttribute('style') ?? '').toMatch(/#8B6A00|rgb\(139, 106, 0\)/i);
  });

  it('el PRECIO de la página es el mismo que el de Mi plan', () => {
    const t = pagina('true');
    const fmt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    expect(t).toContain(fmt(subscriptionPlans.find(p => p.id === 'starter')!.monthlyPrice));
    expect(t).toContain(fmt(subscriptionPlans.find(p => p.id === 'business')!.monthlyPrice));
    expect(t).toContain(fmt(PRECIOS_ANUALES.starter));
    expect(t).toContain(fmt(PRECIOS_ANUALES.business));
  });

  it('con los cobros activados la rejilla es de 2 columnas (solo hay dos planes)', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'true');
    const { container } = render(<HelmetProvider><MemoryRouter><Precios /></MemoryRouter></HelmetProvider>);
    expect(container.innerHTML).not.toContain('lg:grid-cols-3');
    expect(container.innerHTML).toContain('lg:grid-cols-2');
  });
});
