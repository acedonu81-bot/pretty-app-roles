import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Mail, Phone, MessageSquare } from 'lucide-react';
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

const AdminUserManagement = () => {
  const [users, setUsers] = useState<DBProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
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

  const contactUser = (phone: string | null) => {
    if (!phone) { toast.error('Sin teléfono registrado'); return; }
    toast.info('Usa el sistema de mensajes interno para contactar usuarios.');
  };

  const contactEmail = (userId: string, name: string) => {
    toast.info(`Función de email para ${name} próximamente`);
  };

  return (
    <div className="glass-panel p-5">
      <h3 className="text-sm font-bold mb-4">Gestión de Usuarios ({users.length})</h3>
      {loading ? (
        <p className="text-xs text-muted-foreground animate-pulse text-center py-6">Cargando usuarios...</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg transition-all"
              style={{
                background: u.validation_status === 'rejected' ? 'rgba(255,95,86,0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${u.validation_status === 'rejected' ? 'rgba(255,95,86,0.2)' : 'var(--nightlife-border)'}`,
                opacity: u.validation_status === 'rejected' ? 0.5 : 1,
              }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold truncate">{u.display_name || 'Sin nombre'}</span>
                  {u.is_verified && <CheckCircle size={12} style={{ color: '#D4AF37' }} />}
                  <span className="text-[0.55rem] px-1.5 py-0.5 rounded font-bold"
                    style={{
                      background: u.subscription_tier === 'elite' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                      color: u.subscription_tier === 'elite' ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                    }}>
                    {(u.subscription_tier || 'free').toUpperCase()}
                  </span>
                  <span className="text-[0.5rem] px-1 py-0.5 rounded font-bold"
                    style={{
                      background: u.category === 'professional' ? 'rgba(34,197,94,0.1)' : 'rgba(255,188,0,0.1)',
                      color: u.category === 'professional' ? '#22c55e' : '#ffbc00',
                    }}>
                    {u.category === 'professional' ? 'PRO' : (u.category || 'rookie').toUpperCase()}
                  </span>
                </div>
                <p className="text-[0.6rem] text-muted-foreground">{u.role} · {u.zone || 'Sin zona'} · Score: {u.score}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => contactUser(u.phone)} title="Mensajes"
                  className="p-1.5 rounded-md transition-all hover:scale-110"
                  style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                  <MessageSquare size={14} />
                </button>
                <button onClick={() => contactEmail(u.user_id, u.display_name)} title="Email"
                  className="p-1.5 rounded-md transition-all hover:scale-110"
                  style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}>
                  <Mail size={14} />
                </button>
                <button onClick={() => toggleVerify(u)} title={u.is_verified ? 'Quitar verificación' : 'Verificar'}
                  className="p-1.5 rounded-md transition-all hover:scale-110"
                  style={{
                    background: u.is_verified ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                    color: u.is_verified ? '#D4AF37' : 'var(--nightlife-text-secondary)',
                  }}>
                  <CheckCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
