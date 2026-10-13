import { Heart } from 'lucide-react';
import { useFeedLike } from '@/hooks/useFeedLike';

interface LikeButtonProps {
  viewerId: string | undefined;
  contentKey: string;
  /** Tras dar o quitar el me gusta (p. ej. para reordenar el concurso). */
  onChange?: () => void;
}

const LikeButton = ({ viewerId, contentKey, onChange }: LikeButtonProps) => {
  const { count, liked, loading, toggleLike } = useFeedLike(viewerId, contentKey);

  return (
    <button type="button" onClick={async () => { await toggleLike(); onChange?.(); }} disabled={loading || !viewerId}
      aria-pressed={liked}
      aria-label={liked ? 'Quitar me gusta' : 'Me gusta'}
      className="inline-flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      style={{ color: liked ? '#E11D48' : '#6b7280' }}>
      <Heart size={18} fill={liked ? '#E11D48' : 'none'} strokeWidth={2} />
      {count > 0 && <span className="text-xs font-bold tabular-nums">{count}</span>}
    </button>
  );
};

export default LikeButton;
