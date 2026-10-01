import { Music, Image as ImageIcon, MessageSquareText } from 'lucide-react';
import type { FeedPost } from '@/hooks/useFeedPosts';
import LikeButton from '@/components/LikeButton';
import SessionAudioPlayer from '@/components/SessionAudioPlayer';
import { HZ, clay, TONES } from '@/components/healthy-zone/clay';
import type { HZTone } from '@/data/healthyZone';
import { fotoOptimizada } from '@/lib/imagen';

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

const TYPE_META: Record<string, { icon: typeof ImageIcon; label: string }> = {
  image: { icon: ImageIcon, label: 'Foto' },
  audio: { icon: Music, label: 'Sesión' },
  text: { icon: MessageSquareText, label: 'Novedad' },
};

// Rotación estable de tono por pieza (no aleatoria en cada render) — mismo
// patrón que HZMatchCard.tsx (hashCode sobre un string estable).
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0;
  return h;
}
const TONE_ORDER: HZTone[] = ['leaf', 'sky', 'sun', 'lilac'];
const toneFor = (key: string): HZTone => TONE_ORDER[Math.abs(hashCode(key)) % TONE_ORDER.length];

// Tarjeta del feed en el lenguaje visual de Healthy Zone (claymorphism verde/
// azul, adelanto deliberado de esa nueva zona — decisión del usuario 1 oct
// 2026: "la zona social" adopta ese estilo en vez del dorado/crema del resto
// del dashboard). Tono rotado por pieza para variedad visual real, no una
// sola tarjeta blanca repetida.
//
// Mini-cabecera de autor DENTRO de cada tarjeta (no un bloque compartido por
// persona envolviendo varias piezas): con columns-N (masonry real, cada
// tarjeta fluye a su altura natural) un contenedor por autor rompería el
// flujo en cascada y volvería a producir huecos — cada tarjeta es la unidad
// independiente, como en Pinterest/Instagram grid.
const FeedPostCard = ({ post, viewerId }: { post: FeedPost; viewerId: string | undefined }) => {
  const meta = TYPE_META[post.post_type] ?? TYPE_META.text;
  const Icon = meta.icon;
  const isPhoto = post.media_url && post.post_type === 'image';
  // dateIsApproximate: ver nota en useFeedPosts.ts — un link externo pegado
  // no tiene timestamp real, se oculta en vez de mostrar una fecha falsa.
  const tiempo = post.dateIsApproximate ? null : haceTiempo(post.created_at);
  const tone = TONES[toneFor(post.id)];

  return (
    <div className="rounded-[24px] overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5 mb-4 break-inside-avoid"
      style={{ background: HZ.surface, boxShadow: clay(tone.rgb, 'md'), fontFamily: HZ.body }}>
      <a href={`/p/${post.authorUserId}`} className="flex items-center gap-2 px-4 pt-4 pb-1 hover:opacity-80">
        {post.authorPhoto ? (
          <img src={fotoOptimizada(post.authorPhoto, 48)} alt={post.authorName}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0" style={{ objectPosition: '50% 15%' }} />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.65rem] flex-shrink-0"
            style={{ background: tone.card, color: tone.stroke, fontFamily: HZ.display, fontWeight: 800 }}>
            {post.authorName.charAt(0)}
          </div>
        )}
        <span className="text-xs truncate" style={{ color: HZ.ink, fontWeight: 800 }}>{post.authorName}</span>
      </a>

      {isPhoto && (
        <div className="relative mt-2" style={{ aspectRatio: '4/5', background: tone.card }}>
          <img src={post.media_url!} alt={`${meta.label} de ${post.authorName}`} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[0.65rem] px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.92)', color: tone.stroke, fontFamily: HZ.display, fontWeight: 800, backdropFilter: 'blur(6px)' }}>
            <Icon size={11} /> {meta.label}
          </span>
          {tiempo && (
            <span className="absolute bottom-2.5 right-3 text-[0.68rem]" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>
              {tiempo}
            </span>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {!isPhoto && (
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
              style={{ background: tone.card, color: tone.stroke }}>
              <Icon size={13} />
            </span>
            <span className="text-[0.7rem]" style={{ color: tone.stroke, fontFamily: HZ.display, fontWeight: 800, letterSpacing: '0.02em' }}>
              {meta.label.toUpperCase()}
            </span>
            {tiempo && <span className="text-xs" style={{ color: HZ.inkSoft }}>· {tiempo}</span>}
          </div>
        )}

        {post.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: HZ.ink }}>{post.content}</p>
        )}

        {post.media_url && post.post_type === 'audio' && (
          <SessionAudioPlayer url={post.media_url} />
        )}

        <div className="flex items-center pt-2.5" style={{ borderTop: `1px solid ${tone.card}` }}>
          <LikeButton viewerId={viewerId} contentKey={post.id} />
        </div>
      </div>
    </div>
  );
};

export default FeedPostCard;
