import { useParams, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, Star, Shield, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CATEGORIES } from '@/pages/CityLanding';

/**
 * OccasionLanding — eje ocasión × rol (ej: /boda/contratar-dj).
 * Calca la query comercial que domina la competencia (Gigstarter) y la
 * supera con answer box + FAQPage que ellos no tienen. Sin filtro de ciudad:
 * lista profesionales del rol a nivel nacional.
 */

// Fecha de última modificación (congelada al renderizar; en prerender = build).
// Señal de frescura para motores generativos, que penalizan contenido stale.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

interface Prof { id: string; display_name: string; photo_url: string | null; bio: string | null; city: string | null; role: string; score: number; slug: string | null; is_verified: boolean; }

// Roles (categoría) → roles reales en la tabla profiles. Reutiliza la lógica de CityLanding.
const ROLE_MAP: Record<string, string[]> = {
  dj: ['dj'], fotografo: ['media'], catering: ['empresario'], camareros: ['staff'],
  'grupo-musical': ['dj'], animador: ['staff'], mago: ['staff'], maquillaje: ['makeup'],
};

function useRoleProfessionals(categorySlug: string) {
  const [profs, setProfs] = useState<Prof[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setProfs([]);
    const roles = ROLE_MAP[categorySlug] ?? ['dj'];
    const map = (p: any): Prof => ({ id: p.user_id, display_name: p.display_name ?? 'Profesional', photo_url: p.photo_url, bio: p.bio, city: p.city, role: p.role, score: p.score ?? 0, slug: p.slug, is_verified: p.is_verified ?? false });
    supabase
      .from('profiles')
      .select('user_id,display_name,photo_url,bio,city,role,score,slug,is_verified')
      .in('role', roles)
      .eq('is_primary', true)
      .order('score', { ascending: false })
      .limit(6)
      .then(({ data }) => { setProfs((data ?? []).map(map)); setLoaded(true); });
  }, [categorySlug]);

  return { profs, loaded };
}

const ProfGrid = ({ profs }: { profs: Prof[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {profs.map(p => (
      <a key={p.id} href={p.slug ? `/p/${p.slug}` : '/directorio'}
        className="p-4 rounded-xl transition-all hover:scale-[1.02] block"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden" style={{ background: 'rgba(212,175,55,0.15)' }}>
            {p.photo_url
              ? <img src={p.photo_url} alt={`${p.display_name}, profesional verificado en XPEAK`} loading="lazy" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-sm font-black" style={{ color: '#D4AF37' }}>{p.display_name.charAt(0)}</div>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate flex items-center gap-1">
              {p.display_name}
              {p.is_verified && <CheckCircle size={12} style={{ color: '#D4AF37' }} />}
            </p>
            {p.city && <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.city}</p>}
          </div>
        </div>
        {p.bio && <p className="text-xs mt-2 line-clamp-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.bio}</p>}
      </a>
    ))}
  </div>
);

type OccasionInfo = {
  label: string;        // "Boda"
  slug: string;         // "boda"
  labelLong: string;    // "tu boda"
  // Contenido por rol: keyword del rol → textos específicos ocasión×rol
  answer: (rol: string) => string;                          // respuesta rápida extraíble
  intro: (rol: string) => string;                           // párrafo intro
  faqs: (rol: string, precio: string) => { q: string; a: string }[];
  precio: Record<string, string>;                           // rango orientativo por rol
};

// Rango orientativo por rol y ocasión (precio típico, string libre)
const PRECIO_BODA: Record<string, string> = {
  DJ: '400€–900€', Fotógrafo: '800€–2.500€', Catering: '60€–140€/persona',
  Camareros: '120€–180€/servicio', 'Grupo Musical': '900€–3.000€', Animador: '150€–400€', Mago: '250€–600€',
};
const PRECIO_CUMPLE: Record<string, string> = {
  DJ: '200€–500€', Fotógrafo: '250€–600€', Catering: '25€–50€/persona',
  Camareros: '100€–150€/servicio', Animador: '100€–250€', Mago: '150€–350€',
};
const PRECIO_EMPRESA: Record<string, string> = {
  DJ: '350€–800€', Fotógrafo: '400€–1.200€', Catering: '40€–90€/persona',
  Camareros: '120€–180€/servicio', Speaker: '600€–3.000€', 'Grupo Musical': '800€–2.500€',
};
const PRECIO_COMUNION: Record<string, string> = {
  Fotógrafo: '300€–800€', Catering: '30€–65€/persona', Camareros: '100€–160€/servicio',
  Animador: '120€–300€', Mago: '180€–400€', DJ: '250€–550€',
};
const PRECIO_FIESTA: Record<string, string> = {
  DJ: '250€–700€', Fotógrafo: '250€–600€', Catering: '30€–70€/persona',
  Camareros: '100€–170€/servicio', Animador: '120€–300€', Mago: '180€–450€',
};

// Constructor de FAQs genérico por ocasión — coherente entre todas
const buildFaqs = (occLabel: string, occLong: string, antelacion: string) =>
  (rol: string, precio: string) => [
    { q: `¿Cuánto cuesta contratar ${rol.toLowerCase()} para ${occLong}?`, a: `El precio orientativo de ${rol.toLowerCase()} para ${occLong} en España es ${precio}, según experiencia, duración y zona. En XPEAK todos los perfiles muestran su tarifa pública antes de contactar, sin sorpresas.` },
    { q: `¿XPEAK cobra comisión por contratar ${rol.toLowerCase()} para ${occLong}?`, a: 'No. XPEAK es completamente gratuito para quien organiza el evento. El contrato se cierra directamente entre tú y el profesional, sin comisión ni intermediarios.' },
    { q: `¿Con cuánta antelación debo contratar ${rol.toLowerCase()} para ${occLong}?`, a: `${antelacion} Para reservas urgentes, el Flash Booking de XPEAK encuentra disponibilidad en menos de 1 hora.` },
    { q: `¿Los ${rol.toLowerCase()} de XPEAK están verificados?`, a: 'Sí. Cada semana se verifican perfiles: identidad, experiencia y trabajos previos. Puedes ver valoraciones reales antes de contratar.' },
  ];

export const OCCASIONS: Record<string, OccasionInfo> = {
  boda: {
    label: 'Boda', slug: 'boda', labelLong: 'tu boda',
    precio: PRECIO_BODA,
    answer: (rol) =>
      `Para contratar ${rol.toLowerCase()} para una boda en España sin comisión, publica tu evento en XPEAK y recibe propuestas de profesionales verificados en menos de 1 hora. El precio orientativo es ${PRECIO_BODA[rol] ?? 'variable según el servicio'} y el contrato se firma directamente con el profesional, sin intermediarios ni comisión para quien contrata.`,
    intro: (rol) =>
      `Una boda es uno de los eventos donde más importa acertar con el ${rol.toLowerCase()}. En XPEAK conectas directamente con ${rol.toLowerCase()} verificados con experiencia en bodas de toda España: comparas perfiles, precios públicos y valoraciones, y cierras el contrato sin pagar ninguna comisión. Publica tu boda y recibe propuestas reales en menos de una hora con Flash Booking.`,
    faqs: buildFaqs('Boda', 'una boda', 'Los mejores profesionales de boda se reservan con 3–6 meses de antelación, sobre todo en temporada alta (mayo–octubre).'),
  },
  cumpleanos: {
    label: 'Cumpleaños', slug: 'cumpleanos', labelLong: 'tu cumpleaños',
    precio: PRECIO_CUMPLE,
    answer: (rol) =>
      `Para contratar ${rol.toLowerCase()} para un cumpleaños en España sin comisión, publica tu fiesta en XPEAK y recibe propuestas de profesionales verificados en menos de 1 hora. El precio orientativo es ${PRECIO_CUMPLE[rol] ?? 'variable según el servicio'} y contratas directamente al profesional, sin intermediarios ni comisión.`,
    intro: (rol) =>
      `Un cumpleaños memorable empieza por elegir bien el ${rol.toLowerCase()}. En XPEAK encuentras ${rol.toLowerCase()} verificados para fiestas de cumpleaños de todas las edades en toda España: precios públicos, valoraciones reales y contratación sin comisión. Publica tu fiesta y recibe propuestas en menos de una hora.`,
    faqs: buildFaqs('Cumpleaños', 'un cumpleaños', 'Para cumpleaños suele bastar con 2–4 semanas de antelación, aunque en fechas señaladas conviene reservar antes.'),
  },
  'evento-empresa': {
    label: 'Evento de Empresa', slug: 'evento-empresa', labelLong: 'tu evento de empresa',
    precio: PRECIO_EMPRESA,
    answer: (rol) =>
      `Para contratar ${rol.toLowerCase()} para un evento de empresa en España sin comisión, publica tu evento en XPEAK y recibe propuestas de profesionales verificados con factura en menos de 1 hora. El precio orientativo es ${PRECIO_EMPRESA[rol] ?? 'variable según el servicio'}, con contrato y factura directos, sin comisión para la empresa.`,
    intro: (rol) =>
      `Los eventos corporativos exigen ${rol.toLowerCase()} fiables y con factura. En XPEAK conectas con ${rol.toLowerCase()} verificados con experiencia en juntas, cenas de empresa, galas y team building por toda España: precios públicos, contrato digital y factura, sin comisión. Publica tu evento y recibe propuestas en menos de una hora.`,
    faqs: buildFaqs('Evento de Empresa', 'un evento de empresa', 'Para eventos corporativos recomendamos reservar con 3–8 semanas de antelación según el tamaño del evento.'),
  },
  comunion: {
    label: 'Comunión', slug: 'comunion', labelLong: 'tu comunión',
    precio: PRECIO_COMUNION,
    answer: (rol) =>
      `Para contratar ${rol.toLowerCase()} para una comunión en España sin comisión, publica tu celebración en XPEAK y recibe propuestas de profesionales verificados en menos de 1 hora. El precio orientativo es ${PRECIO_COMUNION[rol] ?? 'variable según el servicio'} y contratas directamente al profesional, sin comisión.`,
    intro: (rol) =>
      `Una comunión reúne a toda la familia y merece un buen ${rol.toLowerCase()}. En XPEAK encuentras ${rol.toLowerCase()} verificados especializados en comuniones por toda España: precios públicos, valoraciones y contratación sin comisión. Publica tu celebración y recibe propuestas en menos de una hora.`,
    faqs: buildFaqs('Comunión', 'una comunión', 'La temporada de comuniones (mayo–junio) concentra mucha demanda: reserva con 2–4 meses de antelación.'),
  },
  'fiesta-privada': {
    label: 'Fiesta Privada', slug: 'fiesta-privada', labelLong: 'tu fiesta privada',
    precio: PRECIO_FIESTA,
    answer: (rol) =>
      `Para contratar ${rol.toLowerCase()} para una fiesta privada en España sin comisión, publica tu evento en XPEAK y recibe propuestas de profesionales verificados en menos de 1 hora. El precio orientativo es ${PRECIO_FIESTA[rol] ?? 'variable según el servicio'} y contratas directamente al profesional, sin intermediarios.`,
    intro: (rol) =>
      `Una fiesta privada en villa, ático o local necesita un ${rol.toLowerCase()} a la altura. En XPEAK conectas con ${rol.toLowerCase()} verificados con experiencia en eventos privados por toda España, incluidos destinos como Ibiza y Marbella: precios públicos, contrato directo y sin comisión. Publica tu fiesta y recibe propuestas en menos de una hora.`,
    faqs: buildFaqs('Fiesta Privada', 'una fiesta privada', 'Para fiestas privadas conviene reservar con 2–4 semanas; en destinos y fechas de temporada alta, con más margen.'),
  },
};

// Qué roles tienen sentido para cada ocasión (evita combinaciones absurdas)
export const ROLES_POR_OCASION: Record<string, string[]> = {
  boda: ['dj', 'fotografo', 'catering', 'camareros', 'grupo-musical', 'animador'],
  cumpleanos: ['dj', 'fotografo', 'catering', 'animador', 'mago'],
  'evento-empresa': ['dj', 'fotografo', 'catering', 'camareros', 'speaker'],
  comunion: ['fotografo', 'catering', 'animador', 'mago', 'dj'],
  'fiesta-privada': ['dj', 'fotografo', 'catering', 'camareros', 'animador'],
};

export default function OccasionLanding() {
  const { pathname } = useLocation();
  // /boda/contratar-dj → occasion='boda', rol='dj'
  const parts = pathname.split('/').filter(Boolean);
  const occasionSlug = parts[0] ?? '';
  const categorySlug = (parts[1] ?? '').replace('contratar-', '');

  const occ = OCCASIONS[occasionSlug];
  const catData = CATEGORIES[categorySlug];
  const rolesOk = ROLES_POR_OCASION[occasionSlug]?.includes(categorySlug);

  if (!occ || !catData || !rolesOk) {
    return (
      <>
        <Helmet><meta name="robots" content="noindex, follow" /></Helmet>
        <Navigate to={catData ? `/contratar-${categorySlug}` : '/'} replace />
      </>
    );
  }

  const rol = catData.keyword;                       // "DJ", "Fotógrafo"...
  const precio = occ.precio[rol] ?? 'variable';
  const canonical = `/${occ.slug}/contratar-${categorySlug}`;
  const { profs, loaded } = useRoleProfessionals(categorySlug);
  const h1 = `Contratar ${rol} para ${occ.label} en España`;
  const desc = occ.answer(rol);

  const faqStructured = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: occ.faqs(rol, precio).map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const serviceData = {
    '@context': 'https://schema.org', '@type': 'Service', name: h1,
    provider: { '@type': 'Organization', name: 'XPEAK', url: 'https://xpeak.es' },
    areaServed: { '@type': 'Country', name: 'España' },
    description: desc, url: `https://xpeak.es${canonical}`,
    serviceType: `Contratación de ${rol} para ${occ.label.toLowerCase()}`,
    // Señal de frescura: las IAs priorizan contenido con dateModified reciente.
    // En SSR/prerender se congela con la fecha del build (lo que leen los bots).
    dateModified: BUILD_DATE,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Sin comisión para quien contrata' },
  };
  const breadcrumbData = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://xpeak.es' },
      { '@type': 'ListItem', position: 2, name: `Contratar ${rol}`, item: `https://xpeak.es/contratar-${categorySlug}` },
      { '@type': 'ListItem', position: 3, name: occ.label, item: `https://xpeak.es${canonical}` },
    ],
  };

  const otrosRoles = ROLES_POR_OCASION[occ.slug].filter(s => s !== categorySlug);

  return (
    <>
      <Helmet>
        <title>{`Contratar ${rol} para ${occ.label} sin comisión — XPEAK`}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`https://xpeak.es${canonical}`} />
        <meta property="og:title" content={`Contratar ${rol} para ${occ.label} sin comisión — XPEAK`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`https://xpeak.es${canonical}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(serviceData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqStructured)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-5xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/blog" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>Blog</a>
            <a href="/precios" className="text-xs font-bold hidden sm:block transition-opacity hover:opacity-70" style={{ color: '#3d3d4e' }}>Precios</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} style={{ color: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>{occ.label} · España</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">{h1}</h1>
          <p className="text-sm sm:text-lg mb-8 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{occ.intro(rol)}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/auth" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Publicar {occ.label.toLowerCase()} gratis
            </a>
            <a href={`/directorio/${categorySlug}`} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Ver directorio <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* Answer box extraíble — la señal que Perplexity/AI Overviews copian */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
          <div className="rounded-2xl px-5 py-4" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.04))', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>Respuesta rápida</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{occ.answer(rol)}</p>
          </div>
        </section>

        <section className="border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { label: `Precio ${rol} para ${occ.label.toLowerCase()}`, value: precio, icon: <Star size={16} /> },
              { label: 'Flash Booking', value: 'En menos de 1h', icon: <Zap size={16} /> },
              { label: 'Comisión XPEAK', value: '0% para quien contrata', icon: <Shield size={16} /> },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>{s.icon}</div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                  <p className="text-sm font-black">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {loaded && profs.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <h2 className="text-xl sm:text-2xl font-black mb-2">{rol} disponibles para {occ.labelLong}</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Profesionales verificados activos en XPEAK. Contacto directo, sin intermediarios.</p>
            <ProfGrid profs={profs} />
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <a href={`/directorio/${categorySlug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, fontWeight: 700, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none' }}>
                Ver todos los {rol} <ArrowRight size={13} />
              </a>
            </div>
          </section>
        )}

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Cómo contratar {rol} para {occ.labelLong} con XPEAK</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Crea tu cuenta gratis', body: 'Regístrate como organizador en menos de 2 minutos. Sin tarjeta.' },
              { step: '02', title: 'Publica tu evento', body: `Describe ${occ.labelLong}, fecha, horario y presupuesto. Flash Booking lo distribuye al instante.` },
              { step: '03', title: 'Cierra el contrato', body: 'Elige al profesional y firma el contrato digital con un clic. PDF listo para facturación.' },
            ].map(s => (
              <div key={s.step} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-3xl font-black mb-3" style={{ color: 'rgba(212,175,55,0.25)' }}>{s.step}</p>
                <p className="text-sm font-bold mb-1.5">{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8">Preguntas frecuentes — {rol} para {occ.label}</h2>
          <div className="space-y-4">
            {occ.faqs(rol, precio).map(faq => (
              <div key={faq.q} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="text-sm font-bold mb-2">{faq.q}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Otros roles para la misma ocasión — interlinking */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-6">Otros profesionales para {occ.labelLong}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otrosRoles.map(slug => (
              <a key={slug} href={`/${occ.slug}/contratar-${slug}`}
                className="flex items-center gap-2 p-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {CATEGORIES[slug]?.keyword ?? slug}
              </a>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 text-center">
          <div className="rounded-2xl p-7 sm:p-10" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl sm:text-3xl font-black mb-3">¿Buscas {rol} para {occ.labelLong}?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Únete gratis — sin comisión, contratos automáticos, Flash Booking en menos de 1h.</p>
            <a href="/auth" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              <Zap size={15} /> Empezar gratis
            </a>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
