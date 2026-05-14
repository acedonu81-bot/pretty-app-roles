import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Image, FileText, Crown, Heart, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { sanitizeInput } from '@/lib/contentFilter';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FanPost {
  id: string;
  content: string;
  media_url: string | null;
  post_type: string;
  fan_tier: string | null;
  created_at: string;
}

const POST_TYPES = [
  { id: 'text',  icon: <FileText size={16} />, label: 'Texto' },
  { id: 'audio', icon: <Music    size={16} />, label: 'Audio' },
  { id: 'photo', icon: <Image    size={16} />, label: 'Foto'  },
];

const TIER_ICON = { fan: <Heart size={10} />, vip: <Crown size={10} /> };

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

const PostsTab = () => {
  const { user } = useAuth();
  const [postType, setPostType]   = useState('text');
  const [postText, setPostText]   = useState('');
  const [postTier, setPostTier]   = useState<'fan' | 'vip'>('fan');
  const [posts,    setPosts]      = useState<FanPost[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [saving,   setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const loadPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('profile_posts' as any)
      .select('id, content, media_url, post_type, fan_tier, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);
    setLoading(false);
    setPosts((data ?? []) as FanPost[]);
  }, [user]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const uploadFile = async (file: File, type: 'audio' | 'photo'): Promise<string | null> => {
    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `fan-posts/${user!.id}/${Date.now()}.${ext}`;
    const bucket = type === 'audio' ? 'audio' : 'images';
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    setUploading(false);
    if (error) { toast.error('Error al subir el archivo'); return null; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handlePost = async () => {
    if (!user) return;
    if (postType === 'text') {
      if (!postText.trim()) { toast.error('Escribe algo antes de publicar'); return; }
      const { clean, reason } = sanitizeInput(postText.trim(), 'default');
      if (!clean) { toast.error(reason); return; }
      setSaving(true);
      const { error } = await supabase.from('profile_posts' as any).insert({
        user_id:   user.id,
        content:   postText.trim(),
        post_type: 'text',
        fan_tier:  postTier,
      });
      setSaving(false);
      if (error) { toast.error('Error al publicar'); return; }
      toast.success('Publicado para tus fans ' + (postTier === 'vip' ? 'VIP' : ''));
      setPostText('');
      loadPosts();
    }
  };

  const handleFileUpload = async (file: File | undefined, type: 'audio' | 'photo') => {
    if (!file || !user) return;
    const maxMB = type === 'audio' ? 100 : 20;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`El archivo supera el límite de ${maxMB}MB`);
      return;
    }
    const url = await uploadFile(file, type);
    if (!url) return;
    setSaving(true);
    const { error } = await supabase.from('profile_posts' as any).insert({
      user_id:   user.id,
      content:   file.name,
      media_url: url,
      post_type: type === 'audio' ? 'audio' : 'image',
      fan_tier:  postTier,
    });
    setSaving(false);
    if (error) { toast.error('Error al guardar'); return; }
    toast.success(type === 'audio' ? 'Sesión publicada para tus fans' : 'Foto publicada para tus fans');
    loadPosts();
  };

  const deletePost = async (id: string) => {
    await supabase.from('profile_posts' as any).delete().eq('id', id).eq('user_id', user!.id);
    setPosts(prev => prev.filter(p => p.id !== id));
    toast.info('Post eliminado');
  };

  return (
    <motion.div key="posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      {/* Create post panel */}
      <div className="glass-panel p-5" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <p className="text-sm font-bold mb-4">Crear contenido exclusivo</p>

        <div className="flex gap-2 mb-4">
          {POST_TYPES.map(pt => (
            <button key={pt.id} onClick={() => setPostType(pt.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: postType === pt.id ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${postType === pt.id ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: postType === pt.id ? '#D4AF37' : 'rgba(255,255,255,0.5)',
              }}>
              {pt.icon} {pt.label}
            </button>
          ))}
        </div>

        {postType === 'text' && (
          <textarea value={postText} onChange={e => setPostText(e.target.value)}
            placeholder="Escribe un mensaje exclusivo para tus fans..."
            rows={4} className="nightlife-input text-sm resize-none w-full" maxLength={1000} />
        )}
        {postType === 'audio' && (
          <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
            style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}
            onClick={() => fileRef.current?.click()}>
            {uploading ? (
              <p className="text-sm font-bold animate-pulse" style={{ color: '#D4AF37' }}>Subiendo…</p>
            ) : (
              <>
                <Upload size={28} className="mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>Subir sesión de audio</p>
                <p className="text-xs text-muted-foreground mt-1">MP3 / WAV / M4A · máx 100MB</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="audio/*" className="hidden"
              onChange={e => handleFileUpload(e.target.files?.[0], 'audio')} />
          </div>
        )}
        {postType === 'photo' && (
          <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
            style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}
            onClick={() => photoRef.current?.click()}>
            {uploading ? (
              <p className="text-sm font-bold animate-pulse" style={{ color: '#D4AF37' }}>Subiendo…</p>
            ) : (
              <>
                <Upload size={28} className="mx-auto mb-2" style={{ color: '#D4AF37' }} />
                <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>Subir foto exclusiva</p>
                <p className="text-xs text-muted-foreground mt-1">JPG / PNG / WEBP · máx 20MB</p>
              </>
            )}
            <input ref={photoRef} type="file" accept="image/*" className="hidden"
              onChange={e => handleFileUpload(e.target.files?.[0], 'photo')} />
          </div>
        )}

        {/* Tier selector */}
        <div className="flex items-center gap-3 mt-4 p-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-muted-foreground flex-1">Visible para:</p>
          <div className="flex gap-2">
            {(['fan', 'vip'] as const).map(tier => (
              <button key={tier} onClick={() => setPostTier(tier)}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                style={{
                  background: postTier === tier ? 'rgba(212,175,55,0.15)' : 'transparent',
                  border: `1px solid ${postTier === tier ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: postTier === tier ? '#D4AF37' : 'rgba(255,255,255,0.35)',
                }}>
                {TIER_ICON[tier]}
                {tier.toUpperCase()} +
              </button>
            ))}
          </div>
        </div>

        {postType === 'text' && (
          <button onClick={handlePost} disabled={saving || !postText.trim()}
            className="w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            {saving ? 'Publicando…' : `Publicar para fans ${postTier === 'vip' ? 'VIP' : ''}`}
          </button>
        )}
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="glass-panel p-6 animate-pulse flex flex-col gap-3">
          <div className="h-3 bg-white/5 rounded w-1/3" />
          <div className="h-2 bg-white/5 rounded w-2/3" />
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <FileText size={20} style={{ color: 'rgba(212,175,55,0.2)' }} />
          </div>
          <p className="text-sm font-bold">Sin publicaciones aún</p>
          <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
            Crea tu primera publicación exclusiva arriba. Solo la verán los fans suscritos a tu canal.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="glass-panel p-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase"
                    style={{ background: p.fan_tier === 'vip' ? 'rgba(212,175,55,0.15)' : 'rgba(255,105,180,0.1)', color: p.fan_tier === 'vip' ? '#D4AF37' : '#ff69b4', border: `1px solid ${p.fan_tier === 'vip' ? 'rgba(212,175,55,0.25)' : 'rgba(255,105,180,0.2)'}` }}>
                    {p.fan_tier === 'vip' ? <Crown size={8} /> : <Heart size={8} />}
                    {p.fan_tier?.toUpperCase() ?? 'FAN'}
                  </span>
                  <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">{p.post_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{fmtDate(p.created_at)}</span>
                  <button onClick={() => deletePost(p.id)} className="p-1 rounded hover:scale-110 transition-all" style={{ color: 'rgba(255,85,85,0.4)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              {p.post_type === 'image' && p.media_url ? (
                <img src={p.media_url} alt={p.content} className="w-full rounded-lg max-h-48 object-cover mb-2" />
              ) : p.post_type === 'audio' && p.media_url ? (
                <audio controls src={p.media_url} className="w-full mb-2" style={{ height: 36 }} />
              ) : null}
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{p.content}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PostsTab;
