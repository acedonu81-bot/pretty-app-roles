const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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
  </div>
);

export default AmbientBackground;
