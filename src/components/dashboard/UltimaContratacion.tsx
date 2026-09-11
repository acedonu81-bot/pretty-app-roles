import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_ES } from '@/lib/constants';

/**
 * Banner de "última contratación": prueba social real dentro del directorio.
 *
 * REGLA: solo se pinta si existe una contratación DE VERDAD (estado confirmed
 * o completed) en los últimos 60 días. Sin datos no se muestra nada — un
 * banner con cifras o nombres inventados es exactamente lo que no puede hacer
 * este proyecto, y además se nota enseguida cuando el directorio tiene 37
 * perfiles y todos se conocen.
 *
 * Muestra solo el nombre del profesional contratado (que es público, ya está
 * en su ficha del directorio), su rol y la fecha. Nunca el nombre de quien
 * contrata ni el precio acordado.
 */

type Contratacion = { nombre: string; rol: string; fecha: string };

const AZUL = '#2563EB';

function haceCuanto(iso: string): string {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'ayer';
  if (dias < 7) return `hace ${dias} días`;
  if (dias < 14) return 'hace una semana';
  if (dias < 31) return `hace ${Math.floor(dias / 7)} semanas`;
  return `hace ${Math.floor(dias / 30)} ${Math.floor(dias / 30) === 1 ? 'mes' : 'meses'}`;
}

const UltimaContratacion = () => {
  const [dato, setDato] = useState<Contratacion | null>(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        // Dos sistemas de contratación conviven: flash_bookings (antiguo,
        // SolicitudesTab) y event_request_responses (actual, Flash Booking
        // con plazas) — y ninguno de los dos tenía política RLS de SELECT
        // para 'anon', así que este banner llevaba desaparecido de TODA la
        // web para un visitante real desde siempre, sin ningún error
        // visible (solo se veía logueado como el propio dueño de la fila
        // o admin). La función pública expone solo lo mínimo necesario.
        const { data } = await (supabase.rpc as any)('ultima_contratacion_publica');
        const fila = (data as { professional_user_id?: string; fecha?: string }[] | null)?.[0];

        if (!fila?.professional_user_id || !fila.fecha || !vivo) return;

        const { data: perfil } = await supabase
          .from('profiles')
          .select('display_name, role')
          .eq('user_id', fila.professional_user_id)
          .maybeSingle();

        if (!perfil?.display_name || !vivo) return;
        setDato({
          nombre: perfil.display_name,
          rol: ROLE_ES[perfil.role as string] ?? (perfil.role as string) ?? '',
          fecha: fila.fecha,
        });
      } catch {
        // Sin datos o sin permiso: no se muestra nada. Nunca un valor de relleno.
      }
    })();
    return () => { vivo = false; };
  }, []);

  if (!dato) return null;

  return (
    <div
      className="flex items-center gap-2.5 mb-4 px-3.5 py-2.5 rounded-xl"
      style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)' }}
    >
      <span
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 22, height: 22, background: 'rgba(37,99,235,0.14)', color: AZUL }}
      >
        <CheckCircle2 size={13} />
      </span>
      <p className="text-xs leading-snug" style={{ color: '#222' }}>
        <span className="font-black" style={{ color: AZUL }}>Última contratación:</span>{' '}
        <span className="font-bold">{dato.nombre}</span>
        {dato.rol && <span style={{ color: 'rgba(10,9,8,0.6)' }}> · {dato.rol}</span>}
        <span style={{ color: 'rgba(10,9,8,0.5)' }}> · {haceCuanto(dato.fecha)}</span>
      </p>
    </div>
  );
};

export default UltimaContratacion;
