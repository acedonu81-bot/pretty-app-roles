export interface Profile {
  id: number;
  name: string;
  role: 'dj' | 'staff' | 'makeup' | 'vestuario' | 'media' | 'design' | 'promotor' | 'ambassador';
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  zone: string;
  experience: string;
  price: number;
  priceUnit: string;
  avatar: string;
  gradient: string;
  badges: string[];
  description: string;
  phone: string;
  instagram: string;
  topWeekend: boolean;
  photo: string;
  subscriptionTier: 'free' | 'premium' | 'elite';
  isFlashActive: boolean;
  profileViews: number;
  contactClicks: number;
  streamUrl?: string;
  isLive?: boolean;
  category?: 'professional' | 'rookie';
  isPremium?: boolean;
  tiktok?: string;
  portfolioUrls?: string[];
}

const WA_MSG = encodeURIComponent('Hola, te he visto en NIGHTLIFE Madrid y me interesa tu perfil para un evento. ¿Hablamos?');
export const getWhatsAppLink = (phone: string) => `https://wa.me/${phone}?text=${WA_MSG}`;
export const getInstagramLink = (handle: string) => `https://instagram.com/${handle}`;
export const getPhoneLink = (phone: string) => `tel:+${phone}`;
export const getLocationLink = (zone: string) => `https://maps.google.com/?q=${encodeURIComponent(zone + ', Madrid')}`;

export const profiles: Profile[] = [
  // ═══════════════════ DJs (4) ═══════════════════
  { id: 1, name: 'Dani Tech', role: 'dj', specialty: 'Techno / Industrial', rating: 4.9, reviews: 218, location: 'Madrid', zone: 'Malasaña', experience: '8 años', price: 120, priceUnit: '/hora', avatar: 'DT', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Techno', 'Industrial', 'Modular Live'], description: 'DJ y productor de techno industrial con residencias en las mejores salas underground de Madrid.', phone: '34612345001', instagram: 'danitech_dj', topWeekend: true, photo: '', subscriptionTier: 'elite', isFlashActive: true, profileViews: 1247, contactClicks: 89, streamUrl: 'https://twitch.tv/danitech_dj', isLive: true, category: 'professional', isPremium: true },
  { id: 2, name: 'Luna Deep', role: 'dj', specialty: 'Deep House / Melodic', rating: 5.0, reviews: 312, location: 'Madrid', zone: 'Salamanca', experience: '11 años', price: 150, priceUnit: '/hora', avatar: 'LD', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)', badges: ['Deep House', 'Melodic', 'Vinyl Set'], description: 'Referente del deep house en Madrid. Sesiones melódicas con vinilo y producción propia.', phone: '34612345002', instagram: 'lunadeep_music', topWeekend: true, photo: '', subscriptionTier: 'elite', isFlashActive: true, profileViews: 2103, contactClicks: 156, category: 'professional', isPremium: true },
  { id: 3, name: 'MC Ráfaga', role: 'dj', specialty: 'Urbano / Reggaetón', rating: 4.7, reviews: 189, location: 'Madrid', zone: 'Malasaña', experience: '6 años', price: 60, priceUnit: '/hora', avatar: 'MR', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Urbano', 'Reggaetón', 'Latino Mix'], description: 'El DJ urbano más solicitado de la zona centro.', phone: '34612345003', instagram: 'mcrafaga_dj', topWeekend: false, photo: '', subscriptionTier: 'premium', isFlashActive: false, profileViews: 634, contactClicks: 42, category: 'rookie' },
  { id: 4, name: 'Sara Beats', role: 'dj', specialty: 'Comercial / Top Hits', rating: 4.8, reviews: 267, location: 'Madrid', zone: 'Salamanca', experience: '9 años', price: 80, priceUnit: '/hora', avatar: 'SB', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Comercial', 'Top 40', 'Bodas & Eventos'], description: 'DJ versátil con repertorio comercial para todo tipo de público.', phone: '34612345004', instagram: 'sarabeats_official', topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: true, profileViews: 412, contactClicks: 28, category: 'rookie' },

  // ═══════════════════ Staff (3) ═══════════════════
  { id: 5, name: 'Carla Vega', role: 'staff', specialty: 'Azafata VIP & Hostess', rating: 4.9, reviews: 154, location: 'Madrid', zone: 'Salamanca', experience: '5 años', price: 30, priceUnit: '/hora', avatar: 'CV', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Hostess VIP', 'Protocolo', 'Multilingüe EN/FR'], description: 'Azafata profesional con experiencia en clubs de alto standing.', phone: '34612345005', instagram: 'carlavega_hostess', topWeekend: false, photo: '', subscriptionTier: 'elite', isFlashActive: true, profileViews: 876, contactClicks: 67, category: 'professional', isPremium: true },
  { id: 6, name: 'Marcos Ríos', role: 'staff', specialty: 'Camarero VIP & Flair', rating: 4.8, reviews: 98, location: 'Madrid', zone: 'Malasaña', experience: '7 años', price: 22, priceUnit: '/hora', avatar: 'MR', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Flair Bartending', 'Coctelería VIP', 'Certificado WSET'], description: 'Barman con espectáculo. Coctelería molecular y flair para eventos exclusivos.', phone: '34612345006', instagram: 'marcosrios_bar', topWeekend: false, photo: '', subscriptionTier: 'premium', isFlashActive: false, profileViews: 523, contactClicks: 34, category: 'rookie' },
  { id: 7, name: 'Patricia Sanz', role: 'staff', specialty: 'RRPP & Relaciones Públicas', rating: 5.0, reviews: 201, location: 'Madrid', zone: 'Chamberí', experience: '10 años', price: 28, priceUnit: '/hora', avatar: 'PS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['RRPP Premium', 'Gestión Listas', 'Networking VIP'], description: 'La RRPP más conectada de Madrid.', phone: '34612345007', instagram: 'patriciasanz_rrpp', topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: true, profileViews: 345, contactClicks: 22, category: 'professional' },

  // ═══════════════════ Maquillaje (2) ═══════════════════
  { id: 8, name: 'Nadia Glamour', role: 'makeup', specialty: 'Maquillaje de Noche & FX', rating: 5.0, reviews: 245, location: 'Madrid', zone: 'Chueca', experience: '9 años', price: 0, priceUnit: '', avatar: 'NG', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)', badges: ['Noche Glam', 'FX Pro', 'Bodypaint UV'], description: 'Maquilladora artística especializada en looks de noche y efectos especiales.', phone: '34612345008', instagram: 'nadiaglamour_makeup', topWeekend: false, photo: '', subscriptionTier: 'elite', isFlashActive: false, profileViews: 1089, contactClicks: 78, category: 'professional', isPremium: true },
  { id: 9, name: 'Iván Stylez', role: 'makeup', specialty: 'Peluquería de Autor', rating: 4.9, reviews: 178, location: 'Madrid', zone: 'Chamberí', experience: '12 años', price: 0, priceUnit: '', avatar: 'IS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Color Expert', 'Extensiones', 'Peinado Evento'], description: 'Estilista capilar de autor con experiencia en desfiles y eventos nocturnos.', phone: '34612345009', instagram: 'ivanstylez_hair', topWeekend: false, photo: '', subscriptionTier: 'premium', isFlashActive: true, profileViews: 456, contactClicks: 31, category: 'rookie' },

  // ═══════════════════ Vestuario (2) ═══════════════════
  { id: 10, name: 'Alicia Moon', role: 'vestuario', specialty: 'Estilismo Integral Nocturno', rating: 4.8, reviews: 134, location: 'Madrid', zone: 'Chueca', experience: '7 años', price: 0, priceUnit: '', avatar: 'AM', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Styling Completo', 'Asesoría Imagen', 'Luxury Brands'], description: 'Servicio integral de imagen nocturna: vestuario, asesoría de estilo y personal shopping.', phone: '34612345010', instagram: 'aliciamoon_style', topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: false, profileViews: 289, contactClicks: 18, category: 'professional' },
  { id: 11, name: 'Diego Noir', role: 'vestuario', specialty: 'Moda Nocturna & Streetwear', rating: 4.7, reviews: 92, location: 'Madrid', zone: 'Malasaña', experience: '5 años', price: 0, priceUnit: '', avatar: 'DN', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Streetwear', 'Diseño Custom', 'Vintage'], description: 'Estilista de moda nocturna y streetwear. Diseño custom de outfits para artistas.', phone: '34612345011', instagram: 'diegonoir_fashion', topWeekend: false, photo: '', subscriptionTier: 'premium', isFlashActive: true, profileViews: 178, contactClicks: 12, category: 'rookie' },

  // ═══════════════════ Media & Contenido (3) ═══════════════════
  { id: 12, name: 'Carlos Flash', role: 'media', specialty: 'Fotografía de Eventos', rating: 4.9, reviews: 187, location: 'Madrid', zone: 'Centro', experience: '10 años', price: 0, priceUnit: '', avatar: 'CF', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Foto Nocturna', 'Reportaje', 'Canon R5'], description: 'Fotógrafo especializado en eventos nocturnos y fiestas. Entrega en 24h.', phone: '34612345012', instagram: 'carlosflash_photo', topWeekend: false, photo: '', subscriptionTier: 'elite', isFlashActive: true, profileViews: 934, contactClicks: 72, category: 'professional', isPremium: true },
  { id: 13, name: 'Marta Lens', role: 'media', specialty: 'Videógrafa / Aftermovies', rating: 5.0, reviews: 156, location: 'Madrid', zone: 'Salamanca', experience: '8 años', price: 0, priceUnit: '', avatar: 'ML', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)', badges: ['Aftermovie', '4K Cinema', 'Drone'], description: 'Aftermovies cinematográficos para salas y festivales. Equipo propio con drone y gimbal.', phone: '34612345013', instagram: 'martalens_video', topWeekend: false, photo: '', subscriptionTier: 'premium', isFlashActive: false, profileViews: 678, contactClicks: 54, category: 'professional' },
  { id: 14, name: 'Zoe Viral', role: 'media', specialty: 'Creadora de Contenido UGC/TikTok', rating: 4.8, reviews: 89, location: 'Madrid', zone: 'Malasaña', experience: '3 años', price: 0, priceUnit: '', avatar: 'ZV', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['TikTok', 'Reels', 'UGC Creator'], description: 'Creadora de contenido viral para clubs y eventos nocturnos. +200K seguidores.', phone: '34612345014', instagram: 'zoeviral_', topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: true, profileViews: 1456, contactClicks: 98, category: 'rookie', tiktok: 'zoeviral_' },

  // ═══════════════════ Diseño & Visuales (3) ═══════════════════
  { id: 15, name: 'Álex Neon', role: 'design', specialty: 'Identidad Visual / Flyers', rating: 4.9, reviews: 203, location: 'Madrid', zone: 'Lavapiés', experience: '9 años', price: 0, priceUnit: '', avatar: 'AN', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Flyers', 'Branding', 'Cartelería'], description: 'Diseñador gráfico especializado en identidad visual para salas y promotoras.', phone: '34612345015', instagram: 'alexneon_design', topWeekend: false, photo: '', subscriptionTier: 'elite', isFlashActive: true, profileViews: 812, contactClicks: 61, category: 'professional', isPremium: true },
  { id: 16, name: 'Paula Motion', role: 'design', specialty: 'Motion Graphics', rating: 5.0, reviews: 112, location: 'Madrid', zone: 'Chamberí', experience: '6 años', price: 0, priceUnit: '', avatar: 'PM', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['After Effects', 'LED Mapping', 'Visuales Live'], description: 'Diseñadora de motion graphics para pantallas LED en salas y festivales.', phone: '34612345016', instagram: 'paulamotion_vfx', topWeekend: false, photo: '', subscriptionTier: 'premium', isFlashActive: false, profileViews: 445, contactClicks: 33, category: 'professional' },
  { id: 17, name: 'Rubén VJ', role: 'design', specialty: 'Video Jockey (VJ)', rating: 4.7, reviews: 78, location: 'Madrid', zone: 'Malasaña', experience: '5 años', price: 0, priceUnit: '', avatar: 'RV', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Resolume', 'VDMX', 'Live Visuals'], description: 'VJ con setup propio. Proyecciones inmersivas sincronizadas con el DJ.', phone: '34612345017', instagram: 'rubenvj_visuals', topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: true, profileViews: 234, contactClicks: 19, category: 'rookie' },

  // ═══════════════════ Brand Ambassador (2) ═══════════════════
  { id: 18, name: 'Laura Promo', role: 'ambassador', specialty: 'Brand Ambassador & Street Team', rating: 4.8, reviews: 145, location: 'Madrid', zone: 'Centro', experience: '4 años', price: 25, priceUnit: '/hora', avatar: 'LP', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Street Team', 'Flyering', 'Registro In-Situ'], description: 'Promotora profesional con experiencia en acciones de guerrilla.', phone: '34612345018', instagram: 'laurapromo_mad', topWeekend: false, photo: '', subscriptionTier: 'premium', isFlashActive: true, profileViews: 567, contactClicks: 43, category: 'professional' },
  { id: 19, name: 'Javi Street', role: 'ambassador', specialty: 'Promoción Física & Soporte Marca', rating: 4.6, reviews: 67, location: 'Madrid', zone: 'Malasaña', experience: '2 años', price: 20, priceUnit: '/hora', avatar: 'JS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['QR Campaigns', 'Activaciones', 'Soporte Evento'], description: 'Soporte de marca en eventos nocturnos. Gestión de stands y captación.', phone: '34612345019', instagram: 'javistreet_promo', topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: false, profileViews: 123, contactClicks: 8, category: 'rookie' },
];

// Empresarios (for Flash Booking) — role_needed field for filtering
export const empresarios = [
  {
    id: 101, name: 'Club Onyx Madrid', avatar: 'ON', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
    offers: [
      { title: 'DJ Techno URGENTE esta noche', description: 'Necesitamos DJ de techno/minimal para sesión de 00h a 04h.', location: 'Madrid Centro', pay: '€350', expiresIn: 5400 },
      { title: 'Camarero/a VIP para sábado', description: 'Buscamos personal de barra y camarero con experiencia en coctelería premium para zona VIP.', location: 'Malasaña', pay: '€150', expiresIn: 6200 },
      { title: 'Fotógrafo para evento privado', description: 'Necesitamos fotógrafo profesional para cobertura de evento exclusivo. Entrega en 24h.', location: 'Madrid Centro', pay: '€300', expiresIn: 7200 },
      { title: 'Diseñador de flyers para campaña', description: 'Buscamos diseñador gráfico para crear flyer y cartelería de nueva temporada.', location: 'Madrid Centro', pay: '€250', expiresIn: 8000 },
    ],
  },
  {
    id: 102, name: 'Horizon Rooftop Madrid', avatar: 'HZ', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    offers: [
      { title: 'Maquilladora para Neon Party', description: 'Evento temático UV. Necesitamos maquilladora/estilista con experiencia en pintura corporal fluorescente.', location: 'Salamanca', pay: '€200', expiresIn: 3800 },
      { title: 'DJ House para rooftop session', description: 'Sesión de deep house para terraza. Set de 3 horas.', location: 'Salamanca', pay: '€400', expiresIn: 4500 },
      { title: 'Videógrafo para aftermovie', description: 'Necesitamos videógrafo para crear aftermovie del evento de inauguración.', location: 'Salamanca', pay: '€500', expiresIn: 9000 },
      { title: 'Promotor/RRPP para lista VIP', description: 'Buscamos promotor con experiencia en relaciones públicas y gestión de listas VIP.', location: 'Salamanca', pay: '€120', expiresIn: 5000 },
      { title: 'Estilista de vestuario para staff', description: 'Necesitamos estilista de vestuario y moda para uniformar al personal del evento.', location: 'Salamanca', pay: '€180', expiresIn: 6000 },
      { title: 'Azafata/Hostess para zona VIP', description: 'Buscamos personal de sala y hostess para servicio VIP premium.', location: 'Salamanca', pay: '€100', expiresIn: 4000 },
      { title: 'Brand Ambassador para acción de marca', description: 'Promotor/ambassador para campaña de street marketing y brand activation.', location: 'Centro', pay: '€90', expiresIn: 7000 },
    ],
  },
];

// Visibility ranking: Business > Pro/Passes > Free. Streaming boost +3 positions.
export const getEliteRotation = (allProfiles: Profile[]): Profile[] => {
  const hourSeed = Math.floor(Date.now() / (60 * 60 * 1000));
  const hash = (id: number) => ((id * 2654435761 + hourSeed) >>> 0) % 1000;

  // Tier sorting: isPremium (Business/Elite) first, then premium tier, then free
  const tierScore = (p: Profile) => {
    if (p.isPremium) return 0;
    if (p.subscriptionTier === 'elite') return 1;
    if (p.subscriptionTier === 'premium') return 2;
    return 3;
  };

  // Streaming boost: live profiles get -3 score within their tier
  const sorted = [...allProfiles].sort((a, b) => {
    const ta = tierScore(a);
    const tb = tierScore(b);
    if (ta !== tb) return ta - tb;
    // Streaming boost within same tier
    const liveA = a.isLive ? -3 : 0;
    const liveB = b.isLive ? -3 : 0;
    if (liveA !== liveB) return liveA - liveB;
    return hash(a.id) - hash(b.id);
  });

  return sorted;
};
