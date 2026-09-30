import { Music, Image as ImageIcon, MessageSquareText } from 'lucide-react';
import type { FeedPost } from '@/hooks/useFeedPosts';
import LikeButton from '@/components/LikeButton';
import SessionAudioPlayer from '@/components/SessionAudioPlayer';

const TIME_LABELS: [number, string][] = [
  [60, 's'], [60, 'm'], [24, 'h'], [7, 'd'], [4.345, 'sem'], [12, 'mes'], [Infinity, 'a'],
];

function haceTiempo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  let seconds = diffMs / 1000;
  for (const [unit, label] of TIME_LABELS) {
    if (seconds < unit) return `hace ${Math.max(1, Math.floor(seconds))}${label}`;
    seconds /= unit;
  }
  return '';
}

const TYPE_BADGE: Record<string, { icon: typeof ImageIcon; label: string }> = {
  image: { icon: ImageIcon, label: 'Foto' },
  audio: { icon: Music, label: 'Sesión' },
  text: { icon: MessageSquareText, label: 'Novedad' },
};

// Tarjeta grande del feed (dashboard), una por pieza de contenido — media a
// ancho completo cuando existe, cabecera de autor + acciones (like) siempre.
// Distinta de PostCard.tsx (más compacta, usada en la ficha pública) porque
// el feed necesita más presencia visual: es la superficie pensada para dar
// una razón de volver a la app, no un listado denso.
const FeedPostCard = ({ post, viewerId }: { post: FeedPost; viewerId: string | undefined }) => {
  const badge = TYPE_BADGE[post.post_type] ?? TYPE_BADGE.text;
  const BadgeIcon = badge.icon;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      {post.media_url && post.post_type === 'image' && (
        <div className="relative" style={{ aspectRatio: '4/5', background: '#FBF3DD' }}>
          <img src={post.media_url} alt="" loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[0.65rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(37,99,235,0.08)', color: '#2563EB' }}>
            <BadgeIcon size={10} /> {badge.label}
          </span>
          <span className="text-xs" style={{ color: '#9ca3af' }}>{haceTiempo(post.created_at)}</span>
        </div>

        {post.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#222' }}>{post.content}</p>
        )}

        {post.media_url && post.post_type === 'audio' && (
          <SessionAudioPlayer url={post.media_url} />
        )}

        <div className="flex items-center pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="pt-2.5">
            <LikeButton viewerId={viewerId} contentKey={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPostCard;
