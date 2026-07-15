import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Mail, MessageSquare, FileEdit, Star, TrendingUp, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DBProfile {
  id: string;
  display_name: string;
  role: string;
  zone: string | null;
  subscription_tier: string;
  is_verified: boolean;
  is_early_adopter: boolean;
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
  { icon: Star, label: 'Aro Azul', hint: 'Prioridad en el directorio (primeras posiciones)' },
  { icon: TrendingUp, label: 'Score +200', hint: 'Empuja el ranking del perfil' },
] as const;

const AdminUserManagement = () => {
  const [users, setUsers] = useState<DBProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (data) setUsers(data as unknown as DBProfile[]);
    setLoading(false);
  };

  const toggleVerify = async (user: DBProfile) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: !user.is_verified })
      .eq('id', user.id);
    if (error) { toast.error('Error'); return; }
    toast.success(user.is_verified ? 'Verificación eliminada' : 'Perfil verificado con Sello Dorado');
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_verified: !u.is_verified } : u));
  };

  const contactUser = () => {
    toast.info('Usa el sistema de mensajes interno para contactar usuarios.');
  };

  const contactEmail = (name: string) => {
    window.open(`mailto:info@xpeak.es?subject=Contacto usuario: ${encodeURIComponent(name)}`);
  };

  const toggleEarlyAdopter = async (user: DBProfile) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_early_adopter: !user.is_early_adopter })
      .eq('id', user.id);
    if (error) { toast.error('Error al actualizar aro azul'); return; }
    toast.success(user.is_early_adopter ? 'Aro azul eliminado' : '⭐ Aro Azul activado — aparecerá en primeras posiciones');
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_early_adopter: !u.is_early_adopter } : u));
  };

  const boostScore = async (user: DBProfile) => {
    const newScore = Math.max(user.score ?? 0, 500) + 200;
    const { error } = await supabase
      .from('profiles')
      .update({ score: newScore })
      .eq('id', user.id);
    if (error) { toast.error('Error al subir score'); return; }
    toast.success(`Score subido a ${newScore}`);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, score: newScore } : u));
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
        <h2 className="text-base font-bold whitespace-nowrap">Gestión de Usuarios <span style={{ color: 'rgba(255,255,255,0.5)' }}>({filtered.length}{query ? ` de ${users.length}` : ''})</span></h2>
        <div className="relative sm:ml-auto sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.35)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, rol o zona..."
            className="nightlife-input text-sm w-full !pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-center py-12 animate-pulse" style={{ color: 'rgba(255,255,255,0.45)' }}>Cargando usuarios...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: 'rgba(255,255,255,0.45)' }}>Sin resultados para "{query}".</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                {['Usuario', 'Rol · Zona', 'Plan', 'Categoría', 'Score', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[0.65rem] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="transition-colors hover:bg-white/[0.02]"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: u.validation_status === 'rejected' ? 'rgba(255,95,86,0.05)' : undefined,
                    opacity: u.validation_status === 'rejected' ? 0.55 : 1,
                  }}>
                  <td className="px-4 py-3 font-bold whitespace-nowrap">
                    {u.display_name || <span className="font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>Sin nombre</span>}
                    {u.validation_status === 'rejected' && (
                      <span className="ml-2 text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,95,86,0.15)', color: '#ff5f56' }}>RECHAZADO</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.6)' }}>{u.role} · {u.zone || 'Sin zona'}</td>
                  <td className="px-4 py-3">
                    <span className="text-[0.7rem] px-1.5 py-0.5 rounded font-bold whitespace-nowrap"
                      style={{
                        background: u.subscription_tier === 'elite' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                        color: u.subscription_tier === 'elite' ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                      }}>
                      {(u.subscription_tier || 'free').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[0.7rem] px-1.5 py-0.5 rounded font-bold whitespace-nowrap"
                      style={{
                        background: u.category === 'professional' ? 'rgba(34,197,94,0.1)' : 'rgba(255,188,0,0.1)',
                        color: u.category === 'professional' ? '#22c55e' : '#ffbc00',
                      }}>
                      {u.category === 'professional' ? 'PRO' : (u.category || 'rookie').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums" style={{ color: 'rgba(255,255,255,0.7)' }}>{u.score ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {u.is_verified && (
                        <span className="flex items-center gap-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                          <CheckCircle size={9} /> Verificado
                        </span>
                      )}
                      {u.is_early_adopter && (
                        <span className="flex items-center gap-1 text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                          <Star size={9} /> Aro azul
                        </span>
                      )}
                      {!u.is_verified && !u.is_early_adopter && <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}
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
                      <button onClick={() => toggleVerify(u)} title={u.is_verified ? 'Quitar Sello Dorado' : ACTIONS[3].hint}
                        className="p-1.5 rounded-md transition-all hover:scale-110"
                        style={{
                          background: u.is_verified ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                          color: u.is_verified ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                        }}>
                        <CheckCircle size={13} />
                      </button>
                      <button onClick={() => toggleEarlyAdopter(u)} title={u.is_early_adopter ? 'Quitar Aro Azul' : ACTIONS[4].hint}
                        className="p-1.5 rounded-md transition-all hover:scale-110"
                        style={{
                          background: u.is_early_adopter ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                          color: u.is_early_adopter ? '#3b82f6' : 'rgba(255,255,255,0.6)',
                        }}>
                        <Star size={13} />
                      </button>
                      <button onClick={() => boostScore(u)} title={ACTIONS[5].hint}
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

      <div className="px-6 py-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.65rem]" style={{ borderTop: '1px solid rgba(212,175,55,0.08)', color: 'rgba(255,255,255,0.4)' }}>
        {ACTIONS.map(a => (
          <span key={a.label} className="flex items-center gap-1.5">
            <a.icon size={11} />
            <strong style={{ color: 'rgba(255,255,255,0.55)' }}>{a.label}</strong> — {a.hint}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdminUserManagement;
