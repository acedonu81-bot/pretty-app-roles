import { useRef } from 'react';
import { Camera } from 'lucide-react';

// Cámara redonda para que el DJ cambie una imagen de su perfil de artista
// (banner, foto, carátula o fondo de un set). Solo se pinta para el dueño.
const BotonCamara = ({ etiqueta, onArchivo, subiendo, className }: {
  etiqueta: string; onArchivo: (f: File) => void; subiendo: boolean; className: string;
}) => {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" onClick={() => input.current?.click()} disabled={subiendo} aria-label={etiqueta} title={etiqueta}
        className={`absolute z-10 inline-flex items-center justify-center rounded-full transition-transform hover:scale-105 disabled:opacity-60 ${className}`}
        style={{ width: 40, height: 40, background: 'rgba(46,32,6,0.6)', border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff', backdropFilter: 'blur(6px)' }}>
        {subiendo ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Camera size={18} />}
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onArchivo(f); }} />
    </>
  );
};

export default BotonCamara;
