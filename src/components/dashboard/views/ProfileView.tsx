import { useState, useRef, useEffect } from 'react';
import { Trash2, Camera, Star, Radio, ChevronDown, X, Download, ShoppingBag, Plus, Package, Tag, Image as ImageIcon, Music, Shirt, Sparkles, FileEdit, Copy, Check, Share2 } from 'lucide-react';
import NightlifeSelect from '@/components/ui/NightlifeSelect';
import { exportUserDataZip } from '@/lib/exportUserData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AudioUpload from '@/components/dashboard/AudioUpload';
import { compressImage, MAX_RAW_IMAGE_MB } from '@/lib/image';
import PortfolioUpload from '@/components/dashboard/PortfolioUpload';
import { sanitizeInput } from '@/lib/contentFilter';
import { DEFAULT_ZONE } from '@/lib/constants';

const ProfileView = ({ onNavigate }: { onNavigate?: (view: string) => void } = {}) => {
  const { user } = useAuth();
  const profile = useProfile();
  const [deleting, setDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [localName, setLocalName] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [rider, setRider] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[] | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [sideStats, setSideStats] = useState<{ bookings: number | null; messages: number | null }>({ bookings: null, messages: null });
  const [copied, setCopied] = useState(false);

  const rawPhoto = profile.photo_url;
  const photoUrl = rawPhoto && rawPhoto.trim().length > 5 && !rawPhoto.endsWith("''") ? rawPhoto : null;

  // Profile completeness
  const completenessSteps = (() => {
    const steps: { label: string; done: boolean; hint: string }[] = [
      { label: 'Foto de perfil', done: !!photoUrl || !!profile.photo_url, hint: 'Añade una foto para generar más confianza.' },
      { label: 'Bio', done: !!(profile.bio && profile.bio.trim().length > 20), hint: 'Escribe al menos una frase sobre ti.' },
      { label: 'Ciudad', done: !!(profile.zone && profile.zone !== DEFAULT_ZONE), hint: 'Elige tu ciudad para aparecer en búsquedas locales.' },
      { label: 'Especialidad', done: !!(profile.specialty && profile.specialty.trim().length > 0), hint: 'Añade tus géneros o especialidades.' },
      { label: 'Instagram', done: !!(profile.instagram && profile.instagram.trim().length > 0), hint: 'Enlaza tu Instagram para que te contacten.' },
      ...(profile.role === 'dj' || profile.role === 'rookie' ? [
        { label: 'Mix / Audio', done: !!(profile.audio_embed_url && (profile.audio_embed_url as string).trim().length > 0), hint: 'Añade un enlace a tu mix o sesión.' },
      ] : profile.role !== 'empresario' ? [
        { label: 'Portfolio', done: !!(profile.portfolio_urls && profile.portfolio_urls.length > 0), hint: 'Sube fotos o un vídeo corto de tu trabajo.' },
      ] : []),
    ];
    const done = steps.filter(s => s.done).length;
    return { steps, percent: Math.round((done / steps.length) * 100) };
  })();

  const EU_LANGS = ['Español','Inglés','Francés','Italiano','Alemán','Portugués','Neerlandés','Polaco','Catalán','Euskera'];
  const SPAIN_CITIES = ['Madrid','Barcelona','Valencia','Sevilla','Zaragoza','Málaga','Murcia','Palma de Mallorca','Alicante','Bilbao','Valladolid','Córdoba','Vigo','Gijón','Granada','A Coruña','Vitoria-Gasteiz','San Sebastián','Oviedo','Las Palmas de Gran Canaria','Santa Cruz de Tenerife','Badalona','Cartagena','Sabadell','Móstoles','Elche','Hospitalet de Llobregat','Terrassa','Jerez de la Frontera','Burgos','Santander','Almería','Alcalá de Henares','Pamplona','Salamanca','Ibiza','Marbella','León','Albacete','Logroño','Huelva','Tarragona','Lleida','Badajoz','Jaén','Cádiz','Toledo','Torrevieja','Mataró','Alcobendas'];

  const ROLE_TAGS: Record<string, { label: string; tags: string[] }> = {
    dj:        { label: 'Géneros musicales',    tags: ['Tech House','Deep House','House','Afro House','Organic House','Funky House','Tribal House','Progressive House','Latin House','Techno','Melodic Techno','Minimal','Hard Techno','Industrial','Dub Techno','Trance','Progressive Trance','Psytrance','Drum & Bass','Dubstep','Jungle','UK Garage','Breakbeat','Reggaetón','Dembow','Moombahton','Dancehall','R&B','Hip Hop','Trap','Afrobeats','Amapiano','Comercial','Top 40','Hits actuales','Remember','Pachanga','Disco','Nu-Disco','Funk','Electro','Synthwave','Ambient','Downtempo','Chillout','Hardstyle','Hardcore','EDM'] },
    rookie:    { label: 'Géneros musicales',    tags: ['Tech House','Deep House','House','Afro House','Techno','Melodic Techno','Minimal','Hard Techno','Trance','Drum & Bass','Reggaetón','Dembow','Moombahton','Hip Hop','Trap','Comercial','Top 40','Hits actuales','Remember','Pachanga','Disco','Nu-Disco','Funk','EDM'] },
    staff:         { label: 'Especialidades',         tags: ['Azafata','RRPP','Promotor','Camarero/a','Relaciones Públicas','Animación','Hostess','Sala VIP','Control de acceso','Taquilla','Chill-out','Bottle service','Coordinación'] },
    event_manager: { label: 'Áreas de coordinación', tags: ['Coordinación general','Producción de eventos','Montaje y decoración','Catering','Staff externo','Protocolo','Gestión de artistas','Logística','Presupuestos','Eventos corporativos','Bodas','Festivales','Clubbing','Outdoor'] },
    makeup:    { label: 'Servicios',             tags: ['Maquillaje nupcial','Caracterización','Maquillaje artístico','Estilismo','Nail art','Aerógrafo','Efectos especiales','Maquillaje masculino','Novias','Pasarela','Producción'] },
    peluqueria:{ label: 'Servicios',             tags: ['Peluquería a domicilio','Peinado de novia','Recogidos','Corte','Color','Extensiones','Alisado','Tratamientos capilares','Peluquería infantil','Eventos','Día a día'] },
    media:     { label: 'Especialidades',        tags: ['Fotografía de eventos','Vídeo','Reels & Contenido','Fotografía de DJ','Drone','Cobertura en directo','Fotografía de sala','Retrato','Edición de vídeo','Color grading','Motion graphics','Podcast'] },
    design:    { label: 'Especialidades',        tags: ['Diseño gráfico','VJing','Mapping','LED wall','Visuales en vivo','Cartelería','Branding','Redes sociales','Ilustración','3D','Motion design'] },
    promotor:  { label: 'Especialidades',        tags: ['Festivales','Clubs nocturnos','Eventos privados','Bodas','Corporativo','After','Terraza','Sala pequeña','Sala grande','Residencias','Giras'] },
  };

  const roleTagConfig = ROLE_TAGS[profile.role ?? ''];
  const [selectedGenres, setSelectedGenres] = useState<string[] | null>(null);
  const [genreOpen, setGenreOpen] = useState(false);
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
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [bookingsRes, convsRes] = await Promise.all([
        supabase.from('flash_bookings' as any).select('id', { count: 'exact', head: true }).eq('professional_user_id', user.id),
        supabase.from('conversations').select('id').or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`).limit(50),
      ]);
      const convIds = ((convsRes.data ?? []) as { id: string }[]).map(c => c.id);
      let msgCount = 0;
      if (convIds.length > 0) {
        const { count } = await supabase.from('messages').select('id', { count: 'exact', head: true }).in('conversation_id', convIds).neq('sender_id', user.id);
        msgCount = count ?? 0;
      }
      setSideStats({ bookings: bookingsRes.count ?? 0, messages: msgCount });
    })();
  }, [user]);

  const photoRef = useRef<HTMLInputElement>(null);

  const displayName = localName ?? profile.display_name;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten archivos de imagen.'); return; }
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) { toast.error('Formato no permitido. Usa JPG, PNG, WebP o GIF.'); return; }
    if (file.size > MAX_RAW_IMAGE_MB * 1024 * 1024) { toast.error(`Máximo ${MAX_RAW_IMAGE_MB}MB`); return; }

    const compressed = await compressImage(file);
    const safeName = compressed.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${user.id}/photo-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, compressed);
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
          <p className="text-base text-muted-foreground">
            {profile.role === 'empresario' ? 'Gestiona tu información de empresa.' : 'Así te ven los empresarios.'}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('ficha')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs transition-all hover:scale-105"
              style={{ background: 'rgba(66,133,244,0.12)', border: '1px solid rgba(66,133,244,0.35)', color: '#4285F4' }}>
              <FileEdit size={13} /> <span className="hidden sm:inline">Editar</span> Ficha
            </button>
          )}
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 rounded-lg font-bold text-sm flex-1 sm:flex-none disabled:opacity-60"
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
            <p className="text-xs text-muted-foreground mt-2 mb-1">Sin valoraciones aún</p>
          </div>
          {/* — Completitud del perfil — */}
          {completenessSteps.percent < 100 && (
            <div className="glass-panel p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.7)' }}>Perfil completo</span>
                <span className="text-sm font-black" style={{ color: completenessSteps.percent >= 80 ? '#22c55e' : completenessSteps.percent >= 50 ? '#D4AF37' : '#ff5f56' }}>
                  {completenessSteps.percent}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full mb-3" style={{ background: 'rgba(0,0,0,0.05)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completenessSteps.percent}%`,
                    background: completenessSteps.percent >= 80 ? '#22c55e' : completenessSteps.percent >= 50 ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : '#ff5f56',
                  }} />
              </div>
              <div className="flex flex-col gap-1.5">
                {completenessSteps.steps.filter(s => !s.done).slice(0, 3).map(s => (
                  <div key={s.label} className="flex items-start gap-2">
                    <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.09)' }}>
                      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.1)' }} />
                    </div>
                    <div>
                      <p className="text-[0.7rem] font-bold leading-tight">{s.label}</p>
                      <p className="text-[0.65rem] text-muted-foreground leading-tight">{s.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[0.65rem] font-bold mt-3 pt-2.5" style={{ color: '#8A6D0F', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
                ⚡ Los perfiles completos salen primero en el directorio
              </p>
            </div>
          )}

          <div className="glass-panel p-4">
            {([
              ['Bookings 2026', sideStats.bookings === null ? '—' : String(sideStats.bookings)],
              ['Visitas perfil', String(profile.score ?? 0)],
              ['Mensajes recibidos', sideStats.messages === null ? '—' : String(sideStats.messages)],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 text-sm" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold" style={{ color: v === '0' || v === '—' ? '#333' : 'inherit' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* — Compartir perfil — */}
          {user && (
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2 mb-3">
                <Share2 size={13} style={{ color: '#8A6D0F' }} />
                <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.7)' }}>Comparte tu perfil</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 px-3 py-2 rounded-lg text-[0.7rem] font-mono truncate"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#3d3d4e' }}>
                  xpeak.es/p/{user.id.slice(0, 8)}…
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const url = `https://xpeak.es/p/${user.id}`;
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-2 rounded-lg flex items-center gap-1.5 text-[0.7rem] font-bold flex-shrink-0 transition-all"
                  style={{
                    background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(212,175,55,0.08)',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(212,175,55,0.2)'}`,
                    color: copied ? '#22c55e' : '#D4AF37',
                  }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Mi perfil en XPEAK: https://xpeak.es/p/${user.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[0.7rem] font-bold transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25D366' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const url = `https://xpeak.es/p/${user.id}`;
                    if (navigator.share) {
                      navigator.share({ title: `${displayName || 'Mi perfil'} en XPEAK`, url });
                    } else {
                      navigator.clipboard.writeText(url).then(() => {
                        toast.success('Enlace copiado al portapapeles');
                      }).catch(() => {
                        toast.info(url);
                      });
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[0.7rem] font-bold transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(225,48,108,0.08)', border: '1px solid rgba(225,48,108,0.2)', color: '#E1306C' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  Instagram
                </button>
              </div>
            </div>
          )}

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
                border: `1px solid ${(isAvailable ?? profile.is_flash_active) ? 'rgba(34,197,94,0.35)' : 'rgba(0,0,0,0.05)'}`,
                background: (isAvailable ?? profile.is_flash_active) ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                opacity: savingAvailability ? 0.7 : 1,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Radio size={15} style={{ color: (isAvailable ?? profile.is_flash_active) ? '#22c55e' : '#333' }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: (isAvailable ?? profile.is_flash_active) ? '#22c55e' : '#333' }}>
                      {savingAvailability ? 'Guardando...' : (isAvailable ?? profile.is_flash_active) ? 'Disponible ahora' : 'No disponible'}
                    </p>
                    <p className="text-[0.75rem] text-muted-foreground">Visible en Flash Booking y directorio</p>
                  </div>
                </div>
                <div className="relative w-10 h-5 rounded-full flex-shrink-0"
                  style={{ background: (isAvailable ?? profile.is_flash_active) ? '#22c55e' : 'rgba(0,0,0,0.08)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                    style={{ left: (isAvailable ?? profile.is_flash_active) ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
                </div>
              </div>
            </button>
          )}

        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5">
            <h4 className="text-base font-bold mb-4">Información</h4>

            {/* — Identidad — */}
            <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Identidad</p>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                {(profile.role === 'dj' || profile.role === 'rookie') ? 'Nombre artístico' : 'Nombre profesional'}
              </label>
              <input type="text" value={displayName} onChange={e => setLocalName(e.target.value)} className="nightlife-input mt-1 text-base" />
            </div>
            <div className="mb-3">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: (!profile.role || profile.role === 'pending') ? '#D4AF37' : '#333' }}>
                Rol
                {(!profile.role || profile.role === 'pending') && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F' }}>Elige tu especialidad</span>
                )}
              </label>
              <NightlifeSelect
                className="mt-1"
                value={(!profile.role || profile.role === 'pending') ? '' : profile.role}
                onChange={async (newRole) => {
                  await profile.updateField({ role: newRole } as any);
                  toast.success('Rol actualizado. Recarga para ver los cambios.');
                }}
                options={[
                  { value: '',              label: 'Selecciona tu especialidad' },
                  { value: 'dj',            label: 'DJ / Artista / Productor' },
                  { value: 'rookie',         label: 'Artista Promesa' },
                  { value: 'staff',          label: 'Staff / Camarero / RRPP' },
                  { value: 'event_manager',  label: 'Encargada de Eventos' },
                  { value: 'promotor',       label: 'Promotor' },
                  { value: 'catering',       label: 'Catering / Cocina' },
                  { value: 'makeup',         label: 'Maquillaje' },
                  { value: 'peluqueria',     label: 'Peluquería a Domicilio' },
                  { value: 'media',          label: 'Foto & Vídeo' },
                  { value: 'empresario',     label: 'Empresario / Sala' },
                ]}
                active
              />
            </div>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Ciudad</label>
              <NightlifeSelect
                className="mt-1"
                value={city || profile.zone?.replace(', España','') || ''}
                onChange={setCity}
                options={SPAIN_CITIES.map(c => ({ value: c, label: c }))}
                placeholder="Seleccionar ciudad"
                active={(city || profile.zone) ? true : false}
              />
            </div>
            {profile.role !== 'empresario' && (
              <div className="mb-3">
                <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  Caché / Tarifa por hora
                  <span className="ml-2 normal-case tracking-normal font-normal" style={{ color: '#333' }}>
                    — solo visible para empresarios
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
            <div className="mt-5 mb-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
              <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Habilidades</p>
            </div>
            {roleTagConfig && (
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
                      background: 'rgba(0,0,0,0.03)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      color: '#222',
                    }}
                  >
                    <span>{activeGenres.length > 0 ? `${activeGenres.length} seleccionado${activeGenres.length > 1 ? 's' : ''}` : 'Seleccionar...'}</span>
                    <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: genreOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  {/* Dropdown panel */}
                  {genreOpen && (() => {
                    const isDJ = profile.role === 'dj' || profile.role === 'rookie';
                    const DJ_GROUPS: { label: string; items: string[] }[] = [
                      { label: 'House', items: ['Tech House','Deep House','House','Afro House','Organic House','Funky House','Tribal House','Progressive House','Latin House'] },
                      { label: 'Techno', items: ['Techno','Melodic Techno','Minimal','Hard Techno','Industrial','Dub Techno'] },
                      { label: 'Trance & Psy', items: ['Trance','Progressive Trance','Psytrance'] },
                      { label: 'Bass Music', items: ['Drum & Bass','Dubstep','Jungle','UK Garage','Breakbeat'] },
                      { label: 'Urban & Latino', items: ['Reggaetón','Dembow','Moombahton','Dancehall','R&B','Hip Hop','Trap','Afrobeats','Amapiano'] },
                      { label: 'Comercial & Fiesta', items: ['Comercial','Top 40','Hits actuales','Remember','Pachanga'] },
                      { label: 'Disco & Funk', items: ['Disco','Nu-Disco','Funk','Electro','Synthwave'] },
                      { label: 'Chill & Ambiental', items: ['Ambient','Downtempo','Chillout'] },
                      { label: 'Hard & Rave', items: ['Hardstyle','Hardcore','EDM'] },
                    ];
                    const availableTags = new Set(roleTagConfig.tags);
                    const groups = isDJ ? DJ_GROUPS.map(g => ({ ...g, items: g.items.filter(i => availableTags.has(i)) })).filter(g => g.items.length > 0) : null;
                    return (
                    <div className="mt-1 rounded-xl overflow-hidden animate-[fadeIn_0.15s_ease]"
                      style={{ background: 'rgba(12,12,16,0.97)', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                      <div className="p-3 max-h-64 overflow-y-auto space-y-3"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
                        {groups ? groups.map(group => (
                          <div key={group.label}>
                            <p className="text-[0.6rem] font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(212,175,55,0.45)' }}>{group.label}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {group.items.map(g => (
                                <button key={g} type="button" onClick={() => toggleGenre(g)}
                                  className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                                  style={{
                                    background: activeGenres.includes(g) ? 'rgba(226,190,80,0.15)' : 'rgba(0,0,0,0.05)',
                                    border: `1px solid ${activeGenres.includes(g) ? 'rgba(226,190,80,0.4)' : 'rgba(0,0,0,0.06)'}`,
                                    color: activeGenres.includes(g) ? '#E2BE50' : '#333',
                                  }}>
                                  {g}
                                </button>
                              ))}
                            </div>
                          </div>
                        )) : roleTagConfig.tags.map(g => (
                          <button key={g} type="button" onClick={() => toggleGenre(g)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                            style={{
                              background: activeGenres.includes(g) ? 'rgba(226,190,80,0.15)' : 'rgba(0,0,0,0.05)',
                              border: `1px solid ${activeGenres.includes(g) ? 'rgba(226,190,80,0.4)' : 'rgba(0,0,0,0.06)'}`,
                              color: activeGenres.includes(g) ? '#E2BE50' : '#333',
                            }}>
                            {g}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <span className="text-xs text-muted-foreground">{activeGenres.length} seleccionados</span>
                        <button type="button" onClick={() => setGenreOpen(false)}
                          className="text-xs font-bold px-3 py-1 rounded-lg transition-all"
                          style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.2)' }}>
                          Cerrar
                        </button>
                      </div>
                    </div>
                    );
                  })()}
                </div>
            )}
            <div className="mb-3">
              {(() => {
                const isMusical = profile.role === 'dj' || profile.role === 'rookie';
                const label = isMusical ? 'Rider Técnico' : profile.role === 'makeup' ? 'Marcas / Productos' : profile.role === 'peluqueria' ? 'Servicios / Técnicas' : profile.role === 'media' ? 'Equipo técnico' : profile.role === 'event_manager' ? 'Servicios de coordinación' : 'Especialidad';
                const placeholder = isMusical
                  ? 'Ej: Pioneer CDJ-3000 + DJM-900NXS2. Mesa propia (si no hay Pioneer). 2 enchufes cerca de la cabina. Monitoreo lateral obligatorio.'
                  : profile.role === 'media' ? 'Ej: Sony A7 III + DJI Ronin SC. Entrego en 48h. Incluye edición y color grading.'
                  : profile.role === 'makeup' ? 'Ej: MAC, NARS, Charlotte Tilbury. Traigo maletín completo. Necesito mesa con espejo y luz natural.'
                  : profile.role === 'peluqueria' ? 'Ej: Peluquería a domicilio. Corte, color, peinados de novia y recogidos. Traigo todo el material necesario.'
                  : profile.role === 'event_manager' ? 'Ej: Coordinación integral de eventos. Gestión de artistas, catering, montaje y protocolo. Disponible en toda España.'
                  : 'Describe tu especialidad y requisitos...';
                const PRESETS: Record<string, string[]> = {
                  dj:     ['CDJ-3000 + DJM-900NXS2', 'Mesa propia', '2 enchufes', 'Monitor lateral', 'Rider estándar Pioneer', 'Necesita backline', 'Acepta Serato', 'Acepta Traktor'],
                  rookie: ['CDJ-3000 + DJM-900NXS2', 'Mesa propia', '2 enchufes', 'Monitor lateral', 'Controlador propio'],
                  makeup: ['Traigo maletín', 'Necesita espejo con luz', 'Solo marcas premium', 'Acepta prueba previa', 'Trabaja en equipo'],
                  peluqueria: ['Peluquería a domicilio', 'Peinado de novia', 'Traigo todo el material', 'Acepta prueba previa', 'Corte y color'],
                  media:  ['Cámara Sony A7', 'Drone DJI', 'Entrega 48h', 'Incluye edición', 'Raw disponible', 'Drone incluido'],
                  staff:         ['Traje propio', 'Acreditación de sala', 'Idiomas: EN/FR', 'Experiencia VIP', 'Uniforme de sala'],
                  event_manager: ['Coordinación integral', 'Presupuesto detallado', 'Gestión de proveedores', 'On-site el día del evento', 'Experiencia en bodas', 'Experiencia en festivales'],
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
                      {profile.role === 'empresario'
                        ? 'Describe tu tipo de sala, aforo y eventos que organizas. Ayuda a los profesionales a entender tu negocio.'
                        : 'Los empresarios y técnicos de sonido verán esto. Sé específico — ahorra emails.'}
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
            <div className="mt-5 mb-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
              <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Sobre ti</p>
            </div>
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Bio</label>
              <textarea rows={2} value={bio ?? profile.bio ?? ''}
                onChange={e => setBio(e.target.value)}
                placeholder={profile.role === 'empresario' ? 'Describe tu sala, el tipo de eventos que organizas y tu ambiente...' : 'Describe tu experiencia y estilo...'}
                className="nightlife-input mt-1 text-base resize-y" />
            </div>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
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
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  color: '#222',
                }}
              >
                <span>{activeLangs.length > 0 ? `${activeLangs.length} seleccionado${activeLangs.length > 1 ? 's' : ''}` : 'Seleccionar...'}</span>
                <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: langOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {/* Dropdown panel */}
              {langOpen && (
                <div className="mt-1 rounded-xl overflow-hidden animate-[fadeIn_0.15s_ease]"
                  style={{ background: 'rgba(12,12,16,0.97)', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                  <div className="flex flex-wrap gap-1.5 p-3 max-h-48 overflow-y-auto"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
                    {EU_LANGS.map(lang => (
                      <button key={lang} type="button" onClick={() => toggleLang(lang)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                        style={{
                          background: activeLangs.includes(lang) ? 'rgba(226,190,80,0.15)' : 'rgba(0,0,0,0.05)',
                          border: `1px solid ${activeLangs.includes(lang) ? 'rgba(226,190,80,0.4)' : 'rgba(0,0,0,0.06)'}`,
                          color: activeLangs.includes(lang) ? '#E2BE50' : '#333',
                        }}>
                        {lang}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <span className="text-xs text-muted-foreground">{activeLangs.length} seleccionados</span>
                    <button type="button" onClick={() => setLangOpen(false)}
                      className="text-xs font-bold px-3 py-1 rounded-lg transition-all"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.2)' }}>
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {(profile.role === 'dj' || profile.role === 'rookie') && <AudioUpload legacyEmbedUrl={profile.audio_embed_url} onMigrated={() => profile.updateField({ audio_embed_url: null })} />}
          {profile.role !== 'dj' && profile.role !== 'rookie' && profile.role !== 'empresario' && <PortfolioUpload />}

          {/* Export ZIP - GDPR */}
          <div className="glass-panel p-5 flex items-center justify-between gap-4"
            style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Download size={15} style={{ color: '#8A6D0F' }} /> Exportar mis datos
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
            {deleteStep === 0 && (
              <button onClick={() => setDeleteStep(1)} disabled={deleting}
                className="w-full py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                style={{ background: 'rgba(255,95,86,0.06)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.15)' }}>
                Eliminar todo mi contenido multimedia
              </button>
            )}
            {deleteStep === 1 && (
              <div className="rounded-lg p-4" style={{ background: 'rgba(255,95,86,0.06)', border: '1px solid rgba(255,95,86,0.2)' }}>
                <p className="text-xs font-bold mb-3" style={{ color: '#ff5f56' }}>¿Seguro? Se eliminarán TODOS tus archivos multimedia de forma permanente.</p>
                <div className="flex gap-2">
                  <button onClick={() => setDeleteStep(0)}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#222' }}>
                    Cancelar
                  </button>
                  <button onClick={() => setDeleteStep(2)}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{ background: 'rgba(255,95,86,0.15)', border: '1px solid rgba(255,95,86,0.3)', color: '#ff5f56' }}>
                    Continuar →
                  </button>
                </div>
              </div>
            )}
            {deleteStep === 2 && (
              <div className="rounded-lg p-4" style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.35)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#ff5f56' }}>⚠ CONFIRMACIÓN FINAL — acción irreversible</p>
                <p className="text-xs mb-3" style={{ color: '#333' }}>No podrás recuperar ningún archivo después de esto.</p>
                <div className="flex gap-2">
                  <button onClick={() => setDeleteStep(0)}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#222' }}>
                    Cancelar
                  </button>
                  <button onClick={() => { setDeleteStep(0); handleDeleteMedia(); }} disabled={deleting}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                    style={{ background: 'rgba(255,95,86,0.2)', border: '1px solid rgba(255,95,86,0.5)', color: '#ff5f56' }}>
                    {deleting ? 'Eliminando...' : 'Eliminar definitivamente'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="glass-panel p-5">
            <h4 className="text-base font-bold mb-4">Valoraciones</h4>
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <Star size={20} style={{ color: 'rgba(212,175,55,0.25)' }} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold mb-1" style={{ color: '#333' }}>Sin valoraciones aún</p>
                <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                  {profile.role === 'empresario'
                    ? 'Los profesionales podrán valorar tu sala tras completar un booking contigo.'
                    : 'Los empresarios podrán valorar tu trabajo tras completar un booking contigo.'}
                </p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ProfileView;
