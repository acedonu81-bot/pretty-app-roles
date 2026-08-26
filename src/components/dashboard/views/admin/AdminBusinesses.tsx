import { useState, useEffect, useMemo } from 'react';
import { Building2, Search, MessageCircle, Zap, Euro, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BusinessProfile {
  user_id: string;
  display_name: string;
  zone: string | null;
  photo_url: string | null;
  is_verified: boolean;
  created_at: string;
}

interface BusinessActivity {
  bookingsCount: number;
  bookingsSpend: number;
  lastBookingAt: string | null;
  flashJobsCount: number;
  lastFlashJobAt: string | null;
}

type BusinessRow = BusinessProfile & { activity: BusinessActivity };

const AdminBusinesses = () => {
  const [rows, setRows] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, zone, photo_url, is_verified, created_at')
        .eq('role', 'empresario')
        .order('created_at', { ascending: false })
        .limit(500);

      const businesses = (profiles ?? []) as BusinessProfile[];
      if (businesses.length === 0) { setRows([]); setLoading(false); return; }

      const ids = businesses.map(b => b.user_id);
      const [{ data: bookings }, { data: jobs }] = await Promise.all([
        supabase.from('flash_bookings').select('created_by, agreed_price, status, created_at').in('created_by', ids),
        supabase.from('flash_jobs').select('employer_id, created_at').in('employer_id', ids),
      ]);

      const bookingsByBiz = new Map<string, { count: number; spend: number; lastAt: string | null }>();
      (bookings ?? []).forEach(b => {
        const key = b.created_by as string;
        const cur = bookingsByBiz.get(key) ?? { count: 0, spend: 0, lastAt: null };
        cur.count += 1;
        if ((b.status === 'confirmed' || b.status === 'completed') && b.agreed_price != null) {
          cur.spend += Number(b.agreed_price);
        }
        if (!cur.lastAt || (b.created_at as string) > cur.lastAt) cur.lastAt = b.created_at as string;
        bookingsByBiz.set(key, cur);
      });

      const jobsByBiz = new Map<string, { count: number; lastAt: string | null }>();
      (jobs ?? []).forEach(j => {
        const key = j.employer_id as string;
        const cur = jobsByBiz.get(key) ?? { count: 0, lastAt: null };
        cur.count += 1;
        if (!cur.lastAt || (j.created_at as string) > cur.lastAt) cur.lastAt = j.created_at as string;
        jobsByBiz.set(key, cur);
      });

      setRows(businesses.map(b => {
        const bk = bookingsByBiz.get(b.user_id) ?? { count: 0, spend: 0, lastAt: null };
        const jb = jobsByBiz.get(b.user_id) ?? { count: 0, lastAt: null };
        return {
          ...b,
          activity: {
            bookingsCount: bk.count,
            bookingsSpend: bk.spend,
            lastBookingAt: bk.lastAt,
            flashJobsCount: jb.count,
            lastFlashJobAt: jb.lastAt,
          },
        };
      }));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      (r.display_name || '').toLowerCase().includes(q)
      || (r.zone || '').toLowerCase().includes(q)
    );
  }, [rows, query]);

  const totalActive = rows.filter(r => r.activity.bookingsCount > 0 || r.activity.flashJobsCount > 0).length;
  const totalSpend = rows.reduce((s, r) => s + r.activity.bookingsSpend, 0);

  const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const fmtEur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
        <div>
          <h2 className="text-base font-bold whitespace-nowrap" style={{ color: '#1a1a1a' }}>
            Empresarios <span className="text-muted-foreground">({filtered.length}{query ? ` de ${rows.length}` : ''})</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalActive} con actividad real · {fmtEur(totalSpend)} en bookings confirmados/completados
          </p>
        </div>
        <div className="relative sm:ml-auto sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre o zona..."
            className="nightlife-input text-sm w-full !pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-center py-12 animate-pulse text-muted-foreground">Cargando empresarios...</p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <Building2 size={22} style={{ color: 'rgba(212,175,55,0.3)' }} />
          <p className="text-sm font-bold text-muted-foreground">Sin empresarios registrados todavía</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-center py-12 text-muted-foreground">Sin resultados para "{query}".</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                {['Empresa', 'Zona', 'Registrado', 'Bookings', 'Gasto', 'Flash Jobs', 'Última actividad', 'Ficha'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[0.65rem] font-bold uppercase tracking-wider whitespace-nowrap text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const lastActivity = [r.activity.lastBookingAt, r.activity.lastFlashJobAt]
                  .filter(Boolean)
                  .sort((a, b) => (b as string).localeCompare(a as string))[0] ?? null;
                const isActive = r.activity.bookingsCount > 0 || r.activity.flashJobsCount > 0;
                return (
                  <tr key={r.user_id} className="transition-colors hover:bg-black/[0.02]" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ color: '#1a1a1a' }}>
                          {r.display_name || <span className="font-normal text-muted-foreground">Sin nombre</span>}
                        </span>
                        {r.is_verified && (
                          <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F' }}>✓</span>
                        )}
                        {!isActive && (
                          <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.05)', color: '#888' }}>Inactivo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{r.zone || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{fmtDate(r.created_at)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1 font-mono tabular-nums" style={{ color: '#333' }}>
                        <MessageCircle size={11} style={{ color: '#8A6D0F' }} /> {r.activity.bookingsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums" style={{ color: r.activity.bookingsSpend > 0 ? '#22c55e' : '#888' }}>
                      {r.activity.bookingsSpend > 0 ? fmtEur(r.activity.bookingsSpend) : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1 font-mono tabular-nums" style={{ color: '#333' }}>
                        <Zap size={11} style={{ color: '#D4AF37' }} /> {r.activity.flashJobsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {fmtDate(lastActivity)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/p/${r.user_id}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-md transition-all hover:scale-110 inline-flex"
                        style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}
                        title="Ver ficha pública">
                        <ExternalLink size={13} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-6 py-3 flex items-center gap-2 text-[0.65rem] text-muted-foreground" style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
        <Euro size={11} />
        Gasto = suma de <strong style={{ color: '#555' }}>agreed_price</strong> en Flash Bookings con estado confirmado o completado creados por esta empresa.
      </div>
    </div>
  );
};

export default AdminBusinesses;
