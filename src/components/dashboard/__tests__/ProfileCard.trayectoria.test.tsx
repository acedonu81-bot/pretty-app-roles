import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const yo = { user_id: 'yo', role: 'empresario', subscription_tier: 'free' };
let cobros = true;
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => yo }));
vi.mock('@/lib/pagos', () => ({ cobrosActivos: () => cobros }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }), rpc: async () => ({ data: null }) } }));
vi.mock('@/components/FollowButton', () => ({ default: () => null }));
vi.mock('../VoteButton', () => ({ default: () => null }));
vi.mock('../ContractModal', () => ({ default: () => null }));
vi.mock('@/components/LegalModal', () => ({ default: () => null }));

import ProfileCard from '../ProfileCard';

const base: any = {
  id: 1, name: 'Ana Beat', role: 'dj', specialty: 'House', rating: 0, reviews: 0, location: 'Madrid', zone: 'Madrid', country: 'España',
  city: 'Madrid', experience: '', price: 80, priceUnit: '/hora', avatar: 'A', gradient: '', badges: [], description: 'Bio', phone: '', instagram: '',
  topWeekend: false, photo: 'https://x/f.jpg', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional', userId: 'u1',
};

describe('ProfileCard: eventos confirmados', () => {
  beforeEach(() => { cobros = true; });
  it('enseña el contador cuando hay confirmados y los cobros están activos', () => {
    render(<ProfileCard profile={base} eventosConfirmados={9} />);
    expect(screen.getByText('9 eventos confirmados')).toBeTruthy();
  });
  it('en singular con uno', () => {
    render(<ProfileCard profile={base} eventosConfirmados={1} />);
    expect(screen.getByText('1 evento confirmado')).toBeTruthy();
  });
  it('sin confirmados no enseña nada', () => {
    render(<ProfileCard profile={base} eventosConfirmados={0} />);
    expect(screen.queryByText(/confirmado/)).toBeNull();
  });
  it('con los cobros apagados no se enseña', () => {
    cobros = false;
    render(<ProfileCard profile={base} eventosConfirmados={9} />);
    expect(screen.queryByText(/confirmados/)).toBeNull();
  });
});
