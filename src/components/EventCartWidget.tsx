import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useEventCart } from '@/lib/eventCart';
import EventCartCheckoutModal from '@/components/EventCartCheckoutModal';

// Rutas privadas donde el flujo de "organizador anónimo" no aplica (ya dentro de una cuenta).
const HIDDEN_PREFIXES = ['/dashboard', '/admin-beta', '/auth'];

/** Icono flotante de "mi evento" — visible en directorio y fichas públicas cuando hay algo en la cesta. */
export default function EventCartWidget() {
  const { items, remove } = useEventCart();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const hidden = HIDDEN_PREFIXES.some(p => location.pathname.startsWith(p));
  if (hidden || items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
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
        <EventCartCheckoutModal
          items={items}
          onClose={() => setOpen(false)}
          onRemove={remove}
        />
      )}
    </>
  );
}
