import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import { useEventCart } from '@/lib/eventCart';
import EventCartCheckoutModal from '@/components/EventCartCheckoutModal';

// Rutas privadas donde el flujo de "organizador anónimo" no aplica (ya dentro de una cuenta).
const HIDDEN_PREFIXES = ['/dashboard', '/admin-beta', '/auth'];
const HINT_SEEN_KEY = 'xpeak_cart_hint_seen';
const DRAFT_KEY = 'xpeak_event_cart_draft';

/** Icono flotante de "mi evento" — visible en directorio y fichas públicas cuando hay algo en la cesta. */
export default function EventCartWidget() {
  const { items } = useEventCart();
  // Si vuelve de crear cuenta con un borrador de solicitud pendiente (ver
  // EventCartCheckoutModal), reabre el modal solo para que no tenga que
  // volver a pulsar "Mi evento" y encontrar el formulario en blanco.
  const [open, setOpen] = useState(() => !!sessionStorage.getItem(DRAFT_KEY));
  const [showHint, setShowHint] = useState(false);
  const [overSwipeCard, setOverSwipeCard] = useState(false);
  const location = useLocation();

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem(HINT_SEEN_KEY, '1');
  };

  useEffect(() => {
    if (items.length === 1 && !localStorage.getItem(HINT_SEEN_KEY)) {
      setShowHint(true);
      const t = setTimeout(dismissHint, 5000);
      return () => clearTimeout(t);
    }
  }, [items.length]);

  // La vista Swipe del directorio (móvil) tiene sus propios botones
  // "Ver perfil completo"/"Contactar" anclados al fondo de la tarjeta —
  // este FAB fixed puede solaparlos según cuánto contenido haya encima
  // (no hay padding que lo resuelva en todas las alturas de pantalla, la
  // tarjeta vive en el flujo normal de la página, no a pantalla completa).
  // Se oculta mientras la tarjeta esté en viewport; el swipe ya tiene su
  // propio botón "+" para añadir al carrito, así que no se pierde acceso.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => setOverSwipeCard(entries.some(e => e.isIntersecting)),
      { threshold: 0.15 }
    );
    const observed = new Set<Element>();
    const sync = () => {
      document.querySelectorAll('.swipe-card-info').forEach(el => {
        if (!observed.has(el)) { io.observe(el); observed.add(el); }
      });
    };
    // La tarjeta Swipe se monta de forma asíncrona (tras cargar perfiles),
    // después de que este widget ya esté montado — un MutationObserver
    // detecta cuándo aparece en el DOM, en vez de solo comprobar una vez.
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });
    sync();
    return () => { io.disconnect(); mo.disconnect(); };
  }, [location.pathname]);

  const hidden = HIDDEN_PREFIXES.some(p => location.pathname.startsWith(p));
  const visible = !hidden && items.length > 0 && !overSwipeCard;

  useEffect(() => {
    document.body.classList.toggle('has-event-cart-widget', visible);
    return () => document.body.classList.remove('has-event-cart-widget');
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {showHint && (
        <div className="fixed bottom-20 right-5 z-40 max-w-[240px] p-3.5 rounded-xl animate-[fadeIn_0.3s_ease]"
          style={{ background: '#161412', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
          <button onClick={dismissHint} aria-label="Cerrar aviso" className="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity">
            <X size={13} color="#fff" />
          </button>
          <p className="text-xs font-bold mb-1" style={{ color: '#D4AF37' }}>Perfil guardado en "Mi evento"</p>
          <p className="text-[0.7rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Añade varios profesionales aquí y pide presupuesto conjunto para el mismo evento con un solo formulario.
          </p>
        </div>
      )}
      <button
        onClick={() => { setOpen(true); dismissHint(); }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000', boxShadow: '0 8px 24px rgba(212,175,55,0.4)' }}>
        <span className="relative">
          <ShoppingBag size={18} />
          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem] font-black"
            style={{ background: '#111', color: '#D4AF37' }}>
            {items.length}
          </span>
        </span>
        <span className="text-xs font-black">Mi evento</span>
      </button>

      {open && (
        <EventCartCheckoutModal onClose={() => setOpen(false)} />
      )}
    </>
  );
}
