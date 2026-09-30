import SessionAudioPlayer from '@/components/SessionAudioPlayer';

export interface Post {
  id: string;
  content: string;
  post_type: string;
  created_at: string;
  media_url: string | null;
}

// Tarjeta de post reutilizada en la ficha pública (posts de un solo
// profesional) y en el feed del dashboard (posts de a quién sigues).
// post_type 'audio' son sesiones sintéticas (no profile_posts reales): el
// feed las genera a partir de audio_session_urls/audio_embed_url para dar
// contenido a profesionales que nunca publicaron un post de texto.
const PostCard = ({ post }: { post: Post }) => (
  <div className="p-5 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}>
    <p className="text-xs mb-2" style={{ color: '#444' }}>
      {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
    </p>
    {post.content && (
      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#222' }}>{post.content}</p>
    )}
    {post.media_url && post.post_type === 'image' && (
      <img src={post.media_url} alt="Post" className="w-full max-h-60 object-cover rounded-xl mt-3" loading="lazy"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    )}
    {post.media_url && post.post_type === 'audio' && (
      <div className="mt-1">
        <SessionAudioPlayer url={post.media_url} />
      </div>
    )}
  </div>
);

export default PostCard;
