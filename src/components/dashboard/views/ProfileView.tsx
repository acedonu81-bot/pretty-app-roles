import { useState, useRef } from 'react';
import { Trash2, Camera, ExternalLink, Star, Radio, ChevronDown, X, MapPin, Download, ShoppingBag, Plus, Package, Tag, Image as ImageIcon, Lock, Music, Shirt, Sparkles, FileEdit } from 'lucide-react';
import { exportUserDataZip } from '@/lib/exportUserData';
import { parseStreamUrl } from '@/lib/streaming';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AudioUpload from '@/components/dashboard/AudioUpload';
import PortfolioUpload from '@/components/dashboard/PortfolioUpload';
import { subscriptionPlans, mapSubscriptionTierToPlan } from '@/lib/subscriptions';
import { sanitizeInput } from '@/lib/contentFilter';
import VerificationSection from './profile/VerificationSection';

const ProfileView = ({ onNavigate }: { onNavigate?: (view: string) => void } = {}) => {
  const { user } = useAuth();
  const profile = useProfile();
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localName, setLocalName] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [rider, setRider] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[] | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  const EU_LANGS = ['Español','Inglés','Francés','Italiano','Alemán','Portugués','Neerlandés','Polaco','Catalán','Euskera'];
  const SPAIN_CITIES = ['Madrid','Barcelona','Valencia','Sevilla','Zaragoza','Málaga','Murcia','Palma de Mallorca','Alicante','Bilbao','Valladolid','Córdoba','Vigo','Gijón','Granada','A Coruña','Vitoria-Gasteiz','San Sebastián','Oviedo','Las Palmas de Gran Canaria','Santa Cruz de Tenerife','Badalona','Cartagena','Sabadell','Móstoles','Elche','Hospitalet de Llobregat','Terrassa','Jerez de la Frontera','Burgos','Santander','Almería','Alcalá de Henares','Pamplona','Salamanca','Ibiza','Marbella','León','Albacete','Logroño','Huelva','Tarragona','Lleida','Badajoz','Jaén','Cádiz','Toledo','Torrevieja','Mataró','Alcobendas'];

  const ROLE_TAGS: Record<string, { label: string; tags: string[] }> = {
    dj:        { label: 'Géneros musicales',    tags: ['Techno','Tech House','House','Afro House','Melodic Techno','Deep House','Minimal','Trance','Progressive','Drum & Bass','Jungle','Garage','Afrobeats','Tribal','Nu Disco','Electro','Hard Techno','Industrial','Ambient','Comercial','Reggaetón','Urbano','Hip Hop','RnB','Funk','Soul','Disco','Latino','Salsa','Flamenco Fusión'] },
    rookie:    { label: 'Géneros musicales',    tags: ['Techno','Tech House','House','Afro House','Melodic Techno','Deep House','Minimal','Trance','Progressive','Drum & Bass','Electro','Hard Techno','Comercial','Reggaetón','Urbano','Hip Hop'] },
    staff:     { label: 'Especialidades',        tags: ['Azafata','RRPP','Promotor','Camarero/a','Relaciones Públicas','Animación','Hostess','Sala VIP','Control de acceso','Taquilla','Chill-out','Bottle service','Coordinación'] },
    makeup:    { label: 'Servicios',             tags: ['Maquillaje nupcial','Caracterización','Maquillaje artístico','Peluquería','Estilismo','Nail art','Aerógrafo','Efectos especiales','Maquillaje masculino','Novias','Pasarela','Producción'] },
    media:     { label: 'Especialidades',        tags: ['Fotografía de eventos','Vídeo','Reels & Contenido','Fotografía de DJ','Drone','Cobertura en directo','Fotografía de sala','Retrato','Edición de vídeo','Color grading','Motion graphics','Podcast'] },
    design:    { label: 'Especialidades',        tags: ['Diseño gráfico','VJing','Mapping','LED wall','Visuales en vivo','Cartelería','Branding','Redes sociales','Ilustración','3D','Motion design'] },
    promotor:  { label: 'Especialidades',        tags: ['Festivales','Clubs nocturnos','Eventos privados','Bodas','Corporativo','After','Terraza','Sala pequeña','Sala grande','Residencias','Giras'] },
  };

  const roleTagConfig = ROLE_TAGS[profile.role ?? ''];
  const [selectedGenres, setSelectedGenres] = useState<string[] | null>(null);
  const activeGenres = selectedGenres ?? profile.genres ?? [];
  const toggleGenre = (g: string) => {
    const next = activeGenres.includes(g) ? activeGenres.filter((x: string) => x !== g) : [...activeGenres, g];
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
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten archivos de imagen.'); return; }
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) { toast.error('Formato no permitido. Usa JPG, PNG, WebP o GIF.'); return; }
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
    if (!user || saving) return;
    const toCheck = [localName, bio, rider].filter(Boolean) as string[];
    for (const val of toCheck) {
      const { clean, reason } = sanitizeInput(val);
      if (!clean) { toast.error(reason); return; }
    }
    const updates: Record<string, unknown> = {};
    if (localName !== null) updates.display_name = localName;
    if (city) updates.zone = city;
    if (hourlyRate !== null) updates.hourly_rate = parseInt(hourlyRate) || 0;
    if (rider !== null) updates.specialty = rider;
    if (bio !== null) updates.bio = bio;
    if (audioUrl !== null) updates.audio_embed_url = audioUrl || null;
    if (selectedLangs !== null) updates.languages = selectedLangs;
    if (selectedGenres !== null) updates.genres = selectedGenres;
    // is_flash_active is saved immediately on toggle — skip here
    if (Object.keys(updates).length > 0) {
      setSaving(true);
      const ok = await profile.updateField(updates);
      setSaving(false);
      if (!ok) return;
    }
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
        <div className="flex gap-2 w-full sm:w-auto">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('ficha')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(66,133,244,0.12)', border: '1px solid rgba(66,133,244,0.35)', color: '#4285F4' }}>
              <FileEdit size={14} /> Editar Ficha Pública
            </button>
          )}
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2 rounded-lg font-bold text-base flex-1 sm:flex-none disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
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
            <p className="text-xs text-muted-foreground mt-2 mb-1">Sin valoraciones aún</p>
          </div>
          <div className="glass-panel p-4">
            {[['Bookings 2026','0'],['Tasa respuesta','—'],['Visitas perfil','0'],['Mensajes recibidos','0']].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold" style={{ color: v === '0' || v === '—' ? 'rgba(255,255,255,0.25)' : 'inherit' }}>{v}</span>
              </div>
            ))}
            <p className="text-[0.75rem] text-center mt-2.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Las métricas se activan cuando completes tu perfil
            </p>
          </div>

          {/* Disponibilidad — toggle prominente en columna izquierda */}
          {profile.role !== 'empresario' && (
            <button
              type="button"
              disabled={savingAvailability}
              onClick={async () => {
                const current = isAvailable ?? profile.is_flash_active ?? false;
                const next = !current;
                setIsAvailable(next);
                setSavingAvailability(true);
                const ok = await profile.updateField({ is_flash_active: next });
                setSavingAvailability(false);
                if (ok) {
                  toast.success(next ? '¡Disponible! Los empresarios ya te ven en Flash Booking.' : 'Disponibilidad desactivada.');
                } else {
                  setIsAvailable(current); // revert on error
                }
              }}
              className="glass-panel p-4 w-full text-left transition-all hover:scale-[1.01]"
              style={{
                border: `1px solid ${(isAvailable ?? profile.is_flash_active) ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.06)'}`,
                background: (isAvailable ?? profile.is_flash_active) ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                opacity: savingAvailability ? 0.7 : 1,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Radio size={15} style={{ color: (isAvailable ?? profile.is_flash_active) ? '#22c55e' : 'rgba(255,255,255,0.25)' }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: (isAvailable ?? profile.is_flash_active) ? '#22c55e' : 'rgba(255,255,255,0.4)' }}>
                      {savingAvailability ? 'Guardando...' : (isAvailable ?? profile.is_flash_active) ? 'Disponible ahora' : 'No disponible'}
                    </p>
                    <p className="text-[0.75rem] text-muted-foreground">Visible en Flash Booking y directorio</p>
                  </div>
                </div>
                <div className="relative w-10 h-5 rounded-full flex-shrink-0"
                  style={{ background: (isAvailable ?? profile.is_flash_active) ? '#22c55e' : 'rgba(255,255,255,0.1)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                    style={{ left: (isAvailable ?? profile.is_flash_active) ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
                </div>
              </div>
            </button>
          )}

          {profile.role !== 'empresario' && (
            <button
              onClick={async () => {
                const next = profile.category === 'rookie' ? 'professional' : 'rookie';
                await profile.updateField({ category: next } as any);
                toast.success(next === 'rookie' ? '¡Ahora apareces como Artista Promesa!' : 'Has vuelto a Profesional.');
              }}
              className="glass-panel p-4 text-left w-full transition-all hover:scale-[1.01]"
              style={{
                border: profile.category === 'rookie' ? '1px solid rgba(255,188,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}>
              <div className="flex items-center gap-2 mb-1">
                <Star size={14} style={{ color: profile.category === 'rookie' ? '#ffbc00' : '#D4AF37' }} />
                <span className="text-xs font-bold" style={{ color: profile.category === 'rookie' ? '#ffbc00' : '#D4AF37' }}>
                  {profile.category === 'rookie' ? 'Modo Promesa activo' : 'Última Llamada'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                {profile.category === 'rookie'
                  ? 'Estás en modo Promesa. Consigue 500 apoyos para ascender. Pulsa para volver a Profesional.'
                  : 'Vuelve a modo Promesa para ganar visibilidad y buscar apoyos de la comunidad.'}
              </p>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5">
            <h4 className="text-base font-bold mb-4">Información</h4>

            {/* — Identidad — */}
            <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Identidad</p>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Nombre artístico</label>
              <input type="text" value={displayName} onChange={e => setLocalName(e.target.value)} className="nightlife-input mt-1 text-base" />
            </div>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Ciudad</label>
              <div className="relative mt-1">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  value={city || profile.zone?.replace(', España','') || ''}
                  onChange={e => setCity(e.target.value)}
                  className="nightlife-input !pl-8 text-base appearance-none w-full"
                  style={{ background: 'rgba(255,255,255,0.03)', color: (city || profile.zone) ? 'inherit' : '#8E8EA0' }}>
                  <option value="" disabled>Seleccionar ciudad</option>
                  {SPAIN_CITIES.map(c => <option key={c} value={c} style={{ background: '#0e0e14', color: '#fff' }}>{c}</option>)}
                </select>
              </div>
            </div>
            {profile.role !== 'empresario' && (
              <div className="mb-3">
                <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  Caché / Tarifa por hora
                  <span className="ml-2 normal-case tracking-normal font-normal" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    — solo visible para empresarios con suscripción
                  </span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                  <input
                    type="number"
                    min={0}
                    value={hourlyRate ?? profile.hourly_rate ?? ''}
                    onChange={e => setHourlyRate(e.target.value)}
                    placeholder="Ej: 120"
                    className="nightlife-input !pl-8 text-base"
                  />
                </div>
              </div>
            )}
            {/* — Habilidades — */}
            <div className="mt-5 mb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem' }}>
              <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Habilidades</p>
            </div>
            {roleTagConfig && (() => {
              const [genreOpen, setGenreOpen] = useState(false);
              return (
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{roleTagConfig.label}</label>

                  {/* Selected chips */}
                  {activeGenres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                      {activeGenres.map(g => (
                        <span key={g} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: 'rgba(226,190,80,0.12)', border: '1px solid rgba(226,190,80,0.35)', color: '#E2BE50' }}>
                          {g}
                          <button type="button" onClick={() => toggleGenre(g)} className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dropdown trigger */}
                  <button
                    type="button"
                    onClick={() => setGenreOpen(v => !v)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    <span>{activeGenres.length > 0 ? `${activeGenres.length} seleccionado${activeGenres.length > 1 ? 's' : ''}` : 'Seleccionar...'}</span>
                    <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: genreOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  {/* Dropdown panel */}
                  {genreOpen && (
                    <div className="mt-1 rounded-xl overflow-hidden animate-[fadeIn_0.15s_ease]"
                      style={{ background: 'rgba(12,12,16,0.97)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                      <div className="flex flex-wrap gap-1.5 p-3 max-h-56 overflow-y-auto"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
                        {roleTagConfig.tags.map(g => (
                          <button key={g} type="button" onClick={() => toggleGenre(g)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                            style={{
                              background: activeGenres.includes(g) ? 'rgba(226,190,80,0.15)' : 'rgba(255,255,255,0.05)',
                              border: `1px solid ${activeGenres.includes(g) ? 'rgba(226,190,80,0.4)' : 'rgba(255,255,255,0.07)'}`,
                              color: activeGenres.includes(g) ? '#E2BE50' : 'rgba(255,255,255,0.5)',
                            }}>
                            {g}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="text-xs text-muted-foreground">{activeGenres.length} seleccionados</span>
                        <button type="button" onClick={() => setGenreOpen(false)}
                          className="text-xs font-bold px-3 py-1 rounded-lg transition-all"
                          style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="mb-3">
              {(() => {
                const isMusical = profile.role === 'dj' || profile.role === 'rookie';
                const label = isMusical ? 'Rider Técnico' : profile.role === 'makeup' ? 'Marcas / Productos' : profile.role === 'media' ? 'Equipo técnico' : 'Especialidad';
                const placeholder = isMusical
                  ? 'Ej: Pioneer CDJ-3000 + DJM-900NXS2. Mesa propia (si no hay Pioneer). 2 enchufes cerca de la cabina. Monitoreo lateral obligatorio.'
                  : profile.role === 'media' ? 'Ej: Sony A7 III + DJI Ronin SC. Entrego en 48h. Incluye edición y color grading.'
                  : profile.role === 'makeup' ? 'Ej: MAC, NARS, Charlotte Tilbury. Traigo maletín completo. Necesito mesa con espejo y luz natural.'
                  : 'Describe tu especialidad y requisitos...';
                const PRESETS: Record<string, string[]> = {
                  dj:     ['CDJ-3000 + DJM-900NXS2', 'Mesa propia', '2 enchufes', 'Monitor lateral', 'Rider estándar Pioneer', 'Necesita backline', 'Acepta Serato', 'Acepta Traktor'],
                  rookie: ['CDJ-3000 + DJM-900NXS2', 'Mesa propia', '2 enchufes', 'Monitor lateral', 'Controlador propio'],
                  makeup: ['Traigo maletín', 'Necesita espejo con luz', 'Solo marcas premium', 'Acepta prueba previa', 'Trabaja en equipo'],
                  media:  ['Cámara Sony A7', 'Drone DJI', 'Entrega 48h', 'Incluye edición', 'Raw disponible', 'Drone incluido'],
                  staff:  ['Traje propio', 'Acreditación de sala', 'Idiomas: EN/FR', 'Experiencia VIP', 'Uniforme de sala'],
                };
                const presets = PRESETS[profile.role ?? ''] ?? [];
                const currentRider = rider ?? profile.specialty ?? '';
                const addPreset = (chip: string) => {
                  const cur = rider ?? profile.specialty ?? '';
                  const sep = cur.trim() ? '. ' : '';
                  setRider(cur.trim() + sep + chip);
                };
                return (
                  <>
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</label>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                      Los empresarios y técnicos de sonido verán esto. Sé específico — ahorra emails.
                    </p>
                    {presets.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {presets.map(chip => (
                          <button key={chip} type="button" onClick={() => addPreset(chip)}
                            className="text-xs font-bold px-2 py-1 rounded-lg transition-all hover:scale-105"
                            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', color: 'rgba(212,175,55,0.7)' }}>
                            + {chip}
                          </button>
                        ))}
                      </div>
                    )}
                    <textarea
                      rows={3}
                      value={currentRider}
                      onChange={e => setRider(e.target.value)}
                      placeholder={placeholder}
                      className="nightlife-input mt-1 text-sm resize-y w-full"
                    />
                  </>
                );
              })()}
            </div>
            {/* — Sobre ti — */}
            <div className="mt-5 mb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem' }}>
              <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Sobre ti</p>
            </div>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Bio</label>
              <textarea rows={2} value={bio ?? profile.bio ?? ''}
                onChange={e => setBio(e.target.value)}
                placeholder="Describe tu experiencia y estilo..."
                className="nightlife-input mt-1 text-base resize-y" />
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Idiomas</p>
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Idiomas que hablas</label>

              {/* Selected chips */}
              {activeLangs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                  {activeLangs.map(lang => (
                    <span key={lang} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(226,190,80,0.12)', border: '1px solid rgba(226,190,80,0.35)', color: '#E2BE50' }}>
                      {lang}
                      <button type="button" onClick={() => toggleLang(lang)} className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Dropdown trigger */}
              <button
                type="button"
                onClick={() => setLangOpen(v => !v)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all mt-2"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                <span>{activeLangs.length > 0 ? `${activeLangs.length} seleccionado${activeLangs.length > 1 ? 's' : ''}` : 'Seleccionar...'}</span>
                <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: langOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {/* Dropdown panel */}
              {langOpen && (
                <div className="mt-1 rounded-xl overflow-hidden animate-[fadeIn_0.15s_ease]"
                  style={{ background: 'rgba(12,12,16,0.97)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                  <div className="flex flex-wrap gap-1.5 p-3 max-h-48 overflow-y-auto"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
                    {EU_LANGS.map(lang => (
                      <button key={lang} type="button" onClick={() => toggleLang(lang)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                        style={{
                          background: activeLangs.includes(lang) ? 'rgba(226,190,80,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${activeLangs.includes(lang) ? 'rgba(226,190,80,0.4)' : 'rgba(255,255,255,0.07)'}`,
                          color: activeLangs.includes(lang) ? '#E2BE50' : 'rgba(255,255,255,0.5)',
                        }}>
                        {lang}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-xs text-muted-foreground">{activeLangs.length} seleccionados</span>
                    <button type="button" onClick={() => setLangOpen(false)}
                      className="text-xs font-bold px-3 py-1 rounded-lg transition-all"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <AudioUpload />
          {profile.role !== 'dj' && profile.role !== 'rookie' && <PortfolioUpload />}

          {/* Redes sociales y plataformas — todos los roles */}
          <div className="glass-panel p-5">
            <h4 className="text-base font-bold mb-4">Redes & Plataformas</h4>

            {/* Audio embed — roles musicales */}
            {(profile.role === 'dj' || profile.role === 'rookie') && (() => {
              const currentUrl = audioUrl ?? profile.audio_embed_url ?? '';
              const parsed = parseStreamUrl(currentUrl);
              return (
                <div>
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    hearthis.at / Mixcloud / SoundCloud
                  </label>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    Los empresarios escucharán tus sesiones directamente desde tu ficha.
                  </p>
                  <div className="flex gap-2 mb-2">
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
                    {currentUrl && (
                      <button type="button" onClick={() => setAudioUrl('')}
                        className="px-3 rounded-lg flex items-center"
                        style={{ background: 'rgba(255,85,85,0.08)', border: '1px solid rgba(255,85,85,0.2)', color: '#ff5555' }}
                        title="Eliminar">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {parsed ? (
                    <>
                      <p className="text-xs font-bold mb-2" style={{ color: '#22c55e' }}>
                        ✓ {parsed.type} detectado — preview:
                      </p>
                      <iframe
                        src={parsed.embedUrl}
                        title={`Preview de audio — ${parsed.type}`}
                        className="w-full rounded-lg"
                        style={{ height: 160, border: 'none' }}
                        allow="autoplay"
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                      />
                    </>
                  ) : currentUrl ? (
                    <p className="text-xs" style={{ color: '#ff5f56' }}>URL no reconocida. Prueba con hearthis.at, Mixcloud o SoundCloud.</p>
                  ) : null}
                </div>
              );
            })()}
          </div>

          {/* Export ZIP - GDPR */}
          <div className="glass-panel p-5 flex items-center justify-between gap-4"
            style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Download size={15} style={{ color: '#D4AF37' }} /> Exportar mis datos
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Descarga un ZIP con tu perfil, bookings, favoritos y conversaciones (RGPD Art. 20).
              </p>
            </div>
            <button
              onClick={() => user && exportUserDataZip(user)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Download size={13} /> Descargar ZIP
            </button>
          </div>

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
          <div className="glass-panel p-5">
            <h4 className="text-base font-bold mb-4">Valoraciones</h4>
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <Star size={20} style={{ color: 'rgba(212,175,55,0.25)' }} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Sin valoraciones aún</p>
                <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                  Los empresarios podrán valorar tu trabajo tras completar un booking contigo.
                </p>
              </div>
            </div>
          </div>

          {/* Mi Tienda */}
          {profile.role !== 'empresario' && (
            <div className="glass-panel overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.18)' }}>
              {/* Header — always visible, clickable */}
              <button
                type="button"
                onClick={() => setShopOpen(o => !o)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <ShoppingBag size={16} style={{ color: '#D4AF37' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold">Mi Tienda</h4>
                      <span className="text-[0.7rem] px-1.5 py-0.5 rounded font-bold"
                        style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>PRÓXIMAMENTE</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Vende samples, sesiones y merch desde tu perfil</p>
                  </div>
                </div>
                <ChevronDown size={16} style={{ color: '#8E8EA0', transform: shopOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Expandible content */}
              {shopOpen && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                  {/* Locked notice */}
                  <div className="flex items-center gap-2 py-3 mb-4">
                    <Lock size={13} style={{ color: '#8E8EA0' }} />
                    <p className="text-xs text-muted-foreground">
                      Activa tu plan <strong className="text-white">Starter o superior</strong> para empezar a vender. Comisión XPEAK: <strong className="text-white">10%</strong>.
                    </p>
                  </div>

                  {/* Product categories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {[
                      {
                        icon: Music,
                        label: 'Packs de Samples',
                        desc: 'Loops, one-shots, stems WAV/MP3. Descarga instantánea.',
                        example: 'Ejemplo: Tech House Bundle €9.99',
                        color: '#4285F4',
                      },
                      {
                        icon: Star,
                        label: 'Sesiones Privadas',
                        desc: 'Reserva de sesiones 1:1, clases o sets a medida.',
                        example: 'Ejemplo: Clase de producción 1h €49',
                        color: '#D4AF37',
                      },
                      {
                        icon: Shirt,
                        label: 'Merchandising',
                        desc: 'Camisetas, vinilos, prints. Gestión de stock propia.',
                        example: 'Ejemplo: Hoodie edición limitada €35',
                        color: '#F9A8D4',
                      },
                      {
                        icon: Sparkles,
                        label: 'Contenido Fan Club',
                        desc: 'Exclusivos para tus suscriptores Fan y VIP.',
                        example: 'Ejemplo: Set completo festival €4.99',
                        color: '#A78BFA',
                      },
                    ].map(item => (
                      <div key={item.label} className="rounded-xl p-4 flex flex-col gap-2"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-2">
                          <item.icon size={14} style={{ color: item.color }} />
                          <p className="text-xs font-bold">{item.label}</p>
                        </div>
                        <p className="text-[0.72rem] text-muted-foreground leading-relaxed">{item.desc}</p>
                        <p className="text-[0.7rem] font-medium" style={{ color: item.color }}>{item.example}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add product CTA — disabled */}
                  <div className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-7 gap-2 opacity-40 cursor-not-allowed"
                    style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.02)' }}>
                    <Plus size={20} style={{ color: '#D4AF37' }} />
                    <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>Añadir producto</p>
                    <p className="text-[0.7rem] text-muted-foreground">Disponible con plan de pago</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {profile.role !== 'empresario' && <VerificationSection />}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
