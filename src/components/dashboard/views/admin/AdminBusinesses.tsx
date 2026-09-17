import { useState, useEffect, useMemo } from 'react';
import { Building2, Search, MessageCircle, Zap, Euro, Calendar, ExternalLink, Instagram, Phone, Mail, ImageOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BusinessProfile {
  user_id: string;
  display_name: string;
  zone: string | null;
  photo_url: string | null;
  bio: string | null;
  instagram: string | null;
  phone: string | null;
  email: string | null;
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
        .select('user_id, display_name, zone, photo_url, bio, instagram, phone, email, is_verified, created_at')
        .eq('role', 'empresario')
        .order('created_at', { ascending: false })
        .limit(500);

      const businesses = (profiles ?? []) as BusinessProfile[];
      if (businesses.length === 0) { setRows([]); setLoading(false); return; }

      const ids = businesses.map(b => b.user_id);
      // event_requests va aparte: las ofertas publicadas desde Flash Booking
      // viven en su propia tabla y sin esto un organizador con una oferta viva
      // salía como "Inactivo" con 0 en todo (caso Burger Gourmet Fest, 10 sep).
      const [{ data: bookings }, { data: jobs }, { data: reqs }] = await Promise.all([
        supabase.from('flash_bookings').select('created_by, agreed_price, status, created_at').in('created_by', ids),
        supabase.from('flash_jobs').select('employer_id, created_at').in('employer_id', ids),
        supabase.from('event_requests' as any).select('client_user_id, created_at').in('client_user_id', ids),
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

      // Las ofertas de evento cuentan como "flash job" en la columna: para
      // quien administra son lo mismo (el organizador pidió gente).
      ((reqs ?? []) as { client_user_id: string | null; created_at: string }[]).forEach(r => {
        const key = r.client_user_id ?? '';
        if (!key) return;
        const cur = jobsByBiz.get(key) ?? { count: 0, lastAt: null };
        cur.count += 1;
        if (!cur.lastAt || r.created_at > cur.lastAt) cur.lastAt = r.created_at;
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
      || (r.bio || '').toLowerCase().includes(q)
    );
  }, [rows, query]);

  const totalActive = rows.filter(r => r.activity.bookingsCount > 0 || r.activity.flashJobsCount > 0).length;
  const totalSpend = rows.reduce((s, r) => s + r.activity.bookingsSpend, 0);

  const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const fmtEur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const igHandle = (v: string | null) => (v || '').replace(/^@/, '').trim();

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
            placeholder="Buscar por nombre, zona o bio..."
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
        <div className="grid gap-4 p-4 sm:p-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {filtered.map(r => {
            const lastActivity = [r.activity.lastBookingAt, r.activity.lastFlashJobAt]
              .filter(Boolean)
              .sort((a, b) => (b as string).localeCompare(a as string))[0] ?? null;
            const isActive = r.activity.bookingsCount > 0 || r.activity.flashJobsCount > 0;
            const ig = igHandle(r.instagram);
            return (
              <div key={r.user_id} className="rounded-2xl overflow-hidden flex flex-col"
                style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="relative aspect-[16/10] flex-shrink-0" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  {r.photo_url ? (
                    <img src={r.photo_url} alt={r.display_name || 'Empresario'} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5" style={{ color: 'rgba(0,0,0,0.25)' }}>
                      <ImageOff size={22} />
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider">Sin foto</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    {r.is_verified && (
                      <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm" style={{ background: 'rgba(212,175,55,0.85)', color: '#1a1a1a' }}>✓ Verificado</span>
                    )}
                    {!isActive && (
                      <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>Inactivo</span>
                    )}
                  </div>
                  <a href={`/p/${r.user_id}`} target="_blank" rel="noopener noreferrer"
                    className="absolute top-2 right-2 p-1.5 rounded-md transition-all hover:scale-110 backdrop-blur-sm"
                    style={{ background: 'rgba(255,255,255,0.85)', color: '#8B5CF6' }}
                    title="Ver ficha pública">
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div className="p-4 flex flex-col gap-2.5 flex-1">
                  <div>
                    <p className="font-bold text-sm leading-tight" style={{ color: '#1a1a1a' }}>
                      {r.display_name || <span className="font-normal text-muted-foreground">Sin nombre</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.zone || 'Sin zona'} · Alta {fmtDate(r.created_at)}</p>
                  </div>

                  {r.bio ? (
                    <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#444' }}>{r.bio}</p>
                  ) : (
                    <p className="text-xs italic text-muted-foreground">Sin descripción</p>
                  )}

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: '#666' }}>
                    {ig && (
                      <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline" style={{ color: '#C13584' }}>
                        <Instagram size={11} /> @{ig}
                      </a>
                    )}
                    {r.phone && (
                      <span className="flex items-center gap-1"><Phone size={11} /> {r.phone}</span>
                    )}
                    {r.email && (
                      <span className="flex items-center gap-1 truncate max-w-[160px]"><Mail size={11} /> {r.email}</span>
                    )}
                  </div>

                  <div className="mt-auto pt-2.5 flex items-center justify-between text-xs" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <span className="flex items-center gap-1 font-mono tabular-nums" style={{ color: '#333' }}>
                      <MessageCircle size={11} style={{ color: '#8A6D0F' }} /> {r.activity.bookingsCount}
                    </span>
                    <span className="font-mono tabular-nums" style={{ color: r.activity.bookingsSpend > 0 ? '#22c55e' : '#888' }}>
                      {r.activity.bookingsSpend > 0 ? fmtEur(r.activity.bookingsSpend) : '—'}
                    </span>
                    <span className="flex items-center gap-1 font-mono tabular-nums" style={{ color: '#333' }}>
                      <Zap size={11} style={{ color: '#D4AF37' }} /> {r.activity.flashJobsCount}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar size={11} /> {fmtDate(lastActivity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
