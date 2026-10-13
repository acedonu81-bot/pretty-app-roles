import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ role: 'dj' }) }));
const badges = { flashBadge: 1, msgBadge: 0, demandaBadge: 2 };
vi.mock('@/hooks/useDashboardBadges', () => ({ useDashboardBadges: () => badges }));

import MobileBottomNav from '../MobileBottomNav';

// 13 oct 2026: un profesional no encontró la oferta de Burguerfest. El tab
// Flash de la barra inferior ahora se enciende en verde, parpadea y muestra
// cuántas hay (ofertas nuevas + reservas pendientes).
describe('MobileBottomNav con ofertas nuevas', () => {
  it('el tab Flash muestra el total (ofertas nuevas + reservas pendientes) en un globo', () => {
    render(<MobileBottomNav activeView="explorar" onViewChange={() => {}} onMenuToggle={() => {}} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('el icono de Flash va en verde y con parpadeo mientras haya algo nuevo', () => {
    const { container } = render(<MobileBottomNav activeView="explorar" onViewChange={() => {}} onMenuToggle={() => {}} />);
    const flash = screen.getByText('Flash').closest('button')!;
    expect(flash.innerHTML).toContain('ofertaParpadeo');
    expect(container.querySelectorAll('[class*="ofertaParpadeo"]').length).toBe(1);
  });
});
