import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFollow } from './useFollow';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockFollowsTable({ alreadyFollowing }: { alreadyFollowing: boolean }) {
  const deleteEq2 = vi.fn().mockResolvedValue({ error: null });
  const deleteEq1 = vi.fn().mockReturnValue({ eq: deleteEq2 });
  const del = vi.fn().mockReturnValue({ eq: deleteEq1 });
  const insert = vi.fn().mockResolvedValue({ error: null });
  const maybeSingle = vi.fn().mockResolvedValue({
    data: alreadyFollowing ? { follower_id: 'viewer-1' } : null,
    error: null,
  });
  const eq2 = vi.fn().mockReturnValue({ maybeSingle });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const select = vi.fn().mockReturnValue({ eq: eq1 });
  (supabase.from as any).mockReturnValue({ select, insert, delete: del });
  return { insert, del, deleteEq1, deleteEq2 };
}

describe('useFollow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports not following and does not query without a viewer', async () => {
    const { result } = renderHook(() => useFollow(undefined, 'pro-1'));

    expect(result.current.loading).toBe(false);
    expect(result.current.isFollowing).toBe(false);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('loads whether the viewer already follows the profile', async () => {
    mockFollowsTable({ alreadyFollowing: true });

    const { result } = renderHook(() => useFollow('viewer-1', 'pro-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isFollowing).toBe(true);
  });

  it('follows when not already following', async () => {
    const { insert } = mockFollowsTable({ alreadyFollowing: false });
    const { result } = renderHook(() => useFollow('viewer-1', 'pro-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.toggleFollow(); });

    expect(insert).toHaveBeenCalledWith({ follower_id: 'viewer-1', followed_user_id: 'pro-1' });
    expect(result.current.isFollowing).toBe(true);
  });

  it('unfollows when already following', async () => {
    const { deleteEq1, deleteEq2 } = mockFollowsTable({ alreadyFollowing: true });
    const { result } = renderHook(() => useFollow('viewer-1', 'pro-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.toggleFollow(); });

    expect(deleteEq1).toHaveBeenCalledWith('follower_id', 'viewer-1');
    expect(deleteEq2).toHaveBeenCalledWith('followed_user_id', 'pro-1');
    expect(result.current.isFollowing).toBe(false);
  });
});
