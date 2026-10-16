import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSignature, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logEvent } from '@/lib/track';
import type { Profile } from '@/data/profiles';

const ContractModal = lazy(() => import('@/components/dashboard/ContractModal'));

// Cerrar el acuerdo desde el propio chat (16 oct 2026): hasta hoy había que
// salir de la conversación y buscar el contrato o la reserva por el menú, y
// nadie sabía dónde se cerraba. Según quién hable con quién:
//  - organizador → profesional: "Cerrar acuerdo" abre el contrato ya rellenado
//    con ese profesional, y un enlace a Flash Booking (reservas y ofertas);
//  - profesional → organizador: enlace a sus reservas y ofertas, que es donde
//    confirma;
//  - dos profesionales o dos organizadores: no hay nada que cerrar, no sale.
interface Props { otherUserId: string; otherName: string; miRol: string | null | undefined }

const AcuerdoChatBar = ({ otherUserId, otherName, miRol }: Props) => {
  const navigate = useNavigate();
  const [otroRol, setOtroRol] = useState<string | null>(null);
  const [contrato, setContrato] = useState(false);

  useEffect(() => {
    setOtroRol(null);
    if (!otherUserId) return;
    let vivo = true;
    supabase.from('profiles').select('role')
      .eq('user_id', otherUserId).order('is_primary', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { if (vivo) setOtroRol(data?.role ?? null); });
    return () => { vivo = false; };
  }, [otherUserId]);

  if (!otroRol || !miRol) return null;
  const yoOrganizador = miRol === 'empresario';
  const otroOrganizador = otroRol === 'empresario';
  if (yoOrganizador === otroOrganizador) return null;

  const irAReservas = (origen: string) => {
    void logEvent('cta_click', '/dashboard', `chat_acuerdo ${origen}`);
    navigate('/dashboard?view=flashbooking');
  };

  const profesional = {
    id: 0, userId: otherUserId, name: otherName || 'Profesional', role: otroRol,
  } as unknown as Profile;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b"
        style={{ background: '#FBF3DD', borderColor: 'rgba(212,175,55,0.35)' }}>
        <FileSignature size={15} style={{ color: '#8B6A00' }} className="shrink-0" />
        <p className="flex-1 min-w-[10rem] text-xs font-semibold" style={{ color: '#5c4a12' }}>
          {yoOrganizador
            ? '¿Habéis acordado? Ciérralo aquí y queda por escrito.'
            : 'Cuando acordéis, confirma tu reserva u oferta aquí.'}
        </p>
        {yoOrganizador ? (
          <>
            <button type="button"
              onClick={() => { void logEvent('cta_click', '/dashboard', 'chat_acuerdo cerrar_contrato'); setContrato(true); }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Cerrar acuerdo <ArrowRight size={13} strokeWidth={2.75} />
            </button>
            <button type="button" onClick={() => irAReservas('organizador_reservas')}
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.5)', color: '#8B6A00' }}>
              Reservas y ofertas
            </button>
          </>
        ) : (
          <button type="button" onClick={() => irAReservas('profesional_reservas')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            Mis reservas y ofertas <ArrowRight size={13} strokeWidth={2.75} />
          </button>
        )}
      </div>
      {contrato && (
        <Suspense fallback={null}>
          <ContractModal professional={profesional} onClose={() => setContrato(false)} onSaved={() => setContrato(false)} />
        </Suspense>
      )}
    </>
  );
};

export default AcuerdoChatBar;
