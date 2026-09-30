import { useEffect, useMemo } from 'react';
import { Rss } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFeedPosts, type FeedPost } from '@/hooks/useFeedPosts';
import { useFeedAlert } from '@/hooks/useFeedAlert';
import FeedPostCard from '@/components/dashboard/views/FeedPostCard';
import { fotoOptimizada } from '@/lib/imagen';

// Un profesional puede aportar varias entradas (posts + sesiones de audio +
// portfolio) — agrupadas bajo su nombre una sola vez, en vez de repetir la
// cabecera por cada pieza de contenido suya.
function agruparPorAutor(posts: FeedPost[]) {
  const grupos: { authorUserId: string; authorName: string; authorPhoto: string | null; posts: FeedPost[] }[] = [];
  const indexPorAutor = new Map<string, number>();
  for (const post of posts) {
    let idx = indexPorAutor.get(post.authorUserId);
    if (idx === undefined) {
      idx = grupos.length;
      indexPorAutor.set(post.authorUserId, idx);
      grupos.push({ authorUserId: post.authorUserId, authorName: post.authorName, authorPhoto: post.authorPhoto, posts: [] });
    }
    grupos[idx].posts.push(post);
  }
  return grupos;
}

const FeedView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const { user } = useAuth();
  const { posts, loading } = useFeedPosts(user?.id);
  const grupos = useMemo(() => agruparPorAutor(posts), [posts]);
  // Marcar como visto AL SALIR, no al entrar — igual que AdminActivity.tsx:
  // si se marcara al entrar, lo que llega mientras miras la pestaña quedaría
  // fuera de la ventana de "nuevo" en la próxima visita.
  const { marcarVisto } = useFeedAlert(user?.id);
  useEffect(() => () => { marcarVisto(); }, [marcarVisto]);

  if (loading) {
    return <p className="text-sm text-muted-foreground animate-pulse p-6">Cargando feed…</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-16 gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
          style={{ background: 'rgba(37,99,235,0.08)' }}>
          <Rss size={26} style={{ color: '#2563EB' }} />
        </div>
        <p className="text-sm font-bold" style={{ color: '#222' }}>Tu feed está vacío</p>
        <p className="text-xs max-w-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
          Sigue a los profesionales que te interesen para ver aquí sus fotos, sesiones y novedades.
        </p>
        <button type="button" onClick={() => onNavigate('explorar')}
          className="mt-2 text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
          style={{ background: 'rgba(212,175,55,0.9)', color: '#000' }}>
          Explorar profesionales
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {grupos.map(grupo => (
          <div key={grupo.authorUserId} className="flex flex-col gap-2.5">
            <a href={`/p/${grupo.authorUserId}`} className="flex items-center gap-2.5 hover:opacity-80">
              {grupo.authorPhoto ? (
                <img src={fotoOptimizada(grupo.authorPhoto, 64)} alt={grupo.authorName}
                  className="w-9 h-9 rounded-full object-cover" style={{ objectPosition: '50% 15%' }} />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#8B6A00' }}>
                  {grupo.authorName.charAt(0)}
                </div>
              )}
              <span className="text-sm font-bold" style={{ color: '#111' }}>{grupo.authorName}</span>
            </a>
            <div className="flex flex-col gap-3">
              {grupo.posts.map(post => <FeedPostCard key={post.id} post={post} viewerId={user?.id} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedView;
