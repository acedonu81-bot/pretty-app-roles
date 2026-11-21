import { Link2, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';

// Compartir un comunicado: hoja nativa del móvil, y en ordenador WhatsApp + copiar enlace.
export default function CompartirComunicado({ titulo, url }: { titulo: string; url: string }) {
  const texto = `${titulo} | XPEAK`;
  const nativo = typeof navigator !== 'undefined' && !!navigator.share;

  const compartir = async () => {
    try { await navigator.share({ title: texto, text: titulo, url }); } catch { /* canceló */ }
  };
  const copiar = async () => {
    try { await navigator.clipboard.writeText(url); toast.success('Enlace copiado'); } catch { toast.error('No se pudo copiar'); }
  };
  const boton = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold';
  const estilo = { background: '#fff', border: '1px solid rgba(212,175,55,0.5)', color: '#8A6D0F' };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {nativo && (
        <button type="button" onClick={compartir} className={boton} style={estilo}><Share2 size={14} /> Compartir</button>
      )}
      {!nativo && (
        <a href={`https://wa.me/?text=${encodeURIComponent(`${titulo}: ${url}`)}`} target="_blank" rel="noopener noreferrer"
          className={boton} style={estilo}><MessageCircle size={14} /> WhatsApp</a>
      )}
      <button type="button" onClick={copiar} className={boton} style={estilo}><Link2 size={14} /> Copiar enlace</button>
    </div>
  );
}
