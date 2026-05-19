import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, Plus, Minus, X, ShoppingCart, CheckCircle, Clock, ChevronDown, ChevronUp, Camera, Headphones, UtensilsCrossed, Users, Video, Music, Mic2, Sparkles, Wine, Disc3, ClipboardList } from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface ServiceDef {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  note: string;
  href: string;
  priceType: 'fixed' | 'per-unit-hour' | 'per-person';
  priceMin: number;
  priceMax: number;
  unitPriceMin?: number;
  unitPriceMax?: number;
  perPersonMin?: number;
  perPersonMax?: number;
  hasQuantity: boolean;
  quantityLabel?: string;
  quantityMin?: number;
  hasHours: boolean;
  hoursDefault?: number;
  hasPersons: boolean;
  personsLabel?: string;
  bookWhen: string;
  essential?: boolean;
  guestFormula?: (g: number) => number;
}

interface CartItem {
  id: string;
  quantity: number;
  hours: number;
  persons: number;
}

/* ─── Catalogue ───────────────────────────────────────────────────────────── */

const SERVICES: ServiceDef[] = [
  {
    id: 'catering',
    emoji: '🍾', title: 'Catering', subtitle: '40–45% del presupuesto total',
    note: 'Banquete, cóctel y barra libre incluidos',
    href: '/contratar-catering',
    priceType: 'per-person', priceMin: 0, priceMax: 0,
    perPersonMin: 55, perPersonMax: 150,
    hasQuantity: false, hasHours: false, hasPersons: true, personsLabel: 'Invitados',
    bookWhen: '9–12 meses antes', essential: true,
  },
  {
    id: 'fotografo',
    emoji: '📸', title: 'Fotógrafo de boda', subtitle: '10–12% del presupuesto',
    note: 'Reportaje completo, entrega 4–6 semanas',
    href: '/contratar-fotografo',
    priceType: 'fixed', priceMin: 900, priceMax: 2800,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '12 meses antes', essential: true,
  },
  {
    id: 'dj',
    emoji: '🎧', title: 'DJ de boda', subtitle: '5–10% del presupuesto',
    note: 'Ceremonia, cóctel, cena y pista de baile',
    href: '/contratar-dj',
    priceType: 'fixed', priceMin: 450, priceMax: 1400,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '9 meses antes', essential: true,
  },
  {
    id: 'camareros',
    emoji: '🍽️', title: 'Camareros', subtitle: '5–8% del presupuesto',
    note: '1 camarero por cada 10–12 invitados',
    href: '/contratar-camareros',
    priceType: 'per-unit-hour', priceMin: 0, priceMax: 0,
    unitPriceMin: 12, unitPriceMax: 22,
    hasQuantity: true, quantityLabel: 'Camareros', quantityMin: 1,
    hasHours: true, hoursDefault: 8, hasPersons: false,
    bookWhen: '6 meses antes', essential: true,
    guestFormula: (g) => Math.max(2, Math.ceil(g / 12)),
  },
  {
    id: 'videografo',
    emoji: '🎬', title: 'Videógrafo', subtitle: '5–8% del presupuesto',
    note: 'Tráiler + vídeo completo con montaje',
    href: '/blog/videografo-bodas-precio',
    priceType: 'fixed', priceMin: 600, priceMax: 2200,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '9–12 meses antes',
  },
  {
    id: 'musica',
    emoji: '🎻', title: 'Música en vivo', subtitle: 'Ceremonia o cóctel',
    note: 'Cuarteto de cuerda, jazz, solista o grupo',
    href: '/blog/musica-en-vivo-para-bodas',
    priceType: 'fixed', priceMin: 350, priceMax: 1400,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '6 meses antes',
  },
  {
    id: 'mc',
    emoji: '🎤', title: 'Maestro de ceremonias', subtitle: 'Conduce todo el evento',
    note: 'Dinamiza discursos, cena y pista',
    href: '/blog/maestro-de-ceremonias-boda-precio-guia',
    priceType: 'fixed', priceMin: 500, priceMax: 1500,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '6 meses antes',
  },
  {
    id: 'maquillaje',
    emoji: '💄', title: 'Maquillaje nupcial', subtitle: '3–5% del presupuesto',
    note: 'Prueba previa + día del evento',
    href: '/contratar-maquillaje',
    priceType: 'per-person', priceMin: 0, priceMax: 0,
    perPersonMin: 150, perPersonMax: 400,
    hasQuantity: false, hasHours: false, hasPersons: true, personsLabel: 'Personas',
    bookWhen: '3–4 meses antes',
  },
  {
    id: 'barman',
    emoji: '🍹', title: 'Barman / Bartender', subtitle: 'Barra libre y cócteles',
    note: '1 barman por cada 40–50 invitados',
    href: '/contratar-camareros',
    priceType: 'per-unit-hour', priceMin: 0, priceMax: 0,
    unitPriceMin: 15, unitPriceMax: 25,
    hasQuantity: true, quantityLabel: 'Barmans', quantityMin: 1,
    hasHours: true, hoursDefault: 6, hasPersons: false,
    bookWhen: '4–6 meses antes',
    guestFormula: (g) => Math.max(1, Math.ceil(g / 45)),
  },
  {
    id: 'discomovil',
    emoji: '🎵', title: 'Disco móvil', subtitle: 'Para fincas sin instalación',
    note: 'DJ + sonido + iluminación + efectos',
    href: '/contratar-disco-movil',
    priceType: 'fixed', priceMin: 500, priceMax: 1600,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '6 meses antes',
  },
  {
    id: 'coordinadora',
    emoji: '📋', title: 'Coordinadora del día', subtitle: 'Para bodas de 80+ invitados',
    note: 'Gestiona todos los proveedores el día D',
    href: '/contratar-staff',
    priceType: 'fixed', priceMin: 350, priceMax: 900,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '3 meses antes',
  },
];

/* ─── Timeline ────────────────────────────────────────────────────────────── */

const TIMELINE = [
  { phase: '12+ meses', color: '#e74c3c', label: 'Urgente', tasks: ['Definir presupuesto', 'Reservar venue/finca', 'Contratar fotógrafo', 'Contratar videógrafo'] },
  { phase: '9–11 meses', color: '#e67e22', label: 'Esencial', tasks: ['Contratar catering', 'Contratar DJ o banda', 'Enviar save the dates', 'Elegir vestido/traje'] },
  { phase: '6–8 meses', color: '#f39c12', label: 'Importante', tasks: ['Florista y decoración', 'Maestro de ceremonias', 'Planificar música', 'Camareros y staff'] },
  { phase: '3–5 meses', color: '#27ae60', label: 'Preparación', tasks: ['Maquilladora/peluquería', 'Prueba de maquillaje', 'Enviar invitaciones', 'Lista musical con DJ'] },
  { phase: '1–2 meses', color: '#3498db', label: 'Ultimos detalles', tasks: ['Confirmar proveedores', 'Timings hora a hora', 'Sobres de pago', 'Ensayo ceremonia'] },
  { phase: '1 semana', color: '#9b59b6', label: 'Final', tasks: ['Reunión con proveedores', 'Confirmar horarios', 'Lista música final', 'Descansar y disfrutar'] },
];

const FAQS = [
  { q: '¿Con cuánta antelación hay que contratar el fotógrafo?', a: 'El fotógrafo es el proveedor que más rápido se reserva. Los buenos fotógrafos de boda en España se agotan entre 9 y 12 meses antes, especialmente para temporada alta (mayo–octubre). Contrátalos antes que cualquier otro proveedor.' },
  { q: '¿Cuántos camareros necesito para 100 personas?', a: 'Para un banquete sentado con servicio completo necesitas 1 camarero por cada 10–12 invitados: unos 8–10 para 100 personas. Para servicio tipo cóctel o buffet puedes bajar a 1 por cada 15–20 personas. La calculadora lo ajusta automáticamente.' },
  { q: '¿Cuánto cuesta una boda media en España 2026?', a: 'Entre 20.000€ y 30.000€ para 100–130 invitados. El catering representa el 40–45% del total. En Madrid y Barcelona el coste es un 20–30% superior a la media nacional.' },
  { q: '¿Necesito un wedding planner?', a: 'Depende de tu tiempo y organización. Lo que sí recomiendan todos los expertos es contratar al menos una coordinadora del día (desde 350€): puedes disfrutar de tu boda sin gestionar imprevistos tú mismo. El wedding planner completo (1.500–6.000€) es ideal si no tienes tiempo para coordinar a todos los proveedores.' },
  { q: '¿Qué es el Flash Booking de XPEAK?', a: 'Sistema de contratación urgente: publicas tu necesidad (fecha, zona y presupuesto) y los profesionales disponibles responden en menos de 60 minutos. Ideal para sustituciones de última hora o bodas con poco tiempo de planificación.' },
];

/* ─── Icons ───────────────────────────────────────────────────────────────── */

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  catering:      <UtensilsCrossed size={18} />,
  fotografo:     <Camera size={18} />,
  dj:            <Headphones size={18} />,
  camareros:     <Users size={18} />,
  videografo:    <Video size={18} />,
  musica:        <Music size={18} />,
  mc:            <Mic2 size={18} />,
  maquillaje:    <Sparkles size={18} />,
  barman:        <Wine size={18} />,
  discomovil:    <Disc3 size={18} />,
  coordinadora:  <ClipboardList size={18} />,
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function calcItemPrice(s: ServiceDef, item: CartItem): [number, number] {
  if (s.priceType === 'per-unit-hour') return [s.unitPriceMin! * item.quantity * item.hours, s.unitPriceMax! * item.quantity * item.hours];
  if (s.priceType === 'per-person') return [s.perPersonMin! * item.persons, s.perPersonMax! * item.persons];
  return [s.priceMin, s.priceMax];
}

function fmt(n: number) { return n.toLocaleString('es-ES') + ' €'; }

function monthsUntil(ds: string) {
  if (!ds) return 99;
  const [y, m] = ds.split('-').map(Number);
  const t = new Date();
  return (y - t.getFullYear()) * 12 + (m - 1 - t.getMonth());
}

/* ─── Counter ─────────────────────────────────────────────────────────────── */

function Counter({ label, value, min = 1, onInc, onDec }: {
  label: string; value: number; min?: number; onInc: () => void; onDec: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={onDec} disabled={value <= min}
          className="w-6 h-6 rounded flex items-center justify-center disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.1)' }}><Minus size={10} /></button>
        <span className="text-sm font-black w-6 text-center tabular-nums">{value}</span>
        <button onClick={onInc}
          className="w-6 h-6 rounded flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)' }}><Plus size={10} /></button>
      </div>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function PresupuestoBoda() {
  const [guests, setGuests] = useState(100);
  const [weddingDate, setWeddingDate] = useState('');
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'catering', quantity: 1, hours: 8, persons: 100 },
    { id: 'fotografo', quantity: 1, hours: 8, persons: 1 },
    { id: 'dj', quantity: 1, hours: 8, persons: 1 },
    { id: 'camareros', quantity: 9, hours: 8, persons: 1 },
  ]);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));

  const monthsLeft = useMemo(() => monthsUntil(weddingDate), [weddingDate]);
  const cartIds = useMemo(() => new Set(cart.map(c => c.id)), [cart]);

  function defaultItem(s: ServiceDef): CartItem {
    return {
      id: s.id,
      quantity: s.guestFormula ? Math.max(s.quantityMin ?? 1, s.guestFormula(guests)) : 1,
      hours: s.hoursDefault ?? 8,
      persons: s.id === 'catering' ? guests : 1,
    };
  }

  function addToCart(id: string) {
    if (cartIds.has(id)) return;
    const s = SERVICES.find(x => x.id === id)!;
    setCart(prev => [...prev, defaultItem(s)]);
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(c => c.id !== id));
  }

  function updateCart(id: string, field: keyof CartItem, delta: number) {
    setCart(prev => prev.map(c => {
      if (c.id !== id) return c;
      const s = SERVICES.find(x => x.id === id)!;
      const min = field === 'quantity' ? (s.quantityMin ?? 1) : 1;
      return { ...c, [field]: Math.max(min, c[field] + delta) };
    }));
  }

  function updateGuests(n: number) {
    const g = Math.max(10, n);
    setGuests(g);
    setCart(prev => prev.map(c => {
      const s = SERVICES.find(x => x.id === c.id)!;
      const updated = { ...c };
      if (s.id === 'catering') updated.persons = g;
      if (s.guestFormula) updated.quantity = Math.max(s.quantityMin ?? 1, s.guestFormula(g));
      return updated;
    }));
  }

  const cartWithDef = cart.map(item => {
    const s = SERVICES.find(x => x.id === item.id)!;
    const [pMin, pMax] = calcItemPrice(s, item);
    return { ...item, s, pMin, pMax };
  });

  const totalMin = cartWithDef.reduce((a, c) => a + c.pMin, 0);
  const totalMax = cartWithDef.reduce((a, c) => a + c.pMax, 0);

  /* ── Schemas ── */
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'Cómo planificar una boda paso a paso en España',
    description: 'Guía completa: presupuesto, proveedores y checklist mes a mes.',
    step: TIMELINE.map((t, i) => ({ '@type': 'HowToStep', position: i + 1, name: t.phase, text: t.tasks.join('. ') })),
  };

  return (
    <>
      <Helmet>
        <title>Planificador de Boda 2026 — Calculadora de Presupuesto y Checklist | XPEAK</title>
        <meta name="description" content="Calcula el presupuesto de tu boda al instante: añade DJ, catering, fotógrafo, camareros y más. Checklist mes a mes y timeline adaptado a tu fecha. Gratis." />
        <meta name="keywords" content="planificador boda España, presupuesto boda calculadora, checklist boda, cómo organizar una boda, wedding planner España, cuánto cuesta una boda 2026" />
        <link rel="canonical" href="https://xpeak.es/presupuesto-boda" />
        <meta property="og:title" content="Planificador de Boda — Calculadora + Checklist 2026 | XPEAK" />
        <meta property="og:description" content="Añade servicios, ajusta invitados y ve el presupuesto total en tiempo real. Checklist completo y timeline adaptado a tu fecha de boda." />
        <meta property="og:url" content="https://xpeak.es/presupuesto-boda" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://xpeak.es/og-image.jpg" />
        <meta property="og:site_name" content="XPEAK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://xpeak.es/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-6xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="/bodas" className="text-xs font-bold hidden sm:block hover:opacity-70" style={{ color: '#8E8EA0' }}>← Bodas</a>
            <a href="/auth" className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Unirse gratis
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>💒 Bodas · Calculadora de presupuesto</p>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 leading-tight">
            Planifica tu boda y calcula el presupuesto
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Añade los servicios que necesitas. Las fichas se van sumando en la cesta con el importe estimado total.
          </p>
        </section>

        {/* Setup bar */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
          <div className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 sm:items-center"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>Invitados</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateGuests(guests - 10)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Minus size={13} />
                  </button>
                  <span className="text-2xl font-black w-14 text-center tabular-nums" style={{ color: '#D4AF37' }}>{guests}</span>
                  <button onClick={() => updateGuests(guests + 10)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Plus size={13} />
                  </button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {[50, 80, 100, 150, 200].map(n => (
                    <button key={n} onClick={() => updateGuests(n)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: guests === n ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${guests === n ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: guests === n ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                      }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>Fecha de la boda</p>
              <input type="month" value={weddingDate} onChange={e => setWeddingDate(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: weddingDate ? '#D4AF37' : 'rgba(255,255,255,0.3)', outline: 'none', colorScheme: 'dark' }} />
              {weddingDate && monthsLeft > 0 && (
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{monthsLeft} meses para la boda</p>
              )}
            </div>
          </div>
        </section>

        {/* Main: 2 columns */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Service catalogue ── */}
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Toca "Añadir" para agregar un servicio a tu presupuesto
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map(s => {
                const inCart = cartIds.has(s.id);
                return (
                  <div key={s.id} className="rounded-xl p-4 flex flex-col gap-3 transition-all"
                    style={{
                      background: inCart ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${inCart ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.07)'}`,
                      opacity: inCart ? 0.75 : 1,
                    }}>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
                        {SERVICE_ICONS[s.id]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-black">{s.title}</p>
                          {s.essential && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                              style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', fontSize: '0.6rem' }}>
                              Esencial
                            </span>
                          )}
                        </div>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.note}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>
                          <Clock size={9} className="inline mr-1" style={{ color: '#D4AF37', opacity: 0.5 }} />
                          Reservar {s.bookWhen}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => inCart ? removeFromCart(s.id) : addToCart(s.id)}
                      className="w-full py-2 rounded-lg text-xs font-black transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
                      style={inCart
                        ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }
                        : { background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
                      {inCart
                        ? <><CheckCircle size={11} /> Añadido</>
                        : <><Plus size={11} /> Añadir al presupuesto</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Cart ── */}
          <div className="w-full lg:w-80 lg:sticky lg:top-6 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart size={15} style={{ color: '#D4AF37' }} />
              <p className="text-sm font-black" style={{ color: '#D4AF37' }}>Tu presupuesto</p>
              {cart.length > 0 && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: '#D4AF37', color: '#000' }}>{cart.length}</span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="rounded-2xl p-8 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p className="text-2xl mb-2">🛒</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Tu cesta está vacía.<br />Añade servicios desde la izquierda.</p>
              </div>
            ) : (
              <>
                {/* Fichas (cards stacked) */}
                <div className="space-y-2">
                  {cartWithDef.map(({ id, s, pMin, pMax, quantity, hours, persons }) => (
                    <div key={id} className="rounded-xl p-4"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}>
                            {SERVICE_ICONS[s.id] && <span style={{ transform: 'scale(0.8)', display: 'flex' }}>{SERVICE_ICONS[s.id]}</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black leading-snug">{s.title}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.subtitle}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(id)}
                          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center hover:opacity-70"
                          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                          <X size={10} />
                        </button>
                      </div>

                      {/* Controls */}
                      {(s.hasQuantity || s.hasHours || (s.hasPersons && id !== 'catering')) && (
                        <div className="flex gap-4 flex-wrap mb-3">
                          {s.hasQuantity && (
                            <Counter label={s.quantityLabel!} value={quantity} min={s.quantityMin}
                              onInc={() => updateCart(id, 'quantity', 1)} onDec={() => updateCart(id, 'quantity', -1)} />
                          )}
                          {s.hasHours && (
                            <Counter label="Horas" value={hours} min={1}
                              onInc={() => updateCart(id, 'hours', 1)} onDec={() => updateCart(id, 'hours', -1)} />
                          )}
                          {s.hasPersons && id !== 'catering' && (
                            <Counter label={s.personsLabel!} value={persons} min={1}
                              onInc={() => updateCart(id, 'persons', 1)} onDec={() => updateCart(id, 'persons', -1)} />
                          )}
                        </div>
                      )}
                      {id === 'catering' && (
                        <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                          {guests} invitados · {fmt(s.perPersonMin!)}–{fmt(s.perPersonMax!)} / persona
                        </p>
                      )}

                      {/* Price bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-1 rounded-full mr-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.round((pMax / Math.max(totalMax, 1)) * 100)}%`, background: 'rgba(212,175,55,0.5)' }} />
                        </div>
                        <p className="text-sm font-black tabular-nums flex-shrink-0" style={{ color: '#D4AF37' }}>
                          {fmt(pMin)}
                        </p>
                      </div>
                      <p className="text-xs text-right mt-0.5" style={{ color: 'rgba(212,175,55,0.4)' }}>hasta {fmt(pMax)}</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="rounded-2xl p-4"
                  style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(212,175,55,0.6)' }}>Total estimado</p>
                  <p className="text-2xl font-black tabular-nums" style={{ color: '#D4AF37' }}>{fmt(totalMin)}</p>
                  <p className="text-sm font-bold" style={{ color: 'rgba(212,175,55,0.4)' }}>hasta {fmt(totalMax)}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Orientativo · sin IVA</p>
                </div>

                <a href="/auth"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  <Zap size={14} /> Contratar estos servicios
                </a>
                <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Sin comisión · Flash Booking · Contratos PDF
                </p>
              </>
            )}

            {/* Urgency if date set */}
            {weddingDate && monthsLeft > 0 && (
              <div className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-black mb-3" style={{ color: '#D4AF37' }}>📅 Qué contratar ahora</p>
                {SERVICES.filter(s => {
                  const monthMap: Record<string, number> = {
                    '12 meses antes': 12, '9–12 meses antes': 9, '9 meses antes': 9,
                    '6 meses antes': 6, '4–6 meses antes': 4, '3–4 meses antes': 3, '3 meses antes': 3,
                  };
                  const pm = monthMap[s.bookWhen] ?? 0;
                  return monthsLeft <= pm + 2;
                }).slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center justify-between py-1.5 border-b text-xs"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{s.emoji} {s.title}</span>
                    <span className="font-bold" style={{ color: monthsLeft < (({ '12 meses antes': 12, '9 meses antes': 9, '9–12 meses antes': 9 })[s.bookWhen] ?? 0) ? '#e74c3c' : '#f39c12' }}>
                      {s.bookWhen}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Timeline full ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Checklist: planning de boda mes a mes</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Qué contratar y cuándo para que nada se quede sin organizar.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TIMELINE.map(phase => (
              <div key={phase.phase} className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderTop: `3px solid ${phase.color}` }}>
                <p className="text-xs font-black mb-0.5" style={{ color: phase.color }}>{phase.phase}</p>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{phase.label}</p>
                <ul className="space-y-1">
                  {phase.tasks.map(t => (
                    <li key={t} className="flex items-start gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: phase.color }}>·</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── What a wedding planner does ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="text-xl sm:text-2xl font-black mb-5">¿Necesito un wedding planner?</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <p>Un <strong style={{ color: '#fff' }}>wedding planner</strong> gestiona todo lo que tú no tienes tiempo de coordinar: desde encontrar los proveedores hasta asegurarse de que el fotógrafo llega a la hora el día de la boda. En España cobran entre 1.500€ y 6.000€ según el servicio contratado.</p>
            <p>Existen tres niveles: el <strong style={{ color: '#fff' }}>wedding planner completo</strong> (coordina desde el primer día), el <strong style={{ color: '#fff' }}>coordinador de mes</strong> (entra en el último mes) y la <strong style={{ color: '#fff' }}>coordinadora del día</strong> (solo el día D, desde 350€). Esta última es la que más recomiendan los expertos: puedes disfrutar de tu boda sin ser tú quien gestione los imprevistos.</p>
            <div className="rounded-xl p-5" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-xs font-black mb-3" style={{ color: '#D4AF37' }}>Distribución típica del presupuesto de boda</p>
              {[
                ['Catering (banquete + bebidas)', '40–45%'],
                ['Venue / Finca', '15–20%'],
                ['Fotografía y vídeo', '10–15%'],
                ['Flores y decoración', '8–12%'],
                ['DJ o música en vivo', '5–10%'],
                ['Personal de sala', '5–8%'],
                ['Maquillaje y peluquería', '3–5%'],
                ['MC y coordinación', '3–5%'],
              ].map(([label, pct]) => (
                <div key={label} className="flex justify-between py-1.5 border-b text-xs"
                  style={{ borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                  <span>{label}</span>
                  <span className="font-bold" style={{ color: '#D4AF37' }}>{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-14">
          <h2 className="text-xl font-black mb-5">Preguntas frecuentes</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={faq.q} className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <button onClick={() => setOpenFaqs(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                  className="w-full flex items-center justify-between p-4 text-left gap-3">
                  <p className="text-sm font-bold">{faq.q}</p>
                  {openFaqs.has(i) ? <ChevronUp size={14} style={{ color: '#D4AF37', flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />}
                </button>
                {openFaqs.has(i) && (
                  <p className="px-4 pb-4 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Related guides ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-base font-black mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Guías relacionadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/blog/10-errores-contratar-dj-boda', emoji: '🎧', title: 'Los 10 errores al contratar un DJ para tu boda' },
              { href: '/blog/cuanto-cuesta-una-boda-en-espana', emoji: '💰', title: '¿Cuánto cuesta una boda en España 2026?' },
              { href: '/blog/cuantos-camareros-necesito-para-mi-boda', emoji: '🍽️', title: 'Cuántos camareros necesito para mi boda' },
              { href: '/blog/musica-en-vivo-para-bodas', emoji: '🎻', title: 'Música en vivo para bodas: precios 2026' },
              { href: '/blog/maestro-de-ceremonias-boda-precio-guia', emoji: '🎤', title: 'Maestro de ceremonias: precio y guía' },
              { href: '/blog/maquillaje-nupcial-precio-guia', emoji: '💄', title: 'Maquillaje nupcial: precios y cómo elegir' },
            ].map(p => (
              <a key={p.href} href={p.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-lg">{p.emoji}</span>
                <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.title} →</p>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
          <div className="rounded-2xl p-7 sm:p-10 text-center"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl sm:text-2xl font-black mb-3">¿Lista para contratar?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
              XPEAK conecta novios con los mejores profesionales de boda en España. Sin comisión, contratos digitales y Flash Booking en menos de 1h.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/auth" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Publicar oferta gratis
              </a>
              <a href="/bodas" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                Ver todos los servicios
              </a>
            </div>
          </div>
        </section>

        <FooterPublic />
      </div>
    </>
  );
}
