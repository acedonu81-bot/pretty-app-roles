import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Rss, Home, Megaphone, MessageSquare, Search, User, FileEdit, BarChart3,
  CalendarDays, FileText, Sparkles, ThumbsUp, Settings, LayoutGrid, type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { PUSH_ASK_EVENT } from '@/lib/pushAsk';
import { logConsejo } from '@/lib/track';

/**
 * Un consejo por visita: una ventana junto a un apartado del menú explicando
 * para qué sirve. Primero el Feed y después el menú de arriba abajo; lo que
 * ya salió no vuelve (Ficha XDS 10 oct 2026, 73,2, aprobada por el usuario).
 * El ancla es el atributo data-nav de cada NavItem de DashboardSidebar.
 */

type Paso = {
  id: string;
  titulo: string;
  texto: string;
  icon: LucideIcon;
  color?: string;
  cta?: string;
  // 'resenas' no es una vista: va por goToPendingReviews del Dashboard.
  destino?: string;
};

const FEED_PRO: Paso = { id: 'feed', titulo: 'El Feed', icon: Rss, color: '#6B8FD4', cta: 'Ir al Feed', destino: 'feed',
  texto: 'Aquí ves las fotos, sesiones y novedades de los profesionales que sigues. Sigue a gente del sector y publica lo tuyo desde Mi Ficha para que te descubran.' };

const PROFESIONAL: Paso[] = [
  FEED_PRO,
  { id: 'explorar', titulo: 'Inicio', icon: Home, cta: 'Ir a Inicio', destino: 'explorar',
    texto: 'El mapa de todas las categorías de XPEAK. Desde aquí entras en cualquier oficio y ves quién hay en cada uno.' },
  { id: 'flashbooking', titulo: 'Flash Booking', icon: Megaphone, cta: 'Ir a Flash Booking', destino: 'flashbooking',
    texto: 'Ofertas urgentes de organizadores que necesitan a alguien ya. Activa tu disponibilidad para que te lleguen y contesta rápido.' },
  { id: 'messages', titulo: 'Mensajes', icon: MessageSquare, cta: 'Ir a Mensajes', destino: 'messages',
    texto: 'Tus conversaciones con organizadores, sin salir de XPEAK. Contesta pronto: quien organiza un evento no suele esperar.' },
  { id: 'directorio', titulo: 'Directorio', icon: Search,
    texto: 'Todos los profesionales por categoría y comunidad. Mira cómo se presentan otros de tu oficio y qué tarifas tienen.' },
  { id: 'profile', titulo: 'Mi Perfil', icon: User, cta: 'Ir a Mi Perfil', destino: 'profile',
    texto: 'Tu foto, bio, tarifa, ciudad y lo que haces. Es lo que ven los organizadores en el directorio, y los perfiles completos salen más arriba.' },
  { id: 'ficha', titulo: 'Mi Ficha', icon: FileEdit, cta: 'Ir a Mi Ficha', destino: 'ficha',
    texto: 'Aquí publicas fotos, vídeos y novedades. Lo que subes sale en tu perfil público y en el Feed de quien te sigue.' },
  { id: 'stats', titulo: 'Estadísticas', icon: BarChart3, cta: 'Ver mis estadísticas', destino: 'stats',
    texto: 'Cuánta gente ha visto tu perfil esta semana y cómo está tu tarifa frente a la de otros de tu oficio.' },
  { id: 'calendar', titulo: 'Calendario', icon: CalendarDays, cta: 'Ir al Calendario', destino: 'calendar',
    texto: 'Tus trabajos y los días que tienes libres. Lo que marcas como disponible sale en tu perfil público, y puedes activar un aviso por email el día antes de cada trabajo.' },
  { id: 'contracts', titulo: 'Contratos', icon: FileText, cta: 'Ir a Contratos', destino: 'contracts',
    texto: 'Prepara el contrato de cada trabajo con los datos de las dos partes y descárgalo para firmarlo.' },
  { id: 'resources', titulo: 'Recursos', icon: Sparkles, cta: 'Ver Recursos', destino: 'resources',
    texto: 'Guías para tu oficio: cuánto cobrar, cómo conseguir más trabajo y qué poner en un contrato.' },
  { id: 'resenas', titulo: 'Reseñas', icon: ThumbsUp, cta: 'Ver Reseñas', destino: 'resenas',
    texto: 'Aquí valoras los trabajos que has hecho por XPEAK. Las reseñas dan confianza a quien te va a contratar.' },
  { id: 'settings', titulo: 'Ajustes', icon: Settings, cta: 'Ir a Ajustes', destino: 'settings',
    texto: 'Notificaciones, privacidad, tus perfiles y tus datos. Desde aquí activas los avisos en el móvil para no perderte ningún mensaje.' },
];

const EMPRESARIO: Paso[] = [
  { ...FEED_PRO,
    texto: 'Las fotos, sesiones y novedades de los profesionales que sigues. Sigue a los que te interesen para tenerlos siempre a mano.' },
  { id: 'empresario', titulo: 'Inicio', icon: Home, cta: 'Ir a Inicio', destino: 'empresario',
    texto: 'Tu panel de organizador: descubrir profesionales, tus ofertas Flash, favoritos, historial y gastos de lo que has contratado.' },
  { id: 'flashbooking', titulo: 'Flash Booking', icon: Megaphone, cta: 'Ir a Flash Booking', destino: 'flashbooking',
    texto: 'Publica una oferta urgente con fecha, zona y presupuesto, y te responden los profesionales disponibles.' },
  { id: 'messages', titulo: 'Mensajes', icon: MessageSquare, cta: 'Ir a Mensajes', destino: 'messages',
    texto: 'Habla con los profesionales directamente, sin salir de XPEAK.' },
  { id: 'explorar', titulo: 'Explorar categorías', icon: LayoutGrid, cta: 'Explorar categorías', destino: 'explorar',
    texto: 'El mapa de todos los oficios de XPEAK: DJs, camareros, fotógrafos y mucho más. Entra en cualquiera para ver quién hay.' },
  { id: 'directorio', titulo: 'Directorio', icon: Search,
    texto: 'Todos los profesionales por categoría y comunidad, con su tarifa a la vista antes de escribirles.' },
  { id: 'profile', titulo: 'Mi Perfil', icon: User, cta: 'Ir a Mi Perfil', destino: 'profile',
    texto: 'Tus datos de organizador y de tu empresa o local.' },
  { id: 'calendar', titulo: 'Calendario', icon: CalendarDays, cta: 'Ir al Calendario', destino: 'calendar',
    texto: 'Tus eventos en un calendario, con aviso por email el día antes si lo activas.' },
  { id: 'contracts', titulo: 'Contratos', icon: FileText, cta: 'Ir a Contratos', destino: 'contracts',
    texto: 'Prepara el contrato con el profesional que contratas, con los datos de las dos partes, y descárgalo para firmarlo.' },
  { id: 'resenas', titulo: 'Reseñas', icon: ThumbsUp, cta: 'Ver Reseñas', destino: 'resenas',
    texto: 'Valora a los profesionales con los que has trabajado. Tu reseña ayuda a otros organizadores a elegir bien.' },
  { id: 'settings', titulo: 'Ajustes', icon: Settings, cta: 'Ir a Ajustes', destino: 'settings',
    texto: 'Notificaciones, privacidad y tus datos. Desde aquí activas los avisos en el móvil para no perderte ninguna respuesta.' },
];

// rookie/sin rol tienen "Inicio" apuntando a Mi Perfil y el mapa en su propio
// botón "Explorar categorías" (mismo criterio que homeView en el sidebar).
function pasosPara(role: string): Paso[] {
  if (role === 'empresario') return EMPRESARIO;
  if (role === 'rookie') return PROFESIONAL.map(p => p.id === 'explorar' ? { ...p, titulo: 'Explorar categorías', cta: 'Explorar categorías' } : p);
  return PROFESIONAL;
}

const SESION_KEY = 'xpeak_consejo_sesion';
const vistosKey = (uid: string) => `xpeak_consejos_vistos_${uid}`;

// Storage puede lanzar en modo privado o con datos bloqueados.
const leer = (s: Storage, k: string) => { try { return s.getItem(k); } catch { return null; } };
const guardar = (s: Storage, k: string, v: string) => { try { s.setItem(k, v); } catch { /* sin storage no hay consejos */ } };

interface Props {
  isMobile: boolean;
  onNavigate: (view: string) => void;
  onGoToReviews: () => void;
}

type Ancla = { left: number; top: number; flecha: number } | null;

export default function ConsejosPanel({ isMobile, onNavigate, onGoToReviews }: Props) {
  const { user } = useAuth();
  const profile = useProfile();
  const role = profile.role;
  const createdAt = (profile as { created_at?: string | null }).created_at;
  const [paso, setPaso] = useState<{ p: Paso; n: number; total: number } | null>(null);
  const [ancla, setAncla] = useState<Ancla>(null);

  useEffect(() => {
    const uid = user?.id;
    if (profile.loading || !uid || !role || role === 'pending') return;
    // Una ventana por visita y nunca junto a otra: ni la de notificaciones,
    // ni el aviso de cookies, ni el tour de bienvenida de los primeros 7 días.
    if (leer(sessionStorage, SESION_KEY) || leer(sessionStorage, 'xpeak_push_ask_shown')) return;
    if (!leer(localStorage, 'xpeak-cookie-consent')) return;
    const dias = createdAt ? (Date.now() - new Date(createdAt).getTime()) / 864e5 : 999;
    if (dias <= 7 && !leer(localStorage, 'xpeak_tour_v2_done')) return;

    const lista = pasosPara(role);
    let vistos: string[] = [];
    try { vistos = JSON.parse(leer(localStorage, vistosKey(uid)) ?? '[]'); } catch { vistos = []; }
    const i = lista.findIndex(p => !vistos.includes(p.id));
    if (i < 0) return;

    const t = setTimeout(() => {
      if (leer(sessionStorage, 'xpeak_push_ask_shown')) return;
      guardar(sessionStorage, SESION_KEY, lista[i].id);
      guardar(localStorage, vistosKey(uid), JSON.stringify([...vistos, lista[i].id]));
      setPaso({ p: lista[i], n: i + 1, total: lista.length });
      logConsejo('visto', lista[i].id);
    }, 2500);
    return () => clearTimeout(t);
  }, [profile.loading, user?.id, role, createdAt]);

  useEffect(() => {
    const ocultar = () => setPaso(null);
    window.addEventListener(PUSH_ASK_EVENT, ocultar);
    return () => window.removeEventListener(PUSH_ASK_EVENT, ocultar);
  }, []);

  // En escritorio la ventana se pega al icono del menú; se recalcula porque el
  // sidebar se abre y se cierra con animación y la página hace scroll.
  useEffect(() => {
    if (!paso || isMobile) return;
    const calcular = () => {
      const r = document.querySelector<HTMLElement>(`[data-nav="${paso.p.id}"]`)?.getBoundingClientRect();
      if (!r || r.width === 0 || r.bottom < 0 || r.top > window.innerHeight) { setAncla(a => (a ? null : a)); return; }
      const centro = r.top + r.height / 2;
      const top = Math.min(Math.max(12, centro - 34), window.innerHeight - 250);
      const nueva = { left: r.right + 14, top, flecha: centro - top - 6 };
      setAncla(a => (a && a.left === nueva.left && a.top === nueva.top ? a : nueva));
    };
    calcular();
    const id = window.setInterval(calcular, 400);
    window.addEventListener('resize', calcular);
    return () => { window.clearInterval(id); window.removeEventListener('resize', calcular); };
  }, [paso, isMobile]);

  const cerrar = () => { if (paso) logConsejo('cerrar', paso.p.id); setPaso(null); };
  const ir = () => {
    if (!paso?.p.destino) return;
    logConsejo('ir', paso.p.id);
    const destino = paso.p.destino;
    setPaso(null);
    if (destino === 'resenas') onGoToReviews(); else onNavigate(destino);
  };

  const posicion: React.CSSProperties = isMobile
    ? { left: 12, right: 12, bottom: 'calc(64px + max(env(safe-area-inset-bottom), 12px) + 10px)' }
    : ancla
      ? { left: ancla.left, top: ancla.top, width: 320 }
      : { left: 72, bottom: 24, width: 320 };

  return (
    <AnimatePresence>
      {paso && (
        <motion.div
          key={paso.p.id}
          role="dialog"
          aria-label={`Consejo: ${paso.p.titulo}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[60]"
          style={{ ...posicion, background: '#FFFDF7', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 16, boxShadow: '0 14px 40px rgba(122,98,22,0.20)' }}
        >
          {!isMobile && ancla && (
            <span aria-hidden style={{ position: 'absolute', left: -7, top: ancla.flecha, width: 12, height: 12, background: '#FFFDF7', borderLeft: '1px solid rgba(212,175,55,0.4)', borderBottom: '1px solid rgba(212,175,55,0.4)', transform: 'rotate(45deg)' }} />
          )}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: paso.p.color ? 'rgba(107,143,212,0.14)' : 'rgba(212,175,55,0.14)' }}>
                <paso.p.icon size={18} strokeWidth={2.5} style={{ color: paso.p.color ?? '#8B6A00' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] mb-0.5" style={{ color: '#8B6A00' }}>
                  Conoce XPEAK · {paso.n} de {paso.total}
                </p>
                <p className="text-[0.95rem] font-black font-display" style={{ color: '#111' }}>{paso.p.titulo}</p>
              </div>
              <button onClick={cerrar} aria-label="Cerrar" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 flex-shrink-0">
                <X size={14} style={{ color: '#374151' }} />
              </button>
            </div>
            <p className="text-xs leading-relaxed mt-2.5" style={{ color: '#374151' }}>{paso.p.texto}</p>
            <div className="flex gap-2 mt-4">
              {paso.p.cta && (
                <button onClick={ir} className="flex-1 py-2 rounded-xl text-xs font-black transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                  {paso.p.cta}
                </button>
              )}
              <button onClick={cerrar} className={`${paso.p.cta ? 'px-4' : 'flex-1'} py-2 rounded-xl text-xs font-bold transition-all hover:bg-black/5`}
                style={{ border: '1px solid rgba(122,98,22,0.18)', color: '#374151' }}>
                Entendido
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
