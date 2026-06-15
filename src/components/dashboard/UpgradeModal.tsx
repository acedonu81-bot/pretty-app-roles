import { X, CheckCircle, Crown, Zap, Shield } from 'lucide-react';

// Role-specific upsell copy — what they unlock at Business tier
const ROLE_UPSELL: Record<string, { headline: string; features: string[]; cta: string }> = {
  dj: {
    headline: 'Los mejores DJs están en Business',
    features: [
      'Posicionamiento #1–48 — te ven antes que nadie',
      'Link de sesión (Mixcloud, SoundCloud, hearthis.at)',
      'Streaming en vivo con chat de empresarios',
      'Fan Club — cobra a tus seguidores directamente',
      'Flash Booking — aplica a ofertas urgentes de sala',
      'Estadísticas avanzadas de visitas y mensajes',
    ],
    cta: 'Subir a Business y empezar a cobrar',
  },
  rookie: {
    headline: 'Despega como Artista Promesa',
    features: [
      'Posicionamiento prioritario entre Promesas',
      'Streaming en vivo con chat',
      'Fan Club — empieza a monetizar desde el primer día',
      'Flash Booking — no dejes pasar ninguna oferta',
      'Sello Business dorado en tu ficha',
    ],
    cta: 'Activar Business y crecer más rápido',
  },
  staff: {
    headline: 'Consigue más contratos de sala',
    features: [
      'Posicionamiento prioritario en directorio',
      'Flash Booking — urgencias de sala en tiempo real',
      'Historial de eventos verificado en tu ficha',
      'Estadísticas avanzadas de visitas',
      'Sello Business dorado — más confianza',
    ],
    cta: 'Activar Business y llenar mi agenda',
  },
  makeup: {
    headline: 'Tu talento merece más visibilidad',
    features: [
      'Posicionamiento prioritario en directorio',
      'Portafolio ampliado hasta 20 fotos',
      'Flash Booking — producciones urgentes',
      'Estadísticas de visitas avanzadas',
      'Sello Business dorado en tu ficha',
    ],
    cta: 'Activar Business y conseguir más clientes',
  },
  vestuario: {
    headline: 'Lleva tu estudio al siguiente nivel',
    features: [
      'Posicionamiento prioritario en directorio',
      'Lookbook en vídeo incrustado en tu ficha',
      'Portafolio ampliado hasta 20 imágenes',
      'Flash Booking — pedidos urgentes de estilismo',
      'Sello Business dorado',
    ],
    cta: 'Activar Business y mostrar mi mejor trabajo',
  },
  media: {
    headline: 'Más eventos. Más clientes. Más ingresos.',
    features: [
      'Posicionamiento prioritario en directorio',
      'Showreel de vídeo incrustado en tu ficha',
      'Portafolio ampliado hasta 20 piezas',
      'Flash Booking — cobertura urgente de eventos',
      'Estadísticas avanzadas',
    ],
    cta: 'Activar Business y no perder ningún evento',
  },
  design: {
    headline: 'Las mejores salas buscan diseñadores Business',
    features: [
      'Posicionamiento prioritario en directorio',
      'Demo reel de mapping / visuales incrustado',
      'Flash Booking — urgencias visuales de sala',
      'Estadísticas avanzadas',
      'Sello Business dorado',
    ],
    cta: 'Activar Business y empezar a trabajar en salas top',
  },
  promotor: {
    headline: 'Organiza más eventos. Contrata mejor.',
    features: [
      'Posicionamiento prioritario en directorio',
      'Publicar Flash Jobs para contratar staff ilimitados',
      'Historial de eventos verificado',
      'Estadísticas avanzadas de contratación',
      'Sello Business dorado',
    ],
    cta: 'Activar Business y publicar mi primera urgencia',
  },
  ambassador: {
    headline: 'Las marcas top solo contactan perfiles verificados',
    features: [
      'Posicionamiento prioritario en directorio',
      'Portafolio de campañas realizadas en tu ficha',
      'Flash Booking — acciones urgentes de marca',
      'Estadísticas avanzadas',
      'Sello Business dorado',
    ],
    cta: 'Activar Business y atraer grandes marcas',
  },
  empresario: {
    headline: 'Encuentra al profesional perfecto en minutos',
    features: [
      'Flash Jobs ilimitados activos simultáneamente',
      'Verificación de sala con sello oficial',
      'Acceso prioritario a artistas Business y Agencia',
      'Ver tarifas de todos los profesionales',
      'Historial de contrataciones completo',
    ],
    cta: 'Activar Business y contratar sin límites',
  },
};

const FALLBACK_UPSELL = ROLE_UPSELL.dj;

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  role?: string;
  trigger?: string; // what action triggered it
  onNavigateSubscription?: () => void;
}

const UpgradeModal = ({ open, onClose, role, trigger, onNavigateSubscription }: UpgradeModalProps) => {
  if (!open) return null;
  const upsell = ROLE_UPSELL[role ?? ''] ?? FALLBACK_UPSELL;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
      <div className="relative min-h-full flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 animate-[fadeIn_0.25s_ease]"
        style={{ background: '#f9f8f6', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 0 60px rgba(212,175,55,0.08)' }}
        onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg transition-all hover:bg-white/5">
          <X size={16} className="text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)' }}>
            <Crown size={20} style={{ color: '#000' }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Plan Business</p>
            <h3 className="text-base font-black leading-tight" style={{ color: '#D4AF37' }}>{upsell.headline}</h3>
          </div>
        </div>

        {/* Trigger context */}
        {trigger && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <Zap size={12} style={{ color: '#D4AF37', flexShrink: 0 }} />
            <span className="text-muted-foreground">{trigger}</span>
          </div>
        )}

        {/* Features */}
        <div className="space-y-2.5">
          {upsell.features.map(f => (
            <div key={f} className="flex items-start gap-2.5">
              <CheckCircle size={13} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
              <span className="text-sm" style={{ color: 'rgba(22,20,18,0.88)' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Price pill */}
        <div className="flex items-center justify-between p-3 rounded-xl"
          style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <div>
            <p className="text-xs text-muted-foreground">Desde</p>
            <p className="text-xl font-black" style={{ color: '#D4AF37' }}>€14,99 <span className="text-xs font-normal text-muted-foreground">/mes</span></p>
            <p className="text-xs text-muted-foreground">€10,49/mes con plan anual · 15 días gratis</p>
          </div>
          <Shield size={28} style={{ color: 'rgba(212,175,55,0.3)' }} />
        </div>

        {/* CTA */}
        <button
          onClick={() => { onClose(); onNavigateSubscription?.(); }}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }}>
          {upsell.cta}
        </button>
        <button onClick={onClose} className="text-xs text-muted-foreground text-center hover:text-foreground transition-colors">
          Seguir con el plan gratuito
        </button>
      </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
