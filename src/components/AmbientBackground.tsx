const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div
      className="absolute w-[600px] h-[600px] rounded-full opacity-40"
      style={{
        top: '-20%', left: '-10%',
        background: 'var(--nightlife-primary)',
        filter: 'blur(120px)',
        animation: 'float 20s infinite ease-in-out alternate',
      }}
    />
    <div
      className="absolute w-[600px] h-[600px] rounded-full opacity-40"
      style={{
        bottom: '-10%', right: '-10%',
        background: 'var(--nightlife-secondary)',
        filter: 'blur(120px)',
        animation: 'float 20s infinite ease-in-out alternate',
        animationDelay: '-5s',
      }}
    />
    <div
      className="absolute w-[400px] h-[400px] rounded-full opacity-30"
      style={{
        top: '40%', left: '40%',
        background: 'rgba(255, 20, 147, 0.3)',
        filter: 'blur(120px)',
        animation: 'float 25s infinite ease-in-out alternate',
      }}
    />
  </div>
);

export default AmbientBackground;
