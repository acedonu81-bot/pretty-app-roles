import { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CUENTA_OFICIAL_XPEAK, marcarOrganizadoresVistos } from '@/hooks/useOrganizadoresNuevos';
import { supabase } from '@/integrations/supabase/client';
import TarjetaOrganizador, { type Organizador } from '@/components/dashboard/TarjetaOrganizador';

// Empresas organizadoras que han elegido mostrarse a los profesionales
// (29 oct 2026). Opcional para ellas: aquí NO están todas las registradas,
// solo las que han activado "Mostrar mi empresa". Se dice bien claro arriba.

interface Props {
  onVerOfertas: () => void;
}

export default function OrganizadoresView({ onVerOfertas }: Props) {
  const { user } = useAuth();
  const [lista, setLista] = useState<Organizador[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (supabase.rpc as any)('organizadores_visibles').then(({ data, error: e }: { data: Organizador[] | null; error: unknown }) => {
      if (cancelled) return;
      if (e) setError(true);
      const visibles = e ? [] : (data ?? []).filter(o => o.user_id !== CUENTA_OFICIAL_XPEAK);
      setLista(visibles);
      if (user?.id && visibles.length) marcarOrganizadoresVistos(user.id, visibles.map(o => o.user_id));
    });
    return () => { cancelled = true; };
  }, [user?.id]);

  return (
    <div className="animate-[fadeIn_0.4s_ease] max-w-5xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-1">Organizadores <span className="text-gradient">en XPEAK</span></h2>
        <p className="text-sm text-muted-foreground">Empresas que han elegido mostrarse a los profesionales.</p>
      </div>

      <div className="rounded-2xl p-4 mb-6 flex gap-3 items-start" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)' }}>
        <Briefcase size={18} style={{ color: '#8A6D0F', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm" style={{ color: '#374151' }}>
          <b>No son todas las empresas registradas.</b> Aquí solo salen las que han decidido mostrar su marca. Ves su logo, su ciudad,
          qué organizan, cuántas contrataciones han hecho en XPEAK y las ofertas que tienen abiertas. Si tienen alguna, la ves y te apuntas desde ahí.
        </p>
      </div>

      {lista === null && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm" style={{ color: '#92400e' }}>No se han podido cargar ahora mismo. Prueba en unos minutos.</p>}
      {lista && lista.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">Todavía ninguna empresa ha elegido mostrarse. Cuando alguna lo active, la verás aquí.</p>
      )}
      {lista && lista.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map(o => <TarjetaOrganizador key={o.user_id} org={o} onVerOfertas={onVerOfertas} />)}
        </div>
      )}
    </div>
  );
}
