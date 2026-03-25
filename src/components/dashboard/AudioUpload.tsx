import { useState, useRef } from 'react';
import { Upload, Music, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const allGenres = [
  'Techno', 'Minimal', 'Deep House', 'Tech House', 'Progressive House', 'Melodic Techno',
  'House', 'Afro House', 'Organic House', 'Tribal House', 'Funky House',
  'EDM', 'Future Bass', 'Dubstep', 'Drum & Bass', 'Jungle',
  'Trance', 'Psytrance', 'Progressive Trance', 'Uplifting Trance',
  'Reggaetón', 'Dembow', 'Latin House', 'Moombahton',
  'R&B', 'Hip Hop', 'Trap', 'UK Garage', 'Grime',
  'Disco', 'Nu-Disco', 'Italo Disco', 'Funk',
  'Ambient', 'Downtempo', 'Chillout', 'Lo-Fi',
  'Hard Techno', 'Industrial', 'Hardstyle', 'Hardcore',
  'Breakbeat', 'Electro', 'Synthwave', 'Retrowave',
  'Comercial', 'Top 40', 'Pop Dance', 'Euro Dance',
  'Dancehall', 'Afrobeats', 'Amapiano', 'Baile Funk',
  'Acid House', 'Detroit Techno', 'Chicago House', 'Dub Techno',
];

const AudioUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenres, setShowGenres] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : prev.length < 5 ? [...prev, genre] : prev
    );
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.includes('audio')) { toast.error('Solo archivos de audio (MP3, WAV)'); return; }
    if (file.size > 500 * 1024 * 1024) { toast.error('Máximo 500MB'); return; }

    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    if (error) { toast.error('Error al subir'); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
    const url = urlData.publicUrl;

    await (supabase.from('profiles').update({ audio_url: url } as any) as any).eq('user_id', user.id);

    setAudioUrl(url);
    setFileName(file.name);
    toast.success('Audio subido correctamente');
    setUploading(false);
  };

  return (
    <div className="glass-panel p-4">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Music size={14} style={{ color: '#D4AF37' }} /> Sesión de Audio
      </h4>
      <p className="text-[0.6rem] text-muted-foreground mb-3">
        Sube tu sesión grabada (MP3/WAV, máx 500MB). Es obligatorio para completar tu perfil.
      </p>

      {/* Genre selector */}
      <div className="mb-3">
        <button onClick={() => setShowGenres(!showGenres)}
          className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', color: '#D4AF37' }}>
          🎵 Géneros ({selectedGenres.length}/5)
        </button>
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedGenres.map(g => (
              <span key={g} onClick={() => toggleGenre(g)}
                className="text-[0.55rem] font-bold px-2 py-0.5 rounded cursor-pointer hover:opacity-70"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                {g} ×
              </span>
            ))}
          </div>
        )}
        {showGenres && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-lg p-3 flex flex-wrap gap-1"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--nightlife-border)' }}>
            {allGenres.map(g => (
              <button key={g} onClick={() => toggleGenre(g)}
                className="text-[0.55rem] font-medium px-2 py-0.5 rounded transition-all"
                style={{
                  background: selectedGenres.includes(g) ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.03)',
                  color: selectedGenres.includes(g) ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                  border: selectedGenres.includes(g) ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--nightlife-border)',
                }}>
                {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {audioUrl ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <Music size={12} style={{ color: '#22c55e' }} />
            <span className="text-xs font-medium flex-1 truncate">{fileName}</span>
            <button onClick={() => { setAudioUrl(null); setFileName(null); }}><X size={12} className="text-muted-foreground" /></button>
          </div>
          <audio src={audioUrl} controls className="w-full h-8" style={{ filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(5deg)' }} />
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed transition-all hover:scale-[1.01]"
          style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#D4AF37', background: 'rgba(212,175,55,0.03)' }}>
          <Upload size={16} />
          <span className="text-xs font-bold">{uploading ? 'Subiendo...' : 'Subir sesión de audio'}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="audio/mp3,audio/wav,audio/mpeg" onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default AudioUpload;
