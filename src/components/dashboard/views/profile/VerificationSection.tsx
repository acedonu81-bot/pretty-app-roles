import { useState, useRef } from 'react';
import { Shield, Clock, CheckCircle, Video, Film, Headphones, ScanLine, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const VerificationSection = () => {
  const { user } = useAuth();
  const profile = useProfile();
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const videoRef = useRef<HTMLInputElement>(null);

  const profileAny = profile as any;
  const syncedStatus: 'none' | 'pending' | 'approved' =
    profile.is_verified ? 'approved' :
    profileAny.verification_status === 'pending' ? 'pending' : 'none';

  const handleVerificationVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('video/')) { toast.error('Solo se permiten archivos de vídeo (MP4, MOV, WebM)'); return; }
    if (file.size > 150 * 1024 * 1024) { toast.error('Máximo 150MB'); return; }
    setUploadingVideo(true);
    try {
      const safeName = `verification-${Date.now()}.mp4`;
      const path = `${user.id}/verification/${safeName}`;
      const { error: upErr } = await supabase.storage.from('audio-sessions').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
      const { error: updateErr } = await (supabase.from('profiles') as any).update({
        verification_video_url: urlData.publicUrl,
        verification_status: 'pending',
        verification_submitted_at: new Date().toISOString(),
      }).eq('user_id', user.id);
      if (updateErr) throw updateErr;
      toast.success('Vídeo enviado. El equipo XPEAK lo revisará en 24–48h.');
    } catch {
      toast.error('Error al subir el vídeo. Inténtalo de nuevo.');
    } finally {
      setUploadingVideo(false);
      if (videoRef.current) videoRef.current.value = '';
    }
  };

  return (
    <div className="glass-panel p-5 relative overflow-hidden"
      style={{
        border: syncedStatus === 'approved'
          ? '1px solid rgba(212,175,55,0.5)'
          : syncedStatus === 'pending'
            ? '1px solid rgba(245,158,11,0.35)'
            : '1px solid rgba(212,175,55,0.15)',
        background: syncedStatus === 'approved' ? 'rgba(212,175,55,0.04)' : 'transparent',
      }}>
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />

      <div className="flex items-center gap-3 mb-4 relative">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: syncedStatus === 'approved' ? 'linear-gradient(135deg,#D4AF37,#B8941E)' : 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.3)',
          }}>
          <Shield size={20} style={{ color: syncedStatus === 'approved' ? '#000' : '#D4AF37' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold">Sello de Oro XPEAK</h4>
            {syncedStatus === 'approved' && (
              <span className="text-[0.55rem] font-black px-1.5 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>★ VERIFICADO</span>
            )}
            {syncedStatus === 'pending' && (
              <span className="text-[0.55rem] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                <Clock size={8} /> EN REVISIÓN
              </span>
            )}
          </div>
          <p className="text-[0.6rem] text-muted-foreground">
            {syncedStatus === 'approved'
              ? 'Tu perfil aparece con la estrella dorada en todas las búsquedas.'
              : syncedStatus === 'pending'
                ? 'El equipo XPEAK está revisando tu vídeo. Plazo: 24–48h.'
                : 'Aparece primero en búsquedas. Los empresarios filtran por este sello.'}
          </p>
        </div>
      </div>

      {syncedStatus === 'none' && (
        <>
          <div className="rounded-xl p-4 mb-4 space-y-2.5"
            style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#D4AF37' }}>Qué necesitas enviar:</p>
            {[
              { icon: Film,      text: 'Vídeo de 30–90 segundos demostrando tu habilidad en directo' },
              { icon: Headphones, text: 'Calidad mínima: 720p, buena iluminación' },
              { icon: ScanLine,  text: 'Sin filtros, sin música superpuesta — que se vea el trabajo real' },
              { icon: UserCheck, text: 'Revisión manual por el equipo XPEAK en 24–48h' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                <Icon size={13} style={{ color: 'rgba(212,175,55,0.5)', flexShrink: 0, marginTop: 1 }} />
                <p className="text-[0.65rem] text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVerificationVideo} />
          <button type="button" onClick={() => videoRef.current?.click()} disabled={uploadingVideo}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
            {uploadingVideo
              ? <><Clock size={15} className="animate-spin" /> Subiendo vídeo...</>
              : <><Video size={15} /> Solicitar Sello de Oro</>}
          </button>
        </>
      )}

      {syncedStatus === 'pending' && (
        <div className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Clock size={16} style={{ color: '#F59E0B' }} className="animate-pulse flex-shrink-0" />
          <div>
            <p className="text-xs font-bold" style={{ color: '#F59E0B' }}>Vídeo recibido y en cola de revisión</p>
            <p className="text-[0.6rem] text-muted-foreground">Recibirás una notificación cuando el equipo lo apruebe o solicite cambios.</p>
          </div>
        </div>
      )}

      {syncedStatus === 'approved' && (
        <div className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <CheckCircle size={16} style={{ color: '#D4AF37' }} className="flex-shrink-0" />
          <div>
            <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>Sello activo — tu perfil es prioritario en búsquedas</p>
            <p className="text-[0.6rem] text-muted-foreground">Los empresarios ven tu ★ en todas las listas y filtros.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationSection;
