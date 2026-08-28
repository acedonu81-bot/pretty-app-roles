import { useState, useEffect, useCallback } from 'react';
import { Euro, Download, TrendingUp, Calendar, Users, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { buildWorkbook, downloadWorkbook, fmtDateISO } from '@/lib/csvExport';

interface Booking {
  id: string;
  professional_name: string;
  professional_role: string | null;
  event_date: string | null;
  agreed_price: number | null;
  status: string | null;
  created_at: string | null;
}

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const fmt = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtEur = (n: number) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const GastosTab = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('flash_bookings' as any)
      .select('id, professional_name, professional_role, event_date, agreed_price, status, created_at')
      .eq('created_by', user.id)
      .in('status', ['confirmed', 'completed'])
      .order('created_at', { ascending: false })
      .limit(500);
    setLoading(false);
    if (error) { toast.error('Error al cargar gastos'); return; }
    setBookings((data ?? []) as Booking[]);
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const yearBookings = bookings.filter(b => {
    const d = b.created_at ? new Date(b.created_at) : null;
    return d && d.getFullYear() === yearFilter;
  });

  const totalYear = yearBookings.reduce((s, b) => s + (b.agreed_price ?? 0), 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthBookings = bookings.filter(b => {
    const d = b.created_at ? new Date(b.created_at) : null;
    return d && d.getFullYear() === thisYear && d.getMonth() === thisMonth;
  });
  const totalMonth = monthBookings.reduce((s, b) => s + (b.agreed_price ?? 0), 0);
  const avgPrice = yearBookings.length > 0
    ? yearBookings.filter(b => b.agreed_price).reduce((s, b) => s + (b.agreed_price ?? 0), 0) / yearBookings.filter(b => b.agreed_price).length
    : 0;

  // Monthly breakdown
  const monthlyData = Array.from({ length: 12 }, (_, m) => {
    const mbs = yearBookings.filter(b => {
      const d = b.created_at ? new Date(b.created_at) : null;
      return d && d.getMonth() === m;
    });
    return {
      month: MONTHS_ES[m],
      count: mbs.length,
      total: mbs.reduce((s, b) => s + (b.agreed_price ?? 0), 0),
    };
  }).filter(d => d.count > 0);

  // By role
  const byRole: Record<string, { count: number; total: number }> = {};
  yearBookings.forEach(b => {
    const r = b.professional_role ?? 'Sin rol';
    if (!byRole[r]) byRole[r] = { count: 0, total: 0 };
    byRole[r].count++;
    byRole[r].total += b.agreed_price ?? 0;
  });

  // Available years
  const years = [...new Set(bookings.map(b => b.created_at ? new Date(b.created_at).getFullYear() : null).filter(Boolean))].sort((a, b) => (b as number) - (a as number)) as number[];
  if (!years.includes(yearFilter)) years.unshift(yearFilter);

  const maxMonthTotal = Math.max(...monthlyData.map(d => d.total), 1);

  const exportCSV = async () => {
    if (yearBookings.length === 0) { toast.error('No hay gastos que exportar'); return; }

    const wb = await buildWorkbook(`Panel de Gastos — Año ${yearFilter}`, [
      {
        title: 'RESUMEN',
        header: ['Concepto', 'Valor'],
        rows: [
          ['Total del año', totalYear.toFixed(2) + ' €'],
          ['Caché medio por contratación', avgPrice > 0 ? avgPrice.toFixed(2) + ' €' : '—'],
          ['Contrataciones', yearBookings.length],
        ],
      },
      {
        title: 'DESGLOSE MENSUAL',
        header: ['Mes', 'Contrataciones', 'Gasto total (€)', '% del año'],
        dataBarColumn: 2,
        rows: monthlyData.map(d => [
          d.month,
          d.count,
          d.total.toFixed(2),
          totalYear > 0 ? ((d.total / totalYear) * 100).toFixed(0) + '%' : '—',
        ]),
      },
      {
        title: 'DESGLOSE POR CATEGORÍA',
        header: ['Categoría', 'Contrataciones', 'Gasto total (€)', '% del año'],
        dataBarColumn: 2,
        rows: Object.entries(byRole).sort((a, b) => b[1].total - a[1].total).map(([role, d]) => [
          role,
          d.count,
          d.total.toFixed(2),
          totalYear > 0 ? ((d.total / totalYear) * 100).toFixed(0) + '%' : '—',
        ]),
      },
      {
        title: 'DETALLE DE MOVIMIENTOS',
        header: ['Profesional', 'Rol', 'Fecha evento', 'Caché (€)', 'Estado', 'Fecha solicitud'],
        rows: [
          ...yearBookings.map(b => [
            b.professional_name,
            b.professional_role ?? '—',
            fmtDateISO(b.event_date),
            b.agreed_price != null ? b.agreed_price.toFixed(2) : '—',
            b.status ?? '—',
            fmtDateISO(b.created_at),
          ]),
          ['TOTAL', '—', '—', totalYear.toFixed(2), '—', '—'],
        ],
      },
    ]);

    await downloadWorkbook(wb, `XPEAK_gastos_${yearFilter}.xlsx`);
    toast.success(`Gastos ${yearFilter} exportados`);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="glass-panel p-4 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-[fadeIn_0.4s_ease]">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base font-black">Panel de <span className="text-gradient">Gastos</span></h3>
          <p className="text-xs text-muted-foreground">Contrataciones confirmadas y completadas</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={yearFilter}
            onChange={e => setYearFilter(Number(e.target.value))}
            className="nightlife-input !py-1.5 !px-3 text-xs font-bold w-auto"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6D0F' }}>
            <Download size={12} /> CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total año', value: fmtEur(totalYear), icon: TrendingUp, note: `${yearFilter}` },
          { label: 'Este mes', value: fmtEur(totalMonth), icon: Calendar, note: MONTHS_ES[thisMonth] },
          { label: 'Caché medio', value: avgPrice > 0 ? fmtEur(avgPrice) : '—', icon: Euro, note: 'por contratación' },
          { label: 'Contrataciones', value: String(yearBookings.length), icon: Users, note: `en ${yearFilter}` },
        ].map(({ label, value, icon: Icon, note }) => (
          <div key={label} className="glass-panel p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
              <Icon size={13} style={{ color: '#8A6D0F' }} />
            </div>
            <div className="text-xl font-black" style={{ color: '#8A6D0F' }}>{value}</div>
            <span className="text-[0.6rem] text-muted-foreground">{note}</span>
          </div>
        ))}
      </div>

      {yearBookings.length === 0 ? (
        <div className="glass-panel p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <FileText size={22} style={{ color: 'rgba(212,175,55,0.35)' }} />
          </div>
          <p className="text-sm font-bold">Sin gastos en {yearFilter}</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Los Flash Bookings confirmados o completados aparecerán aquí con su desglose mensual.
          </p>
        </div>
      ) : (
        <>
          {/* Monthly chart (bar) */}
          {monthlyData.length > 0 && (
            <div className="glass-panel p-4">
              <p className="text-xs font-bold mb-4" style={{ color: '#8A6D0F' }}>Gasto mensual {yearFilter}</p>
              <div className="flex items-end gap-2 h-28">
                {monthlyData.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[0.6rem] font-bold" style={{ color: '#8A6D0F' }}>
                      {d.total > 0 ? `€${Math.round(d.total / 1000) > 0 ? `${(d.total/1000).toFixed(1)}k` : d.total}` : ''}
                    </span>
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: `${Math.max((d.total / maxMonthTotal) * 80, d.total > 0 ? 6 : 0)}px`,
                        background: 'linear-gradient(180deg,#D4AF37,#B8941E)',
                        minHeight: d.total > 0 ? '6px' : '0',
                      }}
                    />
                    <span className="text-[0.6rem] text-muted-foreground">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* By role */}
          {Object.keys(byRole).length > 0 && (
            <div className="glass-panel p-4">
              <p className="text-xs font-bold mb-3" style={{ color: '#8A6D0F' }}>Gasto por categoría</p>
              <div className="space-y-2.5">
                {Object.entries(byRole).sort((a, b) => b[1].total - a[1].total).map(([role, d]) => {
                  const pct = totalYear > 0 ? (d.total / totalYear) * 100 : 0;
                  return (
                    <div key={role}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold capitalize">{role}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[0.65rem] text-muted-foreground">{d.count} contratos</span>
                          <span className="text-xs font-bold" style={{ color: '#8A6D0F' }}>{fmtEur(d.total)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#D4AF37,#B8941E)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly detail table */}
          <div className="glass-panel p-4">
            <p className="text-xs font-bold mb-3" style={{ color: '#8A6D0F' }}>Desglose mensual</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    {['Mes', 'Contrataciones', 'Gasto total', '% del año'].map(h => (
                      <th key={h} className="pb-2 text-left font-bold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map(d => (
                    <tr key={d.month} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td className="py-2 font-semibold">{d.month} {yearFilter}</td>
                      <td className="py-2 text-muted-foreground">{d.count}</td>
                      <td className="py-2 font-bold" style={{ color: '#8A6D0F' }}>{fmtEur(d.total)}</td>
                      <td className="py-2 text-muted-foreground">
                        {totalYear > 0 ? `${((d.total / totalYear) * 100).toFixed(0)}%` : '—'}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '1px solid rgba(212,175,55,0.2)' }}>
                    <td className="pt-2.5 font-black text-xs">TOTAL {yearFilter}</td>
                    <td className="pt-2.5 font-black">{yearBookings.length}</td>
                    <td className="pt-2.5 font-black text-sm" style={{ color: '#8A6D0F' }}>{fmtEur(totalYear)}</td>
                    <td className="pt-2.5 font-black">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GastosTab;
