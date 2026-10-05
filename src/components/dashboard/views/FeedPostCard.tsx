import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Music, Image as ImageIcon, MessageSquareText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FeedPost } from '@/hooks/useFeedPosts';
import type { FeedGroup } from '@/components/dashboard/views/FeedView';
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

// Posts de texto largos (un DJ describiendo su servicio línea a línea) ocupaban
// la tarjeta entera y disparaban su altura muy por encima del resto de la
// columna del masonry — break-words arregló que se desbordara, pero seguía
// leyéndose como un muro de texto. line-clamp-5 + "Leer más" corta visualmente
// sin perder el contenido (distinto de TruncatedDescription: ese componente
// envuelve el texto entre comillas, pensado para reseñas, no para este post).
const FeedPostText = ({ text, color }: { text: string; color: string }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 220;
  return (
    <div>
      <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words pt-1 min-w-0 ${expanded || !isLong ? '' : 'line-clamp-5'}`}
        style={{ color }}>
        {text}
      </p>
      {isLong && (
        <button type="button" onClick={() => setExpanded(v => !v)}
          className="text-xs font-bold underline underline-offset-2 mt-1" style={{ color }}>
          {expanded ? 'Leer menos' : 'Leer más'}
        </button>
      )}
    </div>
  );
};

// Tarjeta del feed en el lenguaje visual de Healthy Zone (claymorphism verde/
// azul). Una tarjeta = un bloque de posts consecutivos del MISMO autor (ver
// groupConsecutiveByAuthor en FeedView.tsx), con un único header — antes cada
// foto o sesión suelta era su propia tarjeta con su propio header, y alguien
// con 3 fotos de portfolio ocupaba 3 tarjetas con su nombre repetido 3 veces.
// En móvil (1 columna) apenas se notaba, pero en desktop con 2-3 columnas de
// masonry el mismo nombre aparecía en paralelo en varias columnas a la vez —
// reportado por el usuario el 2 oct 2026. Fotos en grid interno, sesiones de
// audio apiladas: mismo patrón que un post multi-imagen de Instagram/LinkedIn.
const FeedPostCard = ({ group, viewerId }: { group: FeedGroup; viewerId: string | undefined }) => {
  const { posts } = group;
  const first = posts[0];
  const tone = TONES[toneFor(group.key)];

  const photos = posts.filter(p => p.post_type === 'image' && p.media_url);
  const audios = posts.filter(p => p.post_type === 'audio' && p.media_url);
  const texts = posts.filter(p => p.post_type === 'text' || (!p.media_url && p.content));

  // Ninguna foto del grid abría nada al pinchar — el "+N" de la 4ª miniatura
  // era puramente decorativo, sin onClick (reportado por el usuario el 5 oct
  // 2026). lightboxIndex guarda qué foto de `photos` está abierta a pantalla
  // completa; null = cerrado.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fecha más reciente real del bloque (ignora las aproximadas si hay alguna
  // exacta disponible, igual que antes se hacía por pieza individual).
  const tiempoPost = posts.find(p => !p.dateIsApproximate) ?? first;
  const tiempo = tiempoPost.dateIsApproximate ? null : haceTiempo(tiempoPost.created_at);

  return (
    <div className="rounded-[24px] overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5"
      style={{ background: `linear-gradient(170deg, ${tone.bubble}66, ${HZ.surface} 55%)`, boxShadow: clay(tone.rgb, 'lg'), fontFamily: HZ.body }}>
      <Link to={`/p/${first.authorUserId}`} className="flex items-center gap-2 px-4 pt-4 pb-1 hover:opacity-80">
        {first.authorPhoto ? (
          <img src={fotoOptimizada(first.authorPhoto, 48)} alt={first.authorName}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0" style={{ objectPosition: '50% 15%' }} />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.65rem] flex-shrink-0"
            style={{ background: tone.card, color: tone.stroke, fontFamily: HZ.display, fontWeight: 800 }}>
            {first.authorName.charAt(0)}
          </div>
        )}
        <span className="text-xs truncate" style={{ color: HZ.ink, fontWeight: 800 }}>{first.authorName}</span>
        {tiempo && <span className="text-[0.68rem] flex-shrink-0" style={{ color: HZ.inkSoft }}>· {tiempo}</span>}
      </Link>

      {photos.length > 0 && (
        <div className={`mt-2 ${photos.length === 1 ? '' : 'grid grid-cols-2 gap-0.5'}`}>
          {photos.slice(0, 4).map((p, i) => (
            <button key={p.id} type="button" onClick={() => setLightboxIndex(i)}
              className="relative text-left cursor-zoom-in"
              style={{ aspectRatio: photos.length === 1 ? '4/5' : '1/1', background: tone.card }}>
              <img src={p.media_url!} alt={`Foto de ${first.authorName}`} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              {i === 0 && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[0.65rem] px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.92)', color: tone.stroke, fontFamily: HZ.display, fontWeight: 800, backdropFilter: 'blur(6px)' }}>
                  <ImageIcon size={11} /> {photos.length > 1 ? `${photos.length} fotos` : 'Foto'}
                </span>
              )}
              {i === 3 && photos.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white" style={{ background: 'rgba(0,0,0,0.45)' }}>
                  +{photos.length - 4}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {texts.slice(0, 2).map(t => (
          <div key={t.id} className="flex flex-col gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <span className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 mt-0.5"
                style={{ background: tone.bubble, color: '#fff' }}>
                <MessageSquareText size={13} />
              </span>
              <div className="min-w-0 flex-1">
                <FeedPostText text={t.content} color={HZ.ink} />
              </div>
            </div>
            <LikeButton viewerId={viewerId} contentKey={t.id} />
          </div>
        ))}

        {audios.slice(0, 3).map(a => (
          <div key={a.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
                style={{ background: tone.bubble, color: '#fff' }}>
                <Music size={13} />
              </span>
              <SessionAudioPlayer url={a.media_url!} />
            </div>
            <LikeButton viewerId={viewerId} contentKey={a.id} />
          </div>
        ))}

        {photos.length > 0 && (
          <div className="flex items-center pt-2.5" style={{ borderTop: `1px solid ${tone.card}` }}>
            <LikeButton viewerId={viewerId} contentKey={photos[0].id} />
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          index={lightboxIndex}
          authorName={first.authorName}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

// Visor a pantalla completa, estilo stories: la foto "se levanta" con un
// pequeño scale+fade de entrada, y se navega arrastrándola a un lado — igual
// que pedido por el usuario ("levante la foto y la puedas quitar para ver
// las demás"), en vez de solo flechas estáticas. El swipe se mide con
// pointer events nativos (sin librería): se sigue el dedo/ratón mientras
// arrastra y, al soltar, si pasó el umbral, la foto termina de salir hacia
// ese lado y entra la siguiente/anterior; si no, vuelve a su sitio con un
// pequeño rebote. Las flechas y el teclado (← →, Esc) cubren desktop.
const PhotoLightbox = ({ photos, index, authorName, onIndexChange, onClose }: {
  photos: FeedPost[];
  index: number;
  authorName: string;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) => {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null);
  const startXRef = useRef(0);

  const go = (dir: 1 | -1) => {
    const next = index + dir;
    if (next < 0 || next >= photos.length) return;
    setExiting(dir === 1 ? 'left' : 'right');
    setTimeout(() => { onIndexChange(next); setExiting(null); setDragX(0); }, 180);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startXRef.current = e.clientX;
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - startXRef.current);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = 90;
    if (dragX <= -threshold && index < photos.length - 1) { go(1); return; }
    if (dragX >= threshold && index > 0) { go(-1); return; }
    setDragX(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  };

  const photo = photos[index];
  const translate = exiting === 'left' ? -120 : exiting === 'right' ? 120 : dragX;
  const opacity = exiting ? 0 : 1 - Math.min(Math.abs(dragX) / 400, 0.5);

  return (
    <div
      role="dialog" aria-modal="true" aria-label={`Foto ${index + 1} de ${photos.length} de ${authorName}`}
      tabIndex={-1} onKeyDown={onKeyDown}
      ref={el => el?.focus()}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(10,9,8,0.92)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <button type="button" onClick={e => { e.stopPropagation(); onClose(); }}
        aria-label="Cerrar" className="absolute top-4 right-4 p-2 rounded-full transition-opacity hover:opacity-70"
        style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
        <X size={20} />
      </button>

      {photos.length > 1 && (
        <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
          {index + 1} / {photos.length}
        </span>
      )}

      {index > 0 && (
        <button type="button" onClick={e => { e.stopPropagation(); go(-1); }}
          aria-label="Foto anterior"
          className="hidden sm:flex absolute left-3 items-center justify-center w-10 h-10 rounded-full transition-opacity hover:opacity-70"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
          <ChevronLeft size={22} />
        </button>
      )}
      {index < photos.length - 1 && (
        <button type="button" onClick={e => { e.stopPropagation(); go(1); }}
          aria-label="Foto siguiente"
          className="hidden sm:flex absolute right-3 items-center justify-center w-10 h-10 rounded-full transition-opacity hover:opacity-70"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
          <ChevronRight size={22} />
        </button>
      )}

      <img
        key={photo.id}
        src={fotoOptimizada(photo.media_url!, 1200, 85)}
        alt={`Foto de ${authorName}`}
        onClick={e => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="max-w-[92vw] max-h-[86vh] object-contain select-none touch-none motion-safe:animate-[lightboxIn_200ms_ease-out]"
        style={{
          transform: `translateX(${translate}px) rotate(${translate / 28}deg)`,
          opacity,
          transition: dragging ? 'none' : 'transform 220ms cubic-bezier(0.32,0.72,0,1), opacity 220ms',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      />
    </div>
  );
};

export default FeedPostCard;
