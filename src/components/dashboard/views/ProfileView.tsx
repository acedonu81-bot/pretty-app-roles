import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AudioUpload from '@/components/dashboard/AudioUpload';

const ProfileView = () => {
  const genres = ['Techno', 'Minimal', 'Deep House', 'Dark'];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Mi <span className="text-gradient">Perfil</span></h2>
          <p className="text-sm text-muted-foreground">Así te ven los empresarios.</p>
        </div>
        <button onClick={() => toast.success('Perfil guardado.')}
          className="px-5 py-2 rounded-lg font-bold text-sm w-full sm:w-auto"
          style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
          Guardar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-5 text-center">
            <div className="w-16 h-16 rounded-lg mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#B8941E)', color: '#000' }}>A</div>
            <p className="font-bold text-sm">Alex (DJ Aethel)</p>
            <p className="text-[0.6rem] font-bold mt-1" style={{ color: '#D4AF37' }}>Plan Elite</p>
            <div className="flex justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map(s => <span key={s} style={{ color: s<=4?'#D4AF37':'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>★</span>)}
              <span className="text-xs text-muted-foreground ml-1">4.8</span>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-center mt-2">
              {genres.map(g => (
                <span key={g} className="text-[0.55rem] font-medium px-2 py-0.5 rounded"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', color: '#D4AF37' }}>
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-panel p-4">
            {[['Bookings 2026','12'],['Tasa respuesta','98%'],['Visitas perfil','1,247'],['Clics WhatsApp','89']].map(([k,v]) => (
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
            {[['Nombre artístico','Alex (DJ Aethel)'],['Ciudad','Madrid'],['Rider técnico','Pioneer CDJ-3000, DJM-900NXS2']].map(([l,v]) => (
              <div key={l} className="mb-3">
                <label className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">{l}</label>
                <input type="text" defaultValue={v} className="nightlife-input mt-1 text-sm" />
              </div>
            ))}
            <div className="mb-3">
              <label className="text-[0.6rem] text-muted-foreground font-bold uppercase tracking-wider">Bio</label>
              <textarea rows={2} defaultValue="DJ residente en Madrid especializado en Techno oscuro y Minimal. +8 años de experiencia."
                className="nightlife-input mt-1 text-sm resize-y" />
            </div>
          </div>
          <AudioUpload />
          <div className="glass-panel p-5">
            <h4 className="text-sm font-bold mb-3">Valoraciones</h4>
            {[
              { venue: 'Onyx Club Madrid', date: 'Mar 2026', comment: 'Profesional 100%. El set fue brutal.', stars: 5 },
              { venue: 'Horizon Rooftop', date: 'Feb 2026', comment: 'Excelente comunicación previa.', stars: 5 },
            ].map((r) => (
              <div key={r.venue} className="py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-semibold text-xs">{r.venue}</span>
                  <span className="text-[0.55rem] text-muted-foreground">{r.date}</span>
                </div>
                <div className="mb-0.5">{[1,2,3,4,5].map(s => <span key={s} style={{ color: s<=r.stars?'#D4AF37':'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>★</span>)}</div>
                <p className="text-xs text-muted-foreground italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
