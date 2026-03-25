const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Floating gold orbs */}
    <div
      className="absolute w-[600px] h-[600px] rounded-full opacity-[0.22]"
      style={{
        top: '-20%', left: '-10%',
        background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
        filter: 'blur(120px)',
        animation: 'orbFloat1 20s infinite ease-in-out',
      }}
    />
    <div
      className="absolute w-[500px] h-[500px] rounded-full opacity-[0.16]"
      style={{
        bottom: '-15%', right: '-8%',
        background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
        filter: 'blur(140px)',
        animation: 'orbFloat2 24s infinite ease-in-out',
      }}
    />
    <div
      className="absolute w-[350px] h-[350px] rounded-full opacity-[0.06]"
      style={{
        top: '40%', left: '50%',
        background: 'radial-gradient(circle, #B8941E 0%, transparent 70%)',
        filter: 'blur(100px)',
        animation: 'orbFloat3 18s infinite ease-in-out',
      }}
    />

    {/* Animated SVG waves */}
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
      <path fill="url(#waveGold1)">
        <animate
          attributeName="d"
          values="
            M0,700 C240,650 480,750 720,700 C960,650 1200,750 1440,700 L1440,900 L0,900 Z;
            M0,720 C240,770 480,670 720,720 C960,770 1200,670 1440,720 L1440,900 L0,900 Z;
            M0,700 C240,650 480,750 720,700 C960,650 1200,750 1440,700 L1440,900 L0,900 Z
          "
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Wave 2 — mid, medium speed */}
      <path fill="url(#waveGold2)">
        <animate
          attributeName="d"
          values="
            M0,750 C360,710 720,790 1080,750 C1260,730 1350,770 1440,750 L1440,900 L0,900 Z;
            M0,770 C360,810 720,730 1080,770 C1260,790 1350,750 1440,770 L1440,900 L0,900 Z;
            M0,750 C360,710 720,790 1080,750 C1260,730 1350,770 1440,750 L1440,900 L0,900 Z
          "
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Wave 3 — subtle top wave */}
      <path stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.15">
        <animate
          attributeName="d"
          values="
            M0,300 Q360,260 720,300 Q1080,340 1440,300;
            M0,300 Q360,340 720,300 Q1080,260 1440,300;
            M0,300 Q360,260 720,300 Q1080,340 1440,300
          "
          dur="10s"
          repeatCount="indefinite"
        />
      </path>

      {/* Wave 4 — thin mid stroke */}
      <path stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.10">
        <animate
          attributeName="d"
          values="
            M0,500 Q300,480 600,500 Q900,520 1200,500 Q1350,490 1440,500;
            M0,500 Q300,520 600,500 Q900,480 1200,500 Q1350,510 1440,500;
            M0,500 Q300,480 600,500 Q900,520 1200,500 Q1350,490 1440,500
          "
          dur="12s"
          repeatCount="indefinite"
        />
      </path>
    </svg>

    <style>{`
      @keyframes orbFloat1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(60px, 40px) scale(1.05); }
        66% { transform: translate(-30px, 20px) scale(0.97); }
      }
      @keyframes orbFloat2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(-50px, -30px) scale(1.08); }
        66% { transform: translate(40px, -20px) scale(0.95); }
      }
      @keyframes orbFloat3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(70px, -40px) scale(1.1); }
      }
    `}</style>
  </div>
);

export default AmbientBackground;
