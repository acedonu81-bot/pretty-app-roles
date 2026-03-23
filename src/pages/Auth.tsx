import { useNavigate } from 'react-router-dom';
import AmbientBackground from '@/components/AmbientBackground';

const Auth = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'var(--nightlife-bg)' }}>
      <AmbientBackground />

      <div className="glass-panel w-[400px] max-w-[90%] p-10 text-center z-10">
        <h2 className="text-3xl font-extrabold mb-2">
          NIGHT<span className="text-gradient">LIFE</span>
        </h2>
        <p className="text-muted-foreground mb-8">El ecosistema B2B/P2P Premium de eventos.</p>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg py-4 mb-3 text-sm font-semibold flex items-center justify-center gap-3 bg-white text-black/80 hover:-translate-y-0.5 transition-transform"
        >
          <svg viewBox="0 0 24 24" width="18" fill="currentColor">
            <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
          </svg>
          Acceder con Google
        </button>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg py-4 mb-3 text-sm font-semibold flex items-center justify-center gap-3 bg-black text-white hover:-translate-y-0.5 transition-transform"
          style={{ border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <svg viewBox="0 0 24 24" width="18" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.3-3.74 4.25z" />
          </svg>
          Acceder con Apple
        </button>

        <div className="flex items-center my-6 text-muted-foreground text-xs">
          <div className="flex-1 border-t" style={{ borderColor: 'var(--nightlife-border)' }} />
          <span className="mx-4">o continúa con email</span>
          <div className="flex-1 border-t" style={{ borderColor: 'var(--nightlife-border)' }} />
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg py-4 text-sm font-semibold flex items-center justify-center gap-3 bg-transparent text-white hover:-translate-y-0.5 transition-transform"
          style={{ border: '1px solid var(--nightlife-border)' }}
        >
          <svg viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Acceder con Email
        </button>
      </div>
    </div>
  );
};

export default Auth;
