import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Comparacion = {
  preguntadas: number; ambos_si: number; solo_uno_si: number; ambos_no: number; sin_respuesta: number;
  eventos_xpeak: number; eventos_fuera: number;
};

// "Acuerdos cerrados desde XPEAK" (22 nov 2026): resultado de preguntar a las dos
// partes de cada contratación si el acuerdo se cerró, y de dónde vienen los
// eventos de las trayectorias. Solo admin: la función de BD rechaza a los demás.
const AdminAcuerdos = () => {
  const [d, setD] = useState<Comparacion | null>(null);

  useEffect(() => {
    let vivo = true;
    (supabase.rpc as any)('acuerdos_comparacion').then(({ data, error }: { data: Comparacion[] | null; error: unknown }) => {
      if (vivo && !error && data?.[0]) setD(data[0]);
    });
    return () => { vivo = false; };
  }, []);

  if (!d) return null;
  const filas: [string, number][] = [
    ['Contrataciones preguntadas', d.preguntadas],
    ['Las dos partes dicen que sí', d.ambos_si],
    ['Solo una parte dice que sí', d.solo_uno_si],
    ['Nadie dice que sí (alguien dice que no)', d.ambos_no],
    ['Sin respuesta', d.sin_respuesta],
    ['Eventos de trayectorias con contrato XPEAK', d.eventos_xpeak],
    ['Eventos de trayectorias de fuera', d.eventos_fuera],
  ];
  return (
    <div className="glass-panel p-5">
      <h3 className="text-base font-bold mb-3">Acuerdos cerrados desde XPEAK</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {filas.map(([etiqueta, valor]) => (
          <div key={etiqueta}>
            <p className="text-xs text-muted-foreground">{etiqueta}</p>
            <p className="text-2xl font-bold">{valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAcuerdos;
