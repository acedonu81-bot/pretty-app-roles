import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Zap, Plus, Minus, X, ShoppingCart, CheckCircle, Clock, ChevronDown, ChevronUp,
  Camera, Headphones, UtensilsCrossed, Users, Video, Music, Mic2, Sparkles, Wine,
  Disc3, ClipboardList, MapPin, TableProperties, Share2, RotateCcw, Link2,
  TrendingDown, Lightbulb, Euro, Send, AlertTriangle, CalendarDays, Heart,
  BookOpen, ArrowRight,
} from 'lucide-react';
import FooterPublic from '@/components/FooterPublic';

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface ServiceDef {
  id: string; title: string; subtitle: string; note: string;
  href: string; dirHref?: string;
  priceType: 'fixed' | 'per-unit-hour' | 'per-person';
  priceMin: number; priceMax: number;
  unitPriceMin?: number; unitPriceMax?: number;
  perPersonMin?: number; perPersonMax?: number;
  hasQuantity: boolean; quantityLabel?: string; quantityMin?: number;
  hasHours: boolean; hoursDefault?: number;
  hasPersons: boolean; personsLabel?: string;
  bookWhen: string; essential?: boolean;
  guestFormula?: (g: number) => number;
  tipPct?: number;
}

interface CartItem { id: string; quantity: number; hours: number; persons: number; }

interface LeadForm { name: string; email: string; phone: string; notes: string; }

/* ─── City multipliers ────────────────────────────────────────────────────── */

const CITIES = [
  { value: 'nacional', label: 'España (media)', mult: 1.0 },
  { value: 'madrid', label: 'Madrid', mult: 1.28 },
  { value: 'barcelona', label: 'Barcelona', mult: 1.25 },
  { value: 'ibiza', label: 'Ibiza / Baleares', mult: 1.35 },
  { value: 'pais-vasco', label: 'País Vasco', mult: 1.18 },
  { value: 'sevilla', label: 'Sevilla / Andalucía', mult: 0.92 },
  { value: 'valencia', label: 'Valencia / Levante', mult: 0.95 },
  { value: 'galicia', label: 'Galicia', mult: 0.88 },
  { value: 'canarias', label: 'Canarias', mult: 0.90 },
  { value: 'castilla', label: 'Castilla / Interior', mult: 0.85 },
];

/* ─── Catalogue ───────────────────────────────────────────────────────────── */

const SERVICES: ServiceDef[] = [
  {
    id: 'catering', title: 'Catering', subtitle: '40–45% del presupuesto total',
    note: 'Banquete, cóctel y barra libre incluidos',
    href: '/contratar-catering', dirHref: '/directorio/catering',
    priceType: 'per-person', priceMin: 0, priceMax: 0, perPersonMin: 55, perPersonMax: 150,
    hasQuantity: false, hasHours: false, hasPersons: true, personsLabel: 'Invitados',
    bookWhen: '9–12 meses antes', essential: true, tipPct: 5,
  },
  {
    id: 'fotografo', title: 'Fotógrafo de boda', subtitle: '10–12% del presupuesto',
    note: 'Reportaje completo, entrega 4–6 semanas',
    href: '/contratar-fotografo', dirHref: '/directorio/fotografo',
    priceType: 'fixed', priceMin: 900, priceMax: 2800,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '12 meses antes', essential: true, tipPct: 10,
  },
  {
    id: 'dj', title: 'DJ de boda', subtitle: '5–10% del presupuesto',
    note: 'Ceremonia, cóctel, cena y pista de baile',
    href: '/contratar-dj', dirHref: '/directorio/dj',
    priceType: 'fixed', priceMin: 450, priceMax: 1400,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '9 meses antes', essential: true, tipPct: 10,
  },
  {
    id: 'camareros', title: 'Camareros', subtitle: '5–8% del presupuesto',
    note: '1 camarero por cada 10–12 invitados',
    href: '/contratar-camareros', dirHref: '/directorio/camareros',
    priceType: 'per-unit-hour', priceMin: 0, priceMax: 0, unitPriceMin: 12, unitPriceMax: 22,
    hasQuantity: true, quantityLabel: 'Camareros', quantityMin: 1,
    hasHours: true, hoursDefault: 8, hasPersons: false,
    bookWhen: '6 meses antes', essential: true, tipPct: 8,
    guestFormula: (g) => Math.max(2, Math.ceil(g / 12)),
  },
  {
    id: 'videografo', title: 'Videógrafo', subtitle: '5–8% del presupuesto',
    note: 'Tráiler + vídeo completo con montaje',
    href: '/blog/videografo-bodas-precio', dirHref: '/directorio/fotografo',
    priceType: 'fixed', priceMin: 600, priceMax: 2200,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '9–12 meses antes', tipPct: 10,
  },
  {
    id: 'musica', title: 'Música en vivo', subtitle: 'Ceremonia o cóctel',
    note: 'Cuarteto de cuerda, jazz, solista o grupo',
    href: '/blog/musica-en-vivo-para-bodas', dirHref: '/directorio/grupo-musical',
    priceType: 'fixed', priceMin: 350, priceMax: 1400,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '6 meses antes', tipPct: 8,
  },
  {
    id: 'mc', title: 'Maestro de ceremonias', subtitle: 'Conduce todo el evento',
    note: 'Dinamiza discursos, cena y pista',
    href: '/blog/maestro-de-ceremonias-boda-precio-guia', dirHref: '/directorio/animador',
    priceType: 'fixed', priceMin: 500, priceMax: 1500,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '6 meses antes', tipPct: 8,
  },
  {
    id: 'maquillaje', title: 'Maquillaje nupcial', subtitle: '3–5% del presupuesto',
    note: 'Prueba previa + día del evento',
    href: '/contratar-maquillaje', dirHref: '/directorio/maquilladora',
    priceType: 'per-person', priceMin: 0, priceMax: 0, perPersonMin: 150, perPersonMax: 400,
    hasQuantity: false, hasHours: false, hasPersons: true, personsLabel: 'Personas',
    bookWhen: '3–4 meses antes', tipPct: 10,
  },
  {
    id: 'barman', title: 'Barman / Bartender', subtitle: 'Barra libre y cócteles',
    note: '1 barman por cada 40–50 invitados',
    href: '/contratar-camareros', dirHref: '/directorio/camareros',
    priceType: 'per-unit-hour', priceMin: 0, priceMax: 0, unitPriceMin: 15, unitPriceMax: 25,
    hasQuantity: true, quantityLabel: 'Barmans', quantityMin: 1,
    hasHours: true, hoursDefault: 6, hasPersons: false,
    bookWhen: '4–6 meses antes', tipPct: 10,
    guestFormula: (g) => Math.max(1, Math.ceil(g / 45)),
  },
  {
    id: 'discomovil', title: 'Disco móvil', subtitle: 'Para fincas sin instalación',
    note: 'DJ + sonido + iluminación + efectos',
    href: '/contratar-disco-movil', dirHref: '/directorio/dj',
    priceType: 'fixed', priceMin: 500, priceMax: 1600,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '6 meses antes', tipPct: 8,
  },
  {
    id: 'coordinadora', title: 'Coordinadora del día', subtitle: 'Para bodas de 80+ invitados',
    note: 'Gestiona todos los proveedores el día D',
    href: '/contratar-staff', dirHref: '/directorio/staff',
    priceType: 'fixed', priceMin: 350, priceMax: 900,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '3 meses antes', tipPct: 5,
  },
  {
    id: 'saxo', title: 'Saxofonista', subtitle: 'Para ceremonia o cóctel',
    note: 'Acompaña la entrada o ameniza el aperitivo',
    href: '/blog/saxofonista-bodas-precio', dirHref: '/directorio/grupo-musical',
    priceType: 'fixed', priceMin: 300, priceMax: 800,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '4–6 meses antes', tipPct: 8,
  },
  {
    id: 'peluqueria', title: 'Peluquería nupcial', subtitle: 'Recogido o peinado de novia',
    note: 'Incluye prueba previa',
    href: '/contratar-maquillaje', dirHref: '/directorio/maquilladora',
    priceType: 'per-person', priceMin: 0, priceMax: 0, perPersonMin: 100, perPersonMax: 280,
    hasQuantity: false, hasHours: false, hasPersons: true, personsLabel: 'Personas',
    bookWhen: '3–4 meses antes', tipPct: 10,
  },
  {
    id: 'photobooth', title: 'Photo Booth', subtitle: 'Diversión garantizada',
    note: 'Cabina de fotos con atrezzo y álbum digital',
    href: '/directorio/fotografo', dirHref: '/directorio/fotografo',
    priceType: 'fixed', priceMin: 300, priceMax: 700,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '3–4 meses antes',
  },
  {
    id: 'flores', title: 'Florista y decoración', subtitle: '8–12% del presupuesto',
    note: 'Centros de mesa, ramo nupcial y arco',
    href: '/bodas', dirHref: '/directorio/decorador',
    priceType: 'fixed', priceMin: 800, priceMax: 3500,
    hasQuantity: false, hasHours: false, hasPersons: false,
    bookWhen: '6 meses antes',
  },
];

/* ─── Checklist ───────────────────────────────────────────────────────────── */

const CHECKLIST_PHASES = [
  { phase: '12+ meses', color: '#e74c3c', label: 'Urgente', tasks: ['Definir presupuesto total', 'Reservar venue / finca', 'Contratar fotógrafo', 'Contratar videógrafo', 'Elegir fecha definitiva'] },
  { phase: '9–11 meses', color: '#e67e22', label: 'Esencial', tasks: ['Contratar catering', 'Contratar DJ o banda', 'Enviar save the dates', 'Elegir vestido / traje', 'Reservar luna de miel'] },
  { phase: '6–8 meses', color: '#f39c12', label: 'Importante', tasks: ['Florista y decoración', 'Maestro de ceremonias', 'Planificar música ceremonia', 'Camareros y staff', 'Elegir menú con catering'] },
  { phase: '3–5 meses', color: '#27ae60', label: 'Preparación', tasks: ['Maquilladora / peluquería', 'Prueba de maquillaje', 'Enviar invitaciones físicas', 'Lista musical con DJ', 'Confirmar alojamiento invitados'] },
  { phase: '1–2 meses', color: '#3498db', label: 'Últimos detalles', tasks: ['Confirmar todos los proveedores', 'Timings hora a hora', 'Sobres de pago preparados', 'Ensayo ceremonia', 'Confirmar menú definitivo'] },
  { phase: '1 semana', color: '#9b59b6', label: 'Final', tasks: ['Reunión con proveedores clave', 'Confirmar horarios llegada', 'Lista música final al DJ', 'Seating plan definitivo', 'Descansar y disfrutar'] },
];

const ALL_TASKS = CHECKLIST_PHASES.flatMap((p, pi) => p.tasks.map((t, ti) => ({ id: `${pi}-${ti}`, text: t, color: p.color, phase: p.phase })));

/* ─── Fun facts ───────────────────────────────────────────────────────────── */

const FUN_FACTS = [
  { text: 'La boda media en España dura 11 horas.' },
  { text: 'El 78% de los novios dice que el DJ es el proveedor que más disfrutaron.' },
  { text: 'Las fotos son lo que más lamentan no haber invertido más los recién casados.' },
  { text: 'Cada invitado bebe de media 1,5 botellas de vino + 3 cañas durante la boda.' },
  { text: 'Junio y septiembre son los meses más demandados. Reserva 14 meses antes en temporada alta.' },
  { text: 'Las parejas que contratan sin intermediarios ahorran de media un 18% en proveedores.' },
];

/* ─── Icons ───────────────────────────────────────────────────────────────── */

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  catering: <UtensilsCrossed size={18} />, fotografo: <Camera size={18} />,
  dj: <Headphones size={18} />, camareros: <Users size={18} />,
  videografo: <Video size={18} />, musica: <Music size={18} />,
  mc: <Mic2 size={18} />, maquillaje: <Sparkles size={18} />,
  barman: <Wine size={18} />, discomovil: <Disc3 size={18} />,
  coordinadora: <ClipboardList size={18} />, saxo: <Music size={18} />,
  peluqueria: <Sparkles size={18} />, photobooth: <Camera size={18} />,
  flores: <Sparkles size={18} />,
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function calcItemPrice(s: ServiceDef, item: CartItem, mult: number): [number, number] {
  let min = 0; let max = 0;
  if (s.priceType === 'per-unit-hour') { min = s.unitPriceMin! * item.quantity * item.hours; max = s.unitPriceMax! * item.quantity * item.hours; }
  else if (s.priceType === 'per-person') { min = s.perPersonMin! * item.persons; max = s.perPersonMax! * item.persons; }
  else { min = s.priceMin; max = s.priceMax; }
  return [Math.round(min * mult), Math.round(max * mult)];
}

function fmt(n: number) { return n.toLocaleString('es-ES') + ' €'; }

function monthsUntil(ds: string) {
  if (!ds) return 99;
  const [y, m] = ds.split('-').map(Number);
  const t = new Date();
  return (y - t.getFullYear()) * 12 + (m - 1 - t.getMonth());
}

function daysUntil(ds: string) {
  if (!ds) return null;
  const [y, m] = ds.split('-').map(Number);
  const target = new Date(y, m - 1, 15);
  const diff = Math.ceil((target.getTime() - Date.now()) / 86400000);
  return diff > 0 ? diff : null;
}

function isHighSeason(ds: string) {
  if (!ds) return false;
  const month = parseInt(ds.split('-')[1], 10);
  return [4, 5, 6, 7, 8, 9].includes(month);
}

/* ─── Counter ─────────────────────────────────────────────────────────────── */

function Counter({ label, value, min = 1, onInc, onDec }: { label: string; value: number; min?: number; onInc: () => void; onDec: () => void; }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={onDec} disabled={value <= min} className="w-6 h-6 rounded flex items-center justify-center disabled:opacity-30" style={{ background: 'rgba(255,255,255,0.1)' }}><Minus size={10} /></button>
        <span className="text-sm font-black w-6 text-center tabular-nums">{value}</span>
        <button onClick={onInc} className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}><Plus size={10} /></button>
      </div>
    </div>
  );
}

/* ─── LS key ──────────────────────────────────────────────────────────────── */

const LS_KEY = 'xpeak_boda_v2';

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function PresupuestoBoda() {
  const [guests, setGuests] = useState(100);
  const [weddingDate, setWeddingDate] = useState('');
  const [cityKey, setCityKey] = useState('nacional');
  const [tableSize, setTableSize] = useState(8);
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'catering', quantity: 1, hours: 8, persons: 100 },
    { id: 'fotografo', quantity: 1, hours: 8, persons: 1 },
    { id: 'dj', quantity: 1, hours: 8, persons: 1 },
    { id: 'camareros', quantity: 9, hours: 8, persons: 1 },
  ]);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0]));
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'calc' | 'checklist' | 'propinas'>('calc');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [lead, setLead] = useState<LeadForm>({ name: '', email: '', phone: '', notes: '' });
  const [sendingLead, setSendingLead] = useState(false);

  /* ── Load from localStorage + URL params ── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlGuests = params.get('g'); const urlCity = params.get('c'); const urlDate = params.get('d'); const urlCart = params.get('s');
    if (urlGuests || urlCity || urlDate || urlCart) {
      if (urlGuests) setGuests(parseInt(urlGuests, 10));
      if (urlCity) setCityKey(urlCity);
      if (urlDate) setWeddingDate(urlDate);
      if (urlCart) {
        const ids = urlCart.split(',');
        const items = ids.map(id => { const s = SERVICES.find(x => x.id === id); if (!s) return null; return { id, quantity: 1, hours: s.hoursDefault ?? 8, persons: id === 'catering' ? parseInt(urlGuests ?? '100', 10) : 1 }; }).filter(Boolean) as CartItem[];
        if (items.length) setCart(items);
      }
      return;
    }
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.cart) setCart(data.cart);
        if (data.guests) setGuests(data.guests);
        if (data.weddingDate) setWeddingDate(data.weddingDate);
        if (data.cityKey) setCityKey(data.cityKey);
        if (data.checkedTasks) setCheckedTasks(new Set(data.checkedTasks));
      }
    } catch {}
  }, []);

  const cityMult = useMemo(() => CITIES.find(c => c.value === cityKey)?.mult ?? 1, [cityKey]);
  const monthsLeft = useMemo(() => monthsUntil(weddingDate), [weddingDate]);
  const daysLeft = useMemo(() => daysUntil(weddingDate), [weddingDate]);
  const highSeason = useMemo(() => isHighSeason(weddingDate), [weddingDate]);
  const cartIds = useMemo(() => new Set(cart.map(c => c.id)), [cart]);
  const tablesCount = Math.ceil(guests / tableSize);

  const cartWithDef = cart.map(item => {
    const s = SERVICES.find(x => x.id === item.id)!;
    const [pMin, pMax] = calcItemPrice(s, item, cityMult);
    return { ...item, s, pMin, pMax };
  });

  const totalMin = cartWithDef.reduce((a, c) => a + c.pMin, 0);
  const totalMax = cartWithDef.reduce((a, c) => a + c.pMax, 0);
  const perGuestMin = guests > 0 ? Math.round(totalMin / guests) : 0;
  const ahorro = Math.round(totalMin * 0.17);

  const doneCount = checkedTasks.size;
  const totalCount = ALL_TASKS.length;

  /* ── Propinas ── */
  const propinas = cartWithDef
    .filter(({ s }) => !!s.tipPct)
    .map(({ s, pMin }) => ({ title: s.title, tipPct: s.tipPct!, tipMin: Math.round(pMin * s.tipPct! / 100) }));
  const totalTip = propinas.reduce((a, p) => a + p.tipMin, 0);

  function defaultItem(s: ServiceDef): CartItem {
    return { id: s.id, quantity: s.guestFormula ? Math.max(s.quantityMin ?? 1, s.guestFormula(guests)) : 1, hours: s.hoursDefault ?? 8, persons: s.id === 'catering' ? guests : 1 };
  }

  function addToCart(id: string) { if (cartIds.has(id)) return; const s = SERVICES.find(x => x.id === id)!; setCart(prev => [...prev, defaultItem(s)]); }
  function removeFromCart(id: string) { setCart(prev => prev.filter(c => c.id !== id)); }

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

  function toggleTask(id: string) { setCheckedTasks(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  const saveToLS = useCallback(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ cart, guests, weddingDate, cityKey, checkedTasks: [...checkedTasks] }));
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch {}
  }, [cart, guests, weddingDate, cityKey, checkedTasks]);

  function copyShareLink() {
    const params = new URLSearchParams({ g: String(guests), c: cityKey, d: weddingDate, s: cart.map(c => c.id).join(',') });
    navigator.clipboard.writeText(`${window.location.origin}/presupuesto-boda?${params}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSendingLead(true);
    await new Promise(r => setTimeout(r, 800));
    setSendingLead(false);
    setLeadSent(true);
  }

  const FAQS = [
    { q: '¿Con cuánta antelación hay que contratar el fotógrafo?', a: 'El fotógrafo es el proveedor que más rápido se reserva. Los buenos fotógrafos de boda en España se agotan entre 9 y 12 meses antes, especialmente para temporada alta (mayo–octubre).' },
    { q: '¿Cuántos camareros necesito para 100 personas?', a: 'Para un banquete sentado con servicio completo necesitas 1 camarero por cada 10–12 invitados: unos 8–10 para 100 personas. La calculadora lo ajusta automáticamente.' },
    { q: '¿Cuánto cuesta una boda media en España 2026?', a: 'Entre 20.000€ y 30.000€ para 100–130 invitados. El catering representa el 40–45% del total. En Madrid y Barcelona el coste es un 20–30% superior.' },
    { q: '¿Necesito un wedding planner?', a: 'Lo que recomiendan los expertos es contratar al menos una coordinadora del día (desde 350€). El wedding planner completo (1.500–6.000€) es ideal si no tienes tiempo.' },
    { q: '¿Los precios cambian según la ciudad?', a: 'Sí. Madrid y Barcelona son un 20–30% más caros que la media nacional. Ibiza hasta un 35% más. El interior de Castilla, Galicia y Canarias son un 10–15% más económicos. Usa el selector de ciudad en la calculadora.' },
    { q: '¿Qué es el Flash Booking de XPEAK?', a: 'Sistema de contratación urgente: publicas tu necesidad y los profesionales disponibles responden en menos de 60 minutos. Ideal para sustituciones de última hora.' },
  ];

  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };

  return (
    <>
      <Helmet>
        <title>Planificador de Boda 2026 — Calculadora de Presupuesto y Checklist | XPEAK</title>
        <meta name="description" content="Calcula el presupuesto de tu boda por ciudad, añade servicios, ve el coste por invitado, propinas y checklist interactivo. Gratis y sin registro." />
        <link rel="canonical" href="https://xpeak.es/presupuesto-boda" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen" style={{ background: '#090909', color: '#fff' }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-6xl mx-auto">
          <a href="/" className="text-lg font-black tracking-tight" style={{ color: '#D4AF37' }}>XPEAK</a>
          <div className="flex items-center gap-3">
            <a href="/bodas" className="text-xs font-bold hidden sm:block" style={{ color: '#8E8EA0' }}>← Bodas</a>
            <a href="/auth" className="px-3 py-2 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Unirse gratis</a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>Bodas · Planificador completo 2026</p>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2" style={{ lineHeight: 1.15, paddingBottom: '0.1em', overflow: 'visible' }}>
            Planifica tu boda y calcula el presupuesto
          </h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Calculadora por ciudad · coste por invitado · propinas · checklist interactivo · todo se guarda automáticamente.
          </p>
        </section>

        {/* Countdown */}
        {weddingDate && daysLeft && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
            <div className="rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.12),rgba(184,148,30,0.06))', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div className="flex items-center gap-3">
                <Heart size={24} style={{ color: '#D4AF37', flexShrink: 0 }} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(212,175,55,0.7)' }}>Cuenta atrás</p>
                  <p className="text-xl font-black" style={{ color: '#D4AF37' }}>{daysLeft} días para vuestra boda</p>
                </div>
              </div>
              <div className="flex gap-5">
                {[{ val: Math.floor(daysLeft / 30), label: 'meses' }, { val: Math.floor((daysLeft % 30) / 7), label: 'semanas' }, { val: daysLeft % 7, label: 'días' }].map(({ val, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-2xl font-black tabular-nums" style={{ color: '#D4AF37' }}>{val}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Temporada alta alert */}
        {weddingDate && highSeason && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
            <div className="rounded-xl px-4 py-3 flex items-start gap-3" style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)' }}>
              <AlertTriangle size={16} style={{ color: '#e74c3c', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-xs font-black" style={{ color: '#e74c3c' }}>Temporada alta detectada</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Tu boda es en temporada alta (abr–sep). Los proveedores se reservan con hasta 14 meses de antelación. Contrata fotógrafo, DJ y catering <strong style={{ color: '#fff' }}>lo antes posible.</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Setup bar */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
          <div className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-end"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.18)' }}>
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>Invitados</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateGuests(guests - 10)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}><Minus size={13} /></button>
                  <span className="text-2xl font-black w-14 text-center tabular-nums" style={{ color: '#D4AF37' }}>{guests}</span>
                  <button onClick={() => updateGuests(guests + 10)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}><Plus size={13} /></button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {[50, 80, 100, 150, 200].map(n => (
                    <button key={n} onClick={() => updateGuests(n)} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: guests === n ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${guests === n ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`, color: guests === n ? '#D4AF37' : 'rgba(255,255,255,0.4)' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: '#D4AF37' }}><MapPin size={11} /> Ciudad</p>
              <select value={cityKey} onChange={e => setCityKey(e.target.value)} className="px-3 py-2 rounded-lg text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#D4AF37', outline: 'none', colorScheme: 'dark', minWidth: 180 }}>
                {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}{c.mult !== 1 ? ` (${c.mult > 1 ? '+' : ''}${Math.round((c.mult - 1) * 100)}%)` : ''}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#D4AF37' }}>Fecha</p>
              <input type="month" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} className="px-3 py-2 rounded-lg text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: weddingDate ? '#D4AF37' : 'rgba(255,255,255,0.3)', outline: 'none', colorScheme: 'dark' }} />
            </div>
            <div className="flex gap-2 self-end">
              <button onClick={saveToLS} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold"
                style={{ background: saved ? 'rgba(39,174,96,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${saved ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.1)'}`, color: saved ? '#27ae60' : 'rgba(255,255,255,0.4)' }}>
                {saved ? <><CheckCircle size={12} /> Guardado</> : <><Share2 size={12} /> Guardar</>}
              </button>
              <button onClick={copyShareLink} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold"
                style={{ background: copied ? 'rgba(52,152,219,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${copied ? 'rgba(52,152,219,0.3)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#3498db' : 'rgba(255,255,255,0.4)' }}>
                <Link2 size={12} /> {copied ? '¡Copiado!' : 'Compartir'}
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', width: 'fit-content' }}>
            {([['calc', 'Calculadora'], ['checklist', `Checklist (${doneCount}/${totalCount})`], ['propinas', 'Propinas']] as const).map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: activeTab === tab ? 'rgba(212,175,55,0.12)' : 'transparent', color: activeTab === tab ? '#D4AF37' : 'rgba(255,255,255,0.35)', border: activeTab === tab ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB: Calculator ── */}
        {activeTab === 'calc' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 flex flex-col lg:flex-row gap-6 items-start">
            {/* Service catalogue */}
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Toca "Añadir" para agregar un servicio a tu presupuesto
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map(s => {
                  const inCart = cartIds.has(s.id);
                  return (
                    <div key={s.id} className="rounded-xl p-4 flex flex-col gap-3"
                      style={{ background: inCart ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.025)', border: `1px solid ${inCart ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.07)'}`, opacity: inCart ? 0.75 : 1 }}>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.15)' }}>
                          {SERVICE_ICONS[s.id]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-black">{s.title}</p>
                            {s.essential && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', fontSize: '0.6rem' }}>Esencial</span>}
                          </div>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.note}</p>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}><Clock size={9} className="inline mr-1" style={{ color: '#D4AF37', opacity: 0.5 }} />{s.bookWhen}</p>
                            {s.priceType === 'fixed' && <p className="text-xs font-bold" style={{ color: 'rgba(212,175,55,0.5)' }}>desde {fmt(Math.round(s.priceMin * cityMult))}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => inCart ? removeFromCart(s.id) : addToCart(s.id)} className="flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5"
                          style={inCart ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' } : { background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
                          {inCart ? <><CheckCircle size={11} /> Añadido</> : <><Plus size={11} /> Añadir</>}
                        </button>
                        {s.dirHref && (
                          <a href={s.dirHref} className="px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                            Ver →
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table calculator */}
              <div className="mt-6 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-4"><TableProperties size={16} style={{ color: '#D4AF37' }} /><p className="text-sm font-black" style={{ color: '#D4AF37' }}>Calculadora de mesas</p></div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div>
                    <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Mesas de</p>
                    <div className="flex gap-2">
                      {[6, 8, 10, 12].map(n => (
                        <button key={n} onClick={() => setTableSize(n)} className="px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{ background: tableSize === n ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${tableSize === n ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`, color: tableSize === n ? '#D4AF37' : 'rgba(255,255,255,0.4)' }}>
                          {n} pax
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl p-4 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <p className="text-3xl font-black" style={{ color: '#D4AF37' }}>{tablesCount}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>mesas de {tableSize} para {guests} invitados</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>Última mesa: {guests - (tablesCount - 1) * tableSize} personas</p>
                  </div>
                </div>
              </div>

              {/* Fun facts */}
              <div className="mt-6 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-4"><Lightbulb size={16} style={{ color: '#D4AF37' }} /><p className="text-sm font-black" style={{ color: '#D4AF37' }}>¿Sabías que…?</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FUN_FACTS.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#D4AF37' }} />
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart */}
            <div className="w-full lg:w-80 lg:sticky lg:top-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart size={15} style={{ color: '#D4AF37' }} />
                <p className="text-sm font-black" style={{ color: '#D4AF37' }}>Tu presupuesto</p>
                {cart.length > 0 && <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: '#D4AF37', color: '#000' }}>{cart.length}</span>}
                <button onClick={() => setCart([])} className="ml-auto flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}><RotateCcw size={10} /> Vaciar</button>
              </div>

              {cityKey !== 'nacional' && (
                <div className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: cityMult > 1 ? 'rgba(230,126,34,0.08)' : 'rgba(39,174,96,0.08)', border: `1px solid ${cityMult > 1 ? 'rgba(230,126,34,0.2)' : 'rgba(39,174,96,0.2)'}` }}>
                  <MapPin size={11} style={{ color: cityMult > 1 ? '#e67e22' : '#27ae60', flexShrink: 0 }} />
                  <p className="text-xs" style={{ color: cityMult > 1 ? '#e67e22' : '#27ae60' }}>
                    {CITIES.find(c => c.value === cityKey)?.label} {cityMult > 1 ? `+${Math.round((cityMult - 1) * 100)}%` : `-${Math.round((1 - cityMult) * 100)}%`}
                  </p>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <ShoppingCart size={24} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 8 }} />
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Añade servicios desde la izquierda.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {cartWithDef.map(({ id, s, pMin, pMax, quantity, hours, persons }) => (
                      <div key={id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}>
                              <span style={{ transform: 'scale(0.8)', display: 'flex' }}>{SERVICE_ICONS[s.id]}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black leading-snug">{s.title}</p>
                              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.subtitle}</p>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(id)} className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}><X size={10} /></button>
                        </div>
                        {(s.hasQuantity || s.hasHours || (s.hasPersons && id !== 'catering')) && (
                          <div className="flex gap-4 flex-wrap mb-3">
                            {s.hasQuantity && <Counter label={s.quantityLabel!} value={quantity} min={s.quantityMin} onInc={() => updateCart(id, 'quantity', 1)} onDec={() => updateCart(id, 'quantity', -1)} />}
                            {s.hasHours && <Counter label="Horas" value={hours} min={1} onInc={() => updateCart(id, 'hours', 1)} onDec={() => updateCart(id, 'hours', -1)} />}
                            {s.hasPersons && id !== 'catering' && <Counter label={s.personsLabel!} value={persons} min={1} onInc={() => updateCart(id, 'persons', 1)} onDec={() => updateCart(id, 'persons', -1)} />}
                          </div>
                        )}
                        {id === 'catering' && <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>{guests} invitados · {fmt(Math.round(s.perPersonMin! * cityMult))}–{fmt(Math.round(s.perPersonMax! * cityMult))}/p</p>}
                        <div className="flex items-center justify-between">
                          <div className="flex-1 h-1 rounded-full mr-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.round((pMax / Math.max(totalMax, 1)) * 100)}%`, background: 'rgba(212,175,55,0.5)' }} />
                          </div>
                          <p className="text-sm font-black tabular-nums flex-shrink-0" style={{ color: '#D4AF37' }}>{fmt(pMin)}</p>
                        </div>
                        <p className="text-xs text-right mt-0.5" style={{ color: 'rgba(212,175,55,0.4)' }}>hasta {fmt(pMax)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(212,175,55,0.6)' }}>Total estimado</p>
                    <p className="text-2xl font-black tabular-nums" style={{ color: '#D4AF37' }}>{fmt(totalMin)}</p>
                    <p className="text-sm font-bold" style={{ color: 'rgba(212,175,55,0.4)' }}>hasta {fmt(totalMax)}</p>
                    {/* Per guest */}
                    <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <Euro size={12} style={{ color: 'rgba(212,175,55,0.5)', flexShrink: 0 }} />
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <span className="font-black" style={{ color: '#D4AF37' }}>{fmt(perGuestMin)}</span> por invitado
                      </p>
                    </div>
                    {/* Ahorro XPEAK */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <TrendingDown size={12} style={{ color: '#27ae60', flexShrink: 0 }} />
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Ahorras <span className="font-black" style={{ color: '#27ae60' }}>~{fmt(ahorro)}</span> vs agencia con XPEAK
                      </p>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Orientativo · sin IVA</p>
                  </div>

                  {/* Ahorro breakdown */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(39,174,96,0.05)', border: '1px solid rgba(39,174,96,0.15)' }}>
                    <p className="text-xs font-black mb-2 flex items-center gap-1.5" style={{ color: '#27ae60' }}><TrendingDown size={12} /> ¿Cuánto ahorras contratando directo?</p>
                    <div className="space-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <div className="flex justify-between"><span>Con agencia tradicional (~17%)</span><span className="font-bold" style={{ color: '#e74c3c' }}>+{fmt(ahorro)}</span></div>
                      <div className="flex justify-between"><span>Con XPEAK (sin comisión)</span><span className="font-bold" style={{ color: '#27ae60' }}>0 €</span></div>
                    </div>
                    <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Tu ahorro estimado: <strong style={{ color: '#27ae60' }}>{fmt(ahorro)}</strong></p>
                  </div>

                  <a href="/auth" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-sm" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                    <Zap size={14} /> Contratar estos servicios
                  </a>
                  <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>Sin comisión · Flash Booking · Contratos PDF</p>
                </>
              )}

              {weddingDate && monthsLeft > 0 && (
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs font-black mb-3 flex items-center gap-1.5" style={{ color: '#D4AF37' }}><CalendarDays size={12} /> Contratar ahora</p>
                  {SERVICES.filter(s => {
                    const mm: Record<string, number> = { '12 meses antes': 12, '9–12 meses antes': 9, '9 meses antes': 9, '6 meses antes': 6, '4–6 meses antes': 4, '3–4 meses antes': 3, '3 meses antes': 3 };
                    return monthsLeft <= (mm[s.bookWhen] ?? 0) + 2;
                  }).slice(0, 5).map(s => (
                    <div key={s.id} className="flex items-center justify-between py-1.5 border-b text-xs" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{s.title}</span>
                      <span className="font-bold" style={{ color: '#e74c3c' }}>Urgente</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: Checklist ── */}
        {activeTab === 'checklist' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
            <div className="mb-6 rounded-2xl p-4" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-black" style={{ color: '#D4AF37' }}>Progreso de planificación</p>
                <p className="text-sm font-black" style={{ color: '#D4AF37' }}>{doneCount}/{totalCount}</p>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round((doneCount / totalCount) * 100)}%`, background: 'linear-gradient(90deg,#D4AF37,#B8941E)' }} />
              </div>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {Math.round((doneCount / totalCount) * 100)}% completado {doneCount === totalCount && '— ¡Todo listo!'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHECKLIST_PHASES.map((phase, pi) => {
                const phaseTasks = ALL_TASKS.filter(t => t.phase === phase.phase);
                const phaseDone = phaseTasks.filter(t => checkedTasks.has(t.id)).length;
                return (
                  <div key={phase.phase} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderTop: `3px solid ${phase.color}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-black" style={{ color: phase.color }}>{phase.phase}</p>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{phaseDone}/{phase.tasks.length}</span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>{phase.label}</p>
                    <div className="space-y-2">
                      {phaseTasks.map((task) => {
                        const done = checkedTasks.has(task.id);
                        return (
                          <button key={task.id} onClick={() => toggleTask(task.id)} className="w-full flex items-start gap-2.5 text-left">
                            <div className="w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center"
                              style={{ background: done ? phase.color : 'transparent', border: `1.5px solid ${done ? phase.color : 'rgba(255,255,255,0.2)'}` }}>
                              {done && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <p className="text-xs" style={{ color: done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)', textDecoration: done ? 'line-through' : 'none' }}>{task.text}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={saveToLS} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black"
                style={{ background: saved ? 'rgba(39,174,96,0.15)' : 'rgba(212,175,55,0.1)', border: `1px solid ${saved ? 'rgba(39,174,96,0.3)' : 'rgba(212,175,55,0.2)'}`, color: saved ? '#27ae60' : '#D4AF37' }}>
                {saved ? <><CheckCircle size={14} /> Guardado</> : <><Share2 size={14} /> Guardar progreso</>}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: Propinas ── */}
        {activeTab === 'propinas' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
            <div className="mb-6 rounded-2xl p-5" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(212,175,55,0.6)' }}>Propina total recomendada</p>
              <p className="text-3xl font-black" style={{ color: '#D4AF37' }}>{fmt(totalTip)}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Basado en los servicios que tienes en la calculadora. Solo es una orientación — nunca obligatoria.</p>
            </div>
            {propinas.length === 0 ? (
              <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>Añade servicios en la calculadora para ver las propinas recomendadas.</p>
            ) : (
              <div className="space-y-3">
                {propinas.map(p => (
                  <div key={p.title} className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3">
                      <Euro size={16} style={{ color: '#D4AF37', flexShrink: 0 }} />
                      <div>
                        <p className="text-sm font-black">{p.title}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.tipPct}% del coste del servicio</p>
                      </div>
                    </div>
                    <p className="text-base font-black tabular-nums" style={{ color: '#D4AF37' }}>~{fmt(p.tipMin)}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs font-black mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>¿Cómo se pagan las propinas en bodas?</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>Prepara sobres de papel con el nombre del proveedor y la cantidad en efectivo. Entrégalos al final del evento o al día siguiente. No es obligatorio, pero es habitual y muy valorado en España. Los mejores proveedores merecen el reconocimiento.</p>
            </div>
          </div>
        )}

        {/* ── Lead form ── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.18)' }}>
            {leadSent ? (
              <div className="text-center py-6">
                <CheckCircle size={40} style={{ color: '#D4AF37', marginBottom: 12 }} />
                <p className="text-xl font-black mb-2" style={{ color: '#D4AF37' }}>Solicitud enviada</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Los profesionales disponibles te contactarán en menos de 24h. También puedes buscarlos tú directamente en el directorio.</p>
                <a href="/bodas" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl text-sm font-black" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>Ver directorio de bodas</a>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-5">
                  <Send size={20} style={{ color: '#D4AF37', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-lg font-black" style={{ lineHeight: 1.2 }}>¿Quieres que los profesionales te contacten?</p>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Compartimos tu presupuesto de <strong style={{ color: '#D4AF37' }}>{fmt(totalMin)}</strong> con los profesionales disponibles en tu zona. Recibes respuestas en menos de 24h. Sin comisión.
                    </p>
                  </div>
                </div>
                <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input required placeholder="Tu nombre" value={lead.name} onChange={e => setLead(p => ({ ...p, name: e.target.value }))}
                    className="nightlife-input col-span-1" style={{ colorScheme: 'dark' }} />
                  <input required type="email" placeholder="Email" value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))}
                    className="nightlife-input col-span-1" style={{ colorScheme: 'dark' }} />
                  <input type="tel" placeholder="Teléfono (opcional)" value={lead.phone} onChange={e => setLead(p => ({ ...p, phone: e.target.value }))}
                    className="nightlife-input col-span-1" style={{ colorScheme: 'dark' }} />
                  <input placeholder={`Fecha: ${weddingDate || 'por definir'}`} readOnly
                    className="nightlife-input col-span-1" style={{ colorScheme: 'dark', cursor: 'default', opacity: 0.6 }} />
                  <textarea placeholder="Notas adicionales (zona, estilo de boda, dudas...)" value={lead.notes} onChange={e => setLead(p => ({ ...p, notes: e.target.value }))}
                    className="nightlife-input sm:col-span-2 resize-none" rows={3} style={{ colorScheme: 'dark' }} />
                  <button type="submit" disabled={sendingLead} className="sm:col-span-2 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000', opacity: sendingLead ? 0.7 : 1 }}>
                    {sendingLead ? 'Enviando…' : <><Send size={15} /> Enviar solicitud gratuita</>}
                  </button>
                  <p className="text-xs text-center sm:col-span-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Sin comisión · Sin registro previo · Respuesta en &lt;24h</p>
                </form>
              </>
            )}
          </div>
        </section>

        {/* Budget breakdown */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="text-xl sm:text-2xl font-black mb-5" style={{ lineHeight: 1.15, paddingBottom: '0.1em', overflow: 'visible' }}>Distribución típica del presupuesto de boda</h2>
          <div className="rounded-xl p-5" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
            {([['Catering (banquete + bebidas)', '40–45%', 0.42], ['Venue / Finca', '15–20%', 0.17], ['Fotografía y vídeo', '10–15%', 0.12], ['Flores y decoración', '8–12%', 0.10], ['DJ o música en vivo', '5–10%', 0.07], ['Personal de sala', '5–8%', 0.06], ['Maquillaje y peluquería', '3–5%', 0.04], ['MC y coordinación', '3–5%', 0.03]] as [string, string, number][]).map(([label, pct, ratio]) => (
              <div key={label} className="py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span>{label}</span>
                  <span className="font-bold" style={{ color: '#D4AF37' }}>{pct}</span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.round(ratio * 220)}%`, background: 'rgba(212,175,55,0.35)' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-14">
          <h2 className="text-xl font-black mb-5" style={{ lineHeight: 1.15, paddingBottom: '0.1em', overflow: 'visible' }}>Preguntas frecuentes</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={faq.q} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <button onClick={() => setOpenFaqs(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })} className="w-full flex items-center justify-between p-4 text-left gap-3">
                  <p className="text-sm font-bold">{faq.q}</p>
                  {openFaqs.has(i) ? <ChevronUp size={14} style={{ color: '#D4AF37', flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />}
                </button>
                {openFaqs.has(i) && <p className="px-4 pb-4 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-base font-black mb-4" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.15, paddingBottom: '0.1em', overflow: 'visible' }}>Guías relacionadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/blog/10-errores-contratar-dj-boda', title: 'Los 10 errores al contratar un DJ para tu boda' },
              { href: '/blog/cuanto-cuesta-una-boda-en-espana', title: '¿Cuánto cuesta una boda en España 2026?' },
              { href: '/blog/cuantos-camareros-necesito-para-mi-boda', title: 'Cuántos camareros necesito para mi boda' },
              { href: '/blog/musica-en-vivo-para-bodas', title: 'Música en vivo para bodas: precios 2026' },
              { href: '/blog/maestro-de-ceremonias-boda-precio-guia', title: 'Maestro de ceremonias: precio y guía' },
              { href: '/blog/maquillaje-nupcial-precio-guia', title: 'Maquillaje nupcial: precios y cómo elegir' },
            ].map(p => (
              <a key={p.href} href={p.href} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <ArrowRight size={13} style={{ color: 'rgba(212,175,55,0.5)', flexShrink: 0 }} />
                <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.title}</p>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
          <div className="rounded-2xl p-7 sm:p-10 text-center" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 className="text-xl sm:text-2xl font-black mb-3" style={{ lineHeight: 1.15, paddingBottom: '0.1em', overflow: 'visible' }}>¿Lista para contratar?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              XPEAK conecta novios con los mejores profesionales de boda en España. Sin comisión, contratos digitales y Flash Booking en menos de 1h.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/auth" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm" style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                <Zap size={15} /> Publicar oferta gratis
              </a>
              <a href="/bodas" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
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
