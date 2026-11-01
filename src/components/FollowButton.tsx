import { UserPlus, UserCheck } from 'lucide-react';
import { useFollow } from '@/hooks/useFollow';

interface FollowButtonProps {
  viewerId: string | undefined;
  followedUserId: string;
  // Tarjetas estrechas (2 columnas en móvil, directorio): el texto no cabe
  // al lado del nombre sin desbordar o forzar el truncado del nombre.
  // Icono solo en móvil, texto + icono a partir de sm.
  compact?: boolean;
  // Sobre fondo claro (cabecera de artista del DJ): el estilo por defecto
  // está pensado para ir encima de una foto y "Siguiendo" saldría en blanco.
  claro?: boolean;
}

// Botón de seguir para fichas públicas de profesionales. Los empresarios no
// tienen ficha pública (decisión de estrategia), así que solo se sigue a
// profesionales — nunca al revés.
const FollowButton = ({ viewerId, followedUserId, compact, claro }: FollowButtonProps) => {
  const { isFollowing, loading, toggleFollow } = useFollow(viewerId, followedUserId);

  if (!viewerId) return null;

  return (
    <button type="button" onClick={toggleFollow} disabled={loading}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? 'Dejar de seguir' : 'Seguir'}
      className={`inline-flex items-center justify-center gap-1.5 font-black rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-60 flex-shrink-0 ${claro ? 'text-sm px-5 py-2' : compact ? 'text-xs w-7 h-7 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5' : 'text-xs px-3 py-1.5'}`}
      style={claro
        ? (isFollowing
          ? { background: '#fff', border: '1.5px solid rgba(212,175,55,0.6)', color: '#8B6A00' }
          : { background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' })
        : isFollowing
        ? { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }
        : { background: 'rgba(212,175,55,0.85)', color: '#000', backdropFilter: 'blur(8px)' }}>
      {isFollowing ? <UserCheck size={claro ? 15 : 12} /> : <UserPlus size={claro ? 15 : 12} />}
      <span className={compact ? 'hidden sm:inline' : undefined}>{isFollowing ? 'Siguiendo' : 'Seguir'}</span>
    </button>
  );
};

export default FollowButton;
