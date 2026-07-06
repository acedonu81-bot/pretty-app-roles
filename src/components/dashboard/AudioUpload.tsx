import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Music, X, Plus, Link } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const GENRE_GROUPS: { label: string; genres: string[] }[] = [
  { label: 'House', genres: ['Tech House', 'Deep House', 'House', 'Afro House', 'Organic House', 'Funky House', 'Tribal House', 'Progressive House', 'Acid House', 'Chicago House', 'Latin House'] },
  { label: 'Techno', genres: ['Techno', 'Melodic Techno', 'Minimal', 'Hard Techno', 'Industrial', 'Dub Techno', 'Detroit Techno'] },
  { label: 'Trance & Psy', genres: ['Trance', 'Progressive Trance', 'Psytrance', 'Uplifting Trance'] },
  { label: 'Bass Music', genres: ['Drum & Bass', 'Dubstep', 'Jungle', 'UK Garage', 'Grime', 'Breakbeat', 'Future Bass'] },
  { label: 'Urban & Latino', genres: ['Reggaetón', 'Dembow', 'Moombahton', 'Dancehall', 'R&B', 'Hip Hop', 'Trap', 'Afrobeats', 'Amapiano', 'Baile Funk'] },
  { label: 'Comercial & Fiesta', genres: ['Comercial', 'Top 40', 'Pop Dance', 'Hits actuales', 'Remember', 'Pachanga'] },
  { label: 'Disco & Funk', genres: ['Disco', 'Nu-Disco', 'Italo Disco', 'Funk', 'Electro', 'Synthwave'] },
  { label: 'Chill & Ambiental', genres: ['Ambient', 'Downtempo', 'Chillout', 'Lo-Fi'] },
  { label: 'Hard & Rave', genres: ['Hardstyle', 'Hardcore', 'EDM', 'Retrowave'] },
];

const allGenres = GENRE_GROUPS.flatMap(g => g.genres);

const sanitizeFileName = (name: string): string =>
  name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

const MAX_SESSIONS_PRO = 15;
const MAX_FILE_MB = 45;

type SessionType = 'file' | 'soundcloud' | 'mixcloud' | 'hearthis';

interface SessionFile {
  name: string;
  url: string;
  storagePath: string;
  type: SessionType;
}

// Detect embed type from URL
function detectType(url: string): SessionType | null {
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('mixcloud.com')) return 'mixcloud';
  if (url.includes('hearthis.at')) return 'hearthis';
  return null;
}

// Build embed iframe src from URL
function buildEmbedSrc(url: string, type: SessionType): string {
  if (type === 'soundcloud') {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23D4AF37&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
  }
  if (type === 'mixcloud') {
    const match = url.match(/mixcloud\.com\/(.+?\/.+?)\/?(\?.*)?$/);
    const feed = match ? '/' + match[1] + '/' : url.replace(/https?:\/\/(www\.)?mixcloud\.com/, '');
    return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&light=0&feed=${encodeURIComponent(feed)}`;
  }
  // hearthis se resuelve async en EmbedPlayer (el widget solo acepta ID numérico)
  return '';
}

function EmbedPlayer({ session }: { session: SessionFile }) {
  const [hearthisSrc, setHearthisSrc] = useState<string | null>(null);

  useEffect(() => {
    if (session.type !== 'hearthis') return;
    setHearthisSrc(null);
    try {
      const parts = new URL(session.url).pathname.split('/').filter(Boolean);
      if (parts.length < 2) return;
      fetch(`https://api-v2.hearthis.at/${parts[0]}/${parts[1]}/`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.id) setHearthisSrc(`https://hearthis.at/embed/${data.id}/`); })
        .catch(() => {});
    } catch { /* URL inválida */ }
  }, [session.url, session.type]);

  if (session.type === 'file') {
    return (
      <audio
        src={session.url}
        controls
        className="w-full h-9"
        style={{ filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(5deg)' }}
      />
    );
  }
  const src = session.type === 'hearthis' ? hearthisSrc : buildEmbedSrc(session.url, session.type);
  const height = session.type === 'soundcloud' ? 166 : 120;
  if (!src) {
    return (
      <div className="w-full rounded-lg flex items-center justify-center text-xs" style={{ height, background: 'rgba(0,0,0,0.04)', color: '#777' }}>
        Cargando sesión…
      </div>
    );
  }
  return (
    <iframe
      src={src}
      width="100%"
      height={height}
      allow="autoplay"
      className="rounded-lg"
      style={{ border: 'none' }}
    />
  );
}

const AudioUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sessions, setSessions] = useState<SessionFile[]>([]);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showGenres, setShowGenres] = useState(false);
  const [savingGenres, setSavingGenres] = useState(false);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const profile = useProfile();

  useEffect(() => {
    if (profile.genres && profile.genres.length > 0) {
      setSelectedGenres(profile.genres);
    }
  }, [profile.genres?.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load existing sessions: files from storage + external links from profile
  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;
      const loaded: SessionFile[] = [];
      const { data: files } = await supabase.storage.from('audio-sessions').list(user.id + '/sessions');
      if (files && files.length > 0) {
        for (const f of files) {
          const path = `${user.id}/sessions/${f.name}`;
          const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
          loaded.push({ name: f.name.replace(/^\d+-/, ''), url: urlData.publicUrl, storagePath: path, type: 'file' as SessionType });
        }
      }
      // Links externos (SoundCloud/Mixcloud/hearthis) guardados en audio_session_urls
      const { data: prof } = await supabase.from('profiles')
        .select('audio_session_urls').eq('user_id', user.id).maybeSingle();
      const savedUrls: string[] = (prof as any)?.audio_session_urls ?? [];
      for (const u of savedUrls) {
        const t = detectType(u);
        if (t && t !== 'file') {
          loaded.push({ name: u.split('/').filter(Boolean).pop() || u, url: u, storagePath: '', type: t });
        }
      }
      setSessions(loaded);
      setSessionsLoaded(true);
    };
    loadSessions();
  }, [user]);

  // Persistir los links externos en profiles.audio_session_urls (los files viven en storage)
  const persistLinks = (next: SessionFile[]) => {
    const linkUrls = next.filter(s => s.type !== 'file').map(s => s.url);
    supabase.from('profiles').update({ audio_session_urls: linkUrls } as any).eq('user_id', user!.id).then(() => {});
  };

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
    if (file.size > MAX_FILE_MB * 1024 * 1024) { toast.error(`Máximo ${MAX_FILE_MB}MB por sesión`); return; }
    if (sessions.length >= MAX_SESSIONS_PRO) { toast.error(`Máximo ${MAX_SESSIONS_PRO} sesiones permitidas.`); return; }

    setUploading(true);
    setUploadProgress(0);
    const safeName = sanitizeFileName(file.name) || 'audio.mp3';
    const path = `${user.id}/sessions/${Date.now()}-${safeName}`;

    // Simulate progress via XHR for large files
    const xhr = new XMLHttpRequest();
    const progressPromise = new Promise<void>((resolve) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 90));
      });
      resolve();
    });
    await progressPromise;

    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    setUploadProgress(100);
    if (error) { toast.error('Error al subir: ' + error.message); setUploading(false); setUploadProgress(0); return; }

    const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
    const newSession = { name: file.name, url: urlData.publicUrl, storagePath: path, type: 'file' as SessionType };
    setSessions(prev => {
      const next = [...prev, newSession];
      const fileUrls = next.filter(s => s.type === 'file').map(s => s.url);
      supabase.from('profiles').update({ audio_session_urls: fileUrls } as any).eq('user_id', user.id).then(() => {});
      return next;
    });

    await supabase.from('feature_requests').insert({
      user_id: user.id,
      feature_name: `audio_upload:${file.name}`,
    }).then(() => {}, () => {});

    await profile.activateTrial();
    toast.success('Sesión subida correctamente.');
    setUploading(false);
    setUploadProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleAddLink = () => {
    const url = linkInput.trim();
    if (!url) return;
    const type = detectType(url);
    if (!type) {
      toast.error('Pega un link de SoundCloud, Mixcloud o hearthis.at');
      return;
    }
    if (sessions.length >= MAX_SESSIONS_PRO) {
      toast.error(`Máximo ${MAX_SESSIONS_PRO} sesiones permitidas.`);
      return;
    }
    const name = url.split('/').filter(Boolean).pop() || url;
    setSessions(prev => {
      const next = [...prev, { name, url, storagePath: '', type }];
      persistLinks(next);
      return next;
    });
    setLinkInput('');
    setShowLinkInput(false);
    toast.success('Mix añadido correctamente.');
  };

  const removeSession = async (session: SessionFile) => {
    if (session.storagePath) {
      await supabase.storage.from('audio-sessions').remove([session.storagePath]);
    }
    setSessions(prev => {
      const next = prev.filter(s => s !== session);
      persistLinks(next);
      return next;
    });
    toast.info('Sesión eliminada.');
  };

  const canAdd = sessions.length < MAX_SESSIONS_PRO;

  return (
    <div className="glass-panel p-4">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Music size={16} style={{ color: '#8A6D0F' }} /> Sesiones de Audio
        <span className="text-xs text-muted-foreground ml-auto">
          {sessions.length}/{MAX_SESSIONS_PRO}
        </span>
      </h4>
      <p className="text-xs text-muted-foreground mb-3">
        Sube un archivo (máx {MAX_FILE_MB}MB) o pega un link de SoundCloud, Mixcloud o hearthis.at
      </p>

      {/* Genre selector */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowGenres(!showGenres)}
            className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', color: '#8A6D0F' }}>
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
                style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.2)' }}>
                {g} ×
              </span>
            ))}
          </div>
        )}
        {showGenres && (
          <div className="mt-2 max-h-64 overflow-y-auto rounded-lg p-3 space-y-3"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--nightlife-border)' }}>
            {GENRE_GROUPS.map(group => (
              <div key={group.label}>
                <p className="text-[0.6rem] font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(212,175,55,0.5)' }}>{group.label}</p>
                <div className="flex flex-wrap gap-1">
                  {group.genres.map(g => (
                    <button key={g} onClick={() => toggleGenre(g)}
                      className="text-xs font-medium px-2 py-0.5 rounded transition-all"
                      style={{
                        background: selectedGenres.includes(g) ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.03)',
                        color: selectedGenres.includes(g) ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                        border: selectedGenres.includes(g) ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--nightlife-border)',
                      }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA: sin sesiones — el audio es el mayor gancho del perfil */}
      {sessionsLoaded && sessions.length === 0 && (
        <div className="rounded-xl px-4 py-4 mb-3 flex items-start gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))', border: '1.5px solid rgba(212,175,55,0.4)' }}>
          <span className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
            <Music size={17} style={{ color: '#D4AF37' }} />
          </span>
          <div>
            <p className="text-sm font-black mb-1" style={{ color: '#8A6D0F' }}>Sube tu primera sesión — es tu mejor tarjeta de presentación</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--nightlife-text-secondary)' }}>
              Los organizadores escuchan antes de contactar: los perfiles con sesión reciben más visitas, salen mejor posicionados en el directorio y en Google. Pega un enlace de SoundCloud, Mixcloud o hearthis.at — tardas 10 segundos.
            </p>
          </div>
        </div>
      )}

      {/* Sessions list */}
      {sessions.length > 0 && (
        <div className="space-y-3 mb-3">
          {sessions.map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                {s.type === 'file' ? <Music size={14} style={{ color: '#22c55e' }} /> : <Link size={14} style={{ color: '#22c55e' }} />}
                <span className="text-xs font-medium flex-1 truncate opacity-70">{s.type !== 'file' ? s.type : s.name}</span>
                <button onClick={() => removeSession(s)}><X size={14} className="text-muted-foreground hover:text-white" /></button>
              </div>
              <EmbedPlayer session={s} />
            </div>
          ))}
        </div>
      )}

      {/* Rights confirmation */}
      {canAdd && (
        <label className="flex items-start gap-2 mb-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={rightsConfirmed}
            onChange={e => setRightsConfirmed(e.target.checked)}
            className="mt-0.5 flex-shrink-0 accent-[#D4AF37]"
          />
          <span className="text-xs leading-relaxed" style={{ color: '#222' }}>
            Declaro que poseo los derechos o licencias necesarias sobre este contenido, incluyendo las obras de terceros incorporadas en la mezcla, conforme a los{' '}
            <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#8A6D0F' }}>Términos y Condiciones</a>.
          </span>
        </label>
      )}

      {/* Link input */}
      {canAdd && rightsConfirmed && showLinkInput && (
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={linkInput}
            onChange={e => setLinkInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddLink()}
            placeholder="https://soundcloud.com/... · mixcloud.com/... · hearthis.at/..."
            className="nightlife-input text-xs flex-1"
          />
          <button onClick={handleAddLink}
            className="px-3 py-2 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.3)' }}>
            Añadir
          </button>
          <button onClick={() => setShowLinkInput(false)}
            className="px-2 py-2 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid var(--nightlife-border)' }}>
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Action buttons */}
      {canAdd && (
        <div className="flex gap-2">
          <button
            onClick={() => { if (rightsConfirmed) inputRef.current?.click(); }}
            disabled={uploading || !rightsConfirmed}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed transition-all hover:scale-[1.01] disabled:opacity-40"
            style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#8A6D0F', background: 'rgba(212,175,55,0.03)' }}>
            <Upload size={16} />
            <span className="text-sm font-bold">{uploading ? `Subiendo... ${uploadProgress}%` : 'Subir archivo'}</span>
          </button>
          {uploading && uploadProgress > 0 && (
            <div className="w-full h-1 rounded-full mt-1 overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg, #D4AF37, #B8941E)' }} />
            </div>
          )}
          <button
            onClick={() => { if (rightsConfirmed) setShowLinkInput(!showLinkInput); }}
            disabled={!rightsConfirmed}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed transition-all hover:scale-[1.01] disabled:opacity-40"
            style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#8A6D0F', background: 'rgba(212,175,55,0.03)' }}>
            <Link size={16} />
            <span className="text-sm font-bold">Link</span>
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept="audio/mp3,audio/wav,audio/mpeg,audio/m4a,audio/x-m4a" onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default AudioUpload;
