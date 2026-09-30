import { UserPlus, UserCheck } from 'lucide-react';
import { useFollow } from '@/hooks/useFollow';

interface FollowButtonProps {
  viewerId: string | undefined;
  followedUserId: string;
  // Tarjetas estrechas (2 columnas en móvil, directorio): el texto no cabe
  // al lado del nombre sin desbordar o forzar el truncado del nombre.
  // Icono solo en móvil, texto + icono a partir de sm.
  compact?: boolean;
}

// Botón de seguir para fichas públicas de profesionales. Los empresarios no
// tienen ficha pública (decisión de estrategia), así que solo se sigue a
// profesionales — nunca al revés.
const FollowButton = ({ viewerId, followedUserId, compact }: FollowButtonProps) => {
  const { isFollowing, loading, toggleFollow } = useFollow(viewerId, followedUserId);

  if (!viewerId) return null;

  return (
    <button type="button" onClick={toggleFollow} disabled={loading}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? 'Dejar de seguir' : 'Seguir'}
      className={`inline-flex items-center justify-center gap-1.5 text-xs font-black rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-60 flex-shrink-0 ${compact ? 'w-7 h-7 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5' : 'px-3 py-1.5'}`}
      style={isFollowing
        ? { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }
        : { background: 'rgba(212,175,55,0.85)', color: '#000', backdropFilter: 'blur(8px)' }}>
      {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
      <span className={compact ? 'hidden sm:inline' : undefined}>{isFollowing ? 'Siguiendo' : 'Seguir'}</span>
    </button>
  );
};

export default FollowButton;
