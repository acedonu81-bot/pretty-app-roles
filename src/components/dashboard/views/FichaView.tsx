import { useState, useEffect, useRef } from 'react';
import { FileEdit, Plus, Trash2, Music, Video, Image as ImageIcon, Type, ExternalLink, Loader2, Globe, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import AudioUpload from '@/components/dashboard/AudioUpload';
import PortfolioUpload from '@/components/dashboard/PortfolioUpload';

interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  post_type: 'text' | 'audio' | 'video' | 'image';
  created_at: string;
}

const POST_TYPES = [
  { id: 'text'  as const, label: 'Texto',   icon: Type       },
  { id: 'image' as const, label: 'Foto',    icon: ImageIcon  },
  { id: 'video' as const, label: 'Vídeo',   icon: Video      },
  { id: 'audio' as const, label: 'Audio',   icon: Music      },
];

type Tab = 'posts' | 'audio' | 'video' | 'images';

interface Props {
  /** Admin mode: view/edit another user's ficha */
  targetUserId?: string;
  targetName?: string;
}

const FichaView = ({ targetUserId, targetName }: Props = {}) => {
  const { user } = useAuth();
  const profile = useProfile();
  const [tab, setTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [draft, setDraft] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [postType, setPostType] = useState<Post['post_type']>('text');
  const [submitting, setSubmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [savingVideo, setSavingVideo] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const ownerId = targetUserId ?? user?.id;
  const isOwn = !targetUserId || targetUserId === user?.id;
  const displayName = targetName ?? profile.display_name ?? 'tu perfil';
  const slug = profile.display_name
    ? profile.display_name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
    : user?.id ?? '';

  // Load posts
  useEffect(() => {
    if (!ownerId) return;
    setLoadingPosts(true);
    supabase
      .from('profile_posts' as any)
      .select('*')
      .eq('user_id', ownerId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPosts(data as Post[]);
        setLoadingPosts(false);
      });
  }, [ownerId]);

  // Load existing bio video
  useEffect(() => {
    if (profile.bio_video_url) setVideoUrl(profile.bio_video_url);
  }, [profile.bio_video_url]);

  const submitPost = async () => {
    if (!draft.trim() || !user) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('profile_posts' as any)
      .insert({ user_id: user.id, content: draft.trim(), media_url: mediaUrl || null, post_type: postType })
      .select()
      .single();
    setSubmitting(false);
    if (error) { toast.error('Error al publicar'); return; }
    setPosts(prev => [data as Post, ...prev]);
    setDraft('');
    setMediaUrl('');
    setPostType('text');
    toast.success('Publicado en tu ficha');
  };

  const deletePost = async (id: string) => {
    if (!user) return;
    await supabase.from('profile_posts' as any).delete().eq('id', id).eq('user_id', user.id);
    setPosts(prev => prev.filter(p => p.id !== id));
    toast.info('Publicación eliminada');
  };

  const saveVideoUrl = async () => {
    if (!user) return;
    setSavingVideo(true);
    const ok = await profile.updateField({ bio_video_url: videoUrl || null } as any);
    setSavingVideo(false);
    if (ok) toast.success('Vídeo guardado en tu ficha');
  };

  const getVideoEmbed = (url: string): string | null => {
    if (!url) return null;
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return null;
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
    { id: 'posts',  label: 'Posts & Experiencias', icon: Type      },
    { id: 'audio',  label: 'Audio',                icon: Music     },
    { id: 'video',  label: 'Vídeo',                icon: Video     },
    { id: 'images', label: 'Imágenes',             icon: ImageIcon },
  ];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            {targetName
            ? <span className="text-white">Ficha de {targetName}</span>
            : <><span className="text-white">Tu </span><span className="text-gradient">Ficha Pública</span></>
          }
          </h2>
          <p className="text-sm text-muted-foreground">
            Lo que verán fans y empresarios en tu perfil público. Posts, audio, vídeo e imágenes.
          </p>
        </div>
        {isOwn && slug && (
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
            <Globe size={13} /> Ver ficha pública
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: tab === t.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${tab === t.id ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
              color: tab === t.id ? '#D4AF37' : '#8E8EA0',
            }}>
            <t.icon size={12} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Posts & Experiencias ─────────────────────────────────────────── */}
      {tab === 'posts' && (
        <div>
          {isOwn && (
            <div className="glass-panel p-5 mb-5" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
              {/* Post type selector */}
              <div className="flex gap-2 mb-3">
                {POST_TYPES.map(pt => (
                  <button key={pt.id} type="button" onClick={() => setPostType(pt.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: postType === pt.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${postType === pt.id ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
                      color: postType === pt.id ? '#D4AF37' : '#8E8EA0',
                    }}>
                    <pt.icon size={11} /> {pt.label}
                  </button>
                ))}
              </div>

              <textarea
                ref={textareaRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder={
                  postType === 'text'  ? 'Cuéntalo a tus fans y empresarios — experiencias, reflexiones, novedades...' :
                  postType === 'image' ? 'Describe la foto o el momento...' :
                  postType === 'video' ? 'Describe el vídeo...' :
                  'Comenta la sesión de audio...'
                }
                maxLength={1000}
                rows={3}
                className="nightlife-input w-full text-sm resize-none mb-2"
              />

              {(postType === 'image' || postType === 'video') && (
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder={postType === 'video' ? 'URL de YouTube o Vimeo' : 'URL de la imagen'}
                  className="nightlife-input w-full text-sm mb-2"
                />
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{draft.length}/1000</span>
                <button
                  type="button"
                  onClick={submitPost}
                  disabled={!draft.trim() || submitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-40"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  {submitting ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  Publicar
                </button>
              </div>
            </div>
          )}

          {loadingPosts && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={18} className="animate-spin" style={{ color: '#D4AF37' }} />
            </div>
          )}

          {!loadingPosts && posts.length === 0 && (
            <div className="glass-panel p-12 flex flex-col items-center text-center gap-3">
              <FileEdit size={28} style={{ color: 'rgba(212,175,55,0.2)' }} />
              <p className="text-sm text-muted-foreground">Aún no hay publicaciones.</p>
              {isOwn && <p className="text-xs text-muted-foreground">Cuéntales algo a tus fans — experiencias en sala, reflexiones, novedades.</p>}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <div key={post.id} className="glass-panel p-5"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Post header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const pt = POST_TYPES.find(p => p.id === post.post_type);
                      const Icon = pt?.icon ?? Type;
                      return <Icon size={13} style={{ color: '#8E8EA0' }} />;
                    })()}
                    <span className="text-xs text-muted-foreground">{fmtDate(post.created_at)}</span>
                  </div>
                  {(isOwn) && (
                    <button onClick={() => deletePost(post.id)}
                      className="p-1.5 rounded-lg transition-all hover:scale-105"
                      style={{ background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555' }}
                      title="Eliminar">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {/* Media */}
                {post.media_url && post.post_type === 'image' && (
                  <div className="mt-3 rounded-xl overflow-hidden">
                    <img src={post.media_url} alt="Post media"
                      className="w-full max-h-80 object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
                {post.media_url && post.post_type === 'video' && (() => {
                  const embed = getVideoEmbed(post.media_url);
                  return embed ? (
                    <div className="mt-3 rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      <iframe src={embed} className="w-full h-full" allowFullScreen title="Post video" />
                    </div>
                  ) : (
                    <a href={post.media_url} target="_blank" rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-2 text-xs"
                      style={{ color: '#D4AF37' }}>
                      <ExternalLink size={12} /> Ver vídeo
                    </a>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Audio ────────────────────────────────────────────────────────── */}
      {tab === 'audio' && (
        <div>
          {isOwn ? (
            <AudioUpload />
          ) : (
            <div className="glass-panel p-8 text-center">
              <AlertCircle size={20} style={{ color: '#8E8EA0' }} className="mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Sólo el propietario puede gestionar sus sesiones de audio.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Vídeo Destacado ──────────────────────────────────────────────── */}
      {tab === 'video' && (
        <div>
          <div className="glass-panel p-5 mb-5" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
            <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Video size={14} style={{ color: '#D4AF37' }} /> Vídeo Principal
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              Aparece destacado en tu ficha pública. Usa YouTube o Vimeo.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtu.be/... o vimeo.com/..."
                className="nightlife-input text-sm flex-1"
                readOnly={!isOwn}
              />
              {isOwn && (
                <button
                  type="button"
                  onClick={saveVideoUrl}
                  disabled={savingVideo}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  {savingVideo ? <Loader2 size={13} className="animate-spin" /> : 'Guardar'}
                </button>
              )}
            </div>
          </div>

          {videoUrl && (() => {
            const embed = getVideoEmbed(videoUrl);
            return embed ? (
              <div className="glass-panel overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9' }}>
                <iframe src={embed} className="w-full h-full" allowFullScreen title="Vídeo principal" />
              </div>
            ) : (
              <div className="glass-panel p-5 flex items-center gap-3">
                <AlertCircle size={16} style={{ color: '#D4AF37' }} />
                <p className="text-xs text-muted-foreground">URL no reconocida. Usa YouTube o Vimeo.</p>
              </div>
            );
          })()}

          {!videoUrl && (
            <div className="glass-panel p-12 flex flex-col items-center text-center gap-3"
              style={{ border: '1px dashed rgba(212,175,55,0.12)' }}>
              <Video size={28} style={{ color: 'rgba(212,175,55,0.2)' }} />
              <p className="text-sm text-muted-foreground">Sin vídeo destacado aún.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Imágenes / Portfolio ─────────────────────────────────────────── */}
      {tab === 'images' && (
        <div>
          {isOwn ? (
            <PortfolioUpload />
          ) : (
            <div className="glass-panel p-8 text-center">
              <AlertCircle size={20} style={{ color: '#8E8EA0' }} className="mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Solo el propietario puede gestionar sus imágenes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FichaView;
