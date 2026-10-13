import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { EVENTO_INTERESADOS } from '@/hooks/useInteresadosPendientes';

// 13 oct 2026: "Relanzar oferta" solo estaba dentro de Flash Booking > Demanda,
// escondido. Aquí sale de frente en el Inicio del organizador: ofertas suyas
// cerradas (se cayó el contratado, o dijo que no) o caducadas sin cubrir.
interface OfertaRelanzable {
  id: string;
  event_type: string;
  city: string;
  event_date: string | null;
  status: string;
  contratados: string[]; // ids de event_request_responses con hired_at
}

const OfertasRelanzarBanner = ({ userId }: { userId?: string }) => {
  const [ofertas, setOfertas] = useState<OfertaRelanzable[]>([]);
  const [relanzando, setRelanzando] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!userId) return;
    const ahora = new Date().toISOString();
    const catorceDias = new Date(Date.now() - 14 * 86400000).toISOString();
    const { data, error } = await supabase
      .from('event_requests' as any)
      .select('id, event_type, city, event_date, status, expires_at, event_request_responses(id, hired_at)')
      .eq('client_user_id', userId)
      .gt('created_at', catorceDias)
      .or(`status.eq.closed,and(status.eq.open,expires_at.lt.${ahora})`)
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) { console.error('[OfertasRelanzarBanner]', error.message); return; }
    setOfertas(((data ?? []) as any[]).map(r => ({
      id: r.id, event_type: r.event_type, city: r.city, event_date: r.event_date, status: r.status,
      contratados: (r.event_request_responses ?? []).filter((x: any) => x.hired_at).map((x: any) => x.id),
    })));
  }, [userId]);

  useEffect(() => {
    cargar();
    window.addEventListener(EVENTO_INTERESADOS, cargar);
    return () => window.removeEventListener(EVENTO_INTERESADOS, cargar);
  }, [cargar]);

  const relanzar = async (o: OfertaRelanzable) => {
    if (o.contratados.length > 0 && !window.confirm('Se anulará la contratación actual y la oferta volverá a abrirse. ¿Seguro?')) return;
    setRelanzando(o.id);
    for (const rid of o.contratados) {
      await supabase.from('event_request_responses' as any).update({ hired_at: null, chosen_at: null }).eq('id', rid);
    }
    const { data: filas, error } = await supabase
      .from('event_requests' as any)
      .update({ status: 'open', expires_at: new Date(Date.now() + 7 * 86400000).toISOString() })
      .eq('id', o.id)
      .select('id');
    setRelanzando(null);
    if (error || !filas || filas.length === 0) { toast.error('No se pudo relanzar. Inténtalo otra vez.'); return; }
    setOfertas(prev => prev.filter(x => x.id !== o.id));
    window.dispatchEvent(new Event(EVENTO_INTERESADOS));
    toast.success('Oferta relanzada: los profesionales vuelven a verla durante 7 días.');
  };

  if (ofertas.length === 0) return null;

  return (
    <div className="mb-5 flex flex-col gap-2">
      {ofertas.map(o => {
        const titulo = `${o.event_type} en ${o.city}${o.event_date ? ` · ${new Date(o.event_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}` : ''}`;
        const motivo = o.status === 'closed'
          ? (o.contratados.length > 0 ? '¿Se ha caído el profesional? Relanza la oferta para buscar a otro.' : 'La oferta está cerrada. Relánzala para buscar a otro profesional.')
          : 'Esta oferta caducó sin cubrirse. Relánzala y vuelve a verse 7 días.';
        return (
          <div key={o.id} className="p-3 rounded-xl flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1.5px solid #d97706' }}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate" style={{ color: '#7c4a03' }}>{titulo}</p>
              <p className="text-xs" style={{ color: '#7c4a03' }}>{motivo}</p>
            </div>
            <button type="button" onClick={() => relanzar(o)} disabled={relanzando === o.id}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black disabled:opacity-60 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
              <RefreshCw size={13} />
              {relanzando === o.id ? 'Relanzando…' : 'Relanzar oferta'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default OfertasRelanzarBanner;
