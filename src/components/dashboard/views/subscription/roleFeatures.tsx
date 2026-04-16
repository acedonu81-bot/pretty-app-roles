import { Music2, Users, Camera, Palette, Megaphone, Star, Building2, Scissors } from 'lucide-react';

export type PlanFeatures = { starter: string[]; business: string[]; agency: string[] };

export const ROLE_FEATURES: Record<string, { icon: React.ReactNode; label: string; free: string[]; plans: PlanFeatures }> = {
  dj: {
    icon: <Music2 size={16} />,
    label: 'DJ / Artista',
    free: [
      'Perfil visible en el directorio',
      'Géneros musicales ilimitados',
      'Mensajería interna con empresarios',
      'Recibir Flash Bookings (sin aplicar)',
    ],
    plans: {
      starter: [
        'Badge verificado en tu ficha',
        'Rider técnico visible en perfil',
        'Estadísticas básicas de visitas',
        'Aparecer en búsquedas por género',
        'Compra packs de streaming (1h, 5h, 15h, 30h)',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento #1–48 en el directorio',
        'Link de sesión (hearthis / Mixcloud / SoundCloud)',
        'Streaming en vivo (1h/mes incluida, +€2.99/h)',
        'Fan Club — monetiza tus seguidores (12% comisión)',
        'Flash Booking: aplica a ofertas urgentes',
        'Estadísticas avanzadas + exportar',
        'Sello Business dorado en ficha',
      ],
      agency: [
        'Todo lo de Business',
        'Hasta 5 perfiles de artistas gestionados',
        'Panel de agencia con analíticas globales',
        'Rider técnico descargable por empresarios',
        'EPK digital (Electronic Press Kit)',
        'Visibilidad máxima garantizada',
        'Sello Agencia exclusivo',
      ],
    },
  },
  rookie: {
    icon: <Star size={16} />,
    label: 'Artista Promesa',
    free: [
      'Perfil visible como Promesa',
      'Géneros musicales ilimitados',
      'Recibir votos de la comunidad',
      'Mensajería interna',
    ],
    plans: {
      starter: [
        'Badge verificado en tu ficha',
        'Conteo de votos destacado',
        'Estadísticas de visitas básicas',
        'Notificaciones de nuevos votos',
        'Compra packs de streaming (1h, 5h, 15h, 30h)',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento prioritario entre Promesas',
        'Link de sesión (hearthis / Mixcloud / SoundCloud)',
        'Streaming en vivo (1h/mes incluida, +€2.99/h)',
        'Fan Club — empieza a monetizar',
        'Flash Booking: aplica a ofertas urgentes',
        'Sello Business dorado en ficha',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión por representante / mánager',
        'Analíticas de crecimiento de fanbase',
        'EPK digital para booking',
        'Visibilidad máxima en directorio Promesas',
      ],
    },
  },
  staff: {
    icon: <Users size={16} />,
    label: 'Staff & RRPP',
    free: [
      'Perfil visible en directorio Staff',
      'Especialidades ilimitadas',
      'Mensajería interna',
      'Recibir Flash Bookings',
    ],
    plans: {
      starter: [
        'Badge verificado — más contratos',
        'Especialidades ilimitadas (hostess, RRPP...)',
        'Estadísticas de visitas básicas',
        'Aparecer en búsquedas por zona y especialidad',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento #1–48 en directorio',
        'Flash Booking: aplica a urgencias de sala',
        'Historial de eventos verificado',
        'Estadísticas avanzadas',
        'Sello Business dorado en ficha',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión de equipo (hasta 5 perfiles)',
        'Panel de empresa de personal',
        'Visibilidad máxima garantizada',
        'Sello Agencia — para empresas de staff',
      ],
    },
  },
  makeup: {
    icon: <Scissors size={16} />,
    label: 'Maquillaje & Peluquería',
    free: [
      'Perfil visible en directorio',
      'Servicios ilimitados',
      'Mensajería interna',
    ],
    plans: {
      starter: [
        'Badge verificado en tu ficha',
        'Servicios ilimitados (maquillaje, nail art...)',
        'Estadísticas de visitas básicas',
        'Aparecer en búsquedas por tipo de evento',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento prioritario en directorio',
        'Portafolio fotográfico ampliado (hasta 20 imágenes)',
        'Flash Booking: urgencias de producción',
        'Estadísticas avanzadas + exportar',
        'Sello Business dorado',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión de equipo (hasta 5 perfiles)',
        'Panel de agencia de imagen y estilismo',
        'Visibilidad máxima garantizada',
        'Sello Agencia exclusivo',
      ],
    },
  },
  vestuario: {
    icon: <Palette size={16} />,
    label: 'Vestuario & Moda',
    free: [
      'Perfil visible en directorio',
      'Especialidades ilimitadas',
      'Mensajería interna',
    ],
    plans: {
      starter: [
        'Badge verificado en tu ficha',
        'Especialidades ilimitadas',
        'Estadísticas de visitas básicas',
        'Portafolio fotográfico básico',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento prioritario',
        'Portafolio ampliado (hasta 20 imágenes)',
        'Vídeo lookbook incrustado',
        'Flash Booking: pedidos urgentes de estilismo',
        'Sello Business dorado',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión de equipo de estilismo',
        'Panel de agencia de moda',
        'Visibilidad máxima garantizada',
        'Sello Agencia exclusivo',
      ],
    },
  },
  media: {
    icon: <Camera size={16} />,
    label: 'Media & Contenido',
    free: [
      'Perfil visible en directorio',
      'Especialidades ilimitadas',
      'Mensajería interna',
    ],
    plans: {
      starter: [
        'Badge verificado en tu ficha',
        'Especialidades ilimitadas (foto, vídeo, drone...)',
        'Portafolio fotográfico / vídeo básico',
        'Estadísticas de visitas básicas',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento prioritario en directorio',
        'Portafolio ampliado (hasta 20 piezas)',
        'Showreel de vídeo incrustado',
        'Flash Booking: cobertura urgente de eventos',
        'Estadísticas avanzadas',
        'Sello Business dorado',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión de equipo (hasta 5 perfiles)',
        'Panel de agencia de contenido',
        'Visibilidad máxima garantizada',
        'Sello Agencia exclusivo',
      ],
    },
  },
  design: {
    icon: <Palette size={16} />,
    label: 'Diseño & Visuales',
    free: [
      'Perfil visible en directorio',
      'Especialidades ilimitadas',
      'Mensajería interna',
    ],
    plans: {
      starter: [
        'Badge verificado en tu ficha',
        'Especialidades ilimitadas (VJing, mapping, gráfico...)',
        'Portafolio visual básico',
        'Estadísticas de visitas básicas',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento prioritario en directorio',
        'Demo reel / vídeo de mapping incrustado',
        'Flash Booking: urgencias visuales de sala',
        'Estadísticas avanzadas',
        'Sello Business dorado',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión de equipo creativo (hasta 5 perfiles)',
        'Panel de estudio de diseño',
        'Visibilidad máxima garantizada',
        'Sello Agencia exclusivo',
      ],
    },
  },
  promotor: {
    icon: <Megaphone size={16} />,
    label: 'Promotor',
    free: [
      'Perfil visible en directorio',
      'Especialidades ilimitadas',
      'Mensajería interna',
    ],
    plans: {
      starter: [
        'Badge verificado en tu ficha',
        'Especialidades ilimitadas (club, festival, privado...)',
        'Estadísticas básicas de visitas',
        'Aparecer en búsquedas por tipo de evento',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento prioritario en directorio',
        'Publicar Flash Jobs para contratar staff',
        'Historial de eventos verificado',
        'Estadísticas avanzadas',
        'Sello Business dorado',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión de equipo promotor (hasta 5 perfiles)',
        'Panel de promotora / agencia de eventos',
        'Visibilidad máxima garantizada',
        'Sello Agencia exclusivo',
      ],
    },
  },
  ambassador: {
    icon: <Star size={16} />,
    label: 'Brand Ambassador',
    free: [
      'Perfil visible en directorio',
      'Especialidades ilimitadas',
      'Mensajería interna',
    ],
    plans: {
      starter: [
        'Badge verificado en tu ficha',
        'Especialidades ilimitadas',
        'Estadísticas básicas de visitas',
        'Aparecer en búsquedas por zona',
      ],
      business: [
        'Todo lo de Starter',
        'Posicionamiento prioritario',
        'Flash Booking: acciones urgentes de marca',
        'Portafolio de campañas realizadas',
        'Estadísticas avanzadas',
        'Sello Business dorado',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión de equipo de embajadores',
        'Panel de agencia de activaciones',
        'Visibilidad máxima garantizada',
        'Sello Agencia exclusivo',
      ],
    },
  },
  empresario: {
    icon: <Building2 size={16} />,
    label: 'Empresario / Sala',
    free: [
      'Buscar profesionales en el directorio',
      'Publicar 1 Flash Job activo',
      'Mensajería interna (hasta 5 conversaciones)',
      'Guardar hasta 3 favoritos',
    ],
    plans: {
      starter: [
        'Flash Jobs ilimitados activos',
        'Favoritos ilimitados',
        'Filtros avanzados (zona, precio, disponibilidad)',
        'Estadísticas de tus publicaciones',
      ],
      business: [
        'Todo lo de Starter',
        'Verificación de sala con sello oficial',
        'Acceso prioritario a artistas Elite',
        'Ver tarifas de todos los profesionales',
        'Historial de contrataciones',
        'Soporte prioritario 24/7',
        'Sello Business en tus ofertas',
      ],
      agency: [
        'Todo lo de Business',
        'Gestión de hasta 5 salas / venues',
        'Panel de promotora con analíticas',
        'API de integración (próximamente)',
        'Visibilidad máxima en Flash Booking',
        'Sello Agencia exclusivo',
      ],
    },
  },
};

export const FALLBACK_ROLE = 'dj';
