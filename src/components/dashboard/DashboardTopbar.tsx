import { Search, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardTopbar = () => {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header
      className="h-20 px-8 flex items-center justify-between sticky top-0 z-10"
      style={{
        background: 'rgba(20,20,28,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--nightlife-border)',
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-full w-[400px]" style={{
        background: 'var(--nightlife-card)', border: '1px solid var(--nightlife-border)',
      }}>
        <Search size={18} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar promotores, equipos, transportes rápidos..."
          className="bg-transparent border-none outline-none text-foreground w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-6 relative">
        {/* Notifications */}
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 rounded-lg transition-colors"
          style={{
            background: 'rgba(140,82,255,0.1)',
            border: '1px solid rgba(140,82,255,0.3)',
            color: '#8c52ff',
          }}
        >
          <div className="flex items-end gap-[2px] h-5 w-5">
            {[14, 9, 5, 10].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  background: 'currentColor',
                  height: `${h}px`,
                  animation: `eqBar 0.4s ease-in-out infinite alternate ${i * 0.2}s`,
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{
            background: '#ff5f56', boxShadow: '0 0 8px #ff5f56',
          }} />
        </button>

        {showNotif && (
          <div className="glass-panel absolute top-14 right-16 w-[340px] z-50" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
            <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--nightlife-border)' }}>
              <h4 className="text-sm font-bold">Notificaciones</h4>
              <span className="text-xs cursor-pointer" style={{ color: 'var(--nightlife-primary)' }}>Marcar leídas</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {[
                { color: '#00ff88', title: 'Nueva Puja en Directo', desc: 'El promotor Club Onyx ha pujado €180/h por tu sesión.', time: 'Hace 2 min' },
                { color: '#8c52ff', title: 'Fondo Escrow Retenido', desc: 'Horizon Rooftop ha depositado €650 en garantía.', time: 'Hace 1 hora' },
                { color: '#8E8EA0', title: 'Validación KYC Completada', desc: 'Tu DNI + Polaroid han sido aprobados.', time: 'Hace 12 hrs' },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 flex gap-3 items-start cursor-pointer hover:bg-white/5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color }} />
                  <div>
                    <p className="text-sm font-semibold mb-0.5">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                    <span className="text-[0.65rem] text-muted-foreground mt-1 block">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="btn-nightlife-secondary text-xs py-2 px-4 flex items-center gap-2"
        >
          <LogOut size={14} /> Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default DashboardTopbar;
