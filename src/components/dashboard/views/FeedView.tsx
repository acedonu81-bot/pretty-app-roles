import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Rss } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFeedPosts, type FeedPost } from '@/hooks/useFeedPosts';
import { useFeedAlert } from '@/hooks/useFeedAlert';
import FeedPostCard from '@/components/dashboard/views/FeedPostCard';
import { HZ, BLUE_RGB } from '@/components/healthy-zone/clay';

// Nº de columnas por breakpoint — debe coincidir con los breakpoints de
// Tailwind usados más abajo (sm: 640px, xl: 1280px) para que el reparto en
// JS calce con el ancho real disponible.
function useColumnCount(): number {
  const [cols, setCols] = useState(() =>
    typeof window === 'undefined' ? 1 : window.innerWidth >= 1280 ? 3 : window.innerWidth >= 640 ? 2 : 1
  );
  useEffect(() => {
    const onResize = () => setCols(window.innerWidth >= 1280 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return cols;
}

// Altura estimada de una tarjeta a partir de su contenido — no medimos el
// DOM real (evita layout thrashing y funciona igual en el primer render):
// basta una estimación relativa para decidir a qué columna va cada tarjeta.
function estimarAltura(group: FeedGroup): number {
  const { posts } = group;
  const photos = posts.filter(p => p.post_type === 'image' && p.media_url);
  const audios = posts.filter(p => p.post_type === 'audio' && p.media_url);
  const texts = posts.filter(p => p.post_type === 'text' || (!p.media_url && p.content));
  let h = 60; // cabecera (avatar + nombre)
  if (photos.length === 1) h += 320;
  else if (photos.length > 1) h += 220;
  h += texts.slice(0, 2).reduce((acc, t) => acc + Math.min(t.content.length, 220) * 0.6 + 40, 0);
  h += audios.slice(0, 3).length * 90;
  return h;
}

// Reparto tipo Pinterest: cada tarjeta va a la columna más baja en ese
// momento (greedy), en vez de dejar que CSS `columns` las apile todas en la
// primera columna antes de pasar a la siguiente (lo que en desktop con pocas
// tarjetas o tarjetas desiguales se veía todo amontonado a la izquierda,
// reportado por el usuario el 3 oct 2026).
function repartirEnColumnas(groups: FeedGroup[], numCols: number): FeedGroup[][] {
  const columnas: FeedGroup[][] = Array.from({ length: numCols }, () => []);
  const alturas = new Array(numCols).fill(0);
  for (const group of groups) {
    const idx = alturas.indexOf(Math.min(...alturas));
    columnas[idx].push(group);
    alturas[idx] += estimarAltura(group);
  }
  return columnas;
}

// Agrupa posts consecutivos (ya vienen ordenados por fecha desc) del mismo
// autor en un solo bloque — sin esto, un profesional con 3 fotos de
// portfolio o 2 sesiones sueltas ocupaba 3 tarjetas con su nombre repetido
// tres veces seguidas en el feed, lo que en desktop (varias columnas de
// masonry) se veía como "deejayantuan / deejayantuan" en paralelo. Reportado
// por el usuario el 2 oct 2026 viendo el feed en ordenador — en móvil
// (1 columna) apenas se notaba.
export interface FeedGroup { key: string; authorUserId: string; posts: FeedPost[] }

function groupConsecutiveByAuthor(posts: FeedPost[]): FeedGroup[] {
  const groups: FeedGroup[] = [];
  for (const post of posts) {
    const last = groups[groups.length - 1];
    if (last && last.authorUserId === post.authorUserId) {
      last.posts.push(post);
    } else {
      groups.push({ key: `g-${post.id}`, authorUserId: post.authorUserId, posts: [post] });
    }
  }
  return groups;
}

// Feed en el lenguaje visual de Healthy Zone (ver nota en FeedPostCard.tsx) —
// masonry real repartido en JS (ver repartirEnColumnas arriba): cada tarjeta
// va a la columna más baja en vez de apilarse todas en la primera columna
// como hacía CSS `columns-N`, para que el feed crezca izquierda→derecha y de
// arriba a abajo en cada columna, no solo de arriba a abajo en la primera.
const FeedView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const { user } = useAuth();
  const { posts, loading, followingCount } = useFeedPosts(user?.id);
  // Marcar como visto AL SALIR, no al entrar — igual que AdminActivity.tsx:
  // si se marcara al entrar, lo que llega mientras miras la pestaña quedaría
  // fuera de la ventana de "nuevo" en la próxima visita.
  const { marcarVisto } = useFeedAlert(user?.id);
  useEffect(() => () => { marcarVisto(); }, [marcarVisto]);

  const groups = useMemo(() => groupConsecutiveByAuthor(posts), [posts]);
  const numCols = useColumnCount();
  const columnas = useMemo(() => repartirEnColumnas(groups, numCols), [groups, numCols]);

  const fonts = <Helmet><link rel="stylesheet" href={HZ.fontsHref} /></Helmet>;

  if (loading) {
    return (
      <>
        {fonts}
        <p className="text-sm animate-pulse p-6" style={{ color: HZ.inkSoft }}>Cargando feed…</p>
      </>
    );
  }

  if (posts.length === 0) {
    // Mismo posts.length===0 en dos casos distintos: no sigues a nadie
    // todavía, o ya sigues gente que aún no ha publicado nada (sin posts,
    // audio ni portfolio). Invitar a "seguir profesionales" en el segundo
    // caso no tiene sentido porque ya los sigues.
    const yaSigueAAlguien = followingCount > 0;
    return (
      <>
        {fonts}
        <div className="flex flex-col items-center justify-center text-center px-6 py-16 gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1" style={{ background: HZ.blue, boxShadow: `0 8px 20px rgba(${BLUE_RGB},0.45)` }}>
            <Rss size={30} style={{ color: '#fff' }} strokeWidth={2.5} />
          </div>
          <p className="text-sm" style={{ color: HZ.ink, fontFamily: HZ.display, fontWeight: 800 }}>Tu feed está vacío</p>
          <p className="text-xs max-w-xs" style={{ color: HZ.inkSoft }}>
            {yaSigueAAlguien
              ? 'Los profesionales que sigues todavía no han publicado nada. Vuelve pronto o sigue a alguien más.'
              : 'Sigue a los profesionales que te interesen para ver aquí sus fotos, sesiones y novedades.'}
          </p>
          <button type="button" onClick={() => onNavigate('explorar')}
            className="mt-2 text-xs px-4 py-2 rounded-full transition-all hover:scale-105"
            style={{ background: HZ.green, color: '#fff', fontFamily: HZ.display, fontWeight: 800 }}>
            Explorar profesionales
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {fonts}
      <div className="p-4 sm:p-6" style={{ background: HZ.bg, minHeight: '100%' }}>
        <div className="flex gap-4 items-start">
          {columnas.map((columna, i) => (
            <div key={i} className="flex-1 min-w-0 flex flex-col gap-4">
              {columna.map(group => <FeedPostCard key={group.key} group={group} viewerId={user?.id} />)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeedView;
