import { toast } from 'sonner';

const ProfileView = () => {
  const genres = ['Techno', 'Minimal', 'Deep House', 'Dark'];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1">Mi Perfil <span className="text-gradient">Público</span></h2>
          <p className="text-muted-foreground text-sm">Así te ven los promotores. Optimiza cada campo para aparecer primero.</p>
        </div>
        <button onClick={() => toast.success('Perfil guardado y publicado en el directorio.')}
          className="px-5 py-2.5 rounded-xl font-extrabold text-sm w-full sm:w-auto"
          style={{ background: 'linear-gradient(90deg,#8c52ff,#00b8ff)', color: 'white' }}
        >Guardar Cambios</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* Left */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-2xl text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black"
              style={{ background: 'linear-gradient(135deg,#8c52ff,#00b8ff)', color: 'white', boxShadow: '0 0 30px rgba(140,82,255,0.4)' }}>A</div>
            <p className="font-extrabold text-lg">Alex (DJ Aethel)</p>
            <p className="text-xs font-bold mt-1" style={{ color: '#00ff88' }}>✓ KYC Verificado · Top Tier</p>
            <div className="flex justify-center gap-0.5 my-3">
              {[1,2,3,4,5].map(s => <span key={s} style={{ color: s<=4?'#ffbc00':'rgba(255,255,255,0.2)' }}>★</span>)}
              <span className="text-xs text-muted-foreground ml-1">4.8</span>
            </div>
            <div className="flex gap-2 flex-wrap justify-center mt-2">
              {genres.map(g => (
                <span key={g} className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(140,82,255,0.15)', border: '1px solid rgba(140,82,255,0.3)', color: '#8c52ff' }}>
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            {[['Bookings 2026','12'],['Tasa respuesta','98%'],['Visitas perfil','847'],['Posición ranking','#3']].map(([k,v]) => (
              <div key={k} className="flex justify-between py-2 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-muted-foreground">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="font-semibold mb-4">Información Pública</h4>
            {[['Nombre artístico','Alex (DJ Aethel)'],['Ciudad base','Madrid, España'],['Enlace streaming','https://twitch.tv/djaethel'],['Rider técnico','Pioneer CDJ-3000, DJM-900NXS2']].map(([l,v]) => (
              <div key={l} className="mb-3">
                <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{l}</label>
                <input type="text" defaultValue={v} className="nightlife-input mt-1 text-sm" />
              </div>
            ))}
            <div className="mb-3">
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Bio</label>
              <textarea rows={3} defaultValue="DJ residente en Madrid especializado en Techno oscuro y Minimal. +8 años de experiencia."
                className="nightlife-input mt-1 text-sm resize-y" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h4 className="font-semibold mb-4">⭐ Valoraciones Verificadas</h4>
            {[
              { venue: 'Onyx Club Madrid', date: 'Mar 2026', comment: 'Profesional 100%. El set fue brutal.', stars: 5 },
              { venue: 'Horizon Rooftop BCN', date: 'Feb 2026', comment: 'Excelente comunicación previa.', stars: 5 },
              { venue: 'Base Sound BCN', date: 'Feb 2026', comment: 'Muy buen DJ pero llegó 10 min tarde.', stars: 4 },
            ].map((r) => (
              <div key={r.venue} className="py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{r.venue}</span>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="mb-1">{[1,2,3,4,5].map(s => <span key={s} style={{ color: s<=r.stars?'#ffbc00':'rgba(255,255,255,0.15)', fontSize: '0.9rem' }}>★</span>)}</div>
                <p className="text-sm text-muted-foreground italic">"{r.comment}"</p>
                <span className="text-[0.65rem] mt-1 inline-block px-2 py-0.5 rounded"
                  style={{ background: 'rgba(0,255,136,0.08)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}>
                  ✓ Verificado via Escrow
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
