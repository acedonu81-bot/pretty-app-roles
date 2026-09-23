import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown, Zap, Search, MessageCircle, FileText, UserPlus, BadgeEuro,
  CalendarDays, BookOpen, Calculator, ClipboardList, HelpCircle, Info, Sparkles,
  type LucideIcon,
} from 'lucide-react';

// Mega-menú de la landing (23 sep 2026), inspirado en el de eventuy.com pero
// más compacto: al pasar el ratón por cada pestaña se despliega un panel con
// secciones y una llamada a la acción. Solo escritorio (md+); en móvil la
// navbar sigue mostrando únicamente Acceder / Descubrir.

type LinkItem = { label: string; href: string };
type Feature = { title: string; desc: string; href: string; icon: LucideIcon };
type Cta = { title: string; text: string; button: string; href: string };

type Tab =
  | { id: string; label: string; kind: 'list'; columns: { heading: string; links: LinkItem[] }[]; cta: Cta }
  | { id: string; label: string; kind: 'features'; heading: string; features: Feature[]; cta: Cta };

const TABS: Tab[] = [
  {
    id: 'profesionales',
    label: 'Profesionales',
    kind: 'list',
    columns: [
      {
        heading: 'Música',
        links: [
          { label: 'DJs', href: '/directorio/dj' },
          { label: 'Grupos musicales', href: '/directorio/grupo-musical' },
          { label: 'DJs emergentes', href: '/directorio/djs-emergentes' },
          { label: 'Técnicos de sonido', href: '/directorio/tecnico-sonido' },
        ],
      },
      {
        heading: 'Servicios',
        links: [
          { label: 'Fotógrafos', href: '/directorio/fotografo' },
          { label: 'Camareros', href: '/directorio/camareros' },
          { label: 'Catering', href: '/directorio/catering' },
          { label: 'Staff y azafatas', href: '/directorio/staff' },
          { label: 'Maquillaje', href: '/directorio/maquillaje' },
          { label: 'Animadores', href: '/directorio/animador' },
        ],
      },
      {
        heading: 'Espacios',
        links: [
          { label: 'Locales para eventos', href: '/directorio/locales-eventos' },
          { label: 'Todas las categorías', href: '/descubrir' },
        ],
      },
    ],
    cta: {
      title: '¿Buscas algo concreto?',
      text: 'Filtra por servicio y zona y compara perfiles antes de escribir.',
      button: 'Ver profesionales',
      href: '/descubrir',
    },
  },
  {
    id: 'organizadores',
    label: 'Para organizadores',
    kind: 'features',
    heading: 'Cómo contratas en XPEAK',
    features: [
      { title: 'Flash Booking', desc: 'Publica una necesidad urgente y responden los disponibles', href: '/auth?mode=register&role=empresario', icon: Zap },
      { title: 'Busca por zona', desc: 'Filtra por servicio, ciudad y estilo', href: '/descubrir', icon: Search },
      { title: 'Contacto directo', desc: 'Habla con el profesional sin intermediarios', href: '/descubrir', icon: MessageCircle },
      { title: 'Organizar eventos', desc: 'Guía para planificar tu evento paso a paso', href: '/organizar-eventos', icon: CalendarDays },
      { title: 'Planes y precios', desc: 'Qué incluye cada plan', href: '/precios', icon: BadgeEuro },
    ],
    cta: {
      title: '¿Organizas un evento?',
      text: 'Crea tu cuenta de organizador y empieza a contactar profesionales.',
      button: 'Quiero contratar',
      href: '/auth?mode=register&role=empresario',
    },
  },
  {
    id: 'profesionales-alta',
    label: 'Para profesionales',
    kind: 'features',
    heading: 'Consigue más bolos',
    features: [
      { title: 'Crea tu perfil', desc: 'Foto, tarifa y ejemplos de tu trabajo', href: '/auth?mode=register&role=profesional', icon: UserPlus },
      { title: 'Ofertas Flash', desc: 'Recibe avisos de eventos en tu zona', href: '/auth?mode=register&role=profesional', icon: Zap },
      { title: 'Plantilla de contrato', desc: 'Cierra cada bolo por escrito', href: '/plantilla-contrato-dj', icon: FileText },
      { title: 'Calculadora de tarifa', desc: 'Cuánto cobrar según el tipo de evento', href: '/blog/calculadora-tarifa-dj', icon: Calculator },
    ],
    cta: {
      title: '¿Eres DJ, fotógrafo o staff?',
      text: 'Date de alta y deja que los organizadores te encuentren.',
      button: 'Quiero anunciarme',
      href: '/auth?mode=register&role=profesional',
    },
  },
  {
    id: 'recursos',
    label: 'Recursos',
    kind: 'features',
    heading: 'Guías y herramientas',
    features: [
      { title: 'Blog', desc: 'Precios y consejos por tipo de evento', href: '/blog', icon: BookOpen },
      { title: 'Presupuesto de boda', desc: 'Calcula lo que vas a gastar', href: '/presupuesto-boda', icon: Calculator },
      { title: 'Checklist evento de empresa', desc: 'Todo lo que no se te puede olvidar', href: '/checklist-evento-empresa', icon: ClipboardList },
      { title: 'Preguntas frecuentes', desc: 'Resolvemos las dudas habituales', href: '#faq', icon: HelpCircle },
      { title: 'Sobre XPEAK', desc: 'Quién está detrás del proyecto', href: '/sobre-nosotros', icon: Info },
    ],
    cta: {
      title: '¿Nuevo por aquí?',
      text: 'Explora perfiles reales de profesionales para eventos en España.',
      button: 'Descubrir',
      href: '/descubrir',
    },
  },
];

const GOLD = '#D4AF37';

// Las anclas (#faq) se quedan como <a> para que el scroll nativo funcione en
// la propia landing; el resto va por el router sin recargar.
const MenuLink = ({ href, className, style, children, onClick }: {
  href: string; className?: string; style?: React.CSSProperties; children: React.ReactNode; onClick: () => void;
}) => href.startsWith('#')
  ? <a href={href} className={className} style={style} onClick={onClick}>{children}</a>
  : <Link to={href} className={className} style={style} onClick={onClick}>{children}</Link>;

const LandingMegaMenu = () => {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const cancelClose = () => {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
  };
  // Pequeño retraso al salir: sin él, cruzar el hueco entre la pestaña y el
  // panel cierra el menú antes de llegar.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(null), 150);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      cancelClose();
    };
  }, []);

  const active = TABS.find(t => t.id === open) ?? null;
  const close = () => setOpen(null);

  return (
    <div ref={rootRef} className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
      onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
      {TABS.map(tab => {
        const isOpen = open === tab.id;
        return (
          <button key={tab.id} type="button"
            aria-expanded={isOpen}
            aria-controls={`mega-${tab.id}`}
            onMouseEnter={() => { cancelClose(); setOpen(tab.id); }}
            onFocus={() => setOpen(tab.id)}
            // Solo abre: el hover ya lo abrió, y un toggle aquí lo cerraba
            // al hacer clic (parpadeo). Se cierra al salir, con Escape o fuera.
            onClick={() => setOpen(tab.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            style={{ color: isOpen ? '#1a1208' : '#444', background: isOpen ? 'rgba(212,175,55,0.12)' : 'transparent' }}>
            {tab.label}
            <ChevronDown size={13} className="transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
          </button>
        );
      })}

      {/* El centrado va en un contenedor aparte: framer-motion escribe su
          propio transform y pisaría el -translate-x-1/2 de Tailwind. */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full pointer-events-none"
        style={{ width: 'min(760px, calc(100vw - 48px))' }}>
      <AnimatePresence>
        {active && (
          // Una sola key mientras el menú esté abierto: al pasar de una pestaña
          // a otra el panel NO se desmonta (antes sí, y cada cambio repetía la
          // animación de entrada y saltaba de altura). Solo el contenido
          // interior hace un fundido corto; la altura mínima fija evita que el
          // panel crezca/encoja entre pestañas.
          <motion.div
            key="mega-panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="pt-3 pointer-events-auto"
          >
            <div id={`mega-${active.id}`} className="rounded-2xl overflow-hidden flex"
              style={{ minHeight: 308, background: 'linear-gradient(90deg,#ffffff calc(100% - 210px),#120d06 calc(100% - 210px))', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 18px 48px rgba(0,0,0,0.14)' }}>
            <motion.div key={active.id} className="flex flex-1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
              <div className="flex-1 p-6">
                {active.kind === 'list' ? (
                  <div className="grid grid-cols-3 gap-6">
                    {active.columns.map(col => (
                      <div key={col.heading}>
                        <p className="text-[11px] font-black uppercase tracking-[0.12em] mb-3" style={{ color: '#8B6A00' }}>{col.heading}</p>
                        <ul className="flex flex-col gap-2">
                          {col.links.map(l => (
                            <li key={l.href}>
                              <MenuLink href={l.href} onClick={close}
                                className="text-sm font-medium transition-colors hover:text-[#8B6A00]"
                                style={{ color: '#333' }}>
                                {l.label}
                              </MenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] mb-3" style={{ color: '#8B6A00' }}>{active.heading}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {active.features.map(f => {
                        const Icon = f.icon;
                        return (
                          <MenuLink key={f.title} href={f.href} onClick={close}
                            className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-black/[0.035]">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ background: 'rgba(212,175,55,0.14)', color: '#8B6A00' }}>
                              <Icon size={15} />
                            </span>
                            <span>
                              <span className="block text-sm font-bold" style={{ color: '#1a1208' }}>{f.title}</span>
                              <span className="block text-xs leading-snug mt-0.5" style={{ color: '#666' }}>{f.desc}</span>
                            </span>
                          </MenuLink>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="w-[210px] flex-shrink-0 p-6 flex flex-col justify-between"
                style={{ color: '#fff' }}>
                <div>
                  <Sparkles size={16} style={{ color: GOLD }} />
                  <p className="text-sm font-black mt-2 mb-1.5">{active.cta.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{active.cta.text}</p>
                </div>
                <MenuLink href={active.cta.href} onClick={close}
                  className="mt-4 text-xs font-black text-center px-4 py-2.5 rounded-xl transition-transform hover:scale-[1.03]"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  {active.cta.button}
                </MenuLink>
              </div>
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingMegaMenu;
