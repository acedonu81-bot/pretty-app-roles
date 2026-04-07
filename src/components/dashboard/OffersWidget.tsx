import { Megaphone, Clock, MapPin, MessageCircle } from 'lucide-react';
import { empresarios } from '@/data/profiles';
import { toast } from 'sonner';

// Strict role-to-offer matching - only show offers relevant to the profession
const roleOfferKeywords: Record<string, string[]> = {
  dj: ['dj', 'techno', 'house', 'sesión', 'música', 'pinchar', 'set'],
  staff: ['camarero', 'camarera', 'vip', 'personal', 'barra', 'servicio', 'hostess', 'azafata', 'seguridad'],
  makeup: ['maquillad', 'estilista', 'peluquer', 'beauty', 'neon party', 'uv', 'pintura', 'corporal'],
  vestuario: ['vestuario', 'estilismo', 'moda', 'outfit', 'styling', 'ropa'],
  media: ['fotógrafo', 'fotograf', 'vídeo', 'video', 'contenido', 'aftermovie', 'ugc', 'tiktoker'],
  design: ['diseñ', 'flyer', 'visual', 'motion', 'vj', 'gráfic', 'led', 'mapping'],
  promotor: ['promot', 'rrpp', 'relaciones', 'lista'],
  ambassador: ['ambassador', 'promoción', 'flyer', 'qr', 'brand', 'street'],
};

interface OffersWidgetProps {
  title?: string;
  role?: string;
}

const OffersWidget = ({ title = 'Ofertas de Empresarios', role }: OffersWidgetProps) => {
  const allOffers = empresarios.flatMap(e =>
    e.offers.map(o => ({ ...o, author: e.name, avatar: e.avatar, gradient: e.gradient }))
  );

  // Strict filter: only show offers matching role keywords. No fallback to all.
  const keywords = role ? roleOfferKeywords[role] : null;
  const filteredOffers = keywords
    ? allOffers.filter(o => {
        const text = `${o.title} ${o.description}`.toLowerCase();
        return keywords.some(kw => text.includes(kw));
      })
    : allOffers;

  // If no matching offers for this role, don't show the widget at all
  if (filteredOffers.length === 0) return null;

  return (
    <div className="glass-panel p-4 mt-6" style={{ border: '1px solid rgba(212,175,55,0.1)' }}>
      <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
        <Megaphone size={14} style={{ color: '#D4AF37' }} />
        <span style={{ color: '#D4AF37' }}>{title}</span>
      </h3>
      <div className="space-y-2">
        {filteredOffers.map((offer, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--nightlife-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[0.55rem] font-bold flex-shrink-0"
              style={{ background: offer.gradient, color: 'white' }}>
              {offer.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{offer.title}</p>
              <div className="flex items-center gap-2 text-[0.6rem] text-muted-foreground mt-0.5">
                <span className="flex items-center gap-0.5"><MapPin size={9} /> {offer.location}</span>
                <span className="flex items-center gap-0.5"><Clock size={9} /> {Math.floor(offer.expiresIn / 3600)}h</span>
                <span className="font-bold" style={{ color: '#D4AF37' }}>{offer.pay}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.info('Ve a Mensajes para contactar con el empresario.')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[0.6rem] transition-all hover:scale-105 flex-shrink-0"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <MessageCircle size={12} /> Aplicar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersWidget;
