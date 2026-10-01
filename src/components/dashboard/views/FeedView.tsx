import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Rss } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFeedPosts } from '@/hooks/useFeedPosts';
import { useFeedAlert } from '@/hooks/useFeedAlert';
import FeedPostCard from '@/components/dashboard/views/FeedPostCard';
import { HZ } from '@/components/healthy-zone/clay';

// Feed en el lenguaje visual de Healthy Zone (ver nota en FeedPostCard.tsx) —
// masonry real con columns-N en vez de grid: cada tarjeta fluye a su altura
// natural en cascada, sin las filas de igual altura (y sus huecos) que ya
// usa el resto del dashboard (ProfileCard, ExplorarView...). break-inside-
// avoid en cada tarjeta evita que CSS columns la parta entre dos columnas.
const FeedView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const { user } = useAuth();
  const { posts, loading } = useFeedPosts(user?.id);
  // Marcar como visto AL SALIR, no al entrar — igual que AdminActivity.tsx:
  // si se marcara al entrar, lo que llega mientras miras la pestaña quedaría
  // fuera de la ventana de "nuevo" en la próxima visita.
  const { marcarVisto } = useFeedAlert(user?.id);
  useEffect(() => () => { marcarVisto(); }, [marcarVisto]);

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
    return (
      <>
        {fonts}
        <div className="flex flex-col items-center justify-center text-center px-6 py-16 gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1" style={{ background: HZ.sky }}>
            <Rss size={26} style={{ color: HZ.blue }} />
          </div>
          <p className="text-sm" style={{ color: HZ.ink, fontFamily: HZ.display, fontWeight: 800 }}>Tu feed está vacío</p>
          <p className="text-xs max-w-xs" style={{ color: HZ.inkSoft }}>
            Sigue a los profesionales que te interesen para ver aquí sus fotos, sesiones y novedades.
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
        <div className="columns-1 sm:columns-2 xl:columns-3" style={{ columnGap: '16px' }}>
          {posts.map(post => <FeedPostCard key={post.id} post={post} viewerId={user?.id} />)}
        </div>
      </div>
    </>
  );
};

export default FeedView;
