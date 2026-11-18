import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useDjBanner } from '@/hooks/useDjBanner';
import { useProfile } from '@/hooks/useProfile';
import { useMiPlan } from '@/hooks/useMiPlan';

const MAX_MB = 8;

// Banner de la cabecera de artista del perfil público del DJ (estilo
// Hearthis, 1 nov 2026). Sin banner, la cabecera usa la portada del primer
// set o la foto de perfil desenfocada.
// 18 nov 2026: es una ventaja de Premium. Con Esencial o Profesional se puede ver y
// quitar el que ya hubiera, pero no subir otro; la BD lo impone también (banner_permitido).
const BannerArtistaEditor = ({ userId }: { userId: string }) => {
  const { banner, recargar } = useDjBanner(userId);
  const perfil = useProfile();
  const plan = useMiPlan(perfil.id);
  const permitido = plan === 'business' || plan === 'pre';
  const [subiendo, setSubiendo] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const subir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !permitido) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { toast.error('El banner tiene que ser JPG, PNG o WebP.'); return; }
    if (file.size > MAX_MB * 1024 * 1024) { toast.error(`El banner no puede pasar de ${MAX_MB} MB.`); return; }
    setSubiendo(true);
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${userId}/banner/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file, { contentType: file.type });
    if (error) { setSubiendo(false); toast.error('No se pudo subir el banner. Inténtalo de nuevo.'); return; }
    const url = supabase.storage.from('audio-sessions').getPublicUrl(path).data.publicUrl;
    const { error: errBD } = await supabase.from('dj_banners').upsert({ user_id: userId, banner_url: url, updated_at: new Date().toISOString() });
    setSubiendo(false);
    if (errBD) { toast.error('El banner se subió pero no se pudo poner en tu perfil. Inténtalo de nuevo.'); return; }
    toast.success('Banner actualizado.');
    recargar();
  };

  const quitar = async () => {
    const { error } = await supabase.from('dj_banners').delete().eq('user_id', userId);
    if (error) { toast.error('No se pudo quitar el banner.'); return; }
    recargar();
  };

  // Mientras se conoce el plan no se enseña nada, para no parpadear.
  if (plan === undefined) return null;

  if (!permitido) {
    return (
      <div className="mb-4 rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.06)', border: '1px dashed rgba(212,175,55,0.5)' }}>
        <p className="text-sm font-bold mb-1" style={{ color: '#8A6D0F' }}>Banner de tu perfil de artista</p>
        <p className="text-xs text-muted-foreground">
          Poner tu propio banner en la cabecera de tu ficha es una ventaja del plan Premium.
          {banner ? ' El que tienes sigue guardado, pero los demás no lo ven hasta que tengas Premium.' : ''} Puedes verlo en Mi plan.
        </p>
        {banner && (
          <div className="mt-3">
            <img src={banner} alt="Tu banner guardado" className="w-full rounded-lg object-cover opacity-60" style={{ aspectRatio: '16 / 5' }} />
            <button type="button" onClick={quitar} className="text-xs font-semibold mt-1" style={{ color: '#8A6D0F' }}>Quitar banner</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-sm font-bold mb-1.5" style={{ color: '#8A6D0F' }}>Banner de tu perfil de artista</p>
      <button type="button" onClick={() => input.current?.click()} disabled={subiendo}
        className="relative w-full rounded-xl overflow-hidden flex items-center justify-center disabled:opacity-60"
        style={{ aspectRatio: '16 / 5', background: banner ? undefined : 'rgba(212,175,55,0.08)', border: '1px dashed rgba(212,175,55,0.5)' }}
        aria-label={banner ? 'Cambiar banner' : 'Subir banner'}>
        {banner && <img src={banner} alt="Banner de tu perfil" className="absolute inset-0 w-full h-full object-cover" />}
        <span className="relative inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,253,247,0.92)', color: '#8A6D0F' }}>
          <ImagePlus size={14} /> {subiendo ? 'Subiendo…' : banner ? 'Cambiar banner' : 'Subir banner (foto horizontal)'}
        </span>
      </button>
      {banner && (
        <button type="button" onClick={quitar} className="text-xs font-semibold mt-1" style={{ color: '#8A6D0F' }}>Quitar banner</button>
      )}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={subir} className="hidden" />
    </div>
  );
};

export default BannerArtistaEditor;
