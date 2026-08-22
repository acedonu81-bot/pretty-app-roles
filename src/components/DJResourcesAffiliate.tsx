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
 * NOTA (20 ago 2026): la mayoría de items ya usan P('ASIN') verificado a
 * mano en Amazon.es (reseñas 4+, volumen de ventas real). Solo queda un
 * A() sin resolver — "menaje catering profesional": término demasiado
 * amplio, ningún candidato con marca reconocible tenía volumen real de
 * reseñas. Mejor mantener búsqueda genérica ahí que forzar un ASIN flojo.
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
      { icon: Speaker, title: 'Monitor KRK Rokit 5 G4', desc: 'El monitor de estudio referencia para producir tus sets.', href: P('B07NDBM6F2') },
    ],
  },
  camareros: {
    label: 'Camareros', icon: Wine,
    items: [
      { icon: Wine, title: 'Coctelera de acero inoxidable', desc: 'Kit profesional para servicio en eventos (4.5★, +3.000 valoraciones).', href: P('B01MEHUA4I') },
      { icon: Sparkles, title: 'Pack de 3 delantales negros con bolsillos', desc: 'Imagen impecable para bodas y eventos (4.5★, +370 valoraciones).', href: P('B0C2HRJRVM') },
      { icon: UtensilsCrossed, title: 'Bandeja redonda antideslizante', desc: 'Servicio seguro en salón y barra (4.3★, +1.000 valoraciones).', href: P('B09CV5FHT8') },
    ],
  },
  staff: {
    label: 'Staff', icon: Sparkles,
    items: [
      { icon: Sparkles, title: 'Zapatillas de seguridad antideslizantes', desc: 'Comodidad para jornadas largas de evento (4.6★, +500 valoraciones).', href: P('B0FSXQQL7L') },
      { icon: Mic2, title: 'Walkie-talkie manos libres', desc: 'Comunicación entre equipo en eventos grandes (4.7★, pack de 4).', href: P('B07XY79RL4') },
      { icon: Wine, title: 'Kit de herramientas de camarero', desc: 'Funda profesional con 20 herramientas de bar (4.6★, +160 valoraciones).', href: P('B0BB8KPBC6') },
    ],
  },
  fotografo: {
    label: 'Fotógrafos', icon: Camera,
    items: [
      { icon: Aperture, title: 'Canon EF 50mm f/1.8 STM', desc: 'El objetivo más vendido de la historia (4.8★). Retrato de evento con poca luz.', href: P('B00X8MRBCW') },
      { icon: Camera, title: 'Godox TT600 flash speedlite', desc: 'El flash más vendido para iluminar bodas y salones.', href: P('B078TGPDLR') },
      { icon: Sparkles, title: 'SanDisk Extreme Pro SD 128GB', desc: 'La tarjeta best-seller: ráfagas y vídeo 4K sin cortes.', href: P('B07H9DVLBB') },
    ],
  },
  media: {
    label: 'Fotógrafos y vídeo', icon: Camera,
    items: [
      { icon: Aperture, title: 'Canon EF 50mm f/1.8 STM', desc: 'Retrato y ambiente con poca luz en eventos (4.7★, +12.000 valoraciones).', href: P('B00XKSBMQA') },
      { icon: Camera, title: 'DJI Osmo Mobile 6 (gimbal)', desc: 'Estabilizador para aftermovies y vídeo fluido de evento.', href: P('B0B7XD7R43') },
      { icon: Sparkles, title: 'SanDisk Extreme Pro SD 128GB', desc: 'Ráfagas y vídeo 4K sin cortes (4.7★, +89.000 valoraciones).', href: P('B09X7FXHVJ') },
    ],
  },
  maquillaje: {
    label: 'Maquillaje y peluquería', icon: Palette,
    items: [
      { icon: Palette, title: 'Set de brochas y esponja profesional', desc: 'Acabado impecable para novias y eventos (4.7★, +54.000 valoraciones).', href: P('B07FTXBNVL') },
      { icon: Sparkles, title: 'Neewer aro de luz 18"', desc: 'Luz uniforme para maquillaje profesional en cualquier sitio.', href: P('B01LXDNNBW') },
      { icon: Camera, title: 'Maletín de maquillaje con ruedas', desc: 'Transporta tu material con orden a cada bolo (4.6★, +2.500 valoraciones).', href: P('B07KBX8LL6') },
    ],
  },
  makeup: {
    label: 'Maquillaje y peluquería', icon: Palette,
    items: [
      { icon: Palette, title: 'Set de brochas y esponja profesional', desc: 'Acabado impecable para novias y eventos (4.7★, +54.000 valoraciones).', href: P('B07FTXBNVL') },
      { icon: Sparkles, title: 'Neewer aro de luz 18"', desc: 'Luz uniforme para maquillaje profesional en cualquier sitio.', href: P('B01LXDNNBW') },
      { icon: Camera, title: 'Maletín de maquillaje con ruedas', desc: 'Transporta tu material con orden a cada bolo (4.6★, +2.500 valoraciones).', href: P('B07KBX8LL6') },
    ],
  },
  'grupo-musical': {
    label: 'Grupos y músicos', icon: Music,
    items: [
      { icon: Mic2, title: 'Micrófono Shure SM58', desc: 'El micro vocal estándar del directo para bodas y eventos.', href: P('B000CZ0R42') },
      { icon: Speaker, title: 'JBL IRX112BT (PA portátil)', desc: 'Altavoz PA con batería para cóctel y ceremonia.', href: P('B081TNPGZV') },
      { icon: Music, title: 'Atril metálico portátil', desc: 'Comodidad para actuaciones largas (4.7★, +5.600 valoraciones).', href: P('B0BJZVXPD1') },
    ],
  },
  catering: {
    label: 'Catering', icon: UtensilsCrossed,
    items: [
      { icon: UtensilsCrossed, title: 'Chafing dish acero inox', desc: 'Mantiene la comida a temperatura durante todo el evento.', href: P('B0C7T33F8J') },
      { icon: Wine, title: 'Menaje y cristalería', desc: 'Presentación cuidada para banquetes.', href: A('menaje catering profesional') },
      { icon: Sparkles, title: 'Chaqueta de chef unisex', desc: 'Imagen y seguridad para el equipo (4.4★, +5.000 valoraciones).', href: P('B00GAXT37W') },
    ],
  },
  azafata: {
    label: 'Azafatas y hostess', icon: Sparkles,
    items: [
      { icon: Sparkles, title: 'Zapato de tacón bajo cómodo', desc: 'Aguanta turnos largos de congreso o evento sin sacrificar imagen (4.5★, +2.100 valoraciones).', href: P('B0CH3C5KWV') },
      { icon: Mic2, title: 'Powerbank slim con linterna', desc: 'Batería de bolsillo para turnos largos sin enchufe cerca (4.5★, +71.000 valoraciones).', href: P('B07PNL5STG') },
      { icon: UtensilsCrossed, title: 'Organizador de bolso para trabajo', desc: 'Lleva credencial, bolígrafo y básicos siempre a mano en stands y recepciones (4.0★).', href: P('B09X37Q92G') },
    ],
  },
  bailarin: {
    label: 'Bailarines', icon: Music,
    items: [
      { icon: Music, title: 'Zapatillas Bloch Essential Jazz', desc: 'Suela dividida para giros y flexibilidad en actuaciones de evento (marca especializada, 4.2★).', href: P('B00DVFVLG8') },
      { icon: Sparkles, title: 'Maillot clásico de ballet', desc: 'Movilidad completa para ensayo y coreografía (4.4★, +790 valoraciones).', href: P('B07434LBP4') },
      { icon: Wine, title: 'Rodillera de protección para danza', desc: 'Protección para suelos duros en salas de evento no acondicionadas (4.4★, +840 valoraciones).', href: P('B0C5GR2CLR') },
    ],
  },
};

// Alias de roles hacia el catálogo (los slugs del blog varían).
const ROLE_ALIAS: Record<string, string> = {
  camarero: 'camareros', foto: 'fotografo', 'disco-movil': 'dj',
  peluqueria: 'maquillaje', estilista: 'maquillaje', banda: 'grupo-musical',
};

// Color de acento por catálogo — antes el bloque era dorado fijo en TODOS
// los artículos, incluso en categorías con su propio color (Camareros=azul,
// Maquillaje=rosa...), rompiendo la consistencia del rediseño por categoría.
const CATALOG_ACCENT: Record<string, string> = {
  dj: '#D4AF37', camareros: '#2563EB', staff: '#059669',
  fotografo: '#4F46E5', media: '#4F46E5', maquillaje: '#DB2777', makeup: '#DB2777',
  'grupo-musical': '#DB2777', catering: '#B45309', azafata: '#2563EB', bailarin: '#DB2777',
};

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * @param role rol del blog (dj, camareros, fotografo…). Por defecto 'dj'
 * (retrocompatibilidad con los blogs de DJ que ya lo usaban sin props).
 * Roles sin catálogo real (general, empresario — organizadores no compran
 * "equipo profesional" de oficio) NO caen a DJ por defecto: antes cualquier
 * rol desconocido mostraba auriculares/controladora de DJ en un blog de
 * animadores o de organización de bodas, contenido irrelevante que ni
 * siquiera genera comisión real (mala señal para Amazon y para el lector).
 */
export default function DJResourcesAffiliate({ role = 'dj' }: { role?: string }) {
  const key = CATALOG[role] ? role : ROLE_ALIAS[role] && CATALOG[ROLE_ALIAS[role]] ? ROLE_ALIAS[role] : null;
  if (!key) return null;
  const cat = CATALOG[key];
  const HeaderIcon = cat.icon;
  const accent = CATALOG_ACCENT[key] ?? '#D4AF37';

  return (
    <section className="mt-10 mb-4">
      <div className="rounded-2xl p-5 sm:p-6"
        style={{ background: hexToRgba(accent, 0.05), border: `1px solid ${hexToRgba(accent, 0.18)}` }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: hexToRgba(accent, 0.12), border: `1px solid ${hexToRgba(accent, 0.25)}`, color: accent }}>
            <HeaderIcon size={16} />
          </div>
          <h3 className="text-base font-black" style={{ color: accent }}>Equipo recomendado para {cat.label}</h3>
        </div>
        <p className="text-xs mb-5" style={{ color: '#666' }}>
          Material que usan profesionales del sector. Selección de XPEAK.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cat.items.map(r => {
            const Icon = r.icon;
            return (
              <a key={r.title} href={r.href} target="_blank" rel="sponsored noopener noreferrer"
                className="flex flex-col rounded-xl p-4 transition-all hover:scale-[1.02]"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <Icon size={20} style={{ color: accent }} className="mb-2" />
                <p className="text-sm font-bold mb-1" style={{ color: '#111' }}>{r.title}</p>
                <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#555' }}>{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: accent }}>
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
