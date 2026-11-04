const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Manchas doradas fijas. Antes se movían sin parar con blur(120px) y ondas SVG
        animadas: obligaban a repintar toda la pantalla (y los backdrop-blur de encima)
        en cada fotograma, ~40% GPU en Chrome con el panel abierto (4 nov). */}
    <div
      className="absolute w-[600px] h-[600px] rounded-full opacity-[0.22]"
      style={{
        top: '-20%', left: '-10%',
        background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
        filter: 'blur(120px)',
      }}
    />
    <div
      className="absolute w-[500px] h-[500px] rounded-full opacity-[0.16]"
      style={{
        bottom: '-15%', right: '-8%',
        background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
        filter: 'blur(140px)',
      }}
    />
    <div
      className="absolute w-[350px] h-[350px] rounded-full opacity-[0.12]"
      style={{
        top: '40%', left: '50%',
        background: 'radial-gradient(circle, #B8941E 0%, transparent 70%)',
        filter: 'blur(100px)',
      }}
    />

    {/* Ondas SVG fijas */}
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 900">
      <defs>
        <linearGradient id="waveGold1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="30%" stopColor="#D4AF37" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="waveGold2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8941E" stopOpacity="0" />
          <stop offset="40%" stopColor="#B8941E" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#B8941E" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#B8941E" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Wave 1 — large, slow */}
      <path d="M0,700 C240,650 480,750 720,700 C960,650 1200,750 1440,700 L1440,900 L0,900 Z" fill="url(#waveGold1)" />

      {/* Wave 2 — mid, medium speed */}
      <path d="M0,750 C360,710 720,790 1080,750 C1260,730 1350,770 1440,750 L1440,900 L0,900 Z" fill="url(#waveGold2)" />

      {/* Wave 3 — subtle top wave */}
      <path d="M0,300 Q360,260 720,300 Q1080,340 1440,300" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.15" />

      {/* Wave 4 — thin mid stroke */}
      <path d="M0,500 Q300,480 600,500 Q900,520 1200,500 Q1350,490 1440,500" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.10" />
    </svg>
  </div>
);

export default AmbientBackground;
