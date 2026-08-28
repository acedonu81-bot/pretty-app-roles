import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useDashboardBadges } from '@/hooks/useDashboardBadges';

interface NotificationBellProps {
  userId: string | undefined;
  isEmpresario: boolean;
  onViewChange: (view: string) => void;
}

// Red de seguridad in-app: los mismos badges en vivo que ya pinta el sidebar
// (useDashboardBadges), accesibles desde el topbar aunque el usuario no haya
// concedido permisos de Web Push.
const NotificationBell = ({ userId, isEmpresario, onViewChange }: NotificationBellProps) => {
  const { flashBadge, msgBadge } = useDashboardBadges(userId, isEmpresario);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const total = flashBadge + msgBadge;

  // Cerrar al hacer clic fuera (el topbar ya tiene otro dropdown abrible)
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const go = (view: string) => { onViewChange(view); setOpen(false); };

  return (
    <div className="relative flex-shrink-0" ref={wrapRef}>
      <button
        type="button"
        aria-label={`Notificaciones${total > 0 ? ` (${total} pendientes)` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="relative flex items-center justify-center rounded-full p-2 transition-colors hover:bg-black/5 active:scale-95"
        style={{ color: total > 0 ? '#8A6D0F' : '#666' }}
      >
        <Bell size={18} />
        {total > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-black leading-none"
            style={{ background: '#D4AF37', color: '#000' }}
          >
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 rounded-2xl overflow-hidden z-50"
          style={{
            width: 'min(18rem, calc(100vw - 32px))',
            background: '#ffffff',
            border: '1px solid rgba(212,175,55,0.25)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.07)',
          }}
        >
          {flashBadge > 0 && (
            <button
              type="button"
              onClick={() => go('flashbooking')}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-black/5"
              style={{ borderBottom: msgBadge > 0 ? '1px solid rgba(0,0,0,0.06)' : undefined }}
            >
              <span style={{ color: '#111' }}>Flash Booking pendientes</span>
              <span className="font-black" style={{ color: '#8A6D0F' }}>{flashBadge}</span>
            </button>
          )}
          {msgBadge > 0 && (
            <button
              type="button"
              onClick={() => go('messages')}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-black/5"
            >
              <span style={{ color: '#111' }}>Mensajes sin leer</span>
              <span className="font-black" style={{ color: '#2563eb' }}>{msgBadge}</span>
            </button>
          )}
          {total === 0 && (
            <p className="px-4 py-3 text-sm" style={{ color: '#777' }}>Sin novedades por ahora.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
