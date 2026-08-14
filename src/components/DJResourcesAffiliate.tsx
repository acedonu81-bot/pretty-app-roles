import {
  Headphones, Disc3, Music, ExternalLink, Wine, Camera, Aperture,
  Palette, Sparkles, UtensilsCrossed, Mic2, Speaker, type LucideIcon,
} from 'lucide-react';

/**
 * Bloque de recursos/equipo recomendado con enlaces de afiliado Amazon (tag
 * xpeak-21), ESPECÍFICO por rol: cada oficio ve el equipo que de verdad usa
 * (camarero → sacacorchos, DJ → auriculares, fotógrafo → objetivos…). Esto es
 * contenido genuino y útil — reduce el riesgo de sanción de Amazon frente a un
 * bloque genérico repetido en cientos de páginas.
 *
 * NOTA: los href apuntan a búsquedas específicas de Amazon. Amazon prefiere
 * enlaces a producto concreto (/dp/ASIN) — cuando tengas los ASIN desde
 * SiteStripe, sustituye cada href por el enlace /dp/ correspondiente.
 */

type Resource = { icon: LucideIcon; title: string; desc: string; href: string };

// P() = enlace a PRODUCTO concreto (/dp/ASIN) — el único que Amazon permite y
// que genera comisión. A() = búsqueda específica (fallback donde aún no hay
// ASIN; sustituir por P('ASIN') cuando lo saques de SiteStripe).
const P = (asin: string) => `https://www.amazon.es/dp/${asin}?tag=xpeak-21`;
const A = (q: string) => `https://www.amazon.es/s?k=${encodeURIComponent(q)}&tag=xpeak-21`;

// Catálogo por rol (dbRole). Cada rol ve 3 productos de su oficio.
const CATALOG: Record<string, { label: string; icon: LucideIcon; items: Resource[] }> = {
  dj: {
    label: 'DJs', icon: Disc3,
    items: [
      { icon: Headphones, title: 'Pioneer DJ HDJ-X5', desc: 'Los auriculares DJ más vendidos: monitorización limpia a alto volumen.', href: P('B0759FLG32') },
      { icon: Disc3, title: 'Pioneer DDJ-FLX4', desc: 'La controladora de entrada más popular para practicar y bolos.', href: P('B0BLSJZC94') },
      { icon: Speaker, title: 'Monitor KRK Rokit 5', desc: 'El monitor de estudio referencia para producir tus sets.', href: A('KRK Rokit 5 monitor estudio') },
    ],
  },
  camareros: {
    label: 'Camareros', icon: Wine,
    items: [
      { icon: Wine, title: 'Set de sacacorchos y coctelería', desc: 'Kit profesional para servicio en eventos.', href: A('kit cocteleria profesional camarero') },
      { icon: Sparkles, title: 'Delantal y uniforme de camarero', desc: 'Imagen impecable para bodas y eventos.', href: A('delantal camarero profesional negro') },
      { icon: UtensilsCrossed, title: 'Bandeja antideslizante', desc: 'Servicio seguro en salón y barra.', href: A('bandeja camarero antideslizante') },
    ],
  },
  staff: {
    label: 'Staff', icon: Sparkles,
    items: [
      { icon: Sparkles, title: 'Uniforme y calzado de trabajo', desc: 'Comodidad para jornadas largas de evento.', href: A('zapatos trabajo comodos negros antideslizante') },
      { icon: Mic2, title: 'Petaca / intercom de staff', desc: 'Comunicación entre equipo en eventos grandes.', href: A('walkie talkie manos libres evento') },
      { icon: Wine, title: 'Kit de servicio', desc: 'Herramientas básicas para hostelería de eventos.', href: A('kit camarero profesional') },
    ],
  },
  fotografo: {
    label: 'Fotógrafos', icon: Camera,
    items: [
      { icon: Aperture, title: 'Canon EF 50mm f/1.8 STM', desc: 'El objetivo más vendido de la historia (4.8★). Retrato de evento con poca luz.', href: P('B00X8MRBCW') },
      { icon: Camera, title: 'Godox flash speedlite', desc: 'El flash más vendido para iluminar bodas y salones.', href: A('Godox flash speedlite') },
      { icon: Sparkles, title: 'SanDisk Extreme Pro SD 128GB', desc: 'La tarjeta best-seller: ráfagas y vídeo 4K sin cortes.', href: P('B07H9DVLBB') },
    ],
  },
  media: {
    label: 'Fotógrafos y vídeo', icon: Camera,
    items: [
      { icon: Aperture, title: 'Objetivo luminoso 50mm', desc: 'Retrato y ambiente con poca luz en eventos.', href: A('objetivo 50mm f1.8') },
      { icon: Camera, title: 'Estabilizador / gimbal', desc: 'Vídeo fluido para aftermovies de evento.', href: A('gimbal estabilizador camara') },
      { icon: Sparkles, title: 'Tarjetas SD alta velocidad', desc: 'Ráfagas y vídeo 4K sin cortes.', href: A('tarjeta sd 128gb alta velocidad') },
    ],
  },
  maquillaje: {
    label: 'Maquillaje y peluquería', icon: Palette,
    items: [
      { icon: Palette, title: 'Set de brochas profesional', desc: 'Acabado impecable para novias y eventos.', href: A('set brochas maquillaje profesional') },
      { icon: Sparkles, title: 'Luz de anillo portátil', desc: 'Luz uniforme para trabajar en cualquier sitio.', href: A('aro de luz maquillaje profesional') },
      { icon: Camera, title: 'Neceser / organizador', desc: 'Transporta tu material con orden a cada bolo.', href: A('maletin maquillaje profesional') },
    ],
  },
  makeup: {
    label: 'Maquillaje y peluquería', icon: Palette,
    items: [
      { icon: Palette, title: 'Set de brochas profesional', desc: 'Acabado impecable para novias y eventos.', href: A('set brochas maquillaje profesional') },
      { icon: Sparkles, title: 'Luz de anillo portátil', desc: 'Luz uniforme para trabajar en cualquier sitio.', href: A('aro de luz maquillaje profesional') },
      { icon: Camera, title: 'Neceser / organizador', desc: 'Transporta tu material con orden a cada bolo.', href: A('maletin maquillaje profesional') },
    ],
  },
  'grupo-musical': {
    label: 'Grupos y músicos', icon: Music,
    items: [
      { icon: Mic2, title: 'Micrófono vocal', desc: 'Voz clara en directo para bodas y eventos.', href: A('microfono vocal shure') },
      { icon: Speaker, title: 'Sistema PA portátil', desc: 'Sonido para cóctel y ceremonia.', href: A('altavoz pa portatil bateria') },
      { icon: Music, title: 'Atril y accesorios', desc: 'Comodidad para actuaciones largas.', href: A('atril partituras musico') },
    ],
  },
  catering: {
    label: 'Catering', icon: UtensilsCrossed,
    items: [
      { icon: UtensilsCrossed, title: 'Chafing dish / mantenedor de calor', desc: 'Comida a temperatura durante todo el evento.', href: A('chafing dish mantenedor calor buffet') },
      { icon: Wine, title: 'Menaje y cristalería', desc: 'Presentación cuidada para banquetes.', href: A('menaje catering profesional') },
      { icon: Sparkles, title: 'Uniforme de cocina', desc: 'Imagen y seguridad para el equipo.', href: A('chaqueta cocina profesional') },
    ],
  },
};

// Alias de roles hacia el catálogo (los slugs del blog varían).
const ROLE_ALIAS: Record<string, string> = {
  camarero: 'camareros', foto: 'fotografo', 'disco-movil': 'dj',
  peluqueria: 'maquillaje', estilista: 'maquillaje', banda: 'grupo-musical',
};

/**
 * @param role rol del blog (dj, camareros, fotografo…). Por defecto 'dj'
 * (retrocompatibilidad con los blogs de DJ que ya lo usaban sin props).
 */
export default function DJResourcesAffiliate({ role = 'dj' }: { role?: string }) {
  const key = CATALOG[role] ? role : (CATALOG[ROLE_ALIAS[role]] ? ROLE_ALIAS[role] : 'dj');
  const cat = CATALOG[key];
  const HeaderIcon = cat.icon;

  return (
    <section className="mt-10 mb-4">
      <div className="rounded-2xl p-5 sm:p-6"
        style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.18)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#8A6D0F' }}>
            <HeaderIcon size={16} />
          </div>
          <h3 className="text-base font-black" style={{ color: '#D4AF37' }}>Equipo recomendado para {cat.label}</h3>
        </div>
        <p className="text-xs mb-5" style={{ color: 'rgba(212,175,55,0.6)' }}>
          Material que usan profesionales del sector. Selección de XPEAK.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cat.items.map(r => {
            const Icon = r.icon;
            return (
              <a key={r.title} href={r.href} target="_blank" rel="sponsored noopener noreferrer"
                className="flex flex-col rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <Icon size={20} style={{ color: '#8A6D0F' }} className="mb-2" />
                <p className="text-sm font-bold mb-1" style={{ color: '#111' }}>{r.title}</p>
                <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#555' }}>{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: '#8A6D0F' }}>
                  Ver en Amazon <ExternalLink size={11} />
                </span>
              </a>
            );
          })}
        </div>

        <p className="text-[0.65rem] mt-4 leading-relaxed" style={{ color: '#999' }}>
          XPEAK puede recibir una comisión por las compras realizadas a través de estos enlaces de Amazon, sin coste
          adicional para ti. Solo recomendamos equipo que consideramos útil para profesionales del sector.
        </p>
      </div>
    </section>
  );
}
