import { useEffect } from 'react';
import { useDashboardBadges } from '@/hooks/useDashboardBadges';

// Número sobre el icono de la app instalada (Ficha XDS 25 oct 2026). El push
// lo pone al llegar (sw.js) y aquí se ajusta en vivo al mismo contador que
// ves en el menú: al leer, baja; a 0, desaparece. iPhone (app en inicio) y
// Chrome/Edge de ordenador lo muestran; Android pone su propio punto.
export default function AppIconBadge({ userId, isEmpresario }: { userId: string; isEmpresario: boolean }) {
  const { flashBadge, msgBadge, demandaBadge } = useDashboardBadges(userId, isEmpresario);
  const total = flashBadge + msgBadge + demandaBadge;

  useEffect(() => {
    if (!('setAppBadge' in navigator)) return;
    const accion = total > 0 ? navigator.setAppBadge(total) : navigator.clearAppBadge();
    accion.catch(() => { /* sin permiso de avisos: no hay globo */ });
  }, [total]);

  return null;
}
