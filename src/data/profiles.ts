export interface Profile {
  id: number;
  name: string;
  role: 'dj' | 'staff' | 'makeup' | 'vestuario' | 'media' | 'design' | 'promotor' | 'ambassador' | 'rookie' | 'empresario' | 'catering' | 'mago' | 'bailarin' | 'humorista' | 'speaker';
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
  subscriptionTier: 'free' | 'starter' | 'business' | 'premium' | 'elite' | 'agency';
  isVerified?: boolean;
  isFlashActive: boolean;
  profileViews: number;
  contactClicks: number;
  streamUrl?: string;
  isLive?: boolean;
  category?: 'professional' | 'rookie';
  isPremium?: boolean;
  tiktok?: string;
  portfolioUrls?: string[];
  languages?: string[];
  country?: string;
  city?: string;
  userId?: string;
  slug?: string;
}

/** Genera slug SEO-friendly desde nombre: "Dani Tech" → "dani-tech" */
export const toSlug = (name: string) =>
  name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const WA_MSG = encodeURIComponent('Hola, te he visto en XPEAK y me interesa tu perfil para un evento. ¿Hablamos?');
export const getWhatsAppLink = (phone: string) => `https://wa.me/${phone}?text=${WA_MSG}`;
export const getInstagramLink = (handle: string) => `https://instagram.com/${handle}`;
export const getPhoneLink = (phone: string) => `tel:+${phone}`;
export const getLocationLink = (zone: string) => `https://maps.google.com/?q=${encodeURIComponent(zone + ', Madrid')}`;

export const profiles: Profile[] = [
  // ═══════════════════ DJs (4) ═══════════════════
{ id: 2, name: 'Luna Deep', role: 'dj', specialty: 'Deep House / Melodic', rating: 5.0, reviews: 312, location: 'Madrid', zone: 'Salamanca', country: 'España', city: 'Madrid', experience: '11 años', price: 150, priceUnit: '/hora', avatar: 'LD', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)', badges: ['Deep House', 'Melodic', 'Vinyl Set'], description: 'Referente del deep house en Madrid. Sesiones melódicas con vinilo y producción propia.', phone: '', instagram: 'lunadeep_music', topWeekend: true, photo: '', subscriptionTier: 'elite', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 3, name: 'MC Ráfaga', role: 'dj', specialty: 'Urbano / Reggaetón', rating: 4.7, reviews: 189, location: 'Barcelona', zone: 'Eixample', country: 'España', city: 'Barcelona', experience: '6 años', price: 60, priceUnit: '/hora', avatar: 'MR', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Urbano', 'Reggaetón', 'Latino Mix'], description: 'El DJ urbano más solicitado de Barcelona.', phone: '', instagram: 'mcrafaga_dj', topWeekend: false, photo: '/images/profiles/1699161.jpg', subscriptionTier: 'premium', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'rookie' },
  { id: 4, name: 'Sara Beats', role: 'dj', specialty: 'Comercial / Top Hits', rating: 4.8, reviews: 267, location: 'Sevilla', zone: 'Centro', country: 'España', city: 'Sevilla', experience: '9 años', price: 80, priceUnit: '/hora', avatar: 'SB', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Comercial', 'Top 40', 'Bodas & Eventos'], description: 'DJ versátil con repertorio comercial para todo tipo de público.', phone: '', instagram: 'sarabeats_official', topWeekend: false, photo: '/images/profiles/3237218.jpg', subscriptionTier: 'free', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'rookie' },

  // ═══════════════════ Staff (3) ═══════════════════
  { id: 5, name: 'Carla Vega', role: 'staff', specialty: 'Azafata VIP & Hostess', rating: 4.9, reviews: 154, location: 'Madrid', zone: 'Salamanca', experience: '5 años', price: 30, priceUnit: '/hora', avatar: 'CV', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Hostess VIP', 'Protocolo', 'Multilingüe EN/FR'], description: 'Azafata profesional con experiencia en clubs de alto standing.', phone: '', instagram: 'carlavega_hostess', topWeekend: false, photo: '/images/profiles/4065624.jpg', subscriptionTier: 'elite', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 6, name: 'Marcos Ríos', role: 'staff', specialty: 'Camarero VIP & Flair', rating: 4.8, reviews: 98, location: 'Madrid', zone: 'Malasaña', experience: '7 años', price: 22, priceUnit: '/hora', avatar: 'MR', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Flair Bartending', 'Coctelería VIP', 'Certificado WSET'], description: 'Barman con espectáculo. Coctelería molecular y flair para eventos exclusivos.', phone: '', instagram: 'marcosrios_bar', topWeekend: false, photo: '/images/profiles/2773977.jpg', subscriptionTier: 'premium', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'rookie' },
  { id: 7, name: 'Patricia Sanz', role: 'staff', specialty: 'RRPP & Relaciones Públicas', rating: 5.0, reviews: 201, location: 'Madrid', zone: 'Chamberí', experience: '10 años', price: 28, priceUnit: '/hora', avatar: 'PS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['RRPP Premium', 'Gestión Listas', 'Networking VIP'], description: 'La RRPP más conectada de Madrid.', phone: '', instagram: 'patriciasanz_rrpp', topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'professional' },

  // ═══════════════════ Maquillaje (2) ═══════════════════
  { id: 8, name: 'Nadia Glamour', role: 'makeup', specialty: 'Maquillaje de Noche & FX', rating: 5.0, reviews: 245, location: 'Madrid', zone: 'Chueca', experience: '9 años', price: 0, priceUnit: '', avatar: 'NG', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)', badges: ['Noche Glam', 'FX Pro', 'Bodypaint UV'], description: 'Maquilladora artística especializada en looks de noche y efectos especiales.', phone: '', instagram: 'nadiaglamour_makeup', topWeekend: false, photo: '', subscriptionTier: 'elite', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 9, name: 'Iván Stylez', role: 'makeup', specialty: 'Peluquería de Autor', rating: 4.9, reviews: 178, location: 'Madrid', zone: 'Chamberí', experience: '12 años', price: 0, priceUnit: '', avatar: 'IS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Color Expert', 'Extensiones', 'Peinado Evento'], description: 'Estilista capilar de autor con experiencia en desfiles y eventos nocturnos.', phone: '', instagram: 'ivanstylez_hair', topWeekend: false, photo: '/images/profiles/2608517.jpg', subscriptionTier: 'premium', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'rookie' },

  // ═══════════════════ Vestuario (2) ═══════════════════
  { id: 10, name: 'Alicia Moon', role: 'vestuario', specialty: 'Estilismo Integral Nocturno', rating: 4.8, reviews: 134, location: 'Madrid', zone: 'Chueca', experience: '7 años', price: 0, priceUnit: '', avatar: 'AM', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Styling Completo', 'Asesoría Imagen', 'Luxury Brands'], description: 'Servicio integral de imagen nocturna: vestuario, asesoría de estilo y personal shopping.', phone: '', instagram: 'aliciamoon_style', topWeekend: false, photo: '/images/profiles/1126993.jpg', subscriptionTier: 'free', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional' },
  { id: 11, name: 'Diego Noir', role: 'vestuario', specialty: 'Moda Nocturna & Streetwear', rating: 4.7, reviews: 92, location: 'Madrid', zone: 'Malasaña', experience: '5 años', price: 0, priceUnit: '', avatar: 'DN', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Streetwear', 'Diseño Custom', 'Vintage'], description: 'Estilista de moda nocturna y streetwear. Diseño custom de outfits para artistas.', phone: '', instagram: 'diegonoir_fashion', topWeekend: false, photo: '/images/profiles/2869657.jpg', subscriptionTier: 'premium', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'rookie' },

  // ═══════════════════ Media & Contenido (3) ═══════════════════
  { id: 12, name: 'Carlos Flash', role: 'media', specialty: 'Fotografía de Eventos', rating: 4.9, reviews: 187, location: 'Madrid', zone: 'Centro', experience: '10 años', price: 0, priceUnit: '', avatar: 'CF', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Foto Nocturna', 'Reportaje', 'Canon R5'], description: 'Fotógrafo especializado en eventos nocturnos y fiestas. Entrega en 24h.', phone: '', instagram: 'carlosflash_photo', topWeekend: false, photo: '/images/profiles/1047540.jpg', subscriptionTier: 'elite', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 13, name: 'Marta Lens', role: 'media', specialty: 'Videógrafa / Aftermovies', rating: 5.0, reviews: 156, location: 'Madrid', zone: 'Salamanca', experience: '8 años', price: 0, priceUnit: '', avatar: 'ML', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)', badges: ['Aftermovie', '4K Cinema', 'Drone'], description: 'Aftermovies cinematográficos para salas y festivales. Equipo propio con drone y gimbal.', phone: '', instagram: 'martalens_video', topWeekend: false, photo: '/images/profiles/3822619.jpg', subscriptionTier: 'premium', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional' },
  { id: 14, name: 'Zoe Viral', role: 'media', specialty: 'Creadora de Contenido UGC/TikTok', rating: 4.8, reviews: 89, location: 'Madrid', zone: 'Malasaña', experience: '3 años', price: 0, priceUnit: '', avatar: 'ZV', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['TikTok', 'Reels', 'UGC Creator'], description: 'Creadora de contenido viral para clubs y eventos nocturnos. +200K seguidores.', phone: '', instagram: 'zoeviral_', topWeekend: false, photo: '/images/profiles/3771819.jpg', subscriptionTier: 'free', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'rookie', tiktok: 'zoeviral_' },

  // ═══════════════════ Diseño & Visuales (3) ═══════════════════
  { id: 15, name: 'Álex Neon', role: 'design', specialty: 'Identidad Visual / Flyers', rating: 4.9, reviews: 203, location: 'Madrid', zone: 'Lavapiés', experience: '9 años', price: 0, priceUnit: '', avatar: 'AN', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Flyers', 'Branding', 'Cartelería'], description: 'Diseñador gráfico especializado en identidad visual para salas y promotoras.', phone: '', instagram: 'alexneon_design', topWeekend: false, photo: '/images/profiles/3184465.jpg', subscriptionTier: 'elite', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 16, name: 'Paula Motion', role: 'design', specialty: 'Motion Graphics', rating: 5.0, reviews: 112, location: 'Madrid', zone: 'Chamberí', experience: '6 años', price: 0, priceUnit: '', avatar: 'PM', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['After Effects', 'LED Mapping', 'Visuales Live'], description: 'Diseñadora de motion graphics para pantallas LED en salas y festivales.', phone: '', instagram: 'paulamotion_vfx', topWeekend: false, photo: '/images/profiles/1878294.jpg', subscriptionTier: 'premium', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional' },
  { id: 17, name: 'Rubén VJ', role: 'design', specialty: 'Video Jockey (VJ)', rating: 4.7, reviews: 78, location: 'Madrid', zone: 'Malasaña', experience: '5 años', price: 0, priceUnit: '', avatar: 'RV', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Resolume', 'VDMX', 'Live Visuals'], description: 'VJ con setup propio. Proyecciones inmersivas sincronizadas con el DJ.', phone: '', instagram: 'rubenvj_visuals', topWeekend: false, photo: '/images/profiles/7149246.jpg', subscriptionTier: 'free', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'rookie' },

  // ═══════════════════ Brand Ambassador (2) ═══════════════════
  { id: 18, name: 'Laura Promo', role: 'ambassador', specialty: 'Brand Ambassador & Street Team', rating: 4.8, reviews: 145, location: 'Madrid', zone: 'Centro', experience: '4 años', price: 25, priceUnit: '/hora', avatar: 'LP', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Street Team', 'Flyering', 'Registro In-Situ'], description: 'Promotora profesional con experiencia en acciones de guerrilla.', phone: '', instagram: 'laurapromo_mad', topWeekend: false, photo: '/images/profiles/1647919.jpg', subscriptionTier: 'premium', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'professional' },
  // Magos / Ilusionistas (GigSalad: Magicians — muy demandados en bodas y corporativos)
  { id: 40, name: 'Mago Álex Vance',   role: 'mago',      specialty: 'Magia de Cerca & Ilusionismo',  rating: 5.0, reviews: 112, location: 'Madrid',    zone: 'Centro',   country: 'España', city: 'Madrid',    experience: '12 años', price: 300, priceUnit: '/evento', avatar: 'AV', gradient: 'linear-gradient(135deg,#D4AF37,#B8941E)', badges: ['Magia de Cerca', 'Ilusionismo', 'Corporate'], description: 'Mago especializado en eventos corporativos y bodas. Magia de cerca en mesas y shows de escenario. Disponible en toda España.', phone: '', instagram: 'magovalex', topWeekend: true,  photo: '', subscriptionTier: 'elite',   isFlashActive: true,  profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 41, name: 'Ilusionista Nora',   role: 'mago',      specialty: 'Magia Infantil & Familiar',     rating: 4.8, reviews: 78,  location: 'Barcelona', zone: 'Eixample', country: 'España', city: 'Barcelona', experience: '7 años',  price: 200, priceUnit: '/evento', avatar: 'IN', gradient: 'linear-gradient(135deg,#333,#1a1a1a)',   badges: ['Magia Infantil', 'Shows Familia', 'Cumpleaños'], description: 'Ilusionista especializada en espectáculos familiares e infantiles. Shows de 45-60 min con participación del público.', phone: '', instagram: 'noramagia',  topWeekend: false, photo: '', subscriptionTier: 'premium',  isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional' },

  // Bailarines (GigSalad: Dancers — Ballet, Flamenco, Break Dance, Grupos)
  { id: 42, name: 'Compañía Duende',    role: 'bailarin',  specialty: 'Flamenco & Danza Española',     rating: 5.0, reviews: 89,  location: 'Sevilla',   zone: 'Centro',   country: 'España', city: 'Sevilla',   experience: '15 años', price: 500, priceUnit: '/evento', avatar: 'CD', gradient: 'linear-gradient(135deg,#D4AF37,#B8941E)', badges: ['Flamenco', 'Danza Española', 'Shows'], description: 'Compañía de flamenco y danza española con 6 bailarines. Shows de 30-60 min para bodas, corporativos y festivales.', phone: '', instagram: 'ciaduende', topWeekend: true,  photo: '', subscriptionTier: 'elite',   isFlashActive: true,  profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 43, name: 'Crew Breakdance BCN', role: 'bailarin', specialty: 'Break Dance & Hip Hop',         rating: 4.9, reviews: 56,  location: 'Barcelona', zone: 'Gràcia',   country: 'España', city: 'Barcelona', experience: '9 años',  price: 400, priceUnit: '/evento', avatar: 'CB', gradient: 'linear-gradient(135deg,#333,#1a1a1a)',   badges: ['Breakdance', 'Hip Hop', 'Battle'], description: 'Crew de breakdance para eventos, festivales y activaciones de marca. Shows de impacto visual con 4-6 bailarines.', phone: '', instagram: 'crewbcn',   topWeekend: false, photo: '', subscriptionTier: 'premium',  isFlashActive: true,  profileViews: 0, contactClicks: 0, category: 'professional' },

  // Humoristas / Cómicos (GigSalad: Comedians — Corporate, Stand-up, Improv)
  { id: 44, name: 'Carlos Monólogos',   role: 'humorista', specialty: 'Monólogos & Stand-Up',          rating: 4.9, reviews: 134, location: 'Madrid',    zone: 'Malasaña', country: 'España', city: 'Madrid',    experience: '10 años', price: 400, priceUnit: '/evento', avatar: 'CM', gradient: 'linear-gradient(135deg,#D4AF37,#B8941E)', badges: ['Stand-Up', 'Monólogos', 'Corporativo'], description: 'Humorista con más de 500 actuaciones. Monólogos adaptados a cenas de empresa, bodas y eventos privados. Guión personalizado incluido.', phone: '', instagram: 'carlosmonologos', topWeekend: true,  photo: '', subscriptionTier: 'elite',   isFlashActive: true,  profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 45, name: 'Ana Improv',          role: 'humorista', specialty: 'Improv & Humor Corporativo',    rating: 4.7, reviews: 67,  location: 'Barcelona', zone: 'Eixample', country: 'España', city: 'Barcelona', experience: '6 años',  price: 300, priceUnit: '/evento', avatar: 'AI', gradient: 'linear-gradient(135deg,#333,#1a1a1a)',   badges: ['Improv', 'Team Building', 'Dinámicas'], description: 'Actriz de impro y humor para team building corporativo. Shows participativos donde el público es el protagonista.', phone: '', instagram: 'anaimprov',  topWeekend: false, photo: '', subscriptionTier: 'premium',  isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional' },

  // Speakers / Presentadores (GigSalad: Speakers — Emcees, Motivational, Corporate)
  { id: 46, name: 'Javier Keynote',     role: 'speaker',   specialty: 'Speaker Motivacional & Empresa', rating: 5.0, reviews: 98,  location: 'Madrid',    zone: 'Salamanca',country: 'España', city: 'Madrid',    experience: '14 años', price: 800, priceUnit: '/evento', avatar: 'JK', gradient: 'linear-gradient(135deg,#D4AF37,#B8941E)', badges: ['Motivacional', 'Liderazgo', 'Keynote'], description: 'Speaker de referencia en eventos corporativos y congresos. Ponencias sobre liderazgo, innovación y gestión de equipos. +200 conferencias.', phone: '', instagram: 'javierkeynotespk', topWeekend: false, photo: '', subscriptionTier: 'elite',   isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 47, name: 'Lucía Presenta',     role: 'speaker',   specialty: 'Presentadora & MC de Eventos',  rating: 4.9, reviews: 145, location: 'Madrid',    zone: 'Centro',   country: 'España', city: 'Madrid',    experience: '11 años', price: 500, priceUnit: '/evento', avatar: 'LP', gradient: 'linear-gradient(135deg,#333,#1a1a1a)',   badges: ['MC Eventos', 'Galas', 'Presentadora TV'], description: 'Presentadora profesional con experiencia en galas, congresos y eventos corporativos. Ex presentadora de televisión. Bilingüe ES/EN.', phone: '', instagram: 'luciapresenta', topWeekend: false, photo: '', subscriptionTier: 'premium',  isFlashActive: true,  profileViews: 0, contactClicks: 0, category: 'professional' },

  // Catering / Chef de eventos
  { id: 30, name: 'Chef Marco Rossi', role: 'catering', specialty: 'Chef Privado & Banquetes', rating: 5.0, reviews: 134, location: 'Madrid', zone: 'Salamanca', country: 'España', city: 'Madrid', experience: '14 años', price: 120, priceUnit: '/evento', avatar: 'MR', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)', badges: ['Chef Privado', 'Menú Degustación', 'Cocina Mediterránea'], description: 'Chef con estrellas Michelin reconvertido en especialista de eventos privados. Desde cenas íntimas hasta banquetes de 300 personas.', phone: '', instagram: 'chefmarcorossi_events', topWeekend: true, photo: '', subscriptionTier: 'elite', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'professional', isPremium: true },
  { id: 31, name: 'Sara Gastro',    role: 'catering', specialty: 'Catering Bodas & Eventos',  rating: 4.9, reviews: 98,  location: 'Barcelona', zone: 'Eixample',  country: 'España', city: 'Barcelona', experience: '9 años',  price: 65,  priceUnit: '/persona', avatar: 'SG', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Bodas', 'Buffet Premium', 'Menú Cerrado'], description: 'Empresa de catering para bodas y eventos corporativos en Cataluña. Cocina de autor, menús cerrados y buffets de alta gama.', phone: '', instagram: 'saragastro_catering', topWeekend: false, photo: '', subscriptionTier: 'premium', isFlashActive: true, profileViews: 0, contactClicks: 0, category: 'professional' },
  { id: 32, name: 'Kokoro Sushi',   role: 'catering', specialty: 'Catering Japonés & Fusión', rating: 4.8, reviews: 67,  location: 'Madrid',    zone: 'Malasaña', country: 'España', city: 'Madrid',    experience: '6 años',  price: 45,  priceUnit: '/persona', avatar: 'KS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['Sushi en Vivo', 'Fusión', 'Estación Temática'], description: 'Catering japonés y fusión asiática con chef en directo. Estaciones de sushi, gyozas y cocktails japoneses para eventos exclusivos.', phone: '', instagram: 'kokorosushi_events', topWeekend: false, photo: '', subscriptionTier: 'free', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'rookie' },

  { id: 19, name: 'Javi Street', role: 'ambassador', specialty: 'Promoción Física & Soporte Marca', rating: 4.6, reviews: 67, location: 'Madrid', zone: 'Malasaña', experience: '2 años', price: 20, priceUnit: '/hora', avatar: 'JS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)', badges: ['QR Campaigns', 'Activaciones', 'Soporte Evento'], description: 'Soporte de marca en eventos nocturnos. Gestión de stands y captación.', phone: '', instagram: 'javistreet_promo', topWeekend: false, photo: '/images/profiles/4353842.jpg', subscriptionTier: 'free', isFlashActive: false, profileViews: 0, contactClicks: 0, category: 'rookie' },
];

// Empresarios (for Flash Booking)
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

// Visibility ranking
export const getEliteRotation = (allProfiles: Profile[]): Profile[] => {
  const hourSeed = Math.floor(Date.now() / (60 * 60 * 1000));
  const hash = (id: number) => ((id * 2654435761 + hourSeed) >>> 0) % 1000;

  const tierScore = (p: Profile) => {
    if (p.isPremium) return 0;
    if (p.subscriptionTier === 'elite') return 1;
    if (p.subscriptionTier === 'premium') return 2;
    return 3;
  };

  const sorted = [...allProfiles].sort((a, b) => {
    const ta = tierScore(a);
    const tb = tierScore(b);
    if (ta !== tb) return ta - tb;
    const liveA = a.isLive ? -3 : 0;
    const liveB = b.isLive ? -3 : 0;
    if (liveA !== liveB) return liveA - liveB;
    return hash(a.id) - hash(b.id);
  });

  return sorted;
};
