import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Mail, MessageSquare, FileEdit, TrendingUp, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DBProfile {
  id: string;
  display_name: string;
  role: string;
  zone: string | null;
  subscription_tier: string;
  is_verified: boolean;
  phone?: string | null;
  instagram: string | null;
  category: string;
  score: number;
  validation_status: string;
  user_id: string;
}

const ACTIONS = [
  { icon: MessageSquare, label: 'Mensajes', hint: 'Recuerda contactar por el chat interno' },
  { icon: Mail, label: 'Email', hint: 'Abre un correo a info@xpeak.es sobre este usuario' },
  { icon: FileEdit, label: 'Ficha', hint: 'Ver su perfil público en una pestaña nueva' },
  { icon: CheckCircle, label: 'Sello Dorado', hint: 'Marca el perfil como verificado' },
  { icon: TrendingUp, label: 'Score +200', hint: 'Empuja el ranking del perfil' },
] as const;

const AdminUserManagement = () => {
  const [users, setUsers] = useState<DBProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  // IDs con una acción en curso — evita doble clic mientras la request está
  // en vuelo. Caso real (15 sep 2026): gonzalo.magro@yahoo.es recibió 2
  // emails "Perfil aprobado" en 42s porque el botón no bloqueaba reentradas.
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    // Antes se ignoraba `error` por completo: si la consulta fallaba (RLS,
    // columna, lo que sea), `data` quedaba null y la tabla se quedaba vacía
    // en silencio, indistinguible de "no hay usuarios" — así se vivió el caso
    // de Vanessa Ledezma (28 sep 2026): parecía que "no aparecía nadie" sin
    // ninguna pista de qué había fallado.
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setUsers((data ?? []) as unknown as DBProfile[]);
    }
    setLoading(false);
  };

  const toggleVerify = async (user: DBProfile) => {
    if (verifyingIds.has(user.id)) return; // ya hay una request en vuelo para este usuario
    setVerifyingIds(prev => new Set(prev).add(user.id));
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !user.is_verified })
        .eq('id', user.id);
      if (error) { toast.error('Error'); return; }
      toast.success(user.is_verified ? 'Verificación eliminada' : 'Perfil verificado con Sello Dorado');
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_verified: !u.is_verified } : u));

      // Aviso al profesional. Solo al conceder el sello — quitarlo es una
      // acción administrativa sin plantilla de "sello retirado" y no se avisa.
      if (!user.is_verified) {
        supabase.functions.invoke('send-email', {
          body: {
            type: 'admin_approved',
            data: { user_id: user.user_id, name: user.display_name, role: user.role },
          },
        }).catch((err: unknown) => console.warn('[AdminUserManagement] approved email failed:', err));
      }
    } finally {
      setVerifyingIds(prev => { const next = new Set(prev); next.delete(user.id); return next; });
    }
  };

  const contactUser = () => {
    toast.info('Usa el sistema de mensajes interno para contactar usuarios.');
  };

  const contactEmail = (name: string) => {
    window.open(`mailto:info@xpeak.es?subject=Contacto usuario: ${encodeURIComponent(name)}`);
  };

  const boostScore = async (user: DBProfile) => {
    const previousScore = user.score ?? 0;
    const newScore = Math.max(previousScore, 500) + 200;
    const { error } = await supabase
      .from('profiles')
      .update({ score: newScore })
      .eq('id', user.id);
    if (error) { toast.error('Error al subir score'); return; }
    toast.success(`Score subido a ${newScore}`);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, score: newScore } : u));

    const adminId = (await supabase.auth.getUser()).data.user?.id ?? null;
    supabase.from('admin_actions_log').insert({
      admin_user_id: adminId,
      target_user_id: user.user_id,
      action: 'boost_score',
      details: { previous_score: previousScore, new_score: newScore },
    } as any).then(({ error: logError }) => {
      if (logError) console.warn('[AdminUserManagement] no se pudo registrar boostScore en el log:', logError);
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      (u.display_name || '').toLowerCase().includes(q)
      || (u.role || '').toLowerCase().includes(q)
      || (u.zone || '').toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
        <h2 className="text-base font-bold whitespace-nowrap" style={{ color: '#1a1a1a' }}>Gestión de Usuarios <span className="text-muted-foreground">({filtered.length}{query ? ` de ${users.length}` : ''})</span></h2>
        <div className="relative sm:ml-auto sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, rol o zona..."
            className="nightlife-input text-base sm:text-sm w-full !pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-center py-12 animate-pulse text-muted-foreground">Cargando usuarios...</p>
      ) : error ? (
        <div className="text-sm text-center py-12">
          <p className="mb-3" style={{ color: '#b91c1c' }}>No se pudo cargar la lista: {error}</p>
          <button onClick={fetchUsers} className="text-xs font-bold px-3 py-2 rounded-full"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F', border: '1px solid rgba(212,175,55,0.3)' }}>
            Reintentar
          </button>
        </div>
      ) : filtered.length === 0 && users.length === 0 ? (
        <p className="text-sm text-center py-12 text-muted-foreground">No hay usuarios registrados todavía.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-center py-12 text-muted-foreground">Sin resultados para "{query}".</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                {['Usuario', 'Rol · Zona', 'Plan', 'Categoría', 'Score', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[0.65rem] font-bold uppercase tracking-wider whitespace-nowrap text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="transition-colors hover:bg-black/[0.02]"
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                    background: u.validation_status === 'rejected' ? 'rgba(255,95,86,0.05)' : undefined,
                    opacity: u.validation_status === 'rejected' ? 0.55 : 1,
                  }}>
                  <td className="px-4 py-3 font-bold whitespace-nowrap" style={{ color: '#1a1a1a' }}>
                    {u.display_name || <span className="font-normal text-muted-foreground">Sin nombre</span>}
                    {u.validation_status === 'rejected' && (
                      <span className="ml-2 text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,95,86,0.15)', color: '#ff5f56' }}>RECHAZADO</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{u.role} · {u.zone || 'Sin zona'}</td>
                  <td className="px-4 py-3">
                    <span className="text-[0.7rem] px-1.5 py-0.5 rounded font-bold whitespace-nowrap"
                      style={{
                        background: u.subscription_tier === 'elite' ? 'rgba(212,175,55,0.15)' : 'rgba(0,0,0,0.05)',
                        color: u.subscription_tier === 'elite' ? '#D4AF37' : '#555',
                      }}>
                      {(u.subscription_tier || 'free').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[0.7rem] px-1.5 py-0.5 rounded font-bold whitespace-nowrap"
                      style={{
                        background: u.category === 'professional' ? 'rgba(34,197,94,0.1)' : 'rgba(255,188,0,0.1)',
                        color: u.category === 'professional' ? '#16a34a' : '#b45309',
                      }}>
                      {u.category === 'professional' ? 'PRO' : (u.category || 'rookie').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums" style={{ color: '#333' }}>{u.score ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {u.is_verified && (
                        <span className="flex items-center gap-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: '#8A6D0F' }}>
                          <CheckCircle size={9} /> Verificado
                        </span>
                      )}
                      {!u.is_verified && <span className="text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={contactUser} title={ACTIONS[0].hint}
                        className="p-1.5 rounded-md transition-all hover:scale-110"
                        style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                        <MessageSquare size={13} />
                      </button>
                      <button onClick={() => contactEmail(u.display_name)} title={ACTIONS[1].hint}
                        className="p-1.5 rounded-md transition-all hover:scale-110"
                        style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}>
                        <Mail size={13} />
                      </button>
                      <a href={`/p/${u.user_id}`} target="_blank" rel="noopener noreferrer" title={ACTIONS[2].hint}
                        className="p-1.5 rounded-md transition-all hover:scale-110 inline-flex"
                        style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                        <FileEdit size={13} />
                      </a>
                      <button onClick={() => toggleVerify(u)} disabled={verifyingIds.has(u.id)}
                        title={u.is_verified ? 'Quitar Sello Dorado' : ACTIONS[3].hint}
                        className="p-1.5 rounded-md transition-all hover:scale-110 disabled:opacity-40 disabled:pointer-events-none"
                        style={{
                          background: u.is_verified ? 'rgba(212,175,55,0.2)' : 'rgba(0,0,0,0.04)',
                          color: u.is_verified ? '#8A6D0F' : '#666',
                        }}>
                        <CheckCircle size={13} />
                      </button>
                      <button onClick={() => boostScore(u)} title={ACTIONS[4].hint}
                        className="p-1.5 rounded-md transition-all hover:scale-110"
                        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                        <TrendingUp size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-6 py-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.65rem] text-muted-foreground" style={{ borderTop: '1px solid rgba(212,175,55,0.08)' }}>
        {ACTIONS.map(a => (
          <span key={a.label} className="flex items-center gap-1.5">
            <a.icon size={11} />
            <strong style={{ color: '#555' }}>{a.label}</strong> · {a.hint}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdminUserManagement;
