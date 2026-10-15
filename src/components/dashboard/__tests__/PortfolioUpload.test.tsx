import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Subida de fotos del portfolio: se pueden elegir varias de golpe (antes solo
// entraba una por vez) y se suben seguidas, guardando la lista una sola vez.

const upload = vi.fn(async () => ({ error: null }));
const update = vi.fn();
const eq = vi.fn(async () => ({ error: null }));
const existentes = { n: 0 };

const usuario = { id: 'u1' };
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: usuario }) }));
vi.mock('@/hooks/useProfile', () => ({ useProfile: () => ({ role: 'dj' }) }));
vi.mock('@/lib/image', () => ({ compressImage: async (f: File) => f }));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: { from: () => ({
      list: async () => ({ data: Array.from({ length: existentes.n }, (_, i) => ({ name: `${1700000000000 + i}-a.jpg` })) }),
      getPublicUrl: (p: string) => ({ data: { publicUrl: 'https://x/' + p } }),
      upload,
      remove: vi.fn(),
    }) },
    from: () => ({ update: (v: unknown) => { update(v); return { eq }; } }),
  },
}));

import PortfolioUpload from '@/components/dashboard/PortfolioUpload';
import { toast } from 'sonner';

const img = (n: string) => new File(['x'], n, { type: 'image/jpeg' });
const montar = async () => {
  const { container } = render(<PortfolioUpload />);
  await waitFor(() => expect(screen.getByText(/0\/12|\/12/)).toBeTruthy());
  fireEvent.click(screen.getByRole('checkbox'));
  return container.querySelector('input[type="file"]') as HTMLInputElement;
};

describe('PortfolioUpload', () => {
  beforeEach(() => { vi.clearAllMocks(); existentes.n = 0; });

  it('el selector admite varias fotos', async () => {
    expect((await montar()).multiple).toBe(true);
  });

  it('sube todas las elegidas y guarda la lista una vez', async () => {
    const input = await montar();
    fireEvent.change(input, { target: { files: [img('a.jpg'), img('b.jpg'), img('c.jpg')] } });
    await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    expect(upload).toHaveBeenCalledTimes(3);
    expect((update.mock.calls[0][0] as { portfolio_urls: string[] }).portfolio_urls).toHaveLength(3);
    expect(toast.success).toHaveBeenCalledWith('3 fotos añadidas al portfolio.');
  });

  it('si no caben todas, sube las que quepan y avisa', async () => {
    existentes.n = 10;
    const input = await montar();
    fireEvent.change(input, { target: { files: [img('a.jpg'), img('b.jpg'), img('c.jpg'), img('d.jpg')] } });
    await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    expect(upload).toHaveBeenCalledTimes(2);
    expect((update.mock.calls[0][0] as { portfolio_urls: string[] }).portfolio_urls).toHaveLength(12);
    expect(toast.error).toHaveBeenCalledWith('Solo caben 2 más: se suben las 2 primeras.');
  });
});
