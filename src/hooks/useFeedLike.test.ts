import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFeedLike } from './useFeedLike';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockLikesTable({ count, liked }: { count: number; liked: boolean }) {
  const deleteEq2 = vi.fn().mockResolvedValue({ error: null });
  const deleteEq1 = vi.fn().mockReturnValue({ eq: deleteEq2 });
  const del = vi.fn().mockReturnValue({ eq: deleteEq1 });
  const insert = vi.fn().mockResolvedValue({ error: null });
  const maybeSingle = vi.fn().mockResolvedValue({ data: liked ? { user_id: 'viewer-1' } : null, error: null });
  const eqLiked2 = vi.fn().mockReturnValue({ maybeSingle });
  const eqLiked1 = vi.fn().mockReturnValue({ eq: eqLiked2 });
  const selectLiked = vi.fn().mockReturnValue({ eq: eqLiked1 });
  const selectCount = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ count, error: null }) });
  let selectCallCount = 0;
  const select = vi.fn().mockImplementation((...args: any[]) => {
    selectCallCount++;
    // Primera llamada: conteo (head:true). Segunda: comprobar si el propio usuario dio like.
    return selectCallCount === 1 ? selectCount(...args) : selectLiked(...args);
  });
  (supabase.from as any).mockReturnValue({ select, insert, delete: del });
  return { insert, del, deleteEq1, deleteEq2 };
}

describe('useFeedLike', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports zero likes and not liked without a viewer', async () => {
    const { result } = renderHook(() => useFeedLike(undefined, 'post-1'));

    expect(result.current.loading).toBe(false);
    expect(result.current.count).toBe(0);
    expect(result.current.liked).toBe(false);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('loads the like count and whether the viewer already liked it', async () => {
    mockLikesTable({ count: 5, liked: true });

    const { result } = renderHook(() => useFeedLike('viewer-1', 'post-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.count).toBe(5);
    expect(result.current.liked).toBe(true);
  });

  it('likes and increments the count when not already liked', async () => {
    const { insert } = mockLikesTable({ count: 3, liked: false });
    const { result } = renderHook(() => useFeedLike('viewer-1', 'post-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.toggleLike(); });

    expect(insert).toHaveBeenCalledWith({ user_id: 'viewer-1', content_key: 'post-1' });
    expect(result.current.liked).toBe(true);
    expect(result.current.count).toBe(4);
  });

  it('unlikes and decrements the count when already liked', async () => {
    const { deleteEq1, deleteEq2 } = mockLikesTable({ count: 5, liked: true });
    const { result } = renderHook(() => useFeedLike('viewer-1', 'post-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.toggleLike(); });

    expect(deleteEq1).toHaveBeenCalledWith('user_id', 'viewer-1');
    expect(deleteEq2).toHaveBeenCalledWith('content_key', 'post-1');
    expect(result.current.liked).toBe(false);
    expect(result.current.count).toBe(4);
  });
});
