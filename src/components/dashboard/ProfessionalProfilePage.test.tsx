import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfessionalProfilePage from './ProfessionalProfilePage';
import type { Profile } from '@/data/profiles';

vi.mock('@/integrations/supabase/client', () => {
  const filas = [{ role: 'dj', audio_session_urls: ['https://soundcloud.com/dj-prueba/set-de-prueba'], bio: 'Bio de prueba', genres: ['Techno'] }];
  const cadena: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'in', 'order', 'limit', 'maybeSingle']) cadena[m] = () => cadena;
  cadena.then = (f: (r: unknown) => unknown) => Promise.resolve(f({ data: filas, error: null, count: 0 }));
  return { supabase: { from: () => cadena, rpc: () => Promise.resolve({ data: [], error: null }) } };
});
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ user_id: 'yo', role: 'empresario' }) }));
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: { id: 'yo' } }) }));
vi.mock('@/hooks/useScarcitySignal', () => ({ useScarcitySignal: () => ({ loading: true, weeklyContactRequests: 0 }) }));
vi.mock('@/components/AvailabilityCalendar', () => ({ default: () => null }));
vi.mock('@/components/ReviewsSection', () => ({ default: () => null }));
vi.mock('@/components/FollowButton', () => ({ default: () => null }));

const perfil = (role: string) => ({
  id: 1, userId: 'dj-1', name: 'DJ Prueba', role, specialty: '', rating: 0, reviews: 0, location: 'Madrid', zone: 'Madrid',
  experience: '', price: 80, priceUnit: '', avatar: 'DP', gradient: '', badges: [], description: '', phone: '', instagram: '',
  topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional',
}) as unknown as Profile;

describe('ProfessionalProfilePage (ficha dentro del panel)', () => {
  it('un DJ se ve como perfil de artista: cabecera, pestañas y sets', async () => {
    render(<ProfessionalProfilePage profile={perfil('dj')} onClose={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: 'DJ Prueba' })).toBeTruthy();
    expect(await screen.findByRole('tab', { name: /Sets/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Sobre mí/ })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Reseñas/ })).toBeTruthy();
    expect(await screen.findByRole('button', { name: 'Escuchar Set de prueba' })).toBeTruthy();
  });

  it('otro rol mantiene la ficha de siempre, sin pestañas', async () => {
    render(<ProfessionalProfilePage profile={perfil('fotografo')} onClose={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: 'DJ Prueba' })).toBeTruthy();
    expect(screen.queryByRole('tablist')).toBeNull();
  });
});
