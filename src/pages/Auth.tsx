import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WelcomeScreen from '@/components/WelcomeScreen';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/dashboard', { replace: true });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        navigate('/dashboard', { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth` },
    });
    if (error) { toast.error('Error al conectar con Google'); setGoogleLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) { toast.error('Introduce tu email'); return; }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setForgotLoading(false);
    if (error) { toast.error(error.message); return; }
    setForgotSent(true);
    toast.success('Email enviado — revisa tu bandeja de entrada');
  };

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
        if (error) { recordLoginFailure(); throw error; }
        clearRateLimit();
        toast.success('¡Bienvenido de vuelta!');
        navigate('/dashboard');
      } else {
        if (!displayName.trim()) { toast.error('Introduce tu nombre profesional'); setLoading(false); return; }
        if (!acceptedPrivacy) { toast.error('Debes aceptar la Política de Privacidad'); setLoading(false); return; }
        if (!confirmedAge) { toast.error('Debes confirmar que tienes 14 años o más (LOPDGDD)'); setLoading(false); return; }

        const pwdError = validatePassword(password);
        if (pwdError) { toast.error(pwdError); setLoading(false); return; }

        const safeName = displayName.trim().replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]/g, '').slice(0, 60);
        if (!safeName) { toast.error('El nombre no es válido.'); setLoading(false); return; }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: safeName,
              role: 'pending',
              hourly_rate: 0,
              category: 'pending',
              zone: 'España',
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'CompleteRegistration');

        supabase.functions.invoke('send-email', {
          body: { type: 'welcome', data: { name: displayName, email, role: 'pending' } },
        }).catch((err: unknown) => console.warn('[email] welcome failed:', err));

        setShowWelcome(true);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#252220' }}>
      <Helmet>
        <title>Acceder o Registrarse | XPEAK — Directorio Profesional de Eventos</title>
        <meta name="description" content="Únete a XPEAK gratis. Crea tu perfil profesional como DJ, fotógrafo, staff o empresario y empieza a conectar con el sector de eventos en España." />
        <link rel="canonical" href="https://xpeak.es/auth" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Orbe estático — sin animación */}
      <div className="fixed inset-0 -z-10 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-[420px] max-w-full rounded-2xl p-8 z-10"
          style={{ background: '#1E1C1A', border: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Logo */}
          <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-70 mb-1 w-full text-center">
            <h2 className="text-2xl font-black tracking-widest font-display">
              X<span className="text-gradient">PEAK</span>
            </h2>
          </button>

          {/* Tagline */}
          <p className="text-center text-xs mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {isLogin ? 'Directorio Profesional · España' : 'Publica tu perfil. Consigue trabajo en eventos.'}
          </p>

          {/* Micro-bullets — solo en registro */}
          {!isLogin && (
            <div className="flex flex-col gap-1.5 mb-5 px-1">
              {[
                'Gratis · sin comisiones',
                'Flash Booking — trabajos en menos de 1h',
                'Visible en toda España',
              ].map(text => (
                <p key={text} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <span style={{ color: '#D4AF37' }}>✓</span> {text}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Google */}
            <button type="button" disabled={googleLoading} onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.01] disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              {googleLoading ? <span className="text-xs">Conectando...</span> : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {isLogin ? 'Iniciar sesión con Google' : 'Continuar con Google'}
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>o</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Nombre — solo en registro */}
            {!isLogin && (
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  placeholder="Tu nombre profesional" maxLength={60}
                  className="nightlife-input !py-3 !pl-9 text-sm" autoFocus />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" maxLength={254}
                className="nightlife-input !py-3 !pl-9 text-sm" />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña" maxLength={128}
                className="nightlife-input !py-3 !pl-9 !pr-10 text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Password strength — solo en registro */}
            {!isLogin && password.length > 0 && (
              <div className="px-1 flex gap-4">
                {[
                  { ok: password.length >= 8, label: '8+ chars' },
                  { ok: /[0-9]/.test(password), label: 'Número' },
                  { ok: /[^A-Za-z0-9]/.test(password), label: 'Especial' },
                ].map(({ ok, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className="text-[0.7rem] font-bold" style={{ color: ok ? '#22c55e' : '#444' }}>{ok ? '✓' : '·'}</span>
                    <span className="text-[0.7rem]" style={{ color: ok ? '#22c55e' : '#555' }}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Legal — solo en registro */}
            {!isLogin && (
              <div className="space-y-1.5 px-1">
                <label className="flex items-start gap-2 cursor-pointer text-left">
                  <input type="checkbox" checked={confirmedAge} onChange={e => setConfirmedAge(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded accent-[#D4AF37] flex-shrink-0" />
                  <span className="text-[0.65rem] leading-tight" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Tengo <strong style={{ color: 'rgba(255,255,255,0.6)' }}>14 años o más</strong> (LOPDGDD Art. 7)
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-left">
                  <input type="checkbox" checked={acceptedPrivacy} onChange={e => setAcceptedPrivacy(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded accent-[#D4AF37] flex-shrink-0" />
                  <span className="text-[0.65rem] leading-tight" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Acepto{' '}
                    <Link to="/privacidad" target="_blank" className="underline" style={{ color: 'rgba(212,175,55,0.7)' }}>Privacidad</Link>,{' '}
                    <Link to="/terminos" target="_blank" className="underline" style={{ color: 'rgba(212,175,55,0.7)' }}>Términos</Link>{' '}
                    y{' '}
                    <Link to="/cookies" target="_blank" className="underline" style={{ color: 'rgba(212,175,55,0.7)' }}>Cookies</Link>
                  </span>
                </label>
              </div>
            )}

            {/* CTA */}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear cuenta gratis'}
            </button>

          </form>

          {/* Forgot password */}
          {isLogin && !showForgot && (
            <button type="button" onClick={() => setShowForgot(true)}
              className="block w-full mt-2 text-xs text-center transition-opacity hover:opacity-80"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {showForgot && (
            <div className="mt-3 text-left">
              {forgotSent ? (
                <p className="text-xs text-center" style={{ color: '#22c55e' }}>
                  Email enviado. Revisa tu bandeja de entrada para restablecer la contraseña.
                </p>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-2">
                  <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Introduce tu email y te enviamos un enlace de recuperación.
                  </p>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                      placeholder="tu@email.com" className="nightlife-input !py-2.5 !pl-9 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowForgot(false)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#8E8EA0' }}>
                      Cancelar
                    </button>
                    <button type="submit" disabled={forgotLoading}
                      className="flex-1 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                      style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                      {forgotLoading ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Toggle login / registro */}
          <button onClick={() => { setIsLogin(!isLogin); setShowForgot(false); setForgotSent(false); }}
            className="block w-full mt-4 text-xs text-center transition-colors"
            style={{ color: '#D4AF37' }}>
            {isLogin ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Iniciar sesión'}
          </button>

        </div>
      </div>

      <p className="text-center py-4 text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.15)' }}>
        © {new Date().getFullYear()} XPEAK · Todos los derechos reservados
      </p>

      {showWelcome && (
        <WelcomeScreen
          role="pending"
          displayName={displayName}
          onClose={() => { setShowWelcome(false); navigate('/dashboard'); }}
        />
      )}
    </div>
  );
};

export default Auth;
