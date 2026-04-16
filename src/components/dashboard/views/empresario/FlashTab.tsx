import { useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const FlashTab = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [pay, setPay]           = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole]         = useState('');

  const submit = async () => {
    if (!user || !title || !desc || !pay) { toast.error('Completa todos los campos'); return; }
    const { error } = await supabase.from('flash_jobs').insert({
      employer_id: user.id, title, description: desc, pay, location, role_needed: role,
    } as any);
    if (error) { toast.error('Error al publicar'); return; }
    toast.success('Oferta publicada — visible 24h');
    setShowForm(false);
    setTitle(''); setDesc(''); setPay('');
  };

  return (
    <div className="mb-5">
      <button onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105 mb-4"
        style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
        <Plus size={14} /> Publicar Oferta Urgente (24h)
      </button>

      {showForm && (
        <div className="glass-panel p-5 mb-4">
          <h4 className="text-sm font-bold mb-3">Nueva Oferta Flash</h4>
          <div className="space-y-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className="nightlife-input text-sm" />
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción..." rows={3} className="nightlife-input text-sm resize-y" />
            <div className="grid grid-cols-3 gap-2">
              <input value={pay} onChange={e => setPay(e.target.value)} placeholder="Pago (ej: €350)" className="nightlife-input text-sm" />
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ciudad / Zona" maxLength={80} className="nightlife-input text-sm" />
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Rol necesario"
                list="role-suggestions"
                maxLength={60}
                className="nightlife-input text-sm"
              />
              <datalist id="role-suggestions">
                <option value="DJ" />
                <option value="DJ Techno" />
                <option value="DJ House" />
                <option value="DJ Comercial" />
                <option value="DJ Urbano" />
                <option value="Staff / Camarero" />
                <option value="Hostess / Azafata" />
                <option value="RRPP" />
                <option value="Seguridad" />
                <option value="Maquillaje" />
                <option value="Peluquería" />
                <option value="Fotógrafo" />
                <option value="Videógrafo" />
                <option value="Iluminación" />
                <option value="Técnico de sonido" />
              </datalist>
            </div>
            <button onClick={submit} className="w-full py-2.5 rounded-lg font-bold text-sm"
              style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
              Publicar Oferta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashTab;
