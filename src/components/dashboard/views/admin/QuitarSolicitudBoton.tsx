import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Botón "Quitar" de cada solicitud en el aviso ámbar y en el semáforo (17 oct
// 2026). Solo la oculta del panel del admin (flash_bookings.oculta_admin_at):
// la solicitud sigue existiendo y el profesional la sigue viendo y pudiendo
// contestar. Al quitarla desaparece de los dos sitios a la vez.
const QuitarSolicitudBoton = ({ id, onQuitada }: { id: string; onQuitada: (id: string) => void }) => {
  const [enviando, setEnviando] = useState(false);

  const quitar = async () => {
    setEnviando(true);
    const { error } = await (supabase.rpc as any)('panel_admin_ocultar_solicitud', { p_id: id });
    setEnviando(false);
    if (error) {
      toast.error('No se ha podido quitar. Inténtalo otra vez.');
      return;
    }
    onQuitada(id);
    window.dispatchEvent(new CustomEvent('xpeak:solicitud-quitada', { detail: id }));
  };

  return (
    <button
      type="button"
      onClick={quitar}
      disabled={enviando}
      title="Quitar del panel (el profesional la sigue viendo)"
      className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.7rem] font-bold transition-colors disabled:opacity-50"
      style={{ background: 'rgba(0,0,0,0.06)', color: '#374151' }}
    >
      <X size={12} strokeWidth={3} /> {enviando ? 'Quitando…' : 'Quitar'}
    </button>
  );
};

export default QuitarSolicitudBoton;
