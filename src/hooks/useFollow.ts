import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FollowState {
  isFollowing: boolean;
  loading: boolean;
  toggleFollow: () => Promise<void>;
}

export const useFollow = (viewerId: string | undefined, followedUserId: string | undefined): FollowState => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!viewerId || !followedUserId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    supabase.from('follows').select('follower_id')
      .eq('follower_id', viewerId)
      .eq('followed_user_id', followedUserId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setIsFollowing(!!data);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [viewerId, followedUserId]);

  const toggleFollow = async () => {
    if (!viewerId || !followedUserId) return;
    if (isFollowing) {
      await supabase.from('follows').delete()
        .eq('follower_id', viewerId)
        .eq('followed_user_id', followedUserId);
      setIsFollowing(false);
    } else {
      await supabase.from('follows').insert({ follower_id: viewerId, followed_user_id: followedUserId });
      setIsFollowing(true);
    }
  };

  return { isFollowing, loading, toggleFollow };
};
