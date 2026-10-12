import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Cualquier cadena de supabase (from/select/or/rpc/...) resuelve vacía.
vi.mock('@/integrations/supabase/client', () => {
  const vacio = { data: [], count: 0, error: null };
  const cadena: unknown = new Proxy(function () {}, {
    get: (_t, prop) => (prop === 'then'
      ? (ok: (r: typeof vacio) => unknown) => Promise.resolve(ok(vacio))
      : cadena),
    apply: () => cadena,
  });
  return { supabase: cadena };
});
vi.mock('@/components/dashboard/OffersWidget', () => ({ default: () => null }));
vi.mock('@/components/dashboard/ResourcesBanner', () => ({ default: () => null }));
vi.mock('@/components/dashboard/UltimaContratacion', () => ({ default: () => null }));
vi.mock('@/lib/regions', async (orig) => ({ ...(await orig<typeof import('@/lib/regions')>()), getPresetRegion: () => 'Todas' }));

import DirectoryView from '../DirectoryView';

const pintar = (props: Partial<Parameters<typeof DirectoryView>[0]> = {}) => {
  const onNavigate = vi.fn();
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <DirectoryView role="disco-movil" title="Disco Móvil" subtitle="" onNavigate={onNavigate} {...props} />
    </QueryClientProvider>,
  );
  return onNavigate;
};

describe('DirectoryView con la categoría vacía', () => {
  it('dice la verdad y ofrece salida a otras categorías', async () => {
    const onNavigate = pintar();
    expect(await screen.findByText('Categoría recién abierta')).toBeInTheDocument();
    expect(screen.queryByText(/seguro que aparece alguien/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver otras categorías' }));
    expect(onNavigate).toHaveBeenCalledWith('explorar');
  });

  it('con una búsqueda sin resultados mantiene el mensaje de búsqueda, no el de categoría vacía', async () => {
    pintar({ searchQuery: 'Pepito' });
    expect(await screen.findByText('Nadie con ese nombre por aquí')).toBeInTheDocument();
    expect(screen.queryByText('Categoría recién abierta')).not.toBeInTheDocument();
  });
});
