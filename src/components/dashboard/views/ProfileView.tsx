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
import { DEFAULT_ZONE, DJ_GENRES } from '@/lib/constants';

const ProfileView = ({ onNavigate }: { onNavigate?: (view: string) => void } = {}) => {
  const { user } = useAuth();
  const profile = useProfile();
  const [deleting, setDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [localName, setLocalName] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [showMore, setShowMore] = useState(false); // "Más detalles (opcional)" plegado por defecto
  const [rider, setRider] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [instagram, setInstagram] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[] | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[] | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [sideStats, setSideStats] = useState<{ bookings: number | null; messages: number | null }>({ bookings: null, messages: null });
  const [copied, setCopied] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [referralIsNew] = useState(() => !localStorage.getItem('xpeak_referral_seen'));
  const [rewardedReferrals, setRewardedReferrals] = useState<number | null>(null);
  const [offersClasses, setOffersClasses] = useState<boolean | null>(null);
  const [classStyles, setClassStyles] = useState<string[] | null>(null);
  const [classPrice, setClassPrice] = useState<string | null>(null);
  const [seekingPartner, setSeekingPartner] = useState<boolean | null>(null);
  const [danceLevel, setDanceLevel] = useState<string | null>(null);
  const [danceRole, setDanceRole] = useState<string | null>(null);

  const rawPhoto = profile.photo_url;
  const photoUrl = rawPhoto && rawPhoto.trim().length > 5 && !rawPhoto.endsWith("''") ? rawPhoto : null;

  // Profile completeness
  const completenessSteps = (() => {
    const steps: { label: string; done: boolean; hint: string }[] = [
      { label: 'Foto de perfil', done: !!photoUrl || !!profile.photo_url, hint: 'Añade una foto para generar más confianza.' },
      { label: 'Bio', done: !!(profile.bio && profile.bio.trim().length > 20), hint: 'Escribe al menos una frase sobre ti.' },
      { label: 'Ciudad', done: !!(profile.zone && profile.zone !== DEFAULT_ZONE), hint: 'Elige tu ciudad para aparecer en búsquedas locales.' },
      // "Especialidad" solo para profesionales: al empresario se le contaba en
      // el % de perfil completo aunque su control (roleTagConfig) no existe
      // para su rol, así que no tenía forma directa de completarlo.
      ...(profile.role !== 'empresario' ? [
        { label: 'Especialidad', done: !!(profile.specialty && profile.specialty.trim().length > 0), hint: 'Añade tus géneros o especialidades.' },
      ] : []),
      { label: 'Instagram', done: !!(profile.instagram && profile.instagram.trim().length > 0), hint: 'Enlaza tu Instagram para que te contacten.' },
      ...(profile.role === 'dj' ? [
        { label: 'Mix / Audio', done: !!(profile.audio_embed_url && (profile.audio_embed_url as string).trim().length > 0) || !!(profile.audio_session_urls && profile.audio_session_urls.length > 0), hint: 'Añade un enlace a tu mix o sesión.' },
      ] : profile.role !== 'empresario' ? [
        { label: 'Portfolio', done: !!(profile.portfolio_urls && profile.portfolio_urls.length > 0), hint: 'Sube fotos o un vídeo corto de tu trabajo.' },
      ] : []),
    ];
    const done = steps.filter(s => s.done).length;
    return { steps, percent: Math.round((done / steps.length) * 100) };
  })();

  const EU_LANGS = ['Español','Inglés','Francés','Italiano','Alemán','Portugués','Neerlandés','Polaco','Catalán','Euskera','Gallego'];
  // Provincia → ciudades. Flujo de 2 pasos (más ordenado que una lista larga).
  // Incluye Galicia completa (A Coruña, Lugo, Ourense, Pontevedra).
  const PROVINCIAS: Record<string, string[]> = {
    'A Coruña': ['A Coruña','Santiago de Compostela','Ferrol','Narón','Oleiros','Carballo'],
    'Álava': ['Vitoria-Gasteiz'],
    'Albacete': ['Albacete','Hellín','Villarrobledo'],
    'Alicante': ['Alicante','Elche','Torrevieja','Orihuela','Benidorm','Denia','Calpe','Jávea'],
    'Almería': ['Almería','Roquetas de Mar','El Ejido'],
    'Asturias': ['Oviedo','Gijón','Avilés','Langreo'],
    'Ávila': ['Ávila'],
    'Badajoz': ['Badajoz','Mérida','Don Benito'],
    'Baleares': ['Palma de Mallorca','Ibiza','Manacor','Mahón','Formentera'],
    'Barcelona': ['Barcelona','Badalona','Hospitalet de Llobregat','Terrassa','Sabadell','Mataró','Sitges','Manresa','Vilanova i la Geltrú'],
    'Bizkaia': ['Bilbao','Barakaldo','Getxo'],
    'Burgos': ['Burgos','Miranda de Ebro'],
    'Cáceres': ['Cáceres','Plasencia'],
    'Cádiz': ['Cádiz','Jerez de la Frontera','Algeciras','San Fernando','El Puerto de Santa María'],
    'Cantabria': ['Santander','Torrelavega'],
    'Castellón': ['Castellón de la Plana','Vila-real','Benicàssim'],
    'Ciudad Real': ['Ciudad Real','Puertollano'],
    'Córdoba': ['Córdoba','Lucena'],
    'Cuenca': ['Cuenca'],
    'Gipuzkoa': ['San Sebastián','Irún'],
    'Girona': ['Girona','Figueres','Lloret de Mar','Blanes'],
    'Granada': ['Granada','Motril'],
    'Guadalajara': ['Guadalajara'],
    'Huelva': ['Huelva'],
    'Huesca': ['Huesca','Jaca'],
    'Jaén': ['Jaén','Linares','Úbeda'],
    'León': ['León','Ponferrada'],
    'Lleida': ['Lleida'],
    'Lugo': ['Lugo','Monforte de Lemos','Viveiro'],
    'Madrid': ['Madrid','Móstoles','Alcalá de Henares','Alcobendas','Fuenlabrada','Leganés','Getafe','Alcorcón','Pozuelo de Alarcón','Las Rozas','Majadahonda'],
    'Málaga': ['Málaga','Marbella','Fuengirola','Torremolinos','Benalmádena','Estepona','Mijas'],
    'Murcia': ['Murcia','Cartagena','Lorca','Molina de Segura'],
    'Navarra': ['Pamplona','Tudela'],
    'Ourense': ['Ourense','O Barco de Valdeorras','Verín'],
    'Palencia': ['Palencia'],
    'Las Palmas': ['Las Palmas de Gran Canaria','Telde','Maspalomas'],
    'Pontevedra': ['Vigo','Pontevedra','Vilagarcía de Arousa','Sanxenxo','Marín'],
    'La Rioja': ['Logroño','Calahorra'],
    'Salamanca': ['Salamanca'],
    'Santa Cruz de Tenerife': ['Santa Cruz de Tenerife','San Cristóbal de La Laguna','Adeje','Arona'],
    'Segovia': ['Segovia'],
    'Sevilla': ['Sevilla','Dos Hermanas','Alcalá de Guadaíra','Utrera'],
    'Soria': ['Soria'],
    'Tarragona': ['Tarragona','Reus','Salou','Cambrils'],
    'Teruel': ['Teruel'],
    'Toledo': ['Toledo','Talavera de la Reina'],
    'Valencia': ['Valencia','Gandia','Torrent','Paterna','Sagunto'],
    'Valladolid': ['Valladolid'],
    'Zamora': ['Zamora'],
    'Zaragoza': ['Zaragoza','Calatayud'],
  };
  const PROVINCE_LIST = Object.keys(PROVINCIAS).sort((a, b) => a.localeCompare(b, 'es'));
  // Provincia actual: derivada de la ciudad ya guardada (para editar) o del estado.
  const savedCity = (city || profile.zone?.replace(', España', '') || '').trim();
  const provinceOfSaved = PROVINCE_LIST.find(p => PROVINCIAS[p].includes(savedCity)) ?? '';

  const ROLE_TAGS: Record<string, { label: string; tags: string[] }> = {
    dj:        { label: 'Géneros musicales',    tags: DJ_GENRES },
    // Musica en vivo: repertorio y formato, NO los generos de cabina de un DJ.
    // Una cantante que se registro con el rol equivocado acabo etiquetada como
    // "Remember, Comercial, Chillout" porque era lo unico que le encajaba
    // minimamente de la lista de DJ (caso Aurora, 2 sep 2026).
    'grupo-musical': { label: 'Repertorio y formato', tags: ['Pop español','Pop internacional','Rock','Versiones','Acústico','Voz y guitarra','Jazz','Bossa nova','Soul','Funk en vivo','Flamenco','Rumba','Copla','Boleros','Baladas','Música clásica','Góspel','Country','Indie','Cantautor','Ceremonia','Cóctel','Banda completa','Dúo','Trío'] },
    azafata:    { label: 'Especialidades', tags: ['Azafata de congresos','Azafata de imagen','Ferias y stands','Protocolo','Acreditaciones','Recepción','Bienvenida','Sala VIP','Promoción','Azafata de eventos deportivos','Traducción / idiomas','Reparto de merchandising'] },
    catering:   { label: 'Especialidades', tags: ['Catering de bodas','Cóctel','Banquete','Show cooking','Finger food','Barbacoa / brasa','Paellas','Cocina mediterránea','Cocina internacional','Menú vegano','Sin gluten','Food truck','Servicio de barra','Postres y repostería'] },
    humorista:  { label: 'Estilos', tags: ['Monólogo','Stand-up','Humor blanco','Humor negro','Improvisación','Humor musical','Parodia','Presentación de eventos','Humor corporativo','Bodas','Despedidas','Clubs de comedia'] },
    mago:       { label: 'Especialidades', tags: ['Magia de cerca','Magia de escenario','Mentalismo','Magia infantil','Magia cómica','Ilusionismo','Cartomagia','Magia de bodas','Walking magic','Grandes ilusiones'] },
    animador:   { label: 'Especialidades', tags: ['Animación infantil','Fiestas de cumpleaños','Hinchables','Pintacaras','Globoflexia','Talleres','Juegos','Espectáculo infantil','Bodas','Comuniones','Parques','Hoteles'] },
    payaso:     { label: 'Especialidades', tags: ['Payaso clásico','Clown','Circo','Malabares','Zancos','Espectáculo infantil','Cumpleaños','Comuniones','Ferias','Teatro de calle'] },
    speaker:    { label: 'Especialidades', tags: ['Presentador de eventos','Maestro de ceremonias','Locución','Speaker corporativo','Conferencias','Galas','Bodas','Deportivo','Voz en off','Presentación en inglés'] },
    vestuario:  { label: 'Servicios', tags: ['Estilismo','Vestuario de escena','Asesoría de imagen','Personal shopper','Alquiler de vestuario','Caracterización','Sastrería','Vestuario de novia','Producción de moda','Pasarela'] },
    camarero:   { label: 'Especialidades', tags: ['Camarero/a de sala','Barra','Coctelería','Bartender','Flair','Vinos','Café','Servicio de bodas','Catering','Banquetes','Bottle service','Terraza'] },
    'photo-booth': { label: 'Servicios', tags: ['Photocall','Cabina de fotos','Espejo mágico','360 booth','Impresión al momento','Atrezzo','GIFs','Libro de firmas','Bodas','Eventos corporativos'] },
    staff:         { label: 'Especialidades',         tags: ['Azafata','RRPP','Promotor','Camarero/a','Relaciones Públicas','Animación','Hostess','Sala VIP','Control de acceso','Taquilla','Chill-out','Bottle service','Coordinación'] },
    event_manager: { label: 'Áreas de coordinación', tags: ['Coordinación general','Producción de eventos','Montaje y decoración','Catering','Staff externo','Protocolo','Gestión de artistas','Logística','Presupuestos','Eventos corporativos','Bodas','Festivales','Clubbing','Outdoor'] },
    makeup:    { label: 'Servicios',             tags: ['Maquillaje nupcial','Caracterización','Maquillaje artístico','Estilismo','Nail art','Aerógrafo','Efectos especiales','Maquillaje masculino','Novias','Pasarela','Producción'] },
    peluqueria:{ label: 'Servicios',             tags: ['Peluquería a domicilio','Peinado de novia','Recogidos','Corte','Color','Extensiones','Alisado','Tratamientos capilares','Peluquería infantil','Eventos','Día a día'] },
    media:     { label: 'Especialidades',        tags: ['Fotografía de eventos','Vídeo','Reels & Contenido','Fotografía de DJ','Drone','Cobertura en directo','Fotografía de sala','Retrato','Edición de vídeo','Color grading','Motion graphics','Podcast'] },
    design:    { label: 'Especialidades',        tags: ['Diseño gráfico','VJing','Mapping','LED wall','Visuales en vivo','Cartelería','Branding','Redes sociales','Ilustración','3D','Motion design'] },
    promotor:  { label: 'Especialidades',        tags: ['Festivales','Clubs nocturnos','Eventos privados','Bodas','Corporativo','After','Terraza','Sala pequeña','Sala grande','Residencias','Giras'] },
    bailarin:  { label: 'Estilos de baile',       tags: ['Salsa','Salsa cubana','Salsa en línea','Bachata','Bachata sensual','Kizomba','Zouk','Merengue','Cha cha cha','Cumbia','Coreografía primer baile','Baile de exhibición','Danza urbana','Reguetón/Perreo intenso','Danza contemporánea'] },
  };

  const DANCE_CLASS_STYLES = ['Salsa','Bachata','Kizomba','Zouk','Merengue','Baile de boda / primer baile','Danza urbana'];

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

  const ROLE_OPTIONS: { value: string; label: string }[] = [
    { value: 'dj',            label: 'DJ / Artista / Productor' },
    { value: 'staff',         label: 'Camarero' },
    { value: 'azafata',       label: 'Azafata' },
    { value: 'event_manager', label: 'Encargada de Eventos' },
    { value: 'promotor',      label: 'Promotor' },
    { value: 'catering',      label: 'Catering / Cocina' },
    { value: 'makeup',        label: 'Maquillaje' },
    { value: 'peluqueria',    label: 'Peluquería a Domicilio' },
    { value: 'media',         label: 'Foto & Vídeo' },
    { value: 'empresario',    label: 'Empresario / Sala' },
    { value: 'bailarin',      label: 'Bailarín / Danza' },
    { value: 'mago',          label: 'Mago & Ilusionista' },
    { value: 'humorista',     label: 'Humorista & Monólogos' },
    { value: 'animador',      label: 'Payaso / Animador' },
    { value: 'speaker',       label: 'Speaker / Presentador' },
    { value: 'vestuario',     label: 'Estilista / Vestuario' },
    { value: 'design',        label: 'Diseño & Visuales' },
  ];
  const activeRoles = (selectedRoles ?? (profile.roles?.length ? profile.roles : (profile.role ? [profile.role] : [])))
    .filter(r => r && r !== 'pending');
  const toggleRole = (r: string) => {
    const next = activeRoles.includes(r) ? activeRoles.filter(x => x !== r) : [...activeRoles, r];
    if (next.length === 0) return;
    setSelectedRoles(next);
  };
  useEffect(() => {
    if (!referralIsNew) return;
    const t = setTimeout(() => localStorage.setItem('xpeak_referral_seen', '1'), 4000);
    return () => clearTimeout(t);
  }, [referralIsNew]);

  useEffect(() => {
    if (!user) return;
    supabase.from('referrals' as any)
      .select('id', { count: 'exact', head: true })
      .eq('inviter_user_id', user.id)
      .eq('rewarded', true)
      .then(({ count }) => setRewardedReferrals(typeof count === 'number' ? count : null));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [bookingsRes, convsRes] = await Promise.all([
        // El empresario es `created_by`, nunca `professional_user_id`: contando
        // solo esa columna su tarjeta mostraba 0 bookings aunque hubiera
        // contratado decenas. Mismo criterio que SettingsView.
        supabase.from('flash_bookings' as any).select('id', { count: 'exact', head: true }).or(`professional_user_id.eq.${user.id},created_by.eq.${user.id}`),
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
    if (!user || saving || profile.loading) return;
    const toCheck = [localName, bio, rider, instagram].filter(Boolean) as string[];
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
    if (instagram !== null) updates.instagram = instagram.trim().replace(/^@/, '') || null;
    if (selectedLangs !== null) updates.languages = selectedLangs;
    if (selectedGenres !== null) updates.genres = selectedGenres;
    if (selectedRoles !== null) { updates.roles = selectedRoles; updates.role = selectedRoles[0]; }
    if (offersClasses !== null) updates.offers_classes = offersClasses;
    if (classStyles !== null) updates.class_styles = classStyles;
    if (classPrice !== null) updates.class_price = classPrice.trim() === '' ? null : parseInt(classPrice) || 0;
    if (seekingPartner !== null) updates.seeking_dance_partner = seekingPartner;
    if (danceLevel !== null) updates.dance_level = danceLevel;
    if (danceRole !== null) updates.dance_role = danceRole;
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
          <button onClick={handleSave} disabled={saving || profile.loading}
            className="px-4 py-2 rounded-lg font-bold text-sm flex-1 sm:flex-none disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            {profile.loading ? 'Cargando...' : (saving ? 'Guardando...' : 'Guardar')}
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
              <p className="text-[0.65rem] text-muted-foreground mb-3">
                {profile.role === 'empresario'
                  ? 'Un perfil completo da confianza a los profesionales que reciben tus solicitudes — foto, bio y ciudad ayudan a que te respondan.'
                  : 'Los perfiles más completos aparecen antes en el directorio — foto, bio y portfolio suman posición real.'}
              </p>
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
                {profile.role === 'empresario'
                  ? '⚡ Un perfil completo consigue más respuestas de profesionales'
                  : '⚡ Los perfiles completos salen primero en el directorio'}
              </p>
            </div>
          )}

          <div className="glass-panel p-4">
            {([
              ['Bookings 2026', sideStats.bookings === null ? '—' : String(sideStats.bookings)],
              // `score` no existe en el perfil cargado: esto renderizaba siempre
              // un "0" con aspecto de dato real. Sin tracking de visitas, guion.
              ['Visitas perfil', '—'],
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
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: '#8A6D0F' }}>
                  <Copy size={13} />
                  Copiar enlace
                </button>
              </div>
            </div>
          )}

          {/* — Invita y gana prioridad — */}
          {user && profile.role !== 'empresario' && (
            <div className="glass-panel p-4" style={referralIsNew ? { border: '1px solid rgba(37,99,235,0.35)', boxShadow: '0 0 0 1px rgba(37,99,235,0.08)' } : undefined}>
              <div className="flex items-center gap-2 mb-1">
                <Star size={13} style={{ color: '#2563eb' }} />
                <span className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: '#2563eb' }}>Invita y gana prioridad</span>
                {referralIsNew && (
                  <span className="px-1.5 py-0.5 rounded-full text-[0.55rem] font-black uppercase" style={{ background: '#2563eb', color: '#fff' }}>
                    Nuevo
                  </span>
                )}
                {/* Solo se muestra con datos reales (>0) — con 0 invitados
                    completados, mostrar "0" desanimaría en vez de animar. */}
                {!!rewardedReferrals && rewardedReferrals > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full text-[0.6rem] font-black" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                    {rewardedReferrals} {rewardedReferrals === 1 ? 'invitado' : 'invitados'}
                  </span>
                )}
              </div>
              <p className="text-[0.72rem] mb-3" style={{ color: '#3d3d4e' }}>
                Cada profesional que invites y complete su perfil te da <strong style={{ color: 'inherit' }}>+6 meses</strong> de badge azul de prioridad — apareces antes en el directorio.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg text-[0.7rem] font-mono truncate"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: '#3d3d4e' }}>
                  xpeak.es/auth?ref={(profile as any).referral_code || '···'}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const code = (profile as any).referral_code;
                    if (!code) return;
                    await navigator.clipboard.writeText(`https://xpeak.es/auth?mode=register&ref=${code}`);
                    setReferralCopied(true);
                    setTimeout(() => setReferralCopied(false), 2000);
                  }}
                  disabled={!(profile as any).referral_code}
                  className="px-3 py-2 rounded-lg flex items-center gap-1.5 text-[0.7rem] font-bold flex-shrink-0 transition-all disabled:opacity-40"
                  style={{
                    background: referralCopied ? 'rgba(34,197,94,0.12)' : 'rgba(37,99,235,0.08)',
                    border: `1px solid ${referralCopied ? 'rgba(34,197,94,0.3)' : 'rgba(37,99,235,0.2)'}`,
                    color: referralCopied ? '#22c55e' : '#2563eb',
                  }}>
                  {referralCopied ? <Check size={12} /> : <Copy size={12} />}
                  {referralCopied ? 'Copiado' : 'Copiar'}
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
                {profile.role === 'empresario' ? 'Nombre de la empresa o sala'
                  : (profile.role === 'dj') ? 'Nombre artístico' : 'Nombre profesional'}
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
              <p className="text-[0.7rem] text-muted-foreground mb-1.5">Puedes elegir varias — aparecerás en el directorio de cada una.</p>

              {activeRoles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {activeRoles.map(r => (
                    <span key={r} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(226,190,80,0.12)', border: '1px solid rgba(226,190,80,0.35)', color: '#E2BE50' }}>
                      {ROLE_OPTIONS.find(o => o.value === r)?.label ?? r}
                      {activeRoles.length > 1 && (
                        <button type="button" onClick={() => toggleRole(r)} className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setRoleOpen(v => !v)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)', color: '#222' }}
              >
                <span>Añadir otro rol...</span>
                <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: roleOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {roleOpen && (
                <div className="mt-2 p-2 rounded-lg flex flex-wrap gap-1.5" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {ROLE_OPTIONS.map(o => {
                    const active = activeRoles.includes(o.value);
                    return (
                      <button key={o.value} type="button" onClick={() => toggleRole(o.value)}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all"
                        style={active
                          ? { background: 'rgba(226,190,80,0.15)', border: '1px solid rgba(226,190,80,0.4)', color: '#8A6D0F' }
                          : { background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)', color: '#444' }}>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Provincia</label>
                <NightlifeSelect
                  className="mt-1"
                  value={province || provinceOfSaved}
                  onChange={(p) => { setProvince(p); setCity(''); }}
                  options={PROVINCE_LIST.map(p => ({ value: p, label: p }))}
                  placeholder="Elige provincia"
                  active={!!(province || provinceOfSaved)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Ciudad</label>
                <NightlifeSelect
                  className="mt-1"
                  value={city || savedCity}
                  onChange={setCity}
                  options={(PROVINCIAS[province || provinceOfSaved] ?? []).map(c => ({ value: c, label: c }))}
                  placeholder={(province || provinceOfSaved) ? 'Elige ciudad' : 'Elige provincia primero'}
                  active={!!(city || savedCity)}
                />
              </div>
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
                <p className="text-xs mt-1.5" style={{ color: '#333' }}>
                  ¿Tu precio varía según el evento? Actívalo en Ajustes → Privacidad → "Mostrar tarifa en mi ficha".
                </p>
              </div>
            )}
            {/* — Más detalles (opcional): todo lo secundario plegado para que la
                ficha no abrume. Lo esencial (foto, nombre, ciudad, precio, bio)
                queda siempre visible arriba. — */}
            <button type="button" onClick={() => setShowMore(s => !s)}
              className="mt-5 w-full flex items-center justify-between py-3 px-1 transition-all"
              style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <span className="text-sm font-bold" style={{ color: '#8A6D0F' }}>
                {showMore ? 'Ocultar detalles' : 'Añadir más detalles (opcional)'}
              </span>
              <ChevronDown size={16} style={{ color: '#8A6D0F', transform: showMore ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {!showMore && (
              <p className="text-xs text-muted-foreground mb-2 px-1">Géneros, clases, rider técnico y más. Opcional — puedes completarlo luego.</p>
            )}
            <div style={{ display: showMore ? 'block' : 'none' }}>
            {/* — Habilidades — */}
            <div className="mt-2 mb-3">
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
                    const isDJ = profile.role === 'dj';
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
                                    background: activeGenres.includes(g) ? 'rgba(226,190,80,0.2)' : 'rgba(255,255,255,0.08)',
                                    border: `1px solid ${activeGenres.includes(g) ? 'rgba(226,190,80,0.5)' : 'rgba(255,255,255,0.15)'}`,
                                    color: activeGenres.includes(g) ? '#E2BE50' : 'rgba(255,255,255,0.85)',
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
                      <div className="flex items-center justify-between px-3 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{activeGenres.length} seleccionados</span>
                        <button type="button" onClick={() => setGenreOpen(false)}
                          className="text-xs font-bold px-3 py-1 rounded-lg transition-all"
                          style={{ background: 'rgba(212,175,55,0.2)', color: '#E2BE50', border: '1px solid rgba(212,175,55,0.4)' }}>
                          Cerrar
                        </button>
                      </div>
                    </div>
                    );
                  })()}
                </div>
            )}
            {profile.role === 'bailarin' && (
              <div className="mt-5 mb-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Clases particulares</p>
                <label className="flex items-center gap-2.5 mb-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={offersClasses ?? profile.offers_classes ?? false}
                    onChange={e => setOffersClasses(e.target.checked)}
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <span className="text-sm font-semibold" style={{ color: '#222' }}>Doy clases particulares de baile</span>
                </label>
                {(offersClasses ?? profile.offers_classes) && (
                  <>
                    <div className="mb-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Estilos que enseño</label>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {DANCE_CLASS_STYLES.map(s => {
                          const active = (classStyles ?? profile.class_styles ?? []).includes(s);
                          return (
                            <button key={s} type="button"
                              onClick={() => {
                                const current = classStyles ?? profile.class_styles ?? [];
                                setClassStyles(active ? current.filter(x => x !== s) : [...current, s]);
                              }}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                              style={{
                                background: active ? 'rgba(226,190,80,0.15)' : 'rgba(0,0,0,0.05)',
                                border: `1px solid ${active ? 'rgba(226,190,80,0.4)' : 'rgba(0,0,0,0.06)'}`,
                                color: active ? '#E2BE50' : '#333',
                              }}>
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Precio clase (€/hora)</label>
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                        <input
                          type="number"
                          min={0}
                          value={classPrice ?? profile.class_price ?? ''}
                          onChange={e => setClassPrice(e.target.value)}
                          placeholder="Ej: 30"
                          className="nightlife-input !pl-8 text-base"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="mt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  <p className="text-[0.75rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(212,175,55,0.4)' }}>Buscar pareja de baile</p>
                  <label className="flex items-center gap-2.5 mb-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={seekingPartner ?? profile.seeking_dance_partner ?? false}
                      onChange={e => setSeekingPartner(e.target.checked)}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    <span className="text-sm font-semibold" style={{ color: '#222' }}>Busco pareja de baile fija</span>
                  </label>
                  {(seekingPartner ?? profile.seeking_dance_partner) && (
                    <div className="mb-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Tu rol al bailar</label>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {[{ v: 'lead', l: 'Leader' }, { v: 'follow', l: 'Follower' }, { v: 'ambos', l: 'Ambos' }].map(r => {
                          const active = (danceRole ?? profile.dance_role) === r.v;
                          return (
                            <button key={r.v} type="button" onClick={() => setDanceRole(r.v)}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                              style={{
                                background: active ? 'rgba(226,190,80,0.15)' : 'rgba(0,0,0,0.05)',
                                border: `1px solid ${active ? 'rgba(226,190,80,0.4)' : 'rgba(0,0,0,0.06)'}`,
                                color: active ? '#E2BE50' : '#333',
                              }}>
                              {r.l}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {(seekingPartner ?? profile.seeking_dance_partner) && (
                    <div className="mb-1">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Nivel</label>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {['Principiante', 'Intermedio', 'Avanzado'].map(lvl => {
                          const active = (danceLevel ?? profile.dance_level) === lvl;
                          return (
                            <button key={lvl} type="button" onClick={() => setDanceLevel(lvl)}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
                              style={{
                                background: active ? 'rgba(226,190,80,0.15)' : 'rgba(0,0,0,0.05)',
                                border: `1px solid ${active ? 'rgba(226,190,80,0.4)' : 'rgba(0,0,0,0.06)'}`,
                                color: active ? '#E2BE50' : '#333',
                              }}>
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mb-3">
              {(() => {
                const isMusical = profile.role === 'dj';
                const label = isMusical ? 'Rider Técnico' : profile.role === 'makeup' ? 'Marcas / Productos' : profile.role === 'peluqueria' ? 'Servicios / Técnicas' : profile.role === 'media' ? 'Equipo técnico' : profile.role === 'event_manager' ? 'Servicios de coordinación' : (profile.role === 'staff' || profile.role === 'camarero') ? 'Servicios y equipamiento' : 'Especialidad';
                const placeholder = isMusical
                  ? 'Ej: Pioneer CDJ-3000 + DJM-900NXS2. Mesa propia (si no hay Pioneer). 2 enchufes cerca de la cabina. Monitoreo lateral obligatorio.'
                  : profile.role === 'media' ? 'Ej: Sony A7 III + DJI Ronin SC. Entrego en 48h. Incluye edición y color grading.'
                  : profile.role === 'makeup' ? 'Ej: MAC, NARS, Charlotte Tilbury. Traigo maletín completo. Necesito mesa con espejo y luz natural.'
                  : profile.role === 'peluqueria' ? 'Ej: Peluquería a domicilio. Corte, color, peinados de novia y recogidos. Traigo todo el material necesario.'
                  : profile.role === 'event_manager' ? 'Ej: Coordinación integral de eventos. Gestión de artistas, catering, montaje y protocolo. Disponible en toda España.'
                  : (profile.role === 'staff' || profile.role === 'camarero')
                    ? 'Ej: Camarero de sala y barra. Coctelería básica. Traje propio. Inglés fluido. Experiencia en bodas de 200+ invitados.'
                  : profile.role === 'catering'
                    ? 'Ej: Catering para bodas y eventos de empresa. Menú cerrado o buffet. Opciones veganas y sin gluten. Personal de sala incluido.'
                  : 'Describe tu especialidad y requisitos...';
                const PRESETS: Record<string, string[]> = {
                  dj:     ['CDJ-3000 + DJM-900NXS2', 'Mesa propia', '2 enchufes', 'Monitor lateral', 'Rider estándar Pioneer', 'Necesita backline', 'Acepta Serato', 'Acepta Traktor'],
                  rookie: ['CDJ-3000 + DJM-900NXS2', 'Mesa propia', '2 enchufes', 'Monitor lateral', 'Controlador propio'],
                  makeup: ['Traigo maletín', 'Necesita espejo con luz', 'Solo marcas premium', 'Acepta prueba previa', 'Trabaja en equipo'],
                  peluqueria: ['Peluquería a domicilio', 'Peinado de novia', 'Traigo todo el material', 'Acepta prueba previa', 'Corte y color'],
                  media:  ['Cámara Sony A7', 'Drone DJI', 'Entrega 48h', 'Incluye edición', 'Raw disponible', 'Drone incluido'],
                  // 'camarero' es el rol legacy equivalente a staff: sin esta
                  // entrada, esos perfiles no veian ningun chip ni ejemplo y
                  // rellenaban el campo con texto libre de motivacion.
                  staff:         ['Traje propio', 'Acreditación de sala', 'Idiomas: EN/FR', 'Experiencia VIP', 'Uniforme de sala'],
                  camarero:      ['Traje propio', 'Acreditación de sala', 'Idiomas: EN/FR', 'Experiencia VIP', 'Uniforme de sala', 'Coctelería'],
                  catering:      ['Menú cerrado', 'Buffet', 'Cocina en directo', 'Opciones veganas', 'Personal incluido'],
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
            </div>{/* fin colapsable "Más detalles" */}
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
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Instagram</label>
              <p className="text-xs text-muted-foreground mb-1">Ayuda a validar que eres real y da más confianza a quien te contrate.</p>
              <input value={instagram ?? profile.instagram ?? ''}
                onChange={e => setInstagram(e.target.value)}
                placeholder="tu_usuario (sin @)"
                className="nightlife-input mt-1 text-base" />
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
          {(profile.role === 'dj') && <AudioUpload legacyEmbedUrl={profile.audio_embed_url} onMigrated={() => profile.updateField({ audio_embed_url: null })} />}
          {profile.role !== 'dj' && profile.role !== 'empresario' && <PortfolioUpload />}

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
