import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Music, X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
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

const sanitizeFileName = (name: string): string =>
  name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

const MAX_SESSIONS_FREE    = 3;
const MAX_SESSIONS_STARTER = 5;
const MAX_SESSIONS_PRO     = 15;
const MAX_FILE_MB          = 256;

interface SessionFile {
  name: string;
  url: string;
  storagePath: string;
}

const AudioUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [sessions, setSessions] = useState<SessionFile[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenres, setShowGenres] = useState(false);
  const [savingGenres, setSavingGenres] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const profile = useProfile();

  // Initialize genres from profile once loaded
  useEffect(() => {
    if (profile.genres && profile.genres.length > 0) {
      setSelectedGenres(profile.genres);
    }
  }, [profile.genres?.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const tier = profile.subscription_tier ?? 'free';
  const isPro = tier === 'pro' || tier === 'business';
  const isStarter = tier === 'starter' || tier === 'artist';
  const maxSessions = isPro ? MAX_SESSIONS_PRO : isStarter ? MAX_SESSIONS_STARTER : MAX_SESSIONS_FREE;

  // Load existing sessions from storage
  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;
      const { data: files } = await supabase.storage.from('audio-sessions').list(user.id + '/sessions');
      if (files && files.length > 0) {
        const loaded = files.map(f => {
          const path = `${user.id}/sessions/${f.name}`;
          const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
          return { name: f.name.replace(/^\d+-/, ''), url: urlData.publicUrl, storagePath: path };
        });
        setSessions(loaded);
      }
    };
    loadSessions();
  }, [user]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const saveGenres = useCallback(async (genres: string[]) => {
    setSavingGenres(true);
    await profile.updateField({ genres });
    setSavingGenres(false);
    toast.success('Géneros guardados.');
  }, [profile]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.includes('audio')) { toast.error('Solo archivos de audio (MP3, WAV, M4A)'); return; }
    if (file.size > MAX_FILE_MB * 1024 * 1024) { toast.error(`Máximo ${MAX_FILE_MB}MB por sesión (suficiente para 1h a 128kbps)`); return; }
    if (sessions.length >= maxSessions) {
      toast.error(`Máximo ${maxSessions} sesiones en tu plan. ${!isPro ? 'Actualiza a Pro para hasta 15.' : ''}`);
      return;
    }

    setUploading(true);
    const safeName = sanitizeFileName(file.name) || 'audio.mp3';
    const path = `${user.id}/sessions/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    if (error) { toast.error('Error al subir: ' + error.message); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
    const url = urlData.publicUrl;

    const newSession: SessionFile = { name: file.name, url, storagePath: path };
    setSessions(prev => [...prev, newSession]);

    // Notify admin via feature_requests
    await supabase.from('feature_requests').insert({
      user_id: user.id,
      feature_name: `audio_upload:${file.name}`,
    }).then(() => {}, () => {});

    await profile.activateTrial();
    toast.success('Sesión subida y guardada correctamente.');
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeSession = async (session: SessionFile) => {
    await supabase.storage.from('audio-sessions').remove([session.storagePath]);
    setSessions(prev => prev.filter(s => s.storagePath !== session.storagePath));
    toast.info('Sesión eliminada.');
  };

  return (
    <div className="glass-panel p-4">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Music size={16} style={{ color: '#D4AF37' }} /> Sesiones de Audio
        <span className="text-xs text-muted-foreground ml-auto">
          {sessions.length}/{isPro ? '∞' : MAX_SESSIONS_FREE}
        </span>
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        MP3/WAV/M4A · máx {MAX_FILE_MB}MB (~1.5h a 256kbps). Free: {MAX_SESSIONS_FREE} · Starter: {MAX_SESSIONS_STARTER} · Pro: {MAX_SESSIONS_PRO}
      </p>

      {/* Genre selector */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowGenres(!showGenres)}
            className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', color: '#D4AF37' }}>
            Géneros ({selectedGenres.length}/5)
          </button>
          {selectedGenres.length > 0 && (
            <button
              onClick={() => saveGenres(selectedGenres)}
              disabled={savingGenres}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
              {savingGenres ? 'Guardando…' : 'Guardar'}
            </button>
          )}
        </div>
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedGenres.map(g => (
              <span key={g} onClick={() => toggleGenre(g)}
                className="text-xs font-bold px-2 py-0.5 rounded cursor-pointer hover:opacity-70"
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
                className="text-xs font-medium px-2 py-0.5 rounded transition-all"
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

      {/* Sessions list */}
      {sessions.length > 0 && (
        <div className="space-y-2 mb-3">
          {sessions.map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Music size={14} style={{ color: '#22c55e' }} />
                <span className="text-sm font-medium flex-1 truncate">{s.name}</span>
                <button onClick={() => removeSession(s)}><X size={14} className="text-muted-foreground hover:text-white" /></button>
              </div>
              <audio src={s.url} controls className="w-full h-9" style={{ filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(5deg)' }} />
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {sessions.length < maxSessions && (
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed transition-all hover:scale-[1.01]"
          style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#D4AF37', background: 'rgba(212,175,55,0.03)' }}>
          {sessions.length > 0 ? <Plus size={18} /> : <Upload size={18} />}
          <span className="text-sm font-bold">{uploading ? 'Subiendo...' : sessions.length > 0 ? 'Añadir otra sesión' : 'Subir sesión de audio'}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="audio/mp3,audio/wav,audio/mpeg,audio/m4a,audio/x-m4a" onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default AudioUpload;
