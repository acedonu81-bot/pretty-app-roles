import { toast } from 'sonner';

const KYCView = () => {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1">KYC & <span className="text-gradient">Verificación</span></h2>
        <p className="text-muted-foreground">Tu identidad verificada activa el escudo de confianza KYC en tu perfil.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Status */}
        <div className="flex items-center gap-4 p-5 rounded-2xl mb-6"
          style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.3)' }}>
          <span className="text-3xl">🛡️</span>
          <div>
            <p className="font-extrabold" style={{ color: '#00ff88' }}>Verificación Completada</p>
            <p className="text-xs text-white/50">Validada el 15 Mar 2026. Badge "KYC ✓" activo.</p>
          </div>
        </div>

        {/* Steps */}
        {[
          { step: '1', title: 'DNI / Pasaporte', desc: 'Documento verificado · No. 47234XXX-K' },
          { step: '2', title: 'Selfie en Vivo', desc: 'Biometría facial cotejada · Solo flag "VERIFIED"' },
          { step: '3', title: 'Revisión Manual', desc: 'Revisado el 15 Mar 2026 · 6h de revisión' },
        ].map((s) => (
          <div key={s.step} className="flex items-center gap-4 p-4 mb-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--nightlife-border)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm"
              style={{ background: 'rgba(0,255,136,0.2)', color: '#00ff88' }}>✓</div>
            <div className="flex-1">
              <p className="font-extrabold text-sm">Paso {s.step} — {s.title}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-md"
              style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}>
              Completado
            </span>
          </div>
        ))}

        {/* RGPD notice */}
        <div className="p-4 rounded-xl mt-6" style={{ background: 'rgba(140,82,255,0.04)', border: '1px solid rgba(140,82,255,0.15)' }}>
          <p className="text-xs font-bold mb-1">🔒 Datos almacenados (RGPD • AEPD)</p>
          <p className="text-xs text-white/40 leading-relaxed">
            Los vectores biométricos se cifran con SHA-256 y se destruyen tras la verificación. Solo se conserva el flag "KYC = VERIFICADO".
          </p>
        </div>

        <button
          onClick={() => toast.info('Solicitud enviada. Confirmación en 48h.')}
          className="w-full mt-4 py-3 rounded-xl font-bold text-sm"
          style={{ background: 'rgba(255,95,86,0.08)', border: '1px solid rgba(255,95,86,0.3)', color: '#ff5f56' }}
        >
          🗑 Solicitar Eliminación de Datos
        </button>
      </div>
    </div>
  );
};

export default KYCView;
