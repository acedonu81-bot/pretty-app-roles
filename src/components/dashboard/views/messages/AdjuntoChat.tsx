import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Foto o vídeo de un mensaje (16 oct 2026). El bucket 'message-attachments' es
// privado: en la BD se guarda la ruta del archivo y aquí se pide una URL
// firmada de 1 hora, que solo se concede a los dos participantes (política de
// storage). Los mensajes antiguos con una URL completa se muestran tal cual.
const BUCKET = 'message-attachments';

export function useUrlAdjunto(ruta: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    setUrl(null);
    if (!ruta) return;
    if (/^https?:\/\//.test(ruta)) { setUrl(ruta); return; }
    let vivo = true;
    supabase.storage.from(BUCKET).createSignedUrl(ruta, 3600)
      .then(({ data }) => { if (vivo) setUrl(data?.signedUrl ?? null); });
    return () => { vivo = false; };
  }, [ruta]);
  return url;
}

const AdjuntoChat = ({ ruta, tipo }: { ruta: string; tipo: 'foto' | 'video' }) => {
  const url = useUrlAdjunto(ruta);
  if (!url) {
    return <div className="w-[200px] h-[150px] animate-pulse" style={{ background: 'rgba(0,0,0,0.05)' }} />;
  }
  if (tipo === 'video') {
    return (
      <video src={url} controls playsInline preload="metadata"
        className="block max-w-[240px] max-h-[320px]" style={{ background: '#000' }} />
    );
  }
  return (
    <img src={url} alt="Imagen enviada"
      className="block max-w-[200px] max-h-[200px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => window.open(url, '_blank')} />
  );
};

export default AdjuntoChat;
