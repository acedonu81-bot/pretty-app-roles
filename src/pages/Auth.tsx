import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User, Eye, EyeOff, Zap, ShieldCheck, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WelcomeScreen from '@/components/WelcomeScreen';
import { toast } from 'sonner';

const ROLE_CONTENT: Record<string, { tagline: string; sub: string; bullets: { icon: string; text: string }[] }> = {
  dj: {
    tagline: 'El directorio donde te contratan los mejores eventos.',
    sub: 'DJs de toda España ya publican su tarifa y consiguen bolos en horas.',
    bullets: [
      { icon: '⚡', text: 'Flash Booking — oferta en menos de 1h' },
      { icon: '📄', text: 'Contratos digitales automáticos' },
      { icon: '🇪🇸', text: 'Visible para salas de toda España' },
    ],
  },
  staff: {
    tagline: 'Consigue trabajo de staff y camarero en eventos reales.',
    sub: 'Empresarios verificados buscan profesionales como tú cada semana.',
    bullets: [
      { icon: '⚡', text: 'Ofertas de trabajo en tiempo real' },
      { icon: '📄', text: 'Contratos digitales sin papeleo' },
      { icon: '✅', text: 'Perfil verificado, más confianza' },
    ],
  },
  profesional: {
    tagline: 'El directorio de referencia para profesionales de eventos.',
    sub: 'Crea tu perfil, publica tu tarifa y empieza a recibir solicitudes.',
    bullets: [
      { icon: '⚡', text: 'Flash Booking — trabajos en menos de 1h' },
      { icon: '📄', text: 'Contratos automáticos con PDF' },
      { icon: '🇪🇸', text: 'Visible para salas y promotoras de España' },
    ],
  },
  empresario: {
    tagline: 'Contrata talento verificado sin comisiones.',
    sub: 'Flash Booking: profesional disponible en menos de 1 hora.',
    bullets: [
      { icon: '⚡', text: 'Respuesta de profesional en 1h' },
      { icon: '📄', text: 'Contrato automático — sin papeleo' },
      { icon: '✅', text: 'DJs, fotógrafos y staff verificados' },
    ],
  },
};

const DEFAULT_CONTENT = {
  tagline: 'El directorio de referencia para profesionales de eventos.',
  sub: 'Publica tu perfil, consigue trabajo. Gratis, sin comisiones.',
  bullets: [
    { icon: '⚡', text: 'Flash Booking — trabajos en menos de 1h' },
    { icon: '💰', text: '0% comisión — cobras todo lo tuyo' },
    { icon: '🇪🇸', text: 'Visible en toda España' },
  ],
};

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') ?? '';
  const modeParam = searchParams.get('mode') ?? '';
  const content = ROLE_CONTENT[roleParam] ?? DEFAULT_CONTENT;

  const [isLogin, setIsLogin] = useState(modeParam !== 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
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
        if (!legalAccepted) { toast.error('Acepta los términos para continuar'); setLoading(false); return; }

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

        // Early adopter: primeros 20 usuarios reales reciben email automático
        supabase.from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .then(({ count }) => {
            if (typeof count === 'number' && count <= 20) {
              supabase.functions.invoke('send-email', {
                body: { type: 'early_adopter', data: { name: displayName, email } },
              }).catch((err: unknown) => console.warn('[email] early_adopter failed:', err));
            }
          });

        setShowWelcome(true);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = !isLogin && password.length > 0 ? [
    { ok: password.length >= 8, label: '8+ chars' },
    { ok: /[0-9]/.test(password), label: 'Número' },
    { ok: /[^A-Za-z0-9]/.test(password), label: 'Especial' },
  ] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0908' }}>
      <Helmet>
        <title>Acceder o Registrarse | XPEAK — Directorio Profesional de Eventos</title>
        <meta name="description" content="Únete a XPEAK gratis. Crea tu perfil profesional como DJ, fotógrafo, staff o empresario y empieza a conectar con el sector de eventos en España." />
        <link rel="canonical" href="https://xpeak.es/auth" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Ambient glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">

          {/* === SPLIT LAYOUT === */}
          <div className="flex flex-col md:flex-row md:rounded-2xl md:overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>

            {/* LEFT — Value prop (desktop only) */}
            <div className="hidden md:flex md:flex-col md:justify-between md:w-[42%] md:p-10 md:border-r"
              style={{ background: 'rgba(212,175,55,0.03)', borderColor: 'rgba(255,255,255,0.05)' }}>

              {/* Logo */}
              <div>
                <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-70 mb-8">
                  <h2 className="text-2xl font-black tracking-tight font-display text-left">
                    X<span className="text-gradient">PEAK</span>
                  </h2>
                </button>

                <h1 className="text-xl font-black leading-snug mb-3" style={{ color: '#fff' }}>
                  {content.tagline}
                </h1>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {content.sub}
                </p>

                <div className="space-y-3">
                  {content.bullets.map(b => (
                    <div key={b.text} className="flex items-center gap-3">
                      <span className="text-base w-6 text-center">{b.icon}</span>
                      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{b.text}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">💸</span>
                    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Gratis · 0% comisión</span>
                  </div>
                </div>
              </div>

              {/* Social proof bottom */}
              <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    {['L','S','M','C'].map((l,i) => (
                      <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-black border-2"
                        style={{ background: `hsl(${i*40+20},60%,30%)`, borderColor: '#1a1612', color: '#fff' }}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <strong className="text-white">31+ profesionales</strong> ya en la plataforma
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#D4AF37', fontSize: '0.7rem' }}>★</span>)}
                  <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Directorio de referencia en España</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="flex-1 p-6 sm:p-8 md:p-10">

              {/* Mobile logo */}
              <div className="flex flex-col items-center mb-6 md:hidden">
                <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-70 mb-1">
                  <h2 className="text-2xl font-black tracking-tight font-display">
                    X<span className="text-gradient">PEAK</span>
                  </h2>
                </button>
                {/* Mobile bullets */}
                {!isLogin && (
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
                    {content.bullets.map(b => (
                      <span key={b.text} className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        <span style={{ color: '#D4AF37' }}>✓</span> {b.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h3 className="text-lg font-black mb-1" style={{ color: '#fff' }}>
                  {isLogin ? 'Accede a XPEAK' : 'Crear cuenta gratis'}
                </h3>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {isLogin
                    ? '¿Primera vez? → Pulsa "Crear cuenta gratis" abajo.'
                    : 'Solo 30 segundos · Sin tarjeta de crédito · 0% comisión'}
                </p>
              </div>

              {/* === GOOGLE — primary CTA === */}
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.01] disabled:opacity-50 mb-4"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(212,175,55,0.08)',
                }}>
                {googleLoading ? (
                  <span className="text-xs">Conectando...</span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {isLogin ? 'Iniciar sesión con Google' : 'Continuar con Google'}
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>o con email</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Nombre — solo en registro */}
                {!isLogin && (
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder={roleParam === 'dj' ? 'DJ NombreArtístico' : 'Tu nombre profesional'}
                      maxLength={60}
                      className="nightlife-input !py-3 !pl-9 text-sm"
                      autoFocus
                    />
                  </div>
                )}

                {/* Email */}
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    maxLength={254}
                    className="nightlife-input !py-3 !pl-9 text-sm"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    maxLength={128}
                    className="nightlife-input !py-3 !pl-9 !pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Password strength */}
                {passwordStrength && (
                  <div className="flex gap-3 px-1">
                    {passwordStrength.map(({ ok, label }) => (
                      <div key={label} className="flex items-center gap-1">
                        <span className="text-[0.7rem] font-bold" style={{ color: ok ? '#22c55e' : '#444' }}>{ok ? '✓' : '·'}</span>
                        <span className="text-[0.7rem]" style={{ color: ok ? '#22c55e' : '#555' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legal consolidado — solo en registro */}
                {!isLogin && (
                  <label className="flex items-start gap-2.5 cursor-pointer px-1 py-1">
                    <input
                      type="checkbox"
                      checked={legalAccepted}
                      onChange={e => setLegalAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#D4AF37] flex-shrink-0"
                    />
                    <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      Tengo 14+ años y acepto la{' '}
                      <Link to="/privacidad" target="_blank" className="underline" style={{ color: 'rgba(212,175,55,0.85)' }}>Privacidad</Link>,{' '}
                      <Link to="/terminos" target="_blank" className="underline" style={{ color: 'rgba(212,175,55,0.85)' }}>Términos</Link>{' '}
                      y{' '}
                      <Link to="/cookies" target="_blank" className="underline" style={{ color: 'rgba(212,175,55,0.85)' }}>Cookies</Link>
                    </span>
                  </label>
                )}

                {/* CTA principal */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  {loading
                    ? 'Procesando...'
                    : isLogin
                      ? 'Iniciar Sesión'
                      : 'Publicar mi perfil gratis →'}
                </button>

              </form>

              {/* Forgot password */}
              {isLogin && !showForgot && (
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="block w-full mt-3 text-xs text-center transition-opacity hover:opacity-80"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  ¿Olvidaste tu contraseña?
                </button>
              )}

              {showForgot && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {forgotSent ? (
                    <p className="text-xs text-center" style={{ color: '#22c55e' }}>
                      ✓ Email enviado. Revisa tu bandeja de entrada para restablecer la contraseña.
                    </p>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-2">
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
              <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {isLogin ? '¿Nuevo en XPEAK?' : '¿Ya tienes cuenta?'}
                </span>
                <button
                  onClick={() => { setIsLogin(!isLogin); setShowForgot(false); setForgotSent(false); }}
                  className="text-xs font-bold transition-opacity hover:opacity-80"
                  style={{ color: '#D4AF37' }}>
                  {isLogin ? 'Crear cuenta gratis →' : 'Iniciar sesión →'}
                </button>
              </div>

              {/* Trust signals */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <span className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.25)' }}>Datos seguros</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <span className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.25)' }}>Sin spam</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <span className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.25)' }}>31+ profesionales</span>
                </div>
              </div>

            </div>
          </div>

          <p className="text-center mt-6 text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.12)' }}>
            © {new Date().getFullYear()} XPEAK · Todos los derechos reservados
          </p>
        </div>
      </div>

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
