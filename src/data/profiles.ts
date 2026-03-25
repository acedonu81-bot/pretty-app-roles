export interface Profile {
  id: number;
  name: string;
  role: 'dj' | 'staff' | 'makeup' | 'vestuario' | 'promotor';
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
}

const WA_MSG = encodeURIComponent('Hola, te he visto en NIGHTLIFE Madrid y me interesa tu perfil para un evento. ¿Hablamos?');
export const getWhatsAppLink = (phone: string) => `https://wa.me/${phone}?text=${WA_MSG}`;
export const getInstagramLink = (handle: string) => `https://instagram.com/${handle}`;
export const getPhoneLink = (phone: string) => `tel:+${phone}`;
export const getLocationLink = (zone: string) => `https://maps.google.com/?q=${encodeURIComponent(zone + ', Madrid')}`;

export const profiles: Profile[] = [
  // DJs (4) — prices 40-150€/h
  {
    id: 1, name: 'Dani Tech', role: 'dj', specialty: 'Techno / Industrial',
    rating: 4.9, reviews: 218, location: 'Madrid', zone: 'Malasaña',
    experience: '8 años', price: 120, priceUnit: '/hora',
    avatar: 'DT', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
    badges: ['Techno', 'Industrial', 'Modular Live'],
    description: 'DJ y productor de techno industrial con residencias en las mejores salas underground de Madrid. Sets de 3-5 horas.',
    phone: '34612345001', instagram: 'danitech_dj', topWeekend: true,
    photo: '', subscriptionTier: 'elite', isFlashActive: true,
    profileViews: 1247, contactClicks: 89, streamUrl: 'https://twitch.tv/danitech_dj',
    isLive: true, category: 'professional', isPremium: true,
  },
  {
    id: 2, name: 'Luna Deep', role: 'dj', specialty: 'Deep House / Melodic',
    rating: 5.0, reviews: 312, location: 'Madrid', zone: 'Salamanca',
    experience: '11 años', price: 150, priceUnit: '/hora',
    avatar: 'LD', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)',
    badges: ['Deep House', 'Melodic', 'Vinyl Set'],
    description: 'Referente del deep house en Madrid. Sesiones melódicas con vinilo y producción propia. Resident en Horizon.',
    phone: '34612345002', instagram: 'lunadeep_music', topWeekend: true,
    photo: '', subscriptionTier: 'elite', isFlashActive: true,
    profileViews: 2103, contactClicks: 156, category: 'professional', isPremium: true,
  },
  {
    id: 3, name: 'MC Ráfaga', role: 'dj', specialty: 'Urbano / Reggaetón',
    rating: 4.7, reviews: 189, location: 'Madrid', zone: 'Malasaña',
    experience: '6 años', price: 60, priceUnit: '/hora',
    avatar: 'MR', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Urbano', 'Reggaetón', 'Latino Mix'],
    description: 'El DJ urbano más solicitado de la zona centro. Especialista en sesiones de reggaetón y perreo intenso.',
    phone: '34612345003', instagram: 'mcrafaga_dj', topWeekend: false,
    photo: '', subscriptionTier: 'premium', isFlashActive: false,
    profileViews: 634, contactClicks: 42, category: 'rookie',
  },
  {
    id: 4, name: 'Sara Beats', role: 'dj', specialty: 'Comercial / Top Hits',
    rating: 4.8, reviews: 267, location: 'Madrid', zone: 'Salamanca',
    experience: '9 años', price: 80, priceUnit: '/hora',
    avatar: 'SB', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Comercial', 'Top 40', 'Bodas & Eventos'],
    description: 'DJ versátil con repertorio comercial para todo tipo de público. Especialista en eventos corporativos y fiestas privadas.',
    phone: '34612345004', instagram: 'sarabeats_official', topWeekend: false,
    photo: '', subscriptionTier: 'free', isFlashActive: true,
    profileViews: 412, contactClicks: 28, category: 'rookie',
  },

  // Staff (3) — prices from 20€/h
  {
    id: 5, name: 'Carla Vega', role: 'staff', specialty: 'Azafata VIP & Hostess',
    rating: 4.9, reviews: 154, location: 'Madrid', zone: 'Salamanca',
    experience: '5 años', price: 30, priceUnit: '/hora',
    avatar: 'CV', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
    badges: ['Hostess VIP', 'Protocolo', 'Multilingüe EN/FR'],
    description: 'Azafata profesional con experiencia en clubs de alto standing. Gestión de listas VIP, reservados y atención al cliente premium.',
    phone: '34612345005', instagram: 'carlavega_hostess', topWeekend: false,
    photo: '', subscriptionTier: 'elite', isFlashActive: true,
    profileViews: 876, contactClicks: 67, category: 'professional', isPremium: true,
  },
  {
    id: 6, name: 'Marcos Ríos', role: 'staff', specialty: 'Camarero VIP & Flair',
    rating: 4.8, reviews: 98, location: 'Madrid', zone: 'Malasaña',
    experience: '7 años', price: 22, priceUnit: '/hora',
    avatar: 'MR', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Flair Bartending', 'Coctelería VIP', 'Certificado WSET'],
    description: 'Barman con espectáculo. Coctelería molecular y flair para eventos exclusivos en las mejores salas de Madrid.',
    phone: '34612345006', instagram: 'marcosrios_bar', topWeekend: false,
    photo: '', subscriptionTier: 'premium', isFlashActive: false,
    profileViews: 523, contactClicks: 34, category: 'rookie',
  },
  {
    id: 7, name: 'Patricia Sanz', role: 'staff', specialty: 'RRPP & Relaciones Públicas',
    rating: 5.0, reviews: 201, location: 'Madrid', zone: 'Chamberí',
    experience: '10 años', price: 28, priceUnit: '/hora',
    avatar: 'PS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['RRPP Premium', 'Gestión Listas', 'Networking VIP'],
    description: 'La RRPP más conectada de Madrid. Gestión integral de relaciones públicas, listas y reservados para salas top.',
    phone: '34612345007', instagram: 'patriciasanz_rrpp', topWeekend: false,
    photo: '', subscriptionTier: 'free', isFlashActive: true,
    profileViews: 345, contactClicks: 22, category: 'professional',
  },

  // Maquillaje y Peluquería (2) — prices from 30€/h
  {
    id: 8, name: 'Nadia Glamour', role: 'makeup', specialty: 'Maquillaje de Noche & FX',
    rating: 5.0, reviews: 245, location: 'Madrid', zone: 'Chueca',
    experience: '9 años', price: 45, priceUnit: '/hora',
    avatar: 'NG', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)',
    badges: ['Noche Glam', 'FX Pro', 'Bodypaint UV'],
    description: 'Maquilladora artística especializada en looks de noche, efectos especiales y bodypaint UV para fiestas temáticas.',
    phone: '34612345008', instagram: 'nadiaglamour_makeup', topWeekend: false,
    photo: '', subscriptionTier: 'elite', isFlashActive: false,
    profileViews: 1089, contactClicks: 78, category: 'professional', isPremium: true,
  },
  {
    id: 9, name: 'Iván Stylez', role: 'makeup', specialty: 'Peluquería de Autor',
    rating: 4.9, reviews: 178, location: 'Madrid', zone: 'Chamberí',
    experience: '12 años', price: 40, priceUnit: '/hora',
    avatar: 'IS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Color Expert', 'Extensiones', 'Peinado Evento'],
    description: 'Estilista capilar de autor con experiencia en desfiles y eventos nocturnos. Extensiones, color fantasía y peinados de pasarela.',
    phone: '34612345009', instagram: 'ivanstylez_hair', topWeekend: false,
    photo: '', subscriptionTier: 'premium', isFlashActive: true,
    profileViews: 456, contactClicks: 31, category: 'rookie',
  },

  // Vestuario y Moda (2) — prices from 30€/h
  {
    id: 10, name: 'Alicia Moon', role: 'vestuario', specialty: 'Estilismo Integral Nocturno',
    rating: 4.8, reviews: 134, location: 'Madrid', zone: 'Chueca',
    experience: '7 años', price: 55, priceUnit: '/hora',
    avatar: 'AM', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Styling Completo', 'Asesoría Imagen', 'Luxury Brands'],
    description: 'Servicio integral de imagen nocturna: vestuario, asesoría de estilo y personal shopping para artistas y profesionales.',
    phone: '34612345010', instagram: 'aliciamoon_style', topWeekend: false,
    photo: '', subscriptionTier: 'free', isFlashActive: false,
    profileViews: 289, contactClicks: 18, category: 'professional',
  },
  {
    id: 11, name: 'Diego Noir', role: 'vestuario', specialty: 'Moda Nocturna & Streetwear',
    rating: 4.7, reviews: 92, location: 'Madrid', zone: 'Malasaña',
    experience: '5 años', price: 35, priceUnit: '/hora',
    avatar: 'DN', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Streetwear', 'Diseño Custom', 'Vintage'],
    description: 'Estilista de moda nocturna y streetwear. Diseño custom de outfits para artistas y personal de salas con estilo urbano.',
    phone: '34612345011', instagram: 'diegonoir_fashion', topWeekend: false,
    photo: '', subscriptionTier: 'premium', isFlashActive: true,
    profileViews: 178, contactClicks: 12, category: 'rookie',
  },
];

// Empresarios (for Flash Booking)
export const empresarios = [
  {
    id: 101, name: 'Club Onyx Madrid', avatar: 'ON', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
    offers: [
      { title: 'DJ Techno URGENTE esta noche', description: 'Necesitamos DJ de techno/minimal para sesión de 00h a 04h. El anterior canceló.', location: 'Madrid Centro', pay: '€350', expiresIn: 5400 },
      { title: 'Camarero/a VIP para sábado', description: 'Buscamos personal de barra con experiencia en coctelería premium para zona VIP.', location: 'Malasaña', pay: '€150', expiresIn: 6200 },
    ],
  },
  {
    id: 102, name: 'Horizon Rooftop Madrid', avatar: 'HZ', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    offers: [
      { title: 'Maquilladora para Neon Party', description: 'Evento temático UV. Necesitamos estilista con experiencia en pintura corporal fluorescente.', location: 'Salamanca', pay: '€200', expiresIn: 3800 },
    ],
  },
];

// Elite rotation logic — Premium profiles always first
export const getEliteRotation = (allProfiles: Profile[]): Profile[] => {
  const premium = allProfiles.filter(p => p.isPremium);
  const elite = allProfiles.filter(p => !p.isPremium && p.subscriptionTier === 'elite');
  const others = allProfiles.filter(p => !p.isPremium && p.subscriptionTier !== 'elite');

  const hourSeed = Math.floor(Date.now() / (60 * 60 * 1000));
  const shuffle = (arr: Profile[]) => [...arr].sort((a, b) => {
    const hashA = ((a.id * 2654435761 + hourSeed) >>> 0) % 1000;
    const hashB = ((b.id * 2654435761 + hourSeed) >>> 0) % 1000;
    return hashA - hashB;
  });

  return [...premium, ...shuffle(elite).slice(0, 12), ...shuffle(elite).slice(12), ...others];
};
