import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SetFilaArtista from './SetFilaArtista';

vi.mock('@/integrations/supabase/client', () => {
  const cadena: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'in', 'order', 'limit']) cadena[m] = () => cadena;
  cadena.then = (f: (r: { data: unknown[]; error: null }) => unknown) => Promise.resolve(f({ data: [], error: null }));
  return { supabase: { from: () => cadena } };
});

const URL_SET = 'https://ddrqhwravupjzysriblq.supabase.co/storage/v1/object/public/audio-sessions/dj/sessions/1-set.mp3';
const base = {
  url: URL_SET, autor: 'DJ Prueba', ficha: null, numero: 1, estiloPorDefecto: 'Techno',
  djUserId: 'dj-1', onIniciarSesion: () => {},
};

describe('SetFilaArtista: carátula y fondo editables', () => {
  it('un visitante no ve ninguna cámara', () => {
    render(<SetFilaArtista {...base} destacado viewerId="otro" />);
    expect(screen.queryByLabelText('Cambiar la carátula de este set')).toBeNull();
    expect(screen.queryByLabelText('Cambiar el fondo de este set')).toBeNull();
  });

  it('el DJ cambia carátula y, en el destacado, también el fondo', () => {
    render(<SetFilaArtista {...base} destacado viewerId="dj-1" />);
    expect(screen.getByLabelText('Cambiar la carátula de este set')).toBeTruthy();
    expect(screen.getByLabelText('Cambiar el fondo de este set')).toBeTruthy();
  });

  it('en un set normal el DJ solo cambia la carátula', () => {
    render(<SetFilaArtista {...base} destacado={false} viewerId="dj-1" />);
    expect(screen.getByLabelText('Cambiar la carátula de este set')).toBeTruthy();
    expect(screen.queryByLabelText('Cambiar el fondo de este set')).toBeNull();
  });
});
