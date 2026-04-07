import { useState } from 'react';
import { Image, Upload, Play } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_MEDIA } from './types';

const MediaTab = () => {
  const [mediaFilter, setMediaFilter] = useState<'all' | 'dj' | 'makeup' | 'staff'>('all');
  const filtered = mediaFilter === 'all' ? MOCK_MEDIA : MOCK_MEDIA.filter(m => m.role === mediaFilter);

  return (
    <div>
      <div className="glass-panel p-4 mb-4 flex items-center justify-between flex-wrap gap-3"
        style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Image size={14} style={{ color: '#D4AF37' }} /> Media y Contenido
          </h4>
          <p className="text-xs text-muted-foreground">Portfolio, vídeos y fotos de los profesionales disponibles.</p>
        </div>
        <button
          onClick={() => toast.info('Subida de media de sala próximamente.')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          <Upload size={13} /> Subir media de mi sala
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {(['all', 'dj', 'makeup', 'staff'] as const).map(f => (
          <button key={f} onClick={() => setMediaFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background: mediaFilter === f ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${mediaFilter === f ? 'rgba(212,175,55,0.3)' : 'var(--nightlife-border)'}`,
              color: mediaFilter === f ? '#D4AF37' : '#8E8EA0',
            }}>
            {{ all: 'Todo', dj: 'DJ', makeup: 'Makeup', staff: 'Staff' }[f]}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">{filtered.length} elementos</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(m => (
          <div key={m.id}
            className="relative rounded-xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
            style={{ aspectRatio: '16/9', border: '1px solid rgba(255,255,255,0.07)' }}
            onClick={() => toast.info(`Abriendo: ${m.title}`)}>
            <img src={m.thumb} alt={m.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(0,0,0,0.55)' }} />
            {m.type === 'video' && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Play size={10} fill="white" className="text-white ml-0.5" />
              </div>
            )}
            <span className="absolute top-2 left-2 text-[0.5rem] font-black px-1.5 py-0.5 rounded"
              style={{
                background: m.role === 'dj' ? 'rgba(212,175,55,0.8)' : m.role === 'makeup' ? 'rgba(236,72,153,0.8)' : 'rgba(139,92,246,0.8)',
                color: '#fff',
              }}>
              {m.role.toUpperCase()}
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
              style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)' }}>
              <p className="text-[0.6rem] font-bold text-white truncate">{m.title}</p>
              <p className="text-[0.55rem] text-muted-foreground">{m.author}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i}
            className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-amber-500/30 hover:bg-white/[0.02]"
            style={{ aspectRatio: '16/9', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(212,175,55,0.15)' }}
            onClick={() => toast.info('Sube el contenido de tu sala aquí.')}>
            <Upload size={16} style={{ color: 'rgba(212,175,55,0.3)' }} />
            <span className="text-[0.55rem] text-muted-foreground">Subir contenido</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaTab;
