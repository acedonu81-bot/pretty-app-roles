import { UserPlus, UserCheck } from 'lucide-react';
import { useFollow } from '@/hooks/useFollow';

interface FollowButtonProps {
  viewerId: string | undefined;
  followedUserId: string;
}

// Botón de seguir para fichas públicas de profesionales. Los empresarios no
// tienen ficha pública (decisión de estrategia), así que solo se sigue a
// profesionales — nunca al revés.
const FollowButton = ({ viewerId, followedUserId }: FollowButtonProps) => {
  const { isFollowing, loading, toggleFollow } = useFollow(viewerId, followedUserId);

  if (!viewerId) return null;

  return (
    <button type="button" onClick={toggleFollow} disabled={loading}
      aria-pressed={isFollowing}
      className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
      style={isFollowing
        ? { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }
        : { background: 'rgba(212,175,55,0.85)', color: '#000', backdropFilter: 'blur(8px)' }}>
      {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
      {isFollowing ? 'Siguiendo' : 'Seguir'}
    </button>
  );
};

export default FollowButton;
