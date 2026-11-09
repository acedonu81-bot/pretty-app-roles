import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CabeceraArtistaDJ from '@/components/CabeceraArtistaDJ';
import { useDjBanner } from '@/hooks/useDjBanner';
import { GANADOR_CONCURSO_ID, ganadorEnPortada } from '@/lib/concursoMadrid';

// Ganador del Concurso DJ XPEAK Madrid 2026 arriba del todo de la portada
// durante una semana (ver FIN_GANADOR_PORTADA). Lee su perfil en vivo: si
// cambia banner, foto o nombre desde su panel, cambia aquí también. Mismo
// recuadro que su perfil público, con el enlace a su sesión del concurso.
const CONCURSO = 'dj-madrid-2026';
type Fila = { user_id: string; soundcloud_url: string | null };
const sb = supabase as unknown as {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: Fila[] | null; error: unknown }>;
};
type Perfil = { display_name: string | null; photo_url: string | null; zone: string | null; genres: string[] | null; is_verified: boolean | null };

const boton = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black transition-transform hover:translate-x-0.5';

const ConcursoGanador = () => {
  const visible = ganadorEnPortada();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [sesion, setSesion] = useState<string | null>(null);
  const { banner } = useDjBanner(visible ? GANADOR_CONCURSO_ID : undefined);

  useEffect(() => {
    if (!visible) return;
    let cancelado = false;
    supabase.from('profiles').select('display_name, photo_url, zone, genres, is_verified')
      .eq('user_id', GANADOR_CONCURSO_ID)
      .then(({ data }) => {
        const filas = (data ?? []) as Perfil[];
        if (!cancelado) setPerfil(filas.find(f => !!f.photo_url) ?? filas[0] ?? null);
      });
    sb.rpc('concurso_participantes', { p_concurso: CONCURSO }).then(({ data }) => {
      if (!cancelado) setSesion((data ?? []).find(f => f.user_id === GANADOR_CONCURSO_ID)?.soundcloud_url ?? null);
    });
    return () => { cancelado = true; };
  }, [visible]);

  if (!visible || !perfil?.display_name) return null;

  return (
    <section className="max-w-3xl mx-auto mb-5" aria-label="Ganador del Concurso DJ XPEAK Madrid">
      <p className="inline-flex items-center gap-1.5 px-3 text-[0.75rem] uppercase tracking-[0.2em] font-black" style={{ color: '#F3D77A' }}>
        <Trophy size={13} strokeWidth={2.5} /> Ganador del Concurso DJ XPEAK Madrid
      </p>
      <div className="-mx-3 sm:-mx-5">
        <CabeceraArtistaDJ
          titulo="h2"
          nombre={perfil.display_name}
          foto={perfil.photo_url}
          banner={banner ?? perfil.photo_url}
          zona={perfil.zone}
          estilos={perfil.genres ?? []}
          verificado={!!perfil.is_verified}
          acciones={<>
            {sesion && (
              <a href={sesion} target="_blank" rel="noopener noreferrer" className={boton}
                style={{ background: '#D4AF37', color: '#1a1208', boxShadow: '0 4px 15px rgba(212,175,55,0.35)' }}>
                <Headphones size={15} strokeWidth={2.5} /> Escuchar su sesión del concurso
              </a>
            )}
            <Link to={`/p/${GANADOR_CONCURSO_ID}`} className={boton} style={{ background: '#fff', color: '#7A5A0E' }}>
              Ver su perfil <ArrowRight size={15} strokeWidth={2.75} />
            </Link>
          </>}
        />
      </div>
    </section>
  );
};

export default ConcursoGanador;
