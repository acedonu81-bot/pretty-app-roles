import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NuevaOfertaBanner from './NuevaOfertaBanner';

const badges = vi.hoisted(() => ({ demandaBadge: 0, flashBadge: 0 }));
vi.mock('@/hooks/useDashboardBadges', () => ({
  useDashboardBadges: () => ({ demandaBadge: badges.demandaBadge, flashBadge: badges.flashBadge }),
}));

describe('NuevaOfertaBanner', () => {
  beforeEach(() => { badges.demandaBadge = 0; badges.flashBadge = 0; });

  it('no sale sin ofertas nuevas', () => {
    const { container } = render(<NuevaOfertaBanner userId="u" isEmpresario={false} onVer={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('avisa de una oferta nueva y lleva a verla', () => {
    badges.demandaBadge = 1;
    const onVer = vi.fn();
    render(<NuevaOfertaBanner userId="u" isEmpresario={false} onVer={onVer} />);
    expect(screen.getByText('Nueva oferta disponible')).toBeInTheDocument();
    expect(screen.getByText('Atento a las notificaciones')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ver oferta'));
    expect(onVer).toHaveBeenCalledWith('ofertas');
  });

  it('avisa de una solicitud directa (p. ej. de un particular) y lleva a Solicitudes', () => {
    badges.flashBadge = 2;
    const onVer = vi.fn();
    render(<NuevaOfertaBanner userId="u" isEmpresario={false} onVer={onVer} />);
    expect(screen.getByText('2 ofertas nuevas disponibles')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ver oferta'));
    expect(onVer).toHaveBeenCalledWith('solicitudes');
  });

  it('cuenta varias y se oculta para organizador o dentro de Flash Booking', () => {
    badges.demandaBadge = 3;
    const { rerender, container } = render(<NuevaOfertaBanner userId="u" isEmpresario={false} onVer={() => {}} />);
    expect(screen.getByText('3 ofertas nuevas disponibles')).toBeInTheDocument();
    rerender(<NuevaOfertaBanner userId="u" isEmpresario onVer={() => {}} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<NuevaOfertaBanner userId="u" isEmpresario={false} oculto onVer={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
