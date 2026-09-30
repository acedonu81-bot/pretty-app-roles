import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFeedPosts } from './useFeedPosts';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn() },
}));

function mockTables({ follows, posts, profiles }: { follows: { followed_user_id: string }[]; posts: any[]; profiles: any[] }) {
  (supabase.from as any).mockImplementation((table: string) => {
    if (table === 'follows') {
      const eq = vi.fn().mockResolvedValue({ data: follows, error: null });
      const select = vi.fn().mockReturnValue({ eq });
      return { select };
    }
    if (table === 'profile_posts') {
      const order = vi.fn().mockResolvedValue({ data: posts, error: null });
      const inFn = vi.fn().mockReturnValue({ order });
      const select = vi.fn().mockReturnValue({ in: inFn });
      return { select };
    }
    if (table === 'profiles') {
      const inFn = vi.fn().mockResolvedValue({ data: profiles, error: null });
      const select = vi.fn().mockReturnValue({ in: inFn });
      return { select };
    }
    throw new Error(`unexpected table ${table}`);
  });
}

describe('useFeedPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty feed without querying when there is no viewer', async () => {
    const { result } = renderHook(() => useFeedPosts(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.posts).toEqual([]);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('returns empty feed when following no one', async () => {
    mockTables({ follows: [], posts: [], profiles: [] });

    const { result } = renderHook(() => useFeedPosts('viewer-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts).toEqual([]);
  });

  it('joins posts from followed profiles with their author info', async () => {
    mockTables({
      follows: [{ followed_user_id: 'pro-1' }, { followed_user_id: 'pro-2' }],
      posts: [
        { id: 'post-1', user_id: 'pro-1', content: 'Hola', post_type: 'text', media_url: null, created_at: '2026-09-30T10:00:00Z' },
        { id: 'post-2', user_id: 'pro-2', content: 'Mix nuevo', post_type: 'text', media_url: null, created_at: '2026-09-29T10:00:00Z' },
      ],
      profiles: [
        { user_id: 'pro-1', display_name: 'DJ Uno', photo_url: null, role: 'dj' },
        { user_id: 'pro-2', display_name: 'DJ Dos', photo_url: null, role: 'dj' },
      ],
    });

    const { result } = renderHook(() => useFeedPosts('viewer-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts[0]).toMatchObject({ id: 'post-1', authorName: 'DJ Uno' });
    expect(result.current.posts[1]).toMatchObject({ id: 'post-2', authorName: 'DJ Dos' });
  });
});
