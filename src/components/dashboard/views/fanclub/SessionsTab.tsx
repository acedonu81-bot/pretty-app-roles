import { useState, useEffect } from 'react';
import { Music2, Plus, Trash2, Lock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { parseStreamUrl } from '@/lib/streaming';

interface Session {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
}

const SessionsTab = () => {
  const { user } = useAuth();
  const profile = useProfile();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', description: '' });

  const load = async () => {
    if (!profile.id) return;
    const { data } = await supabase
      .from('fan_club_sessions' as any)
      .select('id, title, url, description, created_at')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false });
    setSessions((data as Session[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [profile.id]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      toast.error('Título y URL son obligatorios');
      return;
    }
    if (!parseStreamUrl(form.url)) {
      toast.error('URL no compatible. Usa YouTube, SoundCloud o Mixcloud.');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('fan_club_sessions' as any)
      .insert({ profile_id: profile.id, title: form.title.trim(), url: form.url.trim(), description: form.description.trim() || null });
    setSaving(false);
    if (error) { toast.error('Error al guardar la sesión'); return; }
    toast.success('Sesión exclusiva publicada para tus fans');
    setForm({ title: '', url: '', description: '' });
    setAdding(false);
    load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('fan_club_sessions' as any).delete().eq('id', id).eq('profile_id', profile.id);
    if (error) { toast.error('Error al eliminar'); return; }
    setSessions(s => s.filter(x => x.id !== id));
    toast.success('Sesión eliminada');
  };

  return (
    <motion.div key="sessions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

      {/* Header */}
      <div className="glass-panel p-4 flex items-center justify-between" style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Lock size={14} style={{ color: '#D4AF37' }} />
            <p className="text-sm font-bold">Sesiones exclusivas Fan Club</p>
          </div>
          <p className="text-xs text-muted-foreground">Solo tus fans suscritos pueden escuchar estas sesiones</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <Plus size={13} /> Añadir sesión
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="glass-panel p-5 space-y-3" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37' }}>Nueva sesión</p>
          <div>
            <label className="text-xs font-medium mb-1 block">Título *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Set completo Cova Club — Abril 2025"
              className="nightlife-input text-sm !py-2" maxLength={120} />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">URL del audio/vídeo *</label>
            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://soundcloud.com/tu-usuario/tu-mix"
              className="nightlife-input text-sm !py-2" />
            <p className="text-xs text-muted-foreground mt-1">Compatible con YouTube, SoundCloud y Mixcloud</p>
            {form.url && !parseStreamUrl(form.url) && (
              <p className="text-xs mt-1 font-bold" style={{ color: '#ef4444' }}>URL no compatible</p>
            )}
            {form.url && parseStreamUrl(form.url) && (
              <p className="text-xs mt-1 font-bold" style={{ color: '#22c55e' }}>✓ {parseStreamUrl(form.url)!.type} detectado</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Descripción (opcional)</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Grabado en directo, 2h de Tech House y Melodic Techno..."
              className="nightlife-input text-sm !py-2 resize-none" rows={2} maxLength={280} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-60"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              {saving ? 'Publicando...' : 'Publicar para fans'}
            </button>
            <button type="button" onClick={() => setAdding(false)}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-70"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: 'rgba(22,20,18,0.55)' }}>
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      {/* Sessions list */}
      {loading && (
        <div className="glass-panel p-8 text-center">
          <p className="text-xs text-muted-foreground animate-pulse">Cargando sesiones...</p>
        </div>
      )}

      {!loading && sessions.length === 0 && !adding && (
        <div className="glass-panel p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <Music2 size={22} style={{ color: 'rgba(212,175,55,0.35)' }} />
          </div>
          <p className="text-sm font-bold">Sin sesiones exclusivas todavía</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Sube tus mejores sets como contenido exclusivo para fans. Solo los suscriptores podrán escucharlos.
          </p>
        </div>
      )}

      {sessions.map((s, i) => {
        const parsed = parseStreamUrl(s.url);
        return (
          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="glass-panel p-4" style={{ border: '1px solid rgba(212,175,55,0.1)' }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Lock size={9} className="inline mr-1" />FAN CLUB
                  </span>
                  {parsed && (
                    <span className="text-xs text-muted-foreground font-medium">{parsed.type}</span>
                  )}
                </div>
                <p className="text-sm font-bold truncate">{s.title}</p>
                {s.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.description}</p>}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <ExternalLink size={13} style={{ color: 'rgba(22,20,18,0.65)' }} />
                </a>
                <button type="button" onClick={() => handleDelete(s.id)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <Trash2 size={13} style={{ color: 'rgba(239,68,68,0.6)' }} />
                </button>
              </div>
            </div>
            {parsed && (
              <div className="rounded-lg overflow-hidden" style={{ height: 80 }}>
                <iframe src={parsed.embedUrl} className="w-full h-full" style={{ border: 'none' }}
                  allow="autoplay" sandbox="allow-scripts allow-same-origin" title={s.title} />
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SessionsTab;
