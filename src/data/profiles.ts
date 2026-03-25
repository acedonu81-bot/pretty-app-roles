export interface Profile {
  id: number;
  name: string;
  role: 'dj' | 'staff' | 'makeup' | 'promotor';
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
}

const WA_MSG = encodeURIComponent('Hola, te he visto en NIGHTLIFE Madrid y me interesa tu perfil para un evento. ¿Hablamos?');
export const getWhatsAppLink = (phone: string) => `https://wa.me/${phone}?text=${WA_MSG}`;
export const getInstagramLink = (handle: string) => `https://instagram.com/${handle}`;
export const getPhoneLink = (phone: string) => `tel:+${phone}`;
export const getLocationLink = (zone: string) => `https://maps.google.com/?q=${encodeURIComponent(zone + ', Madrid')}`;

export const profiles: Profile[] = [
  // DJs (4)
  {
    id: 1, name: 'Dani Tech', role: 'dj', specialty: 'Techno / Industrial',
    rating: 4.9, reviews: 218, location: 'Madrid', zone: 'Malasaña',
    experience: '8 años', price: 450, priceUnit: '/sesión',
    avatar: 'DT', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
    badges: ['Techno', 'Industrial', 'Modular Live'],
    description: 'DJ y productor de techno industrial con residencias en las mejores salas underground de Madrid. Sets de 3-5 horas.',
    phone: '34612345001', instagram: 'danitech_dj', topWeekend: true,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DaniTech&backgroundColor=1a1a1a',
    subscriptionTier: 'elite', isFlashActive: true, profileViews: 1247, contactClicks: 89,
    streamUrl: 'https://twitch.tv/danitech_dj', isLive: true,
  },
  {
    id: 2, name: 'Luna Deep', role: 'dj', specialty: 'Deep House / Melodic',
    rating: 5.0, reviews: 312, location: 'Madrid', zone: 'Salamanca',
    experience: '11 años', price: 600, priceUnit: '/sesión',
    avatar: 'LD', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)',
    badges: ['Deep House', 'Melodic', 'Vinyl Set'],
    description: 'Referente del deep house en Madrid. Sesiones melódicas con vinilo y producción propia. Resident en Horizon.',
    phone: '34612345002', instagram: 'lunadeep_music', topWeekend: true,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LunaDeep&backgroundColor=1a1a1a',
    subscriptionTier: 'elite', isFlashActive: true, profileViews: 2103, contactClicks: 156,
  },
  {
    id: 3, name: 'MC Ráfaga', role: 'dj', specialty: 'Urbano / Reggaetón',
    rating: 4.7, reviews: 189, location: 'Madrid', zone: 'Malasaña',
    experience: '6 años', price: 350, priceUnit: '/sesión',
    avatar: 'MR', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Urbano', 'Reggaetón', 'Latino Mix'],
    description: 'El DJ urbano más solicitado de la zona centro. Especialista en sesiones de reggaetón y perreo intenso.',
    phone: '34612345003', instagram: 'mcrafaga_dj', topWeekend: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MCRafaga&backgroundColor=1a1a1a',
    subscriptionTier: 'premium', isFlashActive: false, profileViews: 634, contactClicks: 42,
  },
  {
    id: 4, name: 'Sara Beats', role: 'dj', specialty: 'Comercial / Top Hits',
    rating: 4.8, reviews: 267, location: 'Madrid', zone: 'Salamanca',
    experience: '9 años', price: 400, priceUnit: '/sesión',
    avatar: 'SB', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Comercial', 'Top 40', 'Bodas & Eventos'],
    description: 'DJ versátil con repertorio comercial para todo tipo de público. Especialista en eventos corporativos y fiestas privadas.',
    phone: '34612345004', instagram: 'sarabeats_official', topWeekend: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaraBeats&backgroundColor=1a1a1a',
    subscriptionTier: 'free', isFlashActive: true, profileViews: 412, contactClicks: 28,
  },

  // Staff (3)
  {
    id: 5, name: 'Carla Vega', role: 'staff', specialty: 'Azafata VIP & Hostess',
    rating: 4.9, reviews: 154, location: 'Madrid', zone: 'Salamanca',
    experience: '5 años', price: 180, priceUnit: '/noche',
    avatar: 'CV', gradient: 'linear-gradient(135deg, #D4AF37, #B8941E)',
    badges: ['Hostess VIP', 'Protocolo', 'Multilingüe EN/FR'],
    description: 'Azafata profesional con experiencia en clubs de alto standing. Gestión de listas VIP, reservados y atención al cliente premium.',
    phone: '34612345005', instagram: 'carlavega_hostess', topWeekend: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlaVega&backgroundColor=1a1a1a',
    subscriptionTier: 'elite', isFlashActive: true, profileViews: 876, contactClicks: 67,
  },
  {
    id: 6, name: 'Marcos Ríos', role: 'staff', specialty: 'Camarero VIP & Flair',
    rating: 4.8, reviews: 98, location: 'Madrid', zone: 'Malasaña',
    experience: '7 años', price: 200, priceUnit: '/noche',
    avatar: 'MR', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Flair Bartending', 'Coctelería VIP', 'Certificado WSET'],
    description: 'Barman con espectáculo. Coctelería molecular y flair para eventos exclusivos en las mejores salas de Madrid.',
    phone: '34612345006', instagram: 'marcosrios_bar', topWeekend: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcosRios&backgroundColor=1a1a1a',
    subscriptionTier: 'premium', isFlashActive: false, profileViews: 523, contactClicks: 34,
  },
  {
    id: 7, name: 'Patricia Sanz', role: 'staff', specialty: 'RRPP & Relaciones Públicas',
    rating: 5.0, reviews: 201, location: 'Madrid', zone: 'Chamberí',
    experience: '10 años', price: 250, priceUnit: '/noche',
    avatar: 'PS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['RRPP Premium', 'Gestión Listas', 'Networking VIP'],
    description: 'La RRPP más conectada de Madrid. Gestión integral de relaciones públicas, listas y reservados para salas top.',
    phone: '34612345007', instagram: 'patriciasanz_rrpp', topWeekend: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PatriciaSanz&backgroundColor=1a1a1a',
    subscriptionTier: 'free', isFlashActive: true, profileViews: 345, contactClicks: 22,
  },

  // Estilismo (3)
  {
    id: 8, name: 'Nadia Glamour', role: 'makeup', specialty: 'Maquillaje de Noche & FX',
    rating: 5.0, reviews: 245, location: 'Madrid', zone: 'Chueca',
    experience: '9 años', price: 300, priceUnit: '/sesión',
    avatar: 'NG', gradient: 'linear-gradient(135deg, #D4AF37, #F5D77A)',
    badges: ['Noche Glam', 'FX Pro', 'Bodypaint UV'],
    description: 'Maquilladora artística especializada en looks de noche, efectos especiales y bodypaint UV para fiestas temáticas.',
    phone: '34612345008', instagram: 'nadiaglamour_makeup', topWeekend: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NadiaGlamour&backgroundColor=1a1a1a',
    subscriptionTier: 'elite', isFlashActive: false, profileViews: 1089, contactClicks: 78,
  },
  {
    id: 9, name: 'Iván Stylez', role: 'makeup', specialty: 'Peluquería de Autor',
    rating: 4.9, reviews: 178, location: 'Madrid', zone: 'Chamberí',
    experience: '12 años', price: 280, priceUnit: '/sesión',
    avatar: 'IS', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Color Expert', 'Extensiones', 'Peinado Evento'],
    description: 'Estilista capilar de autor con experiencia en desfiles y eventos nocturnos. Extensiones, color fantasía y peinados de pasarela.',
    phone: '34612345009', instagram: 'ivanstylez_hair', topWeekend: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IvanStylez&backgroundColor=1a1a1a',
    subscriptionTier: 'premium', isFlashActive: true, profileViews: 456, contactClicks: 31,
  },
  {
    id: 10, name: 'Alicia Moon', role: 'makeup', specialty: 'Estilismo Integral Nocturno',
    rating: 4.8, reviews: 134, location: 'Madrid', zone: 'Chueca',
    experience: '7 años', price: 350, priceUnit: '/sesión',
    avatar: 'AM', gradient: 'linear-gradient(135deg, #333, #1a1a1a)',
    badges: ['Styling Completo', 'Asesoría Imagen', 'Luxury Brands'],
    description: 'Servicio integral de imagen nocturna: maquillaje, peinado y vestuario para artistas, DJs y personal de sala.',
    phone: '34612345010', instagram: 'aliciamoon_style', topWeekend: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AliciaMoon&backgroundColor=1a1a1a',
    subscriptionTier: 'free', isFlashActive: false, profileViews: 289, contactClicks: 18,
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

// Elite rotation logic
export const getEliteRotation = (allProfiles: Profile[]): Profile[] => {
  const elite = allProfiles.filter(p => p.subscriptionTier === 'elite');
  const others = allProfiles.filter(p => p.subscriptionTier !== 'elite');
  
  const hourSeed = Math.floor(Date.now() / (60 * 60 * 1000));
  const shuffled = [...elite].sort((a, b) => {
    const hashA = ((a.id * 2654435761 + hourSeed) >>> 0) % 1000;
    const hashB = ((b.id * 2654435761 + hourSeed) >>> 0) % 1000;
    return hashA - hashB;
  });
  
  const top12 = shuffled.slice(0, 12);
  const remainingElite = shuffled.slice(12);
  
  return [...top12, ...remainingElite, ...others];
};
