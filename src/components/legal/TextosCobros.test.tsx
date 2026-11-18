import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  TerminosEconomicas, TerminosLimitacion, PrivacidadDatosPago, PrivacidadFinalidadPago,
  PrivacidadBasePago, PrivacidadConservacionPago, PrivacidadDestinatarioStripe,
} from './TextosCobros';

const texto = (nodo: React.ReactNode) => render(<MemoryRouter><ul>{nodo}</ul></MemoryRouter>).container.textContent ?? '';
afterEach(() => vi.unstubAllEnvs());

describe('textos legales con los cobros apagados', () => {
  it('siguen diciendo que no hay pagos', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'false');
    expect(texto(<TerminosEconomicas />)).toMatch(/no requiere el pago de ninguna cuota/);
    expect(texto(<TerminosEconomicas />)).toMatch(/No existe actualmente ningún sistema de pago/);
    expect(texto(<TerminosLimitacion />)).toMatch(/acceso a la Plataforma es gratuito/);
  });
  it('privacidad no menciona a Stripe ni datos de pago', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'false');
    for (const c of [<PrivacidadDatosPago />, <PrivacidadFinalidadPago />, <PrivacidadBasePago />, <PrivacidadConservacionPago />, <PrivacidadDestinatarioStripe />]) {
      expect(texto(c)).toBe('');
    }
  });
});

describe('textos legales con los cobros activados', () => {
  it('Términos: planes de pago, Stripe y enlace a las condiciones, sin decir que no hay pagos', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'true');
    const t = texto(<TerminosEconomicas />);
    expect(t).toMatch(/planes de pago opcionales/);
    expect(t).toMatch(/Stripe/);
    expect(t).toMatch(/30 días de antelación/);
    expect(t).not.toMatch(/No existe actualmente ningún sistema de pago|no requiere el pago de ninguna cuota/);
    const { container } = render(<MemoryRouter><TerminosEconomicas /></MemoryRouter>);
    expect(container.querySelector('a[href="/condiciones-suscripcion"]')).toBeTruthy();
  });
  it('limitación de responsabilidad: importe abonado en 12 meses y derechos del consumidor', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'true');
    const t = texto(<TerminosLimitacion />);
    expect(t).toMatch(/importe efectivamente abonado/);
    expect(t).toMatch(/12 meses/);
    expect(t).toMatch(/derechos irrenunciables/);
    expect(t).not.toMatch(/es gratuito/);
  });
  it('Privacidad: datos, finalidad, base legal, conservación y Stripe como destinatario', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'true');
    expect(texto(<PrivacidadDatosPago />)).toMatch(/Los datos completos de la tarjeta los trata Stripe/);
    expect(texto(<PrivacidadFinalidadPago />)).toMatch(/cobro, la facturación/);
    expect(texto(<PrivacidadBasePago />)).toMatch(/art\. 6\.1\.b/);
    expect(texto(<PrivacidadConservacionPago />)).toMatch(/seis años/);
    expect(texto(<PrivacidadDestinatarioStripe />)).toMatch(/Stripe Payments Europe, Ltd\./);
  });
  it('sin rayas largas ni "gratis" en ningún texto nuevo', () => {
    vi.stubEnv('VITE_COBROS_ACTIVOS', 'true');
    const todo = [<TerminosEconomicas />, <TerminosLimitacion />, <PrivacidadDatosPago />, <PrivacidadFinalidadPago />, <PrivacidadBasePago />, <PrivacidadConservacionPago />, <PrivacidadDestinatarioStripe />]
      .map(texto).join(' ');
    expect(todo).not.toMatch(/[—–]/);
    expect(todo).not.toMatch(/gratis/i);
  });
});
