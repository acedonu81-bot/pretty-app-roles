import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ValorarContratado, { eventoYaOcurrio } from './ValorarContratado';

// 13 oct 2026: en la tarjeta de una oferta, al profesional contratado solo se
// le mostraba "Contratado" y "Contrato"; el botón Valorar estaba únicamente en
// Empresario > Historial, así que el organizador no encontraba cómo valorar a
// Gonzalo DJ tras el Burger Gourmet Fest.
describe('eventoYaOcurrio', () => {
  it('es true si la última fecha ya pasó', () => {
    expect(eventoYaOcurrio(['2026-09-11', '2026-09-12'], '2026-10-13')).toBe(true);
  });
  it('usa la ÚLTIMA fecha: un evento de varios días no ha terminado hasta el último', () => {
    expect(eventoYaOcurrio(['2026-10-13', '2026-10-17'], '2026-10-14')).toBe(false);
  });
  it('el mismo día del evento ya se puede valorar', () => {
    expect(eventoYaOcurrio(['2026-10-13'], '2026-10-13')).toBe(true);
  });
  it('sin fechas no se puede afirmar que haya ocurrido', () => {
    expect(eventoYaOcurrio([], '2026-10-13')).toBe(false);
    expect(eventoYaOcurrio([null, 'Por confirmar'], '2026-10-13')).toBe(false);
  });
});

describe('ValorarContratado', () => {
  it('muestra "Valorar" cuando el evento ya pasó y aún no hay reseña, y lo lanza al pulsar', () => {
    const onValorar = vi.fn();
    render(<ValorarContratado yaOcurrio valorado={false} onValorar={onValorar} />);
    fireEvent.click(screen.getByRole('button', { name: /Valorar/ }));
    expect(onValorar).toHaveBeenCalledTimes(1);
  });

  it('muestra "Valorado" (sin botón) si ya hay reseña', () => {
    render(<ValorarContratado yaOcurrio valorado onValorar={() => {}} />);
    expect(screen.getByText('Valorado')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('no muestra nada si el evento aún no ha ocurrido', () => {
    const { container } = render(<ValorarContratado yaOcurrio={false} valorado={false} onValorar={() => {}} />);
    expect(container.innerHTML).toBe('');
  });
});
