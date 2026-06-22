import { useState, useEffect, useRef, useCallback } from 'react';
import { FileEdit, Plus, Trash2, Music, Video, Image as ImageIcon, Type, ExternalLink, Loader2, Globe, AlertCircle, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import AudioUpload from '@/components/dashboard/AudioUpload';
import PortfolioUpload from '@/components/dashboard/PortfolioUpload';

const MAX_VIDEO_SESSION_MB = 50;
const MAX_VIDEO_SESSION_S  = 60;

interface VideoItem { name: string; url: string; path: string; }

const VideoSessionUpload = ({ maxSessions, userId }: { maxSessions: number; userId: string }) => {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.storage.from('audio-sessions').list(`${userId}/video-sessions`);
    if (data) setItems(data.map(f => {
      const path = `${userId}/video-sessions/${f.name}`;
      const { data: u } = supabase.storage.from('audio-sessions').getPublicUrl(path);
      return { name: f.name.replace(/^\d+-/, ''), url: u.publicUrl, path };
    }));
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) { toast.error('Solo MP4, MOV o WebM'); return; }
    if (file.size > MAX_VIDEO_SESSION_MB * 1024 * 1024) { toast.error(`Máximo ${MAX_VIDEO_SESSION_MB}MB por sesión`); return; }
    if (items.length >= maxSessions) { toast.error(`Máximo ${maxSessions} sesiones de vídeo en tu plan`); return; }
    try {
      const url = URL.createObjectURL(file);
      const v = document.createElement('video');
      v.preload = 'metadata';
      const dur: number = await new Promise((res, rej) => {
        v.onloadedmetadata = () => { URL.revokeObjectURL(url); res(v.duration); };
        v.onerror = () => { URL.revokeObjectURL(url); rej(); };
        v.src = url;
      });
      if (dur > MAX_VIDEO_SESSION_S) { toast.error(`Máximo ${MAX_VIDEO_SESSION_S}s (duración: ${Math.round(dur)}s)`); return; }
    } catch { toast.error('No se pudo verificar el vídeo'); return; }

    setUploading(true);
    const safe = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]/g,'_');
    const path = `${userId}/video-sessions/${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    if (error) { toast.error('Error: ' + error.message); setUploading(false); return; }
    await load();
    // Sync video session URLs to profiles table
    const { data: vids } = await supabase.storage.from('audio-sessions').list(`${userId}/video-sessions`);
    if (vids) {
      const urls = vids.map(f => {
        const p2 = `${userId}/video-sessions/${f.name}`;
        const { data: u } = supabase.storage.from('audio-sessions').getPublicUrl(p2);
        return u.publicUrl;
      });
      supabase.from('profiles').update({ video_session_urls: urls } as any).eq('user_id', userId).then(() => {});
    }
    toast.success('Sesión de vídeo subida');
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = async (item: VideoItem) => {
    await supabase.storage.from('audio-sessions').remove([item.path]);
    const next = items.filter(i => i.path !== item.path);
    setItems(next);
    const urls = next.map(i => i.url);
    supabase.from('profiles').update({ video_session_urls: urls } as any).eq('user_id', userId).then(() => {});
    toast.info('Sesión eliminada');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{items.length}/{maxSessions} sesiones</span>
      </div>
      {items.length > 0 && (
        <div className="space-y-2 mb-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg"
              style={{ background: 'rgba(66,133,244,0.05)', border: '1px solid rgba(66,133,244,0.15)' }}>
              <Video size={13} style={{ color: '#4285F4' }} />
              <span className="text-xs flex-1 truncate">{item.name}</span>
              <button onClick={() => remove(item)} className="p-1 rounded hover:bg-white/5">
                <X size={12} style={{ color: '#ff5555' }} />
              </button>
            </div>
          ))}
        </div>
      )}
      {items.length < maxSessions && (
        <label className="flex items-start gap-2 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={rightsConfirmed}
            onChange={e => setRightsConfirmed(e.target.checked)}
            className="mt-0.5 flex-shrink-0 accent-[#4285F4]"
          />
          <span className="text-xs leading-relaxed" style={{ color: '#222' }}>
            Declaro que soy titular o tengo autorización para publicar este contenido, conforme a los{' '}
            <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#4285F4' }}>Términos y Condiciones</a>.
          </span>
        </label>
      )}
      {items.length < maxSessions && (
        <button onClick={() => inputRef.current?.click()} disabled={uploading || !rightsConfirmed}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-xs font-bold transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ borderColor: 'rgba(66,133,244,0.2)', color: '#4285F4', background: 'rgba(66,133,244,0.03)' }}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Subiendo...' : 'Subir sesión de vídeo'}
        </button>
      )}
      <input ref={inputRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleUpload} className="hidden" />
    </div>
  );
};

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

const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'posts',  label: 'Posts',    icon: Type      },
  { id: 'audio',  label: 'Audio',   icon: Music     },
  { id: 'video',  label: 'Vídeo',   icon: Video     },
  { id: 'images', label: 'Fotos',   icon: ImageIcon },
];

interface Props {
  targetUserId?: string;
  targetName?: string;
}

const BLUE = '#4285F4';
const BLUE_BG = 'rgba(66,133,244,0.12)';
const BLUE_BORDER = 'rgba(66,133,244,0.35)';

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
  const [musicUrl, setMusicUrl] = useState('');
  const [savingMusic, setSavingMusic] = useState(false);
  const [clearingAudio, setClearingAudio] = useState(false);
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

  // Load existing video & music
  useEffect(() => {
    if (profile.bio_video_url) setVideoUrl(profile.bio_video_url);
    if ((profile as any).bg_music_url) setMusicUrl((profile as any).bg_music_url);
  }, [profile.bio_video_url, (profile as any).bg_music_url]);

  const clearAudioEmbed = async () => {
    if (!user) return;
    setClearingAudio(true);
    await profile.updateField({ audio_embed_url: null } as any);
    setClearingAudio(false);
    toast.success('Contenido de perfil eliminado');
  };

  const submitPost = async () => {
    if (!draft.trim() || !user) return;
    setSubmitting(true);
    const { data, error } = await supabase
      .from('profile_posts' as any)
      .insert({ user_id: user.id, content: draft.trim(), media_url: mediaUrl || null, post_type: postType })
      .select()
      .single();
    setSubmitting(false);
    if (error) {
      toast.error('Error al publicar. Asegúrate de haber ejecutado la migración SQL en Supabase.');
      return;
    }
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

  const saveVideoUrl = async (url: string) => {
    if (!user) return;
    setSavingVideo(true);
    const ok = await profile.updateField({ bio_video_url: url || null } as any);
    setSavingVideo(false);
    if (ok) {
      setVideoUrl(url);
      toast.success(url ? 'Vídeo guardado' : 'Vídeo eliminado');
    }
  };

  const saveMusicUrl = async (url: string) => {
    if (!user) return;
    setSavingMusic(true);
    const ok = await profile.updateField({ bg_music_url: url || null } as any);
    setSavingMusic(false);
    if (ok) {
      setMusicUrl(url);
      toast.success(url ? 'Música de fondo guardada' : 'Música de fondo eliminada');
    }
  };

  const getVideoEmbed = (url: string): string | null => {
    if (!url) return null;
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return null;
  };

  const getMusicEmbed = (url: string): string | null => {
    if (!url) return null;
    if (url.includes('soundcloud.com')) return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%234285F4&auto_play=false&show_artwork=true`;
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=0`;
    return null;
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            {targetName
            ? <span className="text-white">Ficha de {targetName}</span>
            : <><span style={{ color: '#222' }}>Tu </span><span style={{ color: BLUE }}>Ficha Pública</span></>
          }
          </h2>
          <p className="text-sm text-muted-foreground">
            Lo que verán fans y empresarios en tu perfil público.
          </p>
        </div>
        {isOwn && slug && (
          <a href={`/p/${slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: BLUE_BG, border: `1px solid ${BLUE_BORDER}`, color: BLUE }}>
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
              background: tab === t.id ? BLUE_BG : 'rgba(0,0,0,0.03)',
              border: `1px solid ${tab === t.id ? BLUE_BORDER : 'var(--nightlife-border)'}`,
              color: tab === t.id ? BLUE : '#3d3d4e',
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
              <div className="flex gap-2 mb-3">
                {POST_TYPES.map(pt => (
                  <button key={pt.id} type="button" onClick={() => setPostType(pt.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: postType === pt.id ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${postType === pt.id ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
                      color: postType === pt.id ? '#D4AF37' : '#3d3d4e',
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
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">{draft.length}/1000</span>
                  <span className="text-[0.65rem] px-1.5 py-0.5 rounded font-bold"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
                    Público
                  </span>
                </div>
                <button type="button" onClick={submitPost}
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
              <Loader2 size={18} className="animate-spin" style={{ color: BLUE }} />
            </div>
          )}

          {!loadingPosts && posts.length === 0 && (
            <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <FileEdit size={22} style={{ color: 'rgba(212,175,55,0.45)' }} />
              </div>
              <p className="text-sm font-bold">Sin publicaciones todavía</p>
              <p className="text-xs max-w-xs leading-relaxed" style={{ color: '#3d3d4e' }}>
                {isOwn
                  ? 'Comparte experiencias en sala, reflexiones o novedades. Tus fans y los empresarios lo verán aquí.'
                  : 'Este profesional aún no ha publicado contenido en su ficha.'}
              </p>
              {isOwn && (
                <button type="button" onClick={() => { const el = document.querySelector('textarea'); el?.focus(); el?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 mt-1"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  Escribir mi primer post
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <div key={post.id} className="glass-panel p-5"
                style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const pt = POST_TYPES.find(p => p.id === post.post_type);
                      const Icon = pt?.icon ?? Type;
                      return <Icon size={13} style={{ color: '#3d3d4e' }} />;
                    })()}
                    <span className="text-xs text-muted-foreground">{fmtDate(post.created_at)}</span>
                  </div>
                  {isOwn && (
                    <button onClick={() => deletePost(post.id)}
                      className="p-1.5 rounded-lg transition-all hover:scale-105"
                      style={{ background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555' }}
                      title="Eliminar">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

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
              <AlertCircle size={20} style={{ color: '#3d3d4e' }} className="mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Solo el propietario puede gestionar sus sesiones de audio.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Vídeo & Música ───────────────────────────────────────────────── */}
      {tab === 'video' && (
        <div className="space-y-5">
          {/* Vídeo principal */}
          <div className="glass-panel p-5" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
            <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Video size={14} style={{ color: '#D4AF37' }} /> Vídeo Principal
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              Aparece destacado en tu ficha pública. Usa YouTube o Vimeo.
            </p>
            {isOwn ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://youtu.be/... o vimeo.com/..."
                  className="nightlife-input text-sm flex-1"
                />
                {videoUrl && (
                  <button type="button" onClick={() => saveVideoUrl('')}
                    className="p-2.5 rounded-xl transition-all hover:scale-105"
                    style={{ background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555' }}
                    title="Eliminar vídeo">
                    <X size={14} />
                  </button>
                )}
                <button type="button" onClick={() => saveVideoUrl(videoUrl)}
                  disabled={savingVideo}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  {savingVideo ? <Loader2 size={13} className="animate-spin" /> : 'Guardar'}
                </button>
              </div>
            ) : (
              <input type="url" value={videoUrl} readOnly className="nightlife-input text-sm w-full" />
            )}

            {videoUrl && (() => {
              const embed = getVideoEmbed(videoUrl);
              return embed ? (
                <div className="mt-4 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <iframe src={embed} className="w-full h-full" allowFullScreen title="Vídeo principal" />
                </div>
              ) : (
                <div className="mt-3 glass-panel p-4 flex items-center gap-3">
                  <AlertCircle size={14} style={{ color: '#D4AF37' }} />
                  <p className="text-xs text-muted-foreground">URL no reconocida. Usa YouTube o Vimeo.</p>
                </div>
              );
            })()}

            {!videoUrl && (
              <div className="mt-4 p-8 rounded-xl flex flex-col items-center text-center gap-2"
                style={{ border: '1px dashed rgba(212,175,55,0.22)' }}>
                <Video size={24} style={{ color: 'rgba(212,175,55,0.3)' }} />
                <p className="text-sm text-muted-foreground">Sin vídeo destacado aún.</p>
                <p className="text-xs" style={{ color: '#333' }}>Pega una URL de YouTube o Vimeo arriba</p>
              </div>
            )}
          </div>

          {/* Sesiones de vídeo */}
          {isOwn && (
            <div className="glass-panel p-5" style={{ border: '1px solid rgba(66,133,244,0.15)' }}>
              <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
                <Video size={14} style={{ color: BLUE }} /> Sesiones de Vídeo
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Sube clips de actuaciones (MP4/MOV, máx 50MB, 60s).
              </p>
              <VideoSessionUpload maxSessions={10} userId={user!.id} />
            </div>
          )}

          {/* Contenido de perfil (audio_embed_url / stream_url) */}
          {isOwn && (profile.audio_embed_url || (profile as any).stream_url) && (
            <div className="glass-panel p-5" style={{ border: '1px solid rgba(255,85,85,0.2)' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
                    <AlertCircle size={14} style={{ color: '#ff5555' }} />
                    Contenido vinculado al perfil
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    Este contenido aparece en tu ficha pública (hearthis / Mixcloud / SoundCloud / YouTube).
                    Elimínalo aquí si ya no lo quieres mostrar.
                  </p>
                  <p className="text-xs font-mono truncate" style={{ color: '#333' }}>
                    {profile.audio_embed_url || (profile as any).stream_url}
                  </p>
                </div>
                <button type="button" onClick={clearAudioEmbed} disabled={clearingAudio}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 flex-shrink-0"
                  style={{ background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.25)', color: '#ff5555' }}>
                  {clearingAudio ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                  Eliminar
                </button>
              </div>
            </div>
          )}

          {/* Música de fondo */}
          <div className="glass-panel p-5" style={{ border: `1px solid ${BLUE_BORDER}` }}>
            <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Music size={14} style={{ color: BLUE }} /> Música de Fondo
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              Suena cuando alguien abre tu ficha. Usa SoundCloud o YouTube.
            </p>
            {isOwn ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={musicUrl}
                  onChange={e => setMusicUrl(e.target.value)}
                  placeholder="https://soundcloud.com/... o youtu.be/..."
                  className="nightlife-input text-sm flex-1"
                />
                {musicUrl && (
                  <button type="button" onClick={() => saveMusicUrl('')}
                    className="p-2.5 rounded-xl transition-all hover:scale-105"
                    style={{ background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555' }}
                    title="Eliminar música">
                    <X size={14} />
                  </button>
                )}
                <button type="button" onClick={() => saveMusicUrl(musicUrl)}
                  disabled={savingMusic}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: BLUE_BG, border: `1px solid ${BLUE_BORDER}`, color: BLUE }}>
                  {savingMusic ? <Loader2 size={13} className="animate-spin" /> : 'Guardar'}
                </button>
              </div>
            ) : (
              <input type="url" value={musicUrl} readOnly className="nightlife-input text-sm w-full" />
            )}

            {musicUrl && (() => {
              const embed = getMusicEmbed(musicUrl);
              return embed ? (
                <div className="mt-4 rounded-xl overflow-hidden">
                  <iframe
                    src={embed}
                    className="w-full"
                    style={{ height: musicUrl.includes('soundcloud') ? 166 : 80 }}
                    allowFullScreen
                    title="Música de fondo"
                  />
                </div>
              ) : (
                <div className="mt-3 glass-panel p-4 flex items-center gap-3">
                  <AlertCircle size={14} style={{ color: BLUE }} />
                  <p className="text-xs text-muted-foreground">Usa SoundCloud o YouTube.</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── Imágenes / Portfolio ─────────────────────────────────────────── */}
      {tab === 'images' && (
        <div>
          {isOwn ? (
            <PortfolioUpload />
          ) : (
            <div className="glass-panel p-8 text-center">
              <AlertCircle size={20} style={{ color: '#3d3d4e' }} className="mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Solo el propietario puede gestionar sus imágenes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FichaView;
