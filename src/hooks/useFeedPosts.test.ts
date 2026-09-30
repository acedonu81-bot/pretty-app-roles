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

const baseProfile = { photo_url: null, role: 'dj', portfolio_urls: null, audio_session_urls: null, audio_embed_url: null, updated_at: '2026-09-01T00:00:00Z' };

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
        { user_id: 'pro-1', display_name: 'DJ Uno', ...baseProfile },
        { user_id: 'pro-2', display_name: 'DJ Dos', ...baseProfile },
      ],
    });

    const { result } = renderHook(() => useFeedPosts('viewer-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts[0]).toMatchObject({ id: 'post-1', authorName: 'DJ Uno' });
    expect(result.current.posts[1]).toMatchObject({ id: 'post-2', authorName: 'DJ Dos' });
  });

  it('falls back to portfolio photos when a followed profile has no posts', async () => {
    mockTables({
      follows: [{ followed_user_id: 'pro-3' }],
      posts: [],
      profiles: [
        { user_id: 'pro-3', display_name: 'DJ Tres', ...baseProfile, portfolio_urls: ['https://x/a.jpg', 'https://x/b.jpg'] },
      ],
    });

    const { result } = renderHook(() => useFeedPosts('viewer-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts.every(p => p.post_type === 'image' && p.authorName === 'DJ Tres')).toBe(true);
    expect(result.current.posts.map(p => p.media_url)).toEqual(['https://x/a.jpg', 'https://x/b.jpg']);
  });

  it('mixes real posts, audio sessions and portfolio from the same profile', async () => {
    mockTables({
      follows: [{ followed_user_id: 'pro-4' }],
      posts: [
        { id: 'post-4', user_id: 'pro-4', content: 'Novedad real', post_type: 'text', media_url: null, created_at: '2026-09-30T10:00:00Z' },
      ],
      profiles: [
        {
          user_id: 'pro-4', display_name: 'DJ Cuatro', ...baseProfile,
          portfolio_urls: ['https://x/c.jpg'],
          audio_session_urls: ['https://soundcloud.com/set-1'],
        },
      ],
    });

    const { result } = renderHook(() => useFeedPosts('viewer-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts).toHaveLength(3);
    const types = result.current.posts.map(p => p.post_type).sort();
    expect(types).toEqual(['audio', 'image', 'text']);
  });

  it('includes the main audio_embed_url when there are no audio_session_urls', async () => {
    mockTables({
      follows: [{ followed_user_id: 'pro-5' }],
      posts: [],
      profiles: [
        { user_id: 'pro-5', display_name: 'DJ Cinco', ...baseProfile, audio_embed_url: 'https://hearthis.at/perfil/' },
      ],
    });

    const { result } = renderHook(() => useFeedPosts('viewer-1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.posts[0]).toMatchObject({ post_type: 'audio', media_url: 'https://hearthis.at/perfil/' });
  });
});
