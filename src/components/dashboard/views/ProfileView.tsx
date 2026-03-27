import { useState, useRef } from 'react';
import { Trash2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import AudioUpload from '@/components/dashboard/AudioUpload';
import LiveBetaButton from '@/components/dashboard/LiveBetaButton';

const ProfileView = () => {
  const { user } = useAuth();
  const profile = useProfile();
  const [deleting, setDeleting] = useState(false);
  const [localName, setLocalName] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [rider, setRider] = useState('');
  const [bio, setBio] = useState('');
  const photoRef = useRef<HTMLInputElement>(null);

  const displayName = localName ?? profile.display_name;
  const rawPhoto = profile.photo_url;
  const photoUrl = rawPhoto && rawPhoto.length > 5 ? rawPhoto : null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB'); return; }

    const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${user.id}/photo-${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    if (error) { toast.error('Error al subir foto'); return; }
    const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
    await profile.updateField({ photo_url: urlData.publicUrl });
    toast.success('Foto de perfil actualizada.');
  };

  const handleSave = async () => {
    if (!user) return;
    const updates: any = {};
    if (localName !== null) updates.display_name = localName;
    if (Object.keys(updates).length > 0) await profile.updateField(updates);
    toast.success('Perfil guardado.');
  };

  const handleDeleteMedia = async () => {
    if (!user) return;
    const first = window.confirm('¿Estás seguro? Se eliminarán TODOS tus archivos multimedia (audio, fotos) de forma permanente.');
    if (!first) return;
    const second = window.confirm('⚠️ CONFIRMACIÓN FINAL: Esta acción es IRREVERSIBLE. ¿Deseas continuar con la eliminación?');
    if (!second) return;
    setDeleting(true);
    try {
      const { data: files } = await supabase.storage.from('audio-sessions').list(user.id);
      if (files && files.length > 0) {
        const paths = files.map(f => `${user.id}/${f.name}`);
        await supabase.storage.from('audio-sessions').remove(paths);
      }
      await profile.updateField({ photo_url: '' });
      toast.success('Contenido multimedia eliminado permanentemente.');
    } catch {
      toast.error('Error al eliminar contenido.');
    } finally {
      setDeleting(false);
    }
  };

  const initials = displayName ? displayName.charAt(0).toUpperCase() : 'X';

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Mi <span className="text-gradient">Perfil</span></h2>
          <p className="text-sm text-muted-foreground">Así te ven los empresarios.</p>
        </div>
        <button onClick={handleSave}
          className="px-5 py-2 rounded-lg font-bold text-sm w-full sm:w-auto"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          Guardar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5 text-center">
            <div className="relative cursor-pointer group mx-auto w-16 h-16 mb-3" onClick={() => photoRef.current?.click()}>
              <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center text-2xl font-bold"
                style={{ background: photoUrl ? undefined : 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>
                {photoUrl
                  ? <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                  : initials}
              </div>
              <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

            <p className="font-bold text-sm">{displayName || 'Sin nombre'}</p>
            <p className="text-[0.6rem] font-bold mt-1" style={{ color: '#D4AF37' }}>Plan Básico</p>
            <div className="flex justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map(s => <span key={s} style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>★</span>)}
              <span className="text-xs text-muted-foreground ml-1">0.0</span>
            </div>
          </div>
          <div className="glass-panel p-4">
            {[['Bookings 2026','0'],['Tasa respuesta','0%'],['Visitas perfil','0'],['Clics WhatsApp','0']].map(([k,v]) => (
              <div key={k} className="flex justify-between py-1.5 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5">
            <h4 className="text-sm font-bold mb-4">Información</h4>
            <div className="mb-3">
              <label className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">Nombre artístico</label>
              <input type="text" value={displayName} onChange={e => setLocalName(e.target.value)} className="nightlife-input mt-1 text-sm" />
            </div>
            <div className="mb-3">
              <label className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">Ciudad</label>
              <input type="text" value={city || profile.zone || ''} onChange={e => setCity(e.target.value)} className="nightlife-input mt-1 text-sm" />
            </div>
            <div className="mb-3">
              <label className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">Rider técnico</label>
              <input type="text" value={rider} onChange={e => setRider(e.target.value)} placeholder="Ej: Pioneer CDJ-3000, DJM-900NXS2" className="nightlife-input mt-1 text-sm" />
            </div>
            <div className="mb-3">
              <label className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">Bio</label>
              <textarea rows={2} value={bio} onChange={e => setBio(e.target.value)}
                placeholder="Describe tu experiencia y estilo..."
                className="nightlife-input mt-1 text-sm resize-y" />
            </div>
          </div>
          <AudioUpload />

          {/* Media deletion - GDPR */}
          <div className="glass-panel p-5">
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              <Trash2 size={14} style={{ color: '#ff5f56' }} /> Gestión de Contenido Multimedia
            </h4>
            <p className="text-[0.6rem] text-muted-foreground mb-3">
              Según la normativa RGPD, puedes solicitar la eliminación permanente de todo tu contenido multimedia (audios, fotos de perfil y trabajos).
            </p>
            <button onClick={handleDeleteMedia} disabled={deleting}
              className="w-full py-2.5 rounded-lg font-medium text-xs transition-all disabled:opacity-50"
              style={{ background: 'rgba(255,95,86,0.06)', color: '#ff5f56', border: '1px solid rgba(255,95,86,0.15)' }}>
              {deleting ? 'Eliminando...' : 'Eliminar todo mi contenido multimedia'}
            </button>
          </div>
          <div className="glass-panel p-5">
            <h4 className="text-sm font-bold mb-3">Vídeo en Directo</h4>
            <LiveBetaButton />
          </div>
          <div className="glass-panel p-5">
            <h4 className="text-sm font-bold mb-3">Valoraciones</h4>
            <p className="text-xs text-muted-foreground text-center py-4">Aún no tienes valoraciones. Aparecerán aquí cuando los empresarios valoren tu trabajo.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
