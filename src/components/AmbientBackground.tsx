const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Gold orbs */}
    <div
      className="absolute w-[500px] h-[500px] rounded-full opacity-15"
      style={{
        top: '-15%', left: '-8%',
        background: '#D4AF37',
        filter: 'blur(150px)',
        animation: 'float 25s infinite ease-in-out alternate',
      }}
    />
    <div
      className="absolute w-[400px] h-[400px] rounded-full opacity-10"
      style={{
        bottom: '-10%', right: '-5%',
        background: '#D4AF37',
        filter: 'blur(150px)',
        animation: 'float 25s infinite ease-in-out alternate',
        animationDelay: '-8s',
      }}
    />
    {/* Subtle ambient waves */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="" stroke="url(#waveGrad)" strokeWidth="1" fill="none">
        <animate attributeName="d"
          values="M0,300 Q250,280 500,300 Q750,320 1000,300 Q1250,280 1500,300;M0,300 Q250,320 500,300 Q750,280 1000,300 Q1250,320 1500,300;M0,300 Q250,280 500,300 Q750,320 1000,300 Q1250,280 1500,300"
          dur="8s" repeatCount="indefinite" />
      </path>
      <path d="" stroke="url(#waveGrad)" strokeWidth="0.8" fill="none" opacity="0.6">
        <animate attributeName="d"
          values="M0,400 Q300,380 600,400 Q900,420 1200,400 Q1500,380 1800,400;M0,400 Q300,420 600,400 Q900,380 1200,400 Q1500,420 1800,400;M0,400 Q300,380 600,400 Q900,420 1200,400 Q1500,380 1800,400"
          dur="10s" repeatCount="indefinite" />
      </path>
      <path d="" stroke="url(#waveGrad)" strokeWidth="0.5" fill="none" opacity="0.4">
        <animate attributeName="d"
          values="M0,500 Q200,485 400,500 Q600,515 800,500 Q1000,485 1200,500;M0,500 Q200,515 400,500 Q600,485 800,500 Q1000,515 1200,500;M0,500 Q200,485 400,500 Q600,515 800,500 Q1000,485 1200,500"
          dur="12s" repeatCount="indefinite" />
      </path>
    </svg>
  </div>
);

export default AmbientBackground;
