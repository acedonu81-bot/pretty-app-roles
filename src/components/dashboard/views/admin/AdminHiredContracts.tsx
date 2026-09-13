import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2 } from 'lucide-react';

// Banner de contratos completados (13 sep 2026): quién contrató a quién y
// qué día, juntando las dos vías reales de contratación —
// flash_bookings (confirmed/completed) y event_request_responses
// (hired_at no nulo) — porque son caras del mismo hecho de negocio y antes
// solo se veían por separado como conteos sueltos en AdminMetrics, sin
// nombres ni fechas.

interface HiredContract {
  id: string;
  source: 'flash' | 'request';
  organizador: string;
  profesional: string;
  fecha: string; // fecha del contrato (hired_at / created_at), no del evento
}

const AdminHiredContracts = () => {
  const [contracts, setContracts] = useState<HiredContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [{ data: flash }, { data: requests }] = await Promise.all([
        supabase
          .from('flash_bookings')
          .select('id, requester_name, professional_name, created_at')
          .in('status', ['confirmed', 'accepted', 'completed'])
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('event_request_responses' as any)
          .select('id, hired_at, professional_user_id, event_requests!inner(client_name)')
          .not('hired_at', 'is', null)
          .order('hired_at', { ascending: false })
          .limit(30),
      ]);

      if (cancelled) return;

      const flashRows: HiredContract[] = (flash ?? []).map((b: any) => ({
        id: b.id,
        source: 'flash',
        organizador: b.requester_name || 'Organizador',
        profesional: b.professional_name || 'Profesional',
        fecha: b.created_at,
      }));

      // El nombre del profesional no está en event_request_responses, solo el
      // user_id — se resuelve aparte contra profiles en vez de un join directo
      // (PostgREST no permite !inner cruzado con una tabla no relacionada por FK
      // declarada en el mismo sentido).
      const reqRows = requests ?? [];
      const profIds = [...new Set(reqRows.map((r: any) => r.professional_user_id).filter(Boolean))];
      let nameMap = new Map<string, string>();
      if (profIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name')
          .in('user_id', profIds);
        nameMap = new Map((profiles ?? []).map((p: any) => [p.user_id, p.display_name]));
      }

      const requestRows: HiredContract[] = reqRows.map((r: any) => ({
        id: r.id,
        source: 'request',
        organizador: r.event_requests?.client_name || 'Organizador',
        profesional: nameMap.get(r.professional_user_id) || 'Profesional',
        fecha: r.hired_at,
      }));

      const all = [...flashRows, ...requestRows].sort((a, b) => b.fecha.localeCompare(a.fecha));
      setContracts(all);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return null;
  if (contracts.length === 0) return null;

  return (
    <div className="glass-panel p-5 mb-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
        Contratos Completados
        <span className="text-[0.75rem] px-2 py-0.5 rounded-full font-bold"
          style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>
          {contracts.length}
        </span>
      </h3>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {contracts.map(c => (
          <div key={`${c.source}_${c.id}`} className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <p className="text-sm" style={{ color: '#222' }}>
              <span className="font-bold">{c.organizador}</span>
              <span style={{ color: '#888' }}> → </span>
              <span className="font-bold">{c.profesional}</span>
            </p>
            <p className="text-xs" style={{ color: '#888' }}>
              {new Date(c.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHiredContracts;
