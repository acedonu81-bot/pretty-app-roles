import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const yo = { user_id: 'yo', role: 'empresario', subscription_tier: 'free' };
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => yo }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }), rpc: async () => ({ data: null }) } }));
vi.mock('@/components/FollowButton', () => ({ default: () => null }));
vi.mock('../VoteButton', () => ({ default: () => null }));
vi.mock('../ContractModal', () => ({ default: () => null }));
vi.mock('@/components/LegalModal', () => ({ default: () => null }));

import ProfileCard from '../ProfileCard';

const base: any = {
  id: 1, name: 'Ana Beat', role: 'dj', specialty: 'House', rating: 0, reviews: 0, location: 'Madrid', zone: 'Madrid', country: 'España',
  city: 'Madrid', experience: '', price: 80, priceUnit: '/hora', avatar: 'A', gradient: '', badges: [], description: 'Bio', phone: '', instagram: '',
  topWeekend: false, photo: 'https://x/f.jpg', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional',
};

describe('ProfileCard: posición destacada', () => {
  it('Premium real con foto lleva la etiqueta Destacado', () => {
    render(<ProfileCard profile={{ ...base, userId: 'u1', subscriptionTier: 'business' }} />);
    expect(screen.getByText('Destacado')).toBeTruthy();
  });
  it('Profesional y Esencial no la llevan', () => {
    const { unmount } = render(<ProfileCard profile={{ ...base, userId: 'u1', subscriptionTier: 'starter' }} />);
    expect(screen.queryByText('Destacado')).toBeNull();
    unmount();
    render(<ProfileCard profile={{ ...base, userId: 'u1', subscriptionTier: 'free' }} />);
    expect(screen.queryByText('Destacado')).toBeNull();
  });
  it('un perfil de demostración (sin userId) no la lleva aunque su tier de ejemplo sea elite', () => {
    render(<ProfileCard profile={{ ...base, subscriptionTier: 'elite' }} />);
    expect(screen.queryByText('Destacado')).toBeNull();
  });
  it('Premium sin foto no la lleva', () => {
    render(<ProfileCard profile={{ ...base, userId: 'u1', subscriptionTier: 'business', photo: '' }} />);
    expect(screen.queryByText('Destacado')).toBeNull();
  });
});
