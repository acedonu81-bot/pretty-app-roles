import { useState, useRef } from 'react';
import { Upload, Music, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AudioUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.includes('audio')) { toast.error('Solo archivos de audio (MP3, WAV)'); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error('Máximo 20MB'); return; }

    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('audio-sessions').upload(path, file);
    if (error) { toast.error('Error al subir'); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from('audio-sessions').getPublicUrl(path);
    const url = urlData.publicUrl;

    await (supabase.from('profiles').update({ audio_url: url } as any) as any).eq('user_id', user.id);

    setAudioUrl(url);
    setFileName(file.name);
    toast.success('Audio subido correctamente');
    setUploading(false);
  };

  return (
    <div className="glass-panel p-4">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Music size={14} style={{ color: '#D4AF37' }} /> Sesión de Audio
      </h4>
      <p className="text-[0.6rem] text-muted-foreground mb-3">
        Sube tu sesión grabada (MP3/WAV, máx 20MB). Es obligatorio para completar tu perfil.
      </p>

      {audioUrl ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <Music size={12} style={{ color: '#22c55e' }} />
            <span className="text-xs font-medium flex-1 truncate">{fileName}</span>
            <button onClick={() => { setAudioUrl(null); setFileName(null); }}><X size={12} className="text-muted-foreground" /></button>
          </div>
          <audio src={audioUrl} controls className="w-full h-8" style={{ filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(5deg)' }} />
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg border-2 border-dashed transition-all hover:scale-[1.01]"
          style={{ borderColor: 'rgba(212,175,55,0.2)', color: '#D4AF37', background: 'rgba(212,175,55,0.03)' }}>
          <Upload size={16} />
          <span className="text-xs font-bold">{uploading ? 'Subiendo...' : 'Subir sesión de audio'}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="audio/mp3,audio/wav,audio/mpeg" onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default AudioUpload;
