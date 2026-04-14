import { useState, useRef } from 'react';
import { Music, Image, FileText, Crown, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { sanitizeInput } from '@/lib/contentFilter';

const POST_TYPES = [
  { id: 'text', icon: <FileText size={16} />, label: 'Texto' },
  { id: 'audio', icon: <Music size={16} />, label: 'Audio' },
  { id: 'photo', icon: <Image size={16} />, label: 'Foto' },
];

const PostsTab = () => {
  const [postType, setPostType] = useState('text');
  const [postText, setPostText] = useState('');
  const [postTier, setPostTier] = useState<'fan' | 'vip'>('fan');
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePost = () => {
    if (!postText.trim()) { toast.error('Escribe algo antes de publicar'); return; }
    const { clean, reason } = sanitizeInput(postText.trim(), 'default');
    if (!clean) { toast.error(reason); return; }
    toast.success('Publicado para tus fans ' + (postTier === 'vip' ? 'VIP' : 'Fan'));
    setPostText('');
  };

  return (
    <motion.div key="posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
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
            rows={4} className="nightlife-input text-sm resize-none w-full" />
        )}
        {postType === 'audio' && (
          <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
            style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}
            onClick={() => fileRef.current?.click()}>
            <Music size={28} className="mx-auto mb-2" style={{ color: '#D4AF37' }} />
            <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>Subir sesión de audio</p>
            <p className="text-xs text-muted-foreground mt-1">MP3 / WAV / M4A · máx 500MB</p>
            <input ref={fileRef} type="file" accept="audio/*" className="hidden"
              onChange={() => toast.info('Próximamente — integración con Stripe activa')} />
          </div>
        )}
        {postType === 'photo' && (
          <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
            style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' }}>
            <Image size={28} className="mx-auto mb-2" style={{ color: '#D4AF37' }} />
            <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>Subir foto exclusiva</p>
            <p className="text-xs text-muted-foreground mt-1">JPG / PNG / WEBP · máx 20MB</p>
          </div>
        )}

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
                {tier === 'vip' ? <Crown size={10} /> : <Heart size={10} />}
                {tier.toUpperCase()} +
              </button>
            ))}
          </div>
        </div>

        <button onClick={handlePost}
          className="w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          Publicar para fans {postTier === 'vip' ? 'VIP' : ''}
        </button>
      </div>

      <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
          <FileText size={20} style={{ color: 'rgba(212,175,55,0.2)' }} />
        </div>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Sin publicaciones aún</p>
          <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
            Crea tu primera publicación exclusiva arriba. Solo la verán los fans suscritos a tu canal.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PostsTab;
