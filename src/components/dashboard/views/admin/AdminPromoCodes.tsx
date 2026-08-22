import { useState, useEffect } from 'react';
import { Tag, Plus, Check, X, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_percent: number;
  plan_id: string | null;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;
}

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState({ code: '', description: '', discount_percent: 20, plan_id: '', valid_until: '', max_uses: '' });
  const [creating, setCreating] = useState(false);

  const loadPromoCodes = async () => {
    setLoading(true);
    const { data } = await (supabase.from as any)('promo_codes').select('*').order('created_at', { ascending: false });
    setPromoCodes((data as PromoCode[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadPromoCodes(); }, []);

  const handleCreateCode = async () => {
    if (!newCode.code.trim() || !newCode.discount_percent) { toast.error('Código y descuento son obligatorios'); return; }
    setCreating(true);
    const payload: any = {
      code: newCode.code.trim().toUpperCase(),
      description: newCode.description || null,
      discount_percent: Number(newCode.discount_percent),
      plan_id: newCode.plan_id || null,
      valid_until: newCode.valid_until || null,
      max_uses: newCode.max_uses ? Number(newCode.max_uses) : null,
    };
    const { error } = await (supabase.from as any)('promo_codes').insert(payload);
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Código "${payload.code}" creado`);
    setNewCode({ code: '', description: '', discount_percent: 20, plan_id: '', valid_until: '', max_uses: '' });
    loadPromoCodes();
  };

  const handleToggleCode = async (id: string, current: boolean) => {
    await (supabase.from as any)('promo_codes').update({ is_active: !current }).eq('id', id);
    loadPromoCodes();
  };

  const handleDeleteCode = async (id: string, code: string) => {
    if (!confirm(`¿Eliminar el código "${code}"? Esta acción no se puede deshacer.`)) return;
    await (supabase.from as any)('promo_codes').delete().eq('id', id);
    toast.success('Código eliminado');
    loadPromoCodes();
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Crear código */}
      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={14} style={{ color: '#8A6D0F' }} />
          <h3 className="text-sm font-bold">Crear código promo</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="col-span-2 md:col-span-1">
            <label className="text-[0.65rem] font-bold uppercase tracking-wider mb-1 block text-muted-foreground">Código *</label>
            <input
              value={newCode.code}
              onChange={e => setNewCode(p => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="XPEAK20"
              maxLength={32}
              className="nightlife-input text-sm w-full"
            />
          </div>
          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-wider mb-1 block text-muted-foreground">Descuento % *</label>
            <input
              type="number" min={1} max={100}
              value={newCode.discount_percent}
              onChange={e => setNewCode(p => ({ ...p, discount_percent: Number(e.target.value) }))}
              className="nightlife-input text-sm w-full"
            />
          </div>
          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-wider mb-1 block text-muted-foreground">Plan (vacío = todos)</label>
            <select
              value={newCode.plan_id}
              onChange={e => setNewCode(p => ({ ...p, plan_id: e.target.value }))}
              className="nightlife-input text-sm w-full appearance-none"
            >
              <option value="">Todos los planes</option>
              {['starter', 'business', 'agency'].map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-wider mb-1 block text-muted-foreground">Caduca (vacío = nunca)</label>
            <input
              type="date"
              value={newCode.valid_until}
              onChange={e => setNewCode(p => ({ ...p, valid_until: e.target.value }))}
              className="nightlife-input text-sm w-full"
            />
          </div>
          <div>
            <label className="text-[0.65rem] font-bold uppercase tracking-wider mb-1 block text-muted-foreground">Máx. usos (vacío = ∞)</label>
            <input
              type="number" min={1}
              value={newCode.max_uses}
              onChange={e => setNewCode(p => ({ ...p, max_uses: e.target.value }))}
              placeholder="∞"
              className="nightlife-input text-sm w-full"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="text-[0.65rem] font-bold uppercase tracking-wider mb-1 block text-muted-foreground">Descripción interna</label>
            <input
              value={newCode.description}
              onChange={e => setNewCode(p => ({ ...p, description: e.target.value }))}
              placeholder="Ej. Lanzamiento Madrid"
              maxLength={100}
              className="nightlife-input text-sm w-full"
            />
          </div>
        </div>
        <button
          onClick={handleCreateCode}
          disabled={creating}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}
        >
          <Plus size={14} />
          {creating ? 'Creando...' : 'Crear código'}
        </button>
      </div>

      {/* Lista de códigos */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
          <Tag size={16} style={{ color: '#D4AF37' }} />
          <h3 className="text-sm font-bold">Códigos activos</h3>
          <span className="ml-auto text-xs text-muted-foreground">{promoCodes.filter(c => c.is_active).length} activos</span>
        </div>
        {loading ? (
          <p className="text-sm text-center py-10 animate-pulse text-muted-foreground">Cargando...</p>
        ) : promoCodes.length === 0 ? (
          <p className="text-sm text-center py-10 text-muted-foreground">Sin códigos creados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                  {['Código', 'Dto.', 'Plan', 'Usos', 'Caduca', 'Estado', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promoCodes.map(c => (
                  <tr key={c.id} className="hover:bg-black/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td className="px-4 py-3 font-mono font-bold text-xs" style={{ color: '#D4AF37' }}>{c.code}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: '#22c55e' }}>{c.discount_percent}%</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.plan_id ?? 'todos'}</td>
                    <td className="px-4 py-3 text-xs">{c.current_uses}{c.max_uses ? `/${c.max_uses}` : ''}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {c.valid_until ? new Date(c.valid_until).toLocaleDateString('es-ES') : '∞'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleCode(c.id, c.is_active)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[0.65rem] font-bold transition-all"
                        style={c.is_active
                          ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
                          : { background: 'rgba(0,0,0,0.04)', color: '#555', border: '1px solid rgba(0,0,0,0.08)' }}
                      >
                        {c.is_active ? <><Check size={10} /> Activo</> : <><X size={10} /> Inactivo</>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteCode(c.id, c.code)} className="hover:text-red-400 transition-colors text-muted-foreground">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromoCodes;
