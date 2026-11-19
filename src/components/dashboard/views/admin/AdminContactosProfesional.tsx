import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROLE_ES } from '@/lib/constants';
import { nombrePlan } from '@/lib/ventajasPlan';
import { resumenContactos, type FilaContactos } from '@/lib/contactosProfesional';

// 19 nov 2026: con el chat libre XPEAK deja de ver lo que pasa fuera. Esta
// tarjeta cuenta cuántas personas distintas ha contactado a cada profesional
// en 30 días (conversaciones nuevas y solicitudes, sin repetir). Es la cifra
// que decide cuándo subir el precio: ≥2 contactos al mes por profesional de
// pago. Datos de la función admin_contactos_por_profesional.
const AdminContactosProfesional = () => {
  const [filas, setFilas] = useState<FilaContactos[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const { data, error: e } = await (supabase.rpc as any)('admin_contactos_por_profesional', { p_dias: 30 });
      if (!vivo) return;
      if (e || !Array.isArray(data)) { setError(true); return; }
      setFilas(data as FilaContactos[]);
    })();
    return () => { vivo = false; };
  }, []);

  if (error) {
    return (
      <div className="glass-panel p-4 mb-6">
        <p className="text-[0.75rem] text-muted-foreground uppercase tracking-wider font-bold mb-1">Contactos por profesional</p>
        <p className="text-sm text-muted-foreground">Falta ejecutar el SQL de contactos en Supabase (20261119140000_admin_contactos_por_profesional).</p>
      </div>
    );
  }
  if (!filas) return null;

  const r = resumenContactos(filas);
  const kpis = [
    { label: 'Profesionales', value: String(r.total) },
    { label: 'Con 1 o más', value: `${r.con1} (${r.pct1} %)` },
    { label: 'Con 2 o más', value: `${r.con2} (${r.pct2} %)` },
    { label: 'Media por profesional', value: r.media.toFixed(2).replace('.', ',') },
  ];
  const top = filas.filter(f => Number(f.contactos) > 0).slice(0, 8);

  return (
    <div className="mb-6">
      <p className="text-[0.75rem] text-muted-foreground uppercase tracking-wider font-bold mb-2">Contactos por profesional · últimos 30 días</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {kpis.map(k => (
          <div key={k.label} className="glass-panel p-3">
            <span className="text-[0.75rem] text-muted-foreground uppercase tracking-wider font-bold">{k.label}</span>
            <p className="text-lg font-bold mt-1" style={{ color: '#8A6D0F' }}>{k.value}</p>
          </div>
        ))}
      </div>
      {top.length > 0 ? (
        <div className="glass-panel p-3">
          <ul className="flex flex-col gap-1.5">
            {top.map(f => (
              <li key={f.user_id} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate font-bold">{f.nombre}</span>
                <span className="flex-shrink-0 text-xs text-muted-foreground">{(ROLE_ES as Record<string, string>)[f.rol] ?? f.rol} · {nombrePlan(f.plan)}</span>
                <span className="flex-shrink-0 text-sm font-bold" style={{ color: '#8A6D0F' }}>{Number(f.contactos)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Ningún profesional ha recibido contactos en los últimos 30 días.</p>
      )}
      <p className="text-[0.7rem] text-muted-foreground mt-2">
        Personas distintas que le han escrito o le han pedido algo, sin contar admins ni la cuenta de XPEAK. Para subir precios: 2 o más al mes por profesional de pago.
      </p>
    </div>
  );
};

export default AdminContactosProfesional;
