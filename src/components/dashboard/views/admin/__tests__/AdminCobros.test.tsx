import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminCobros, { type DatosCobros } from '../AdminCobros';

const dani = { user_id: 'u1', nombre: 'Daniel Torrez', email: 'd@x.es' };
const datos: DatosCobros = {
  resumen: {
    mes: '2026-11', cobrado: 1499, devuelto: 1499, neto: 0, cobros: 1, fallidos: 0, disputas: 0,
    ingresoMensual: 699, activas: { starter_mensual: 1, starter_anual: 0, business_mensual: 0, business_anual: 0 },
    conBaja: 0, impagadas: 0, fundadores: 110, lanzamiento: null,
  },
  suscripciones: [
    { user_id: 'u2', plan: 'starter', ciclo: 'mensual', estado: 'active', periodo_fin: '2026-12-23T10:00:00Z', cancela_al_final: false, updated_at: '2026-11-23', persona: { user_id: 'u2', nombre: 'Ana DJ', email: 'a@x.es' } },
    { user_id: 'u1', plan: 'business', ciclo: 'mensual', estado: 'canceled', periodo_fin: null, cancela_al_final: false, updated_at: '2026-11-22', persona: dani },
  ],
  movimientos: [
    { id: 're_1', fecha: '2026-11-23T11:00:00Z', tipo: 'devolucion', importe: -1499, concepto: 'Devolución', persona: dani, enlace: 'https://dashboard.stripe.com/payments/pi_1' },
    { id: 'ch_1', fecha: '2026-11-23T10:52:00Z', tipo: 'cobro', importe: 1499, concepto: 'Subscription creation', persona: dani, enlace: 'https://dashboard.stripe.com/payments/pi_1' },
  ],
};

describe('AdminCobros', () => {
  it('enseña el resumen, las suscripciones vivas y los movimientos con su perfil', async () => {
    render(<AdminCobros cargar={async () => datos} />);
    expect(await screen.findByText('Ingreso mensual recurrente')).toBeTruthy();
    expect(screen.getByText(/110 fundadores/)).toBeTruthy();
    expect(screen.getByText('Ana DJ')).toBeTruthy();
    expect(screen.queryByText('Cancelada')).toBeNull(); // las canceladas, ocultas por defecto
    expect(screen.getAllByText('Daniel Torrez').length).toBe(2);
    expect(screen.getAllByLabelText('Ver en Stripe')[0].getAttribute('href')).toContain('dashboard.stripe.com');
  });

  it('filtra por devoluciones y deja ver las canceladas', async () => {
    render(<AdminCobros cargar={async () => datos} />);
    await screen.findByText('Movimientos');
    fireEvent.click(screen.getByRole('button', { name: 'Devoluciones' }));
    expect(screen.getAllByText('Daniel Torrez').length).toBe(1);
    fireEvent.click(screen.getByLabelText(/Ver también canceladas/));
    expect(screen.getByText('Cancelada')).toBeTruthy();
  });

  it('si Stripe falla lo dice y deja reintentar', async () => {
    render(<AdminCobros cargar={async () => { throw new Error('x'); }} />);
    expect(await screen.findByText(/No se han podido leer los cobros/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeTruthy();
  });
});
