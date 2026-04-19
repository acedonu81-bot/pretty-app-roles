import { Music, Users, Camera, Brush, Building2, Utensils, Flag, Shirt, Palette, X } from 'lucide-react';

interface WelcomeScreenProps {
  role: string;
  displayName: string;
  onClose: () => void;
}

const welcomeMessages: Record<string, { icon: any; title: string; subject: string; body: string }> = {
  dj: {
    icon: Music,
    title: 'Música',
    subject: 'Tu cabina te espera.',
    body: 'Gracias por unirte como DJ a XPEAK. Ya puedes completar tu perfil y añadir tu enlace de Twitch o YouTube. Durante esta Fase Beta, aparecerás en el buscador nacional sin coste. Si vas a pinchar este fin de semana, pega tu link para que los empresarios te vean trabajar en tiempo real.',
  },
  staff: {
    icon: Users,
    title: 'Staff & Sala',
    subject: 'Listo para la acción.',
    body: 'Tu perfil de Staff ya está activo. En XPEAK, la puntualidad y la presencia son clave. Mantén tus datos de contacto actualizados para recibir avisos de contratación urgente de salas y eventos en tu zona.',
  },
  makeup: {
    icon: Palette,
    title: 'Imagen',
    subject: 'Tu estilo marca la diferencia.',
    body: 'Tu perfil de Maquillaje y Peluquería ya está activo. Sube fotos de alta calidad de tus trabajos y completa tu biografía técnica para que los organizadores validen tu estilo antes de la contratación.',
  },
  vestuario: {
    icon: Shirt,
    title: 'Vestuario & Moda',
    subject: 'Tu creatividad al frente.',
    body: 'Ya formas parte de la red de profesionales de moda de XPEAK. Sube tus mejores trabajos y asegúrate de completar tu biografía técnica. Tu perfil está optimizado para que empresas y marcas encuentren tu estilo rápidamente.',
  },
  media: {
    icon: Camera,
    title: 'Media & Contenido',
    subject: 'Haz que tu portfolio destaque.',
    body: 'Ya formas parte de la red de creadores de XPEAK. Sube tus mejores trabajos y asegúrate de completar tu biografía técnica. Tu perfil está optimizado para que empresas y marcas encuentren tu estilo visual rápidamente a través de nuestro buscador por provincias.',
  },
  design: {
    icon: Brush,
    title: 'Diseño & Visuales',
    subject: 'Tu creatividad tiene audiencia.',
    body: 'Tu perfil de Diseño ya está activo. Sube tu portfolio con flyers, motion graphics o identidad visual. Los empresarios buscan diseñadores que entiendan la noche. Muestra tu mejor trabajo.',
  },
  ambassador: {
    icon: Flag,
    title: 'Promoción',
    subject: 'Tu red es tu valor.',
    body: 'Ya formas parte de la red de promotores de XPEAK. Completa tu perfil con tus redes sociales y alcance. Los empresarios buscan promotores con presencia real en su zona.',
  },
  empresario: {
    icon: Building2,
    title: 'Empresario',
    subject: 'El talento que necesitas está aquí.',
    body: 'Ya puedes explorar el directorio nacional. Filtra por categoría y provincia para encontrar al profesional ideal. No cobramos comisiones por la contratación; el trato es directo entre tú y el talento. Reporta cualquier duda a info@xpeak.site.',
  },
};

const WelcomeScreen = ({ role, displayName, onClose }: WelcomeScreenProps) => {
  const msg = welcomeMessages[role] || welcomeMessages.dj;
  const Icon = msg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="glass-panel w-[500px] max-w-full p-8 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>

        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.15)', border: '2px solid rgba(212,175,55,0.3)' }}>
          <Icon size={28} style={{ color: '#D4AF37' }} />
        </div>

        <h2 className="text-xl font-bold mb-1">
          Bienvenido a <span style={{ color: '#D4AF37' }}>XPEAK</span>
        </h2>
        <p className="text-xs text-muted-foreground mb-1">{msg.title}</p>
        <p className="text-sm font-bold mb-4" style={{ color: '#D4AF37' }}>{msg.subject}</p>

        <div className="text-left px-3 py-4 rounded-lg mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nightlife-border)' }}>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Hola, <span className="font-bold text-foreground">{displayName}</span>. {msg.body}
          </p>
        </div>

        <p className="text-[0.75rem] text-muted-foreground mb-4">
          📧 Se ha enviado una copia de este mensaje a tu correo electrónico.<br />
          Firmado por <strong>Equipo XPEAK</strong> · info@xpeak.site
        </p>

        <button onClick={onClose}
          className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.01]"
          style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
          Ir a mi perfil
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
