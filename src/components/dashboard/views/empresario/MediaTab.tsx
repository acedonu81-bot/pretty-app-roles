import { useState, useEffect } from 'react';
import { Image, Music, Video, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import GeometricAvatar from '@/components/dashboard/GeometricAvatar';
import SessionAudioEmbed from '@/components/dashboard/SessionAudioEmbed';

interface MediaProfile {
  user_id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  audio_embed_url: string | null;
  instagram: string | null;
  tiktok: string | null;
  specialty: string | null;
  zone: string | null;
}

const MediaTab = () => {
  const [profiles, setProfiles] = useState<MediaProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'audio' | 'photo' | 'social'>('all');

  useEffect(() => {
    supabase
      .from('profiles')
      .select('user_id, display_name, role, photo_url, audio_embed_url, instagram, tiktok, specialty, zone')
      .or('photo_url.not.is.null,audio_embed_url.not.is.null,instagram.not.is.null')
      .neq('role', 'empresario')
      .limit(50)
      .then(({ data }) => {
        setProfiles((data ?? []) as MediaProfile[]);
        setLoading(false);
      });
  }, []);

  const filtered = profiles.filter(p => {
    if (filter === 'audio') return !!p.audio_embed_url;
    if (filter === 'photo') return !!p.photo_url;
    if (filter === 'social') return !!(p.instagram || p.tiktok);
    return true;
  });

  const FILTERS = [
    { id: 'all',    label: 'Todo',       icon: Image },
    { id: 'audio',  label: 'Audio',      icon: Music },
    { id: 'photo',  label: 'Fotos',      icon: Image },
    { id: 'social', label: 'Redes',      icon: Video },
  ] as const;

  return (
    <div>
      <div className="glass-panel p-4 mb-5" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
          <Image size={14} style={{ color: '#8A6D0F' }} /> Portfolios y Contenido
        </h4>
        <p className="text-xs text-muted-foreground">
          Audio, fotos y redes sociales de los profesionales registrados.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: filter === f.id ? 'rgba(212,175,55,0.12)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${filter === f.id ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
              color: filter === f.id ? '#D4AF37' : '#3d3d4e',
            }}>
            <f.icon size={12} /> {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin" style={{ color: '#8A6D0F' }} />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="glass-panel p-12 flex flex-col items-center text-center gap-3"
          style={{ border: '1px dashed rgba(212,175,55,0.12)' }}>
          <Image size={28} style={{ color: 'rgba(212,175,55,0.2)' }} />
          <p className="text-sm text-muted-foreground">Ningún profesional con contenido en esta categoría todavía.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && filtered.map(p => (
          <div key={p.user_id} className="glass-panel p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-3">
              {p.photo_url ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={p.photo_url} alt={p.display_name ?? ''} loading="lazy" className="w-full h-full object-cover" />
                </div>
              ) : (
                <GeometricAvatar role={p.role as any} seed={(p.user_id ?? 'x').charCodeAt(0)} size={40} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.display_name || 'Sin nombre'}</p>
                <p className="text-xs text-muted-foreground truncate">{p.specialty || p.role} · {p.zone || 'España'}</p>
              </div>
            </div>

            {/* Audio embed */}
            {p.audio_embed_url && (
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
                <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: 'rgba(212,175,55,0.05)' }}>
                  <Music size={11} style={{ color: '#8A6D0F' }} />
                  <span className="text-xs font-bold" style={{ color: '#8A6D0F' }}>Audio</span>
                </div>
                <SessionAudioEmbed url={p.audio_embed_url} title={`Audio de ${p.display_name}`} height={80} />
              </div>
            )}

            {/* Social links */}
            <div className="flex gap-2 flex-wrap">
              {p.instagram && (
                <a href={`https://instagram.com/${p.instagram.replace('@', '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(225,48,108,0.08)', border: '1px solid rgba(225,48,108,0.2)', color: '#e1306c' }}>
                  <ExternalLink size={10} /> Instagram
                </a>
              )}
              {p.tiktok && (
                <a href={`https://tiktok.com/@${p.tiktok.replace('@', '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                  style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)', color: '#222' }}>
                  <ExternalLink size={10} /> TikTok
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaTab;
