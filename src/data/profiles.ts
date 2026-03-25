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
  topFinde: boolean;
  photo: string;
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
    avatar: 'DT', gradient: 'linear-gradient(135deg, #8c52ff, #6b21ff)',
    badges: ['Techno', 'Industrial', 'Modular Live'],
    description: 'DJ y productor de techno industrial con residencias en las mejores salas underground de Madrid. Sets de 3-5 horas.',
    phone: '34612345001', instagram: 'danitech_dj', topFinde: true,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DaniTech&backgroundColor=8c52ff',
  },
  {
    id: 2, name: 'Luna Deep', role: 'dj', specialty: 'Deep House / Melodic',
    rating: 5.0, reviews: 312, location: 'Madrid', zone: 'Salamanca',
    experience: '11 años', price: 600, priceUnit: '/sesión',
    avatar: 'LD', gradient: 'linear-gradient(135deg, #00e5ff, #00b8ff)',
    badges: ['Deep House', 'Melodic', 'Vinyl Set'],
    description: 'Referente del deep house en Madrid. Sesiones melódicas con vinilo y producción propia. Resident en Horizon.',
    phone: '34612345002', instagram: 'lunadeep_music', topFinde: true,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LunaDeep&backgroundColor=00e5ff',
  },
  {
    id: 3, name: 'MC Ráfaga', role: 'dj', specialty: 'Urbano / Reggaetón',
    rating: 4.7, reviews: 189, location: 'Madrid', zone: 'Malasaña',
    experience: '6 años', price: 350, priceUnit: '/sesión',
    avatar: 'MR', gradient: 'linear-gradient(135deg, #ffbc00, #ff5f56)',
    badges: ['Urbano', 'Reggaetón', 'Latino Mix'],
    description: 'El DJ urbano más solicitado de la zona centro. Especialista en sesiones de reggaetón y perreo intenso.',
    phone: '34612345003', instagram: 'mcrafaga_dj', topFinde: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MCRafaga&backgroundColor=ffbc00',
  },
  {
    id: 4, name: 'Sara Beats', role: 'dj', specialty: 'Comercial / Top Hits',
    rating: 4.8, reviews: 267, location: 'Madrid', zone: 'Salamanca',
    experience: '9 años', price: 400, priceUnit: '/sesión',
    avatar: 'SB', gradient: 'linear-gradient(135deg, #f472b6, #ec4899)',
    badges: ['Comercial', 'Top 40', 'Bodas & Eventos'],
    description: 'DJ versátil con repertorio comercial para todo tipo de público. Especialista en eventos corporativos y fiestas privadas.',
    phone: '34612345004', instagram: 'sarabeats_official', topFinde: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaraBeats&backgroundColor=f472b6',
  },

  // Staff (3)
  {
    id: 5, name: 'Carla Vega', role: 'staff', specialty: 'Azafata VIP & Hostess',
    rating: 4.9, reviews: 154, location: 'Madrid', zone: 'Salamanca',
    experience: '5 años', price: 180, priceUnit: '/noche',
    avatar: 'CV', gradient: 'linear-gradient(135deg, #f472b6, #8c52ff)',
    badges: ['Hostess VIP', 'Protocolo', 'Multilingüe EN/FR'],
    description: 'Azafata profesional con experiencia en clubs de alto standing. Gestión de listas VIP, reservados y atención al cliente premium.',
    phone: '34612345005', instagram: 'carlavega_hostess', topFinde: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlaVega&backgroundColor=f472b6',
  },
  {
    id: 6, name: 'Marcos Ríos', role: 'staff', specialty: 'Camarero VIP & Flair',
    rating: 4.8, reviews: 98, location: 'Madrid', zone: 'Malasaña',
    experience: '7 años', price: 200, priceUnit: '/noche',
    avatar: 'MR', gradient: 'linear-gradient(135deg, #00e5ff, #00ff88)',
    badges: ['Flair Bartending', 'Coctelería VIP', 'Certificado WSET'],
    description: 'Barman con espectáculo. Coctelería molecular y flair para eventos exclusivos en las mejores salas de Madrid.',
    phone: '34612345006', instagram: 'marcosrios_bar', topFinde: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcosRios&backgroundColor=00e5ff',
  },
  {
    id: 7, name: 'Patricia Sanz', role: 'staff', specialty: 'RRPP & Relaciones Públicas',
    rating: 5.0, reviews: 201, location: 'Madrid', zone: 'Chamberí',
    experience: '10 años', price: 250, priceUnit: '/noche',
    avatar: 'PS', gradient: 'linear-gradient(135deg, #ffbc00, #ff5f56)',
    badges: ['RRPP Premium', 'Gestión Listas', 'Networking VIP'],
    description: 'La RRPP más conectada de Madrid. Gestión integral de relaciones públicas, listas y reservados para salas top.',
    phone: '34612345007', instagram: 'patriciasanz_rrpp', topFinde: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PatriciaSanz&backgroundColor=ffbc00',
  },

  // Estilismo (3)
  {
    id: 8, name: 'Nadia Glamour', role: 'makeup', specialty: 'Maquillaje de Noche & FX',
    rating: 5.0, reviews: 245, location: 'Madrid', zone: 'Chueca',
    experience: '9 años', price: 300, priceUnit: '/sesión',
    avatar: 'NG', gradient: 'linear-gradient(135deg, #f472b6, #ec4899)',
    badges: ['Noche Glam', 'FX Pro', 'Bodypaint UV'],
    description: 'Maquilladora artística especializada en looks de noche, efectos especiales y bodypaint UV para fiestas temáticas.',
    phone: '34612345008', instagram: 'nadiaglamour_makeup', topFinde: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NadiaGlamour&backgroundColor=f472b6',
  },
  {
    id: 9, name: 'Iván Stylez', role: 'makeup', specialty: 'Peluquería de Autor',
    rating: 4.9, reviews: 178, location: 'Madrid', zone: 'Chamberí',
    experience: '12 años', price: 280, priceUnit: '/sesión',
    avatar: 'IS', gradient: 'linear-gradient(135deg, #ffbc00, #f59e0b)',
    badges: ['Color Expert', 'Extensiones', 'Peinado Evento'],
    description: 'Estilista capilar de autor con experiencia en desfiles y eventos nocturnos. Extensiones, color fantasía y peinados de pasarela.',
    phone: '34612345009', instagram: 'ivanstylez_hair', topFinde: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IvanStylez&backgroundColor=ffbc00',
  },
  {
    id: 10, name: 'Alicia Moon', role: 'makeup', specialty: 'Estilismo Integral Nocturno',
    rating: 4.8, reviews: 134, location: 'Madrid', zone: 'Chueca',
    experience: '7 años', price: 350, priceUnit: '/sesión',
    avatar: 'AM', gradient: 'linear-gradient(135deg, #8c52ff, #00e5ff)',
    badges: ['Styling Completo', 'Asesoría Imagen', 'Luxury Brands'],
    description: 'Servicio integral de imagen nocturna: maquillaje, peinado y vestuario para artistas, DJs y personal de sala.',
    phone: '34612345010', instagram: 'aliciamoon_style', topFinde: false,
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AliciaMoon&backgroundColor=8c52ff',
  },
];

// Empresarios (for Last Call)
export const empresarios = [
  {
    id: 101, name: 'Club Onyx Madrid', avatar: 'ON', gradient: 'linear-gradient(135deg, #8c52ff, #6b21ff)',
    offers: [
      { title: '🚨 DJ Techno URGENTE esta noche', description: 'Necesitamos DJ de techno/minimal para sesión de 00h a 04h. El anterior canceló.', location: 'Madrid Centro', pay: '€350', expiresIn: 5400 },
      { title: '⚡ Camarero/a VIP para sábado', description: 'Buscamos personal de barra con experiencia en coctelería premium para zona VIP.', location: 'Malasaña', pay: '€150', expiresIn: 6200 },
    ],
  },
  {
    id: 102, name: 'Horizon Rooftop Madrid', avatar: 'HZ', gradient: 'linear-gradient(135deg, #00e5ff, #00ff88)',
    offers: [
      { title: '💄 Maquilladora para Neon Party', description: 'Evento temático UV. Necesitamos estilista con experiencia en pintura corporal fluorescente.', location: 'Salamanca', pay: '€200', expiresIn: 3800 },
    ],
  },
];
