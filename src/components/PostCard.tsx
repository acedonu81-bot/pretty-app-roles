export interface Post {
  id: string;
  content: string;
  post_type: string;
  created_at: string;
  media_url: string | null;
}

// Tarjeta de post reutilizada en la ficha pública (posts de un solo
// profesional) y en el feed del dashboard (posts de a quién sigues).
const PostCard = ({ post }: { post: Post }) => (
  <div className="p-5 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)' }}>
    <p className="text-xs mb-2" style={{ color: '#444' }}>
      {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
    </p>
    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#222' }}>{post.content}</p>
    {post.media_url && post.post_type === 'image' && (
      <img src={post.media_url} alt="Post" className="w-full max-h-60 object-cover rounded-xl mt-3" loading="lazy"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
    )}
  </div>
);

export default PostCard;
