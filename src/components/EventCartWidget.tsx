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

  const hidden = HIDDEN_PREFIXES.some(p => location.pathname.startsWith(p));
  const visible = !hidden && items.length > 0;

  useEffect(() => {
    document.body.classList.toggle('has-event-cart-widget', visible);
    return () => document.body.classList.remove('has-event-cart-widget');
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {showHint && (
        <div className="fixed right-5 z-40 max-w-[240px] p-3.5 rounded-xl animate-[fadeIn_0.3s_ease]"
          style={{
            bottom: 'calc(10.5rem + env(safe-area-inset-bottom))',
            background: '#161412',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}>
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
        aria-label={`Mi evento — ${items.length} profesional${items.length === 1 ? '' : 'es'}`}
        // Mismo tamaño que el círculo de SupportChat (44px/56px) en vez de la
        // píldora ancha con texto de antes — un solo FAB de peso visual
        // comparable al de soporte, no dos "botones grandes" compitiendo.
        // El botón de soporte ocupa la misma esquina (`right-4`, z-50), así
        // que este sube por encima en vez de competir por el mismo hueco.
        className="fixed right-4 sm:right-5 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{
          bottom: 'calc(5.75rem + env(safe-area-inset-bottom))',
          background: 'linear-gradient(135deg,#D4AF37,#B8941E)',
          color: '#000',
          boxShadow: '0 4px 14px rgba(212,175,55,0.35)',
        }}>
        <span className="relative">
          <ShoppingBag size={18} className="sm:hidden" />
          <ShoppingBag size={22} className="hidden sm:block" />
          <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[0.55rem] sm:text-[0.6rem] font-black"
            style={{ background: '#111', color: '#D4AF37' }}>
            {items.length}
          </span>
        </span>
      </button>

      {open && (
        <EventCartCheckoutModal onClose={() => setOpen(false)} />
      )}
    </>
  );
}
