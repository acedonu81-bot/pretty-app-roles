import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Music, Users, Palette, Building2, Camera, Brush, Flag, Shirt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';
import WelcomeScreen from '@/components/WelcomeScreen';
import { toast } from 'sonner';

const roleGroups = [
  { label: '🎵 Música', roles: [
    { value: 'dj', label: 'DJ', icon: Music, minRate: 40 },
  ]},
  { label: '👥 Staff', roles: [
    { value: 'staff', label: 'Personal de Sala', icon: Users, minRate: 20 },
  ]},
  { label: '💄 Imagen', roles: [
    { value: 'makeup', label: 'Maquillaje & Peluquería', icon: Palette, minRate: 30 },
    { value: 'vestuario', label: 'Vestuario & Moda', icon: Shirt, minRate: 30 },
  ]},
  { label: '📸 Media & Diseño', roles: [
    { value: 'media', label: 'Media & Contenido', icon: Camera, minRate: 30 },
    { value: 'design', label: 'Diseño & Visuales', icon: Brush, minRate: 30 },
    { value: 'ambassador', label: 'Promoción', icon: Flag, minRate: 15 },
  ]},
  { label: '🏢 Empresa', roles: [
    { value: 'empresario', label: 'Empresario', icon: Building2, minRate: 0 },
  ]},
];

const roles = roleGroups.flatMap(g => g.roles);

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState('dj');
  const [hourlyRate, setHourlyRate] = useState('');
  const [isRookie, setIsRookie] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const currentRole = roles.find(r => r.value === selectedRole)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Completa todos los campos'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('¡Bienvenido de vuelta!');
        navigate('/dashboard');
      } else {
        if (!displayName.trim()) { toast.error('Introduce tu nombre profesional'); setLoading(false); return; }
        if (!acceptedPrivacy) { toast.error('Debes aceptar la Política de Privacidad'); setLoading(false); return; }

        // Validate minimum rate for non-empresario
        if (selectedRole !== 'empresario') {
          const rate = parseInt(hourlyRate) || 0;
          if (rate < currentRole.minRate) {
            toast.error(`El mínimo para ${currentRole.label} es ${currentRole.minRate}€/hora`);
            setLoading(false);
            return;
          }
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              role: selectedRole,
              hourly_rate: selectedRole !== 'empresario' ? parseInt(hourlyRate) || currentRole.minRate : 0,
              category: isRookie ? 'rookie' : 'pending',
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        setShowWelcome(true);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#000' }}>
      <AmbientBackground />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="glass-panel w-[460px] max-w-full p-8 text-center z-10">
          <h2 className="text-2xl font-bold mb-1">
            X<span className="text-gradient">PEAK</span>
          </h2>
          <p className="text-muted-foreground mb-6 text-xs">Directorio Profesional · Madrid</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder="Tu nombre artístico o profesional" className="nightlife-input !py-3 !pl-9 text-sm" />
                </div>

                {/* Role selector by category */}
                <div className="space-y-2">
                  {roleGroups.map(group => (
                    <div key={group.label}>
                      <p className="text-[0.6rem] font-bold text-muted-foreground mb-1 px-1">{group.label}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {group.roles.map(r => (
                          <button key={r.value} type="button" onClick={() => setSelectedRole(r.value)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                            style={{
                              background: selectedRole === r.value ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${selectedRole === r.value ? 'rgba(212,175,55,0.4)' : 'var(--nightlife-border)'}`,
                              color: selectedRole === r.value ? '#D4AF37' : '#8E8EA0',
                            }}>
                            <r.icon size={14} /> {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hourly rate for non-empresario */}
                {selectedRole !== 'empresario' && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                    <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
                      placeholder={`Tarifa por hora (mín. ${currentRole.minRate}€)`}
                      min={currentRole.minRate} className="nightlife-input !py-3 !pl-8 text-sm" />
                  </div>
                )}

                {/* Rookie toggle */}
                {selectedRole !== 'empresario' && (
                  <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: isRookie ? 'rgba(255,188,0,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isRookie ? 'rgba(255,188,0,0.3)' : 'var(--nightlife-border)'}`,
                    }}>
                    <input type="checkbox" checked={isRookie} onChange={e => setIsRookie(e.target.checked)} className="hidden" />
                    <div className="w-4 h-4 rounded border flex items-center justify-center"
                      style={{ borderColor: isRookie ? '#ffbc00' : '#555', background: isRookie ? '#ffbc00' : 'transparent' }}>
                      {isRookie && <span className="text-[0.5rem] text-black font-bold">✓</span>}
                    </div>
                    <div className="text-left">
                     <span className="text-xs font-bold" style={{ color: isRookie ? '#ffbc00' : '#8E8EA0' }}>Soy Promesa</span>
                      <p className="text-[0.55rem] text-muted-foreground">Necesitarás 500 apoyos de la comunidad para ascender a Profesional</p>
                    </div>
                  </label>
                )}

                {selectedRole === 'empresario' && (
                  <div className="px-3 py-2.5 rounded-lg text-left" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <p className="text-[0.6rem]" style={{ color: '#D4AF37' }}>
                      ⚡ Las cuentas de empresario requieren aprobación del administrador. Recibirás un email de confirmación.
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email" className="nightlife-input !py-3 !pl-9 text-sm" />
            </div>

            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña" className="nightlife-input !py-3 !pl-9 !pr-10 text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {!isLogin && (
              <label className="flex items-start gap-2.5 px-1 cursor-pointer text-left">
                <input type="checkbox" checked={acceptedPrivacy} onChange={e => setAcceptedPrivacy(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded accent-[#D4AF37]" />
                <span className="text-[0.6rem] text-muted-foreground leading-tight">
                  He leído y acepto la{' '}
                  <Link to="/privacidad" target="_blank" className="font-bold underline" style={{ color: '#D4AF37' }}>
                    Política de Privacidad
                  </Link>{' '}
                  y los Términos y Condiciones.
                </span>
              </label>
            )}

            <button type="submit" disabled={loading || (!isLogin && !acceptedPrivacy)}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-xs transition-colors" style={{ color: '#D4AF37' }}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>

      <LegalFooter />

      {showWelcome && (
        <WelcomeScreen
          role={selectedRole}
          displayName={displayName}
          onClose={() => { setShowWelcome(false); navigate('/dashboard'); }}
        />
      )}
    </div>
  );
};

export default Auth;
