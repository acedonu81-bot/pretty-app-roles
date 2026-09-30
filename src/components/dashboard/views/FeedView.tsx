import { useEffect } from 'react';
import { Rss } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFeedPosts } from '@/hooks/useFeedPosts';
import { useFeedAlert } from '@/hooks/useFeedAlert';
import PostCard from '@/components/PostCard';
import { fotoOptimizada } from '@/lib/imagen';

const FeedView = () => {
  const { user } = useAuth();
  const { posts, loading } = useFeedPosts(user?.id);
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
        <Rss size={32} style={{ color: 'rgba(0,0,0,0.25)' }} />
        <p className="text-sm font-bold" style={{ color: '#222' }}>Tu feed está vacío</p>
        <p className="text-xs max-w-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
          Sigue a los profesionales que te interesen desde su ficha pública para ver aquí sus novedades.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 max-w-xl mx-auto">
      {posts.map(post => (
        <div key={post.id}>
          <a href={`/p/${post.authorUserId}`} className="flex items-center gap-2.5 mb-2 hover:opacity-80">
            {post.authorPhoto ? (
              <img src={fotoOptimizada(post.authorPhoto, 64)} alt={post.authorName}
                className="w-8 h-8 rounded-full object-cover" style={{ objectPosition: '50% 15%' }} />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#8B6A00' }}>
                {post.authorName.charAt(0)}
              </div>
            )}
            <span className="text-sm font-bold" style={{ color: '#111' }}>{post.authorName}</span>
          </a>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default FeedView;
