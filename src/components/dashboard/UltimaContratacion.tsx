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
 *
 * ROTACIÓN: la función trae hasta 10 contrataciones recientes (más nueva
 * primero) y el banner va rotando entre ellas cada 5s. Es una cola natural:
 * si solo hay 1, se queda fija sin rotar; si entra una nueva contratación más
 * reciente, empuja fuera a la más antigua de la cola (por el LIMIT 10 de la
 * función) o esta desaparece sola al pasar los 60 días.
 */

type Contratacion = { nombre: string; rol: string; fecha: string };

const AZUL = '#2563EB';
const INTERVALO_ROTACION_MS = 5000;

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
  const [cola, setCola] = useState<Contratacion[]>([]);
  const [indice, setIndice] = useState(0);

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
        const filas = (data as { professional_user_id?: string; fecha?: string }[] | null) ?? [];
        if (!filas.length || !vivo) return;

        const ids = [...new Set(filas.map((f) => f.professional_user_id).filter(Boolean))] as string[];
        const { data: perfiles } = await supabase
          .from('profiles')
          .select('user_id, display_name, role')
          .in('user_id', ids);

        if (!vivo) return;
        const perfilPorId = new Map((perfiles ?? []).map((p) => [p.user_id, p]));

        const items: Contratacion[] = filas
          .map((f) => {
            const perfil = f.professional_user_id ? perfilPorId.get(f.professional_user_id) : null;
            if (!perfil?.display_name || !f.fecha) return null;
            return {
              nombre: perfil.display_name,
              rol: ROLE_ES[perfil.role as string] ?? (perfil.role as string) ?? '',
              fecha: f.fecha,
            };
          })
          .filter((x): x is Contratacion => x !== null);

        setCola(items);
      } catch {
        // Sin datos o sin permiso: no se muestra nada. Nunca un valor de relleno.
      }
    })();
    return () => { vivo = false; };
  }, []);

  useEffect(() => {
    if (cola.length < 2) return;
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % cola.length);
    }, INTERVALO_ROTACION_MS);
    return () => clearInterval(id);
  }, [cola.length]);

  const dato = cola[indice];
  if (!dato) return null;

  return (
    <div
      className="xpk-ultima-contratacion flex items-center gap-2.5 mb-4 px-3.5 py-2.5 rounded-xl"
      style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)' }}
    >
      <style>{`
        @keyframes xpk-pulso-vida {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes xpk-fade-rotacion {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .xpk-ultima-contratacion { animation: xpk-pulso-vida 2.4s ease-in-out infinite; }
        .xpk-ultima-contratacion-texto { animation: xpk-fade-rotacion 0.4s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .xpk-ultima-contratacion, .xpk-ultima-contratacion-texto { animation: none; }
        }
      `}</style>
      <span
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 22, height: 22, background: 'rgba(37,99,235,0.14)', color: AZUL }}
      >
        <CheckCircle2 size={13} />
      </span>
      <p key={indice} className="xpk-ultima-contratacion-texto text-xs leading-snug" style={{ color: '#222' }}>
        <span className="font-black" style={{ color: AZUL }}>Última contratación:</span>{' '}
        <span className="font-bold">{dato.nombre}</span>
        {dato.rol && <span style={{ color: 'rgba(10,9,8,0.6)' }}> · {dato.rol}</span>}
        <span style={{ color: 'rgba(10,9,8,0.5)' }}> · {haceCuanto(dato.fecha)}</span>
      </p>
    </div>
  );
};

export default UltimaContratacion;
