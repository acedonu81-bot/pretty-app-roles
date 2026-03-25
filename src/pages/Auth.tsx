import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';

const Auth = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: 'var(--nightlife-bg)' }}>
      <AmbientBackground />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="glass-panel w-[440px] max-w-full p-10 text-center z-10">
          <h2 className="text-3xl font-extrabold mb-2">
            NIGHT<span className="text-gradient">LIFE</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">Directorio Profesional de Ocio Nocturno</p>

          {/* Photo upload */}
          <label className="mx-auto w-24 h-24 rounded-full flex items-center justify-center cursor-pointer mb-6 overflow-hidden transition-all hover:scale-105" style={{
            background: photo ? 'transparent' : 'rgba(255,255,255,0.05)',
            border: `2px dashed ${photo ? 'var(--nightlife-primary)' : 'var(--nightlife-border)'}`,
          }}>
            {photo ? (
              <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera size={24} className="text-muted-foreground" />
                <span className="text-[0.6rem] text-muted-foreground">Foto</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </label>

          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tu nombre artístico o profesional"
            className="nightlife-input !py-4 mb-3 text-sm"
          />
          <input
            value={contact}
            onChange={e => setContact(e.target.value)}
            placeholder="Email o teléfono de contacto"
            className="nightlife-input !py-4 mb-6 text-sm"
          />

          <button
            onClick={handleRegister}
            className="w-full py-4 rounded-2xl font-extrabold text-base transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)), #6b21ff)',
              color: 'white',
              boxShadow: '0 0 25px hsla(var(--primary) / 0.5)',
            }}
          >
            Entrar al Directorio
          </button>

          <div className="flex items-center my-6 text-muted-foreground text-xs">
            <div className="flex-1 border-t" style={{ borderColor: 'var(--nightlife-border)' }} />
            <span className="mx-4">o accede rápido con</span>
            <div className="flex-1 border-t" style={{ borderColor: 'var(--nightlife-border)' }} />
          </div>

          <div className="flex gap-3">
            <button onClick={handleRegister} className="flex-1 rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2 bg-white text-black/80 hover:-translate-y-0.5 transition-transform">
              <svg viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" /></svg>
              Google
            </button>
            <button onClick={handleRegister} className="flex-1 rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2 bg-black text-white hover:-translate-y-0.5 transition-transform" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
              <svg viewBox="0 0 24 24" width="18" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.3-3.74 4.25z" /></svg>
              Apple
            </button>
          </div>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
};

export default Auth;
