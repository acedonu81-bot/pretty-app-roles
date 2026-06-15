import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { XCircle, TrendingDown, Gift, BarChart3 } from 'lucide-react';

const REASON_LABELS: Record<string, string> = {
  too_expensive: 'Precio alto',
  not_using: 'No la usa',
  missing_features: 'Faltan funciones',
  bad_experience: 'Mala experiencia',
  found_alternative: 'Alternativa mejor',
  temporary: 'Temporal',
  other: 'Otro',
};

interface Survey {
  id: string;
  reason: string;
  retention_accepted: boolean;
  created_at: string;
  plan: string;
}

interface Discount {
  id: string;
  plan: string;
  expires_at: string;
  discount_percent: number;
}

const AdminCancellations = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('cancellation_surveys').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('retention_discounts').select('*').limit(200),
    ]).then(([surveyRes, discountRes]) => {
      setSurveys((surveyRes.data as Survey[]) || []);
      setDiscounts((discountRes.data as Discount[]) || []);
      setLoading(false);
    });
  }, []);

  const total = surveys.length;
  const retained = surveys.filter(s => s.retention_accepted).length;
  const retentionRate = total > 0 ? Math.round((retained / total) * 100) : 0;
  const activeDiscounts = discounts.filter(d => new Date(d.expires_at) > new Date()).length;

  // Count reasons
  const reasonCounts: Record<string, number> = {};
  surveys.forEach(s => {
    reasonCounts[s.reason] = (reasonCounts[s.reason] || 0) + 1;
  });
  const sortedReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedReasons[0]?.[1] || 1;

  if (loading) {
    return (
      <div className="glass-panel p-5 mb-6">
        <p className="text-xs text-muted-foreground animate-pulse">Cargando estadísticas de cancelación...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 mb-6">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
        <TrendingDown size={14} style={{ color: '#D4AF37' }} />
        Estadísticas de Cancelación
      </h3>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total cancelaciones', value: total, icon: XCircle, color: '#ff5f56' },
          { label: 'Retenidos', value: retained, icon: Gift, color: '#22c55e' },
          { label: 'Tasa retención', value: `${retentionRate}%`, icon: BarChart3, color: '#D4AF37' },
          { label: 'Descuentos activos', value: activeDiscounts, icon: Gift, color: '#D4AF37' },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{
            background: 'rgba(212,175,55,0.04)',
            border: '1px solid rgba(212,175,55,0.1)',
          }}>
            <m.icon size={14} className="mx-auto mb-1" style={{ color: m.color }} />
            <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[0.75rem] text-muted-foreground uppercase tracking-wider font-bold">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Reason chart */}
      <div className="mb-4">
        <p className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-wider">Motivos más frecuentes</p>
        {sortedReasons.length === 0 ? (
          <p className="text-xs text-muted-foreground">Sin datos aún.</p>
        ) : (
          <div className="space-y-2">
            {sortedReasons.map(([reason, count]) => (
              <div key={reason} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-32 truncate">{REASON_LABELS[reason] || reason}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(212,175,55,0.08)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(count / maxCount) * 100}%`,
                      background: 'linear-gradient(90deg, #B8941E, #D4AF37)',
                    }}
                  />
                </div>
                <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent cancellations */}
      {surveys.length > 0 && (
        <div>
          <p className="text-xs font-bold mb-2 text-muted-foreground uppercase tracking-wider">Últimas cancelaciones</p>
          <div className="max-h-40 overflow-y-auto space-y-1.5">
            {surveys.slice(0, 10).map(s => (
              <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                style={{ background: 'rgba(0,0,0,0.03)' }}>
                <span className="text-muted-foreground">{REASON_LABELS[s.reason] || s.reason}</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-xs"
                  style={{
                    background: s.retention_accepted ? 'rgba(34,197,94,0.12)' : 'rgba(255,95,86,0.12)',
                    color: s.retention_accepted ? '#22c55e' : '#ff5f56',
                  }}>
                  {s.retention_accepted ? 'Retenido' : 'Cancelado'}
                </span>
                <span className="text-muted-foreground">{s.plan}</span>
                <span className="text-muted-foreground">{new Date(s.created_at).toLocaleDateString('es-ES')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCancellations;
