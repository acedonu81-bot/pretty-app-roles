import { useState, useRef } from 'react';
import { Trash2, Camera, Music2, ExternalLink } from 'lucide-react';
import { parseStreamUrl } from '@/lib/streaming';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AudioUpload from '@/components/dashboard/AudioUpload';
import PortfolioUpload from '@/components/dashboard/PortfolioUpload';
import LiveBetaButton from '@/components/dashboard/LiveBetaButton';
import { subscriptionPlans, mapSubscriptionTierToPlan } from '@/lib/subscriptions';
import { sanitizeInput } from '@/lib/contentFilter';

const ProfileView = () => {
  const { user } = useAuth();
  const profile = useProfile();
  const [deleting, setDeleting] = useState(false);
  const [localName, setLocalName] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [rider, setRider] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedLangs, setSelectedLangs] = useState<string[] | null>(null);

  const EU_LANGS = ['Español','Inglés','Francés','Italiano','Alemán','Portugués','Neerlandés','Polaco','Catalán','Euskera'];
  const DJ_GENRES = ['Techno','Tech House','House','Afro House','Melodic Techno','Deep House','Minimal','Trance','Progressive','Drum & Bass','Jungle','Garage','Afrobeats','Tribal','Nu Disco','Electro','Hard Techno','Industrial','Ambient','Comercial','Reggaetón','Urbano','Hip Hop','RnB','Funk','Soul','Disco','Latino','Salsa','Flamenco Fusión'];
  const [selectedGenres, setSelectedGenres] = useState<string[] | null>(null);
  const activeGenres = selectedGenres ?? (profile.languages ?? []).filter(g => DJ_GENRES.includes(g));
  const toggleGenre = (g: string) => {
    const next = activeGenres.includes(g) ? activeGenres.filter(x => x !== g) : [...activeGenres, g];
    setSelectedGenres(next);
  };
  const activeLangs = selectedLangs ?? profile.languages ?? [];
  const toggleLang = (lang: string) => {
    const current = activeLangs;
    const next = current.includes(lang) ? current.filter(l => l !== lang) : [...current, lang];
    setSelectedLangs(next);
  };
  const photoRef = useRef<HTMLInputElement>(null);

  const displayName = localName ?? profile.display_name;
  const rawPhoto = profile.photo_url;
  const photoUrl = rawPhoto && rawPhoto.trim().length > 5 && !rawPhoto.endsWith("''") ? rawPhoto : null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB'); return; }

    const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${user.id}/photo-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    if (error) { toast.error('Error al subir foto: ' + error.message); return; }
    const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
    const newUrl = urlData.publicUrl;
    await profile.updateField({ photo_url: newUrl });
    toast.success('Foto de perfil actualizada.');
  };

  const handleSave = async () => {
    if (!user) return;
    const toCheck = [localName, bio, rider].filter(Boolean) as string[];
    for (const val of toCheck) {
      const { clean, reason } = sanitizeInput(val);
      if (!clean) { toast.error(reason); return; }
    }
    const updates: any = {};
    if (localName !== null) updates.display_name = localName;
    if (city) updates.zone = city;
    if (rider !== null) updates.specialty = rider;
    if (bio !== null) updates.instagram = bio;
    if (audioUrl !== null) updates.audio_embed_url = audioUrl || null;
    if (selectedLangs !== null) updates.languages = selectedLangs;
    if (selectedGenres !== null) updates.badges = selectedGenres;
    if (Object.keys(updates).length > 0) await profile.updateField(updates);
    toast.success('Perfil guardado.');
  };

  const handleDeleteMedia = async () => {
    if (!user) return;
    const first = window.confirm('¿Estás seguro? Se eliminarán TODOS tus archivos multimedia (audio, fotos) de forma permanente.');
    if (!first) return;
    const second = window.confirm('⚠️ CONFIRMACIÓN FINAL: Esta acción es IRREVERSIBLE. ¿Deseas continuar con la eliminación?');
    if (!second) return;
    setDeleting(true);
    try {
      const { data: files } = await supabase.storage.from('audio-sessions').list(user.id);
      if (files && files.length > 0) {
        const paths = files.map(f => `${user.id}/${f.name}`);
        await supabase.storage.from('audio-sessions').remove(paths);
      }
      const { data: sessionFiles } = await supabase.storage.from('audio-sessions').list(user.id + '/sessions');
      if (sessionFiles && sessionFiles.length > 0) {
        const sPaths = sessionFiles.map(f => `${user.id}/sessions/${f.name}`);
        await supabase.storage.from('audio-sessions').remove(sPaths);
      }
      await profile.updateField({ photo_url: '' });
      toast.success('Contenido multimedia eliminado permanentemente.');
    } catch {
      toast.error('Error al eliminar contenido.');
    } finally {
      setDeleting(false);
    }
  };

  const initials = displayName ? displayName.charAt(0).toUpperCase() : 'X';

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Mi <span className="text-gradient">Perfil</span></h2>
          <p className="text-base text-muted-foreground">Así te ven los empresarios.</p>
        </div>
        <button onClick={handleSave}
          className="px-5 py-2 rounded-lg font-bold text-base w-full sm:w-auto"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          Guardar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5 text-center">
            <div className="relative cursor-pointer group mx-auto w-20 h-20 mb-3" onClick={() => photoRef.current?.click()}>
              <div className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center text-2xl font-bold"
                style={{ background: photoUrl ? undefined : 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {photoUrl
                  ? <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" crossOrigin="anonymous" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  : initials}
              </div>
              <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

            <p className="font-bold text-base">{displayName || 'Sin nombre'}</p>
            <p className="text-xs font-bold mt-1" style={{ color: '#D4AF37' }}>
              {subscriptionPlans.find(p => p.id === mapSubscriptionTierToPlan(profile.subscription_tier))?.name ?? 'Free'}
            </p>
            <div className="flex justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map(s => <span key={s} style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>★</span>)}
              <span className="text-sm text-muted-foreground ml-1">0.0</span>
            </div>
          </div>
          <div className="glass-panel p-4">
            {[['Bookings 2026','0'],['Tasa respuesta','0%'],['Visitas perfil','0'],['Clics WhatsApp','0']].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5">
            <h4 className="text-base font-bold mb-4">Información</h4>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Nombre artístico</label>
              <input type="text" value={displayName} onChange={e => setLocalName(e.target.value)} className="nightlife-input mt-1 text-base" />
            </div>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Ciudad</label>
              <input type="text" value={city || profile.zone || ''} onChange={e => setCity(e.target.value)} className="nightlife-input mt-1 text-base" />
            </div>
            {profile.role === 'dj' && (
              <div className="mb-3">
                <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Géneros musicales</label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {DJ_GENRES.map(g => (
                    <button key={g} type="button" onClick={() => toggleGenre(g)}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
                      style={{
                        background: activeGenres.includes(g) ? 'rgba(226,190,80,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${activeGenres.includes(g) ? 'rgba(226,190,80,0.4)' : 'var(--nightlife-border)'}`,
                        color: activeGenres.includes(g) ? '#E2BE50' : '#8E8EA0',
                      }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Rider técnico</label>
              <input type="text" value={rider ?? profile.specialty ?? ''} onChange={e => setRider(e.target.value)} placeholder="Ej: Pioneer CDJ-3000, DJM-900NXS2" className="nightlife-input mt-1 text-base" />
            </div>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Bio</label>
              <textarea rows={2} value={bio ?? profile.instagram ?? ''}
                onChange={e => setBio(e.target.value)}
                placeholder="Describe tu experiencia y estilo..."
                className="nightlife-input mt-1 text-base resize-y" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Idiomas</label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {EU_LANGS.map(lang => (
                  <button key={lang} type="button" onClick={() => toggleLang(lang)}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
                    style={{
                      background: activeLangs.includes(lang) ? 'rgba(226,190,80,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${activeLangs.includes(lang) ? 'rgba(226,190,80,0.4)' : 'var(--nightlife-border)'}`,
                      color: activeLangs.includes(lang) ? '#E2BE50' : '#8E8EA0',
                    }}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {profile.role === 'dj' ? <AudioUpload /> : <PortfolioUpload />}

          {/* External audio embed — hearthis.at / Mixcloud / SoundCloud */}
          {profile.role === 'dj' && (() => {
            const currentUrl = audioUrl ?? profile.audio_embed_url ?? '';
            const parsed = parseStreamUrl(currentUrl);
            return (
              <div className="glass-panel p-5">
                <h4 className="text-base font-bold mb-1 flex items-center gap-2">
                  <Music2 size={16} style={{ color: '#D4AF37' }} /> Player Externo
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Incrusta tu perfil de <strong>hearthis.at</strong>, <strong>Mixcloud</strong> o <strong>SoundCloud</strong> — los empresarios lo verán directamente en tu ficha.
                </p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={currentUrl}
                    onChange={e => setAudioUrl(e.target.value)}
                    placeholder="https://hearthis.at/tu-usuario/ o mixcloud.com/..."
                    className="nightlife-input text-sm flex-1"
                  />
                  {currentUrl && (
                    <a href={currentUrl} target="_blank" rel="noopener noreferrer"
                      className="px-3 rounded-lg flex items-center"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                {parsed ? (
                  <>
                    <p className="text-[0.6rem] font-bold mb-2" style={{ color: '#22c55e' }}>
                      ✓ {parsed.type} detectado — preview:
                    </p>
                    <iframe
                      src={parsed.embedUrl}
                      className="w-full rounded-lg"
                      style={{ height: 160, border: 'none' }}
                      allow="autoplay"
                    />
                  </>
                ) : currentUrl ? (
                  <p className="text-[0.6rem]" style={{ color: '#ff5f56' }}>URL no reconocida. Prueba con hearthis.at, Mixcloud o SoundCloud.</p>
                ) : null}
              </div>
            );
          })()}

          {/* Media deletion - GDPR */}
          <div className="glass-panel p-5">
            <h4 className="text-base font-bold mb-2 flex items-center gap-2">
              <Trash2 size={16} style={{ color: '#ff5f56' }} /> Gestión de Contenido Multimedia
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Según la normativa RGPD, puedes solicitar la eliminación permanente de todo tu contenido multimedia (audios, fotos de perfil y trabajos).
            </p>
            <button onClick={handleDeleteMedia} disabled={deleting}
              className="w-full py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
              style={{ background: 'rgba(255,95,86,0.06)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.15)' }}>
              {deleting ? 'Eliminando...' : 'Eliminar todo mi contenido multimedia'}
            </button>
          </div>
          {profile.role === 'dj' && (
            <div className="glass-panel p-5">
              <h4 className="text-base font-bold mb-3">Vídeo en Directo</h4>
              <LiveBetaButton />
            </div>
          )}
          <div className="glass-panel p-5">
            <h4 className="text-base font-bold mb-3">Valoraciones</h4>
            <p className="text-sm text-muted-foreground text-center py-4">Aún no tienes valoraciones. Aparecerán aquí cuando los empresarios valoren tu trabajo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
