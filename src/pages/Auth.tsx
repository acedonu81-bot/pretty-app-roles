import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Music, Users, Smile, Building2, Camera, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AmbientBackground from '@/components/AmbientBackground';
import LegalFooter from '@/components/LegalFooter';
import WelcomeScreen from '@/components/WelcomeScreen';
import { toast } from 'sonner';

const roleGroups = [
  { label: '🎵 Música', roles: [
    { value: 'dj', label: 'DJ / Artista / Productor', icon: Music, minRate: 40 },
  ]},
  { label: '👥 Staff', roles: [
    { value: 'staff', label: 'Personal de Sala', icon: Users, minRate: 20 },
  ]},
  { label: '💄 Imagen', roles: [
    { value: 'makeup', label: 'Maquillaje & Peluquería', icon: Smile, minRate: 30 },
  ]},
  { label: '📸 Media', roles: [
    { value: 'media', label: 'Media & Contenido', icon: Camera, minRate: 30 },
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
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [city, setCity] = useState('');

  const currentRole = roles.find(r => r.value === selectedRole)!;

  // Simple client-side rate limiting for login attempts
  const checkRateLimit = (): boolean => {
    const key = 'xpeak_login_attempts';
    const raw = localStorage.getItem(key);
    const record: { count: number; until: number } = raw ? JSON.parse(raw) : { count: 0, until: 0 };
    if (Date.now() < record.until) {
      const secs = Math.ceil((record.until - Date.now()) / 1000);
      toast.error(`Demasiados intentos. Espera ${secs}s antes de volver a intentarlo.`);
      return false;
    }
    return true;
  };

  const recordLoginFailure = () => {
    const key = 'xpeak_login_attempts';
    const raw = localStorage.getItem(key);
    const record: { count: number; until: number } = raw ? JSON.parse(raw) : { count: 0, until: 0 };
    const count = record.count + 1;
    // Exponential backoff: 3 attempts free, then 15s, 30s, 60s, 120s...
    const backoff = count >= 3 ? Math.min(15 * 2 ** (count - 3), 120) * 1000 : 0;
    localStorage.setItem(key, JSON.stringify({ count, until: Date.now() + backoff }));
  };

  const clearRateLimit = () => localStorage.removeItem('xpeak_login_attempts');

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[0-9]/.test(pwd)) return 'La contraseña debe contener al menos un número.';
    if (!/[^A-Za-z0-9]/.test(pwd)) return 'La contraseña debe contener al menos un carácter especial (!@#$...).';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Completa todos los campos'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        if (!checkRateLimit()) { setLoading(false); return; }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          recordLoginFailure();
          throw error;
        }
        clearRateLimit();
        toast.success('¡Bienvenido de vuelta!');
        navigate('/dashboard');
      } else {
        if (!displayName.trim()) { toast.error('Introduce tu nombre profesional'); setLoading(false); return; }
        if (!acceptedPrivacy) { toast.error('Debes aceptar la Política de Privacidad'); setLoading(false); return; }
        if (!confirmedAge) { toast.error('Debes confirmar que tienes 14 años o más (LOPDGDD)'); setLoading(false); return; }

        const pwdError = validatePassword(password);
        if (pwdError) { toast.error(pwdError); setLoading(false); return; }

        // Sanitize display name — strip HTML tags and control characters
        const safeName = displayName.trim().replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]/g, '').slice(0, 60);
        if (!safeName) { toast.error('El nombre no es válido.'); setLoading(false); return; }

        // Validate minimum rate for non-empresario
        if (selectedRole !== 'empresario') {
          const rate = parseInt(hourlyRate) || 0;
          if (rate < currentRole.minRate) {
            toast.error(`El mínimo para ${currentRole.label} es ${currentRole.minRate}€/hora`);
            setLoading(false);
            return;
          }
        }

        // Sanitize city — strip tags and clamp length
        const safeCity = city.trim().replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]/g, '').slice(0, 80);
        // Clamp hourly_rate to valid range
        const safeRate = selectedRole !== 'empresario'
          ? Math.min(Math.max(parseInt(hourlyRate) || currentRole.minRate, currentRole.minRate), 9999)
          : 0;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: safeName,
              role: selectedRole,
              hourly_rate: safeRate,
              category: isRookie ? 'rookie' : 'pending',
              zone: safeCity ? `${safeCity}, España` : 'España',
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        // Email bienvenida + aviso empresario si aplica
        supabase.functions.invoke('send-email', {
          body: { type: 'welcome', data: { name: displayName, email, role: selectedRole } },
        }).catch((err: unknown) => console.warn('[email] welcome failed:', err));
        if (selectedRole === 'empresario') {
          supabase.functions.invoke('send-email', {
            body: { type: 'empresario_registered', data: { name: displayName, email } },
          }).catch((err: unknown) => console.warn('[email] empresario_registered failed:', err));
          supabase.functions.invoke('send-email', {
            body: { type: 'empresario_pending', data: { name: displayName, email } },
          }).catch((err: unknown) => console.warn('[email] empresario_pending failed:', err));
        }

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
          <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-70 mb-1">
            <h2 className="text-2xl font-bold">
              X<span className="text-gradient">PEAK</span>
            </h2>
          </button>
          <p className="text-muted-foreground mb-6 text-xs">Directorio Profesional · España</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder="Tu nombre artístico o profesional" className="nightlife-input !py-3 !pl-9 text-sm" />
                </div>

                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={city} onChange={e => setCity(e.target.value)}
                    placeholder="Ciudad (ej. Madrid, Barcelona, Ibiza...)" className="nightlife-input !py-3 !pl-9 text-sm" />
                </div>

                {/* Role selector by category */}
                <div className="space-y-2">
                  {roleGroups.map(group => (
                    <div key={group.label}>
                      <p className="text-[0.6rem] font-bold text-muted-foreground mb-1 px-1">{group.label}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {group.roles.map(r => (
                          <button key={r.value} type="button" onClick={() => setSelectedRole(r.value)}
                            className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg text-[0.65rem] sm:text-xs font-bold transition-all leading-tight"
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

            {!isLogin && password.length > 0 && (
              <div className="px-1 space-y-1">
                {[
                  { ok: password.length >= 8, label: 'Mínimo 8 caracteres' },
                  { ok: /[0-9]/.test(password), label: 'Al menos un número' },
                  { ok: /[^A-Za-z0-9]/.test(password), label: 'Al menos un carácter especial' },
                ].map(({ ok, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="text-[0.55rem] font-bold" style={{ color: ok ? '#22c55e' : '#666' }}>
                      {ok ? '✓' : '·'}
                    </span>
                    <span className="text-[0.55rem]" style={{ color: ok ? '#22c55e' : '#666' }}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2 px-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-left">
                  <input type="checkbox" checked={confirmedAge} onChange={e => setConfirmedAge(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded accent-[#D4AF37] flex-shrink-0" />
                  <span className="text-[0.6rem] text-muted-foreground leading-tight">
                    Confirmo que tengo <span className="font-bold" style={{ color: '#D4AF37' }}>14 años o más</span>.
                    {' '}Esta plataforma no está dirigida a menores de 14 años (LOPDGDD Art. 7).
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer text-left">
                  <input type="checkbox" checked={acceptedPrivacy} onChange={e => setAcceptedPrivacy(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded accent-[#D4AF37] flex-shrink-0" />
                  <span className="text-[0.6rem] text-muted-foreground leading-tight">
                    He leído y acepto la{' '}
                    <Link to="/privacidad" target="_blank" className="font-bold underline" style={{ color: '#D4AF37' }}>Política de Privacidad</Link>,{' '}
                    los{' '}
                    <Link to="/terminos" target="_blank" className="font-bold underline" style={{ color: '#D4AF37' }}>Términos y Condiciones</Link>{' '}
                    y la{' '}
                    <Link to="/cookies" target="_blank" className="font-bold underline" style={{ color: '#D4AF37' }}>Política de Cookies</Link>.
                  </span>
                </label>
              </div>
            )}

            <button type="submit" disabled={loading || (!isLogin && (!acceptedPrivacy || !confirmedAge))}
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
