import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User, Eye, EyeOff, Music, Users, Smile, Building2, Camera, MonitorPlay, ArrowLeft, ArrowRight, CalendarCheck, UtensilsCrossed, ChefHat, Megaphone } from 'lucide-react';
import NightlifeSelect from '@/components/ui/NightlifeSelect';
import { supabase } from '@/integrations/supabase/client';
import AmbientBackground from '@/components/AmbientBackground';
import WelcomeScreen from '@/components/WelcomeScreen';
import RolePreviewModal from '@/components/RolePreviewModal';
import { toast } from 'sonner';

const roleGroups = [
  { label: 'Música', roles: [
    { value: 'dj', label: 'DJ & Artista', icon: Music, minRate: 40, desc: 'Sesiones, directos, Flash Booking' },
  ]},
  { label: 'Staff', roles: [
    { value: 'staff', label: 'Staff de Sala', icon: Users, minRate: 20, desc: 'Relaciones públicas, seguridad, recepción' },
    { value: 'event_manager', label: 'Jefa de Eventos', icon: CalendarCheck, minRate: 25, desc: 'Coordinación y producción de eventos' },
    { value: 'promotor', label: 'Promotor', icon: Megaphone, minRate: 20, desc: 'Marketing nocturno y redes sociales' },
  ]},
  { label: 'Hostelería', roles: [
    { value: 'camarero', label: 'Camarero', icon: UtensilsCrossed, minRate: 15, desc: 'Barra, sala, servicio en eventos' },
    { value: 'catering', label: 'Catering', icon: ChefHat, minRate: 25, desc: 'Gastronomía y servicio de banquetes' },
  ]},
  { label: 'Imagen', roles: [
    { value: 'makeup', label: 'Maquillaje', icon: Smile, minRate: 30, desc: 'Maquillaje nupcial y artístico' },
  ]},
  { label: 'Media', roles: [
    { value: 'media', label: 'Foto & Vídeo', icon: Camera, minRate: 30, desc: 'Fotografía y videografía de eventos' },
  ]},
  { label: 'Empresa', roles: [
    { value: 'empresario', label: 'Empresario / Sala', icon: Building2, minRate: 0, desc: 'Contrata profesionales para tu negocio' },
  ]},
];

const roles = roleGroups.flatMap(g => g.roles);

const SPAIN_CITIES = [
  'Madrid','Barcelona','Valencia','Sevilla','Zaragoza','Málaga','Murcia',
  'Palma de Mallorca','Alicante','Bilbao','Valladolid','Córdoba','Vigo',
  'Gijón','Granada','A Coruña','Vitoria-Gasteiz','San Sebastián','Oviedo',
  'Las Palmas de Gran Canaria','Santa Cruz de Tenerife','Badalona','Cartagena',
  'Sabadell','Móstoles','Elche','Hospitalet de Llobregat','Terrassa','Jerez de la Frontera',
  'Burgos','Santander','Almería','Alcalá de Henares','Pamplona','Salamanca','Ibiza',
  'Marbella','León','Albacete','Logroño','Huelva','Tarragona','Lleida','Badajoz',
  'Jaén','Cádiz','Toledo','Torrevieja','Fuenlabrada','Alcorcón','Leganés',
  'Getafe','Dos Hermanas','Parla','Mataró','Torrejón de Ardoz','Alcobendas',
];

const SPAIN_CITY_OPTIONS = SPAIN_CITIES.map(c => ({ value: c, label: c }));


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
  const [showRolePreview, setShowRolePreview] = useState(false);
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // Handle OAuth callback — if user arrives back from Google, navigate to dashboard
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

  const currentRole = roles.find(r => r.value === selectedRole)!;

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
  };;

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

        if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'CompleteRegistration');

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

  const handleStep1Continue = () => {
    if (!email || !password) { toast.error('Introduce email y contraseña'); return; }
    const pwdError = validatePassword(password);
    if (pwdError) { toast.error(pwdError); return; }
    if (!confirmedAge) { toast.error('Debes confirmar que tienes 14 años o más'); return; }
    if (!acceptedPrivacy) { toast.error('Acepta la Política de Privacidad para continuar'); return; }
    setRegisterStep(2);
  };

  const handleStep2Continue = () => {
    if (!displayName.trim()) { toast.error('Introduce tu nombre profesional'); return; }
    setRegisterStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col relative grain-overlay" style={{ background: '#060606' }}>
      <Helmet>
        <title>Acceder o Registrarse | XPEAK — Directorio Profesional de Eventos</title>
        <meta name="description" content="Únete a XPEAK gratis. Crea tu perfil profesional como DJ, fotógrafo, staff o empresario y empieza a conectar con el sector de eventos en España." />
        <link rel="canonical" href="https://xpeak.es/auth" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <AmbientBackground />
      {/* Extra mid orb — fills the card area with subtle warmth */}
      <div className="fixed inset-0 -z-10 pointer-events-none flex items-center justify-center">
        <div className="w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-[10vh] pb-16">
        <div className="glass-panel w-[460px] max-w-full p-8 text-center z-10">
          <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-70 mb-1">
            <h2 className="text-2xl font-black tracking-widest font-display">
              X<span className="text-gradient">PEAK</span>
            </h2>
          </button>
          <p className="text-muted-foreground mb-6 text-xs">Directorio Profesional · España</p>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* ── LOGIN ─────────────────────────────────────── */}
            {isLogin && (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <span className="text-xs text-muted-foreground">Accede con tu email</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com" maxLength={254}
                    className="nightlife-input !py-3 !pl-9 text-sm" />
                </div>
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
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  {loading ? 'Procesando...' : 'Iniciar Sesión'}
                </button>
              </>
            )}

            {/* ── REGISTER STEP 1: credenciales ─────────────── */}
            {!isLogin && registerStep === 1 && (
              <>
                {/* Step indicator 3 pasos */}
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  {[
                    { n: 1, label: 'Cuenta', active: true },
                    { n: 2, label: 'Tu rol' },
                    { n: 3, label: 'Ubicación' },
                  ].map((s, i, arr) => (
                    <div key={s.n} className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="w-5 h-5 rounded-full text-[0.65rem] font-black flex items-center justify-center"
                          style={{
                            background: s.active ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(255,255,255,0.06)',
                            color: s.active ? '#000' : '#444',
                          }}>{s.n}</span>
                        <span className="text-[0.65rem] font-bold hidden sm:block"
                          style={{ color: s.active ? '#D4AF37' : '#444' }}>{s.label}</span>
                      </div>
                      {i < arr.length - 1 && <div className="w-5 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
                    </div>
                  ))}
                </div>

                <button type="button" disabled
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold opacity-30 cursor-not-allowed"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google — Próximamente
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <span className="text-xs text-muted-foreground">o</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com" maxLength={254}
                    className="nightlife-input !py-3 !pl-9 text-sm" />
                </div>
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
                {password.length > 0 && (
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
                <div className="space-y-2 px-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-left">
                    <input type="checkbox" checked={confirmedAge} onChange={e => setConfirmedAge(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded accent-[#D4AF37] flex-shrink-0" />
                    <span className="text-xs text-muted-foreground leading-tight">
                      Tengo <span className="font-bold" style={{ color: '#D4AF37' }}>14 años o más</span> (LOPDGDD Art. 7).
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer text-left">
                    <input type="checkbox" checked={acceptedPrivacy} onChange={e => setAcceptedPrivacy(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded accent-[#D4AF37] flex-shrink-0" />
                    <span className="text-xs text-muted-foreground leading-tight">
                      Acepto{' '}
                      <Link to="/privacidad" target="_blank" className="font-bold underline" style={{ color: '#D4AF37' }}>Privacidad</Link>,{' '}
                      <Link to="/terminos" target="_blank" className="font-bold underline" style={{ color: '#D4AF37' }}>Términos</Link>{' '}
                      y{' '}
                      <Link to="/cookies" target="_blank" className="font-bold underline" style={{ color: '#D4AF37' }}>Cookies</Link>.
                    </span>
                  </label>
                </div>
                <button type="button" onClick={handleStep1Continue}
                  className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  Continuar <ArrowRight size={15} />
                </button>
              </>
            )}

            {/* ── REGISTER STEP 2: nombre + rol ─────────────── */}
            {!isLogin && registerStep === 2 && (
              <>
                {/* Step indicator 3 pasos */}
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  {[
                    { n: 1, label: 'Cuenta', done: true },
                    { n: 2, label: 'Tu rol', done: false, active: true },
                    { n: 3, label: 'Ubicación', done: false, active: false },
                  ].map((s, i, arr) => (
                    <div key={s.n} className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="w-5 h-5 rounded-full text-[0.65rem] font-black flex items-center justify-center"
                          style={{
                            background: s.done ? 'rgba(34,197,94,0.15)' : s.active ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(255,255,255,0.06)',
                            color: s.done ? '#22c55e' : s.active ? '#000' : '#444',
                            border: s.done ? '1px solid rgba(34,197,94,0.3)' : 'none',
                          }}>{s.done ? '✓' : s.n}</span>
                        <span className="text-[0.65rem] font-bold hidden sm:block"
                          style={{ color: s.done ? '#22c55e' : s.active ? '#D4AF37' : '#444' }}>{s.label}</span>
                      </div>
                      {i < arr.length - 1 && <div className="w-5 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
                    </div>
                  ))}
                </div>

                {/* Back + email preview */}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setRegisterStep(1)}
                    className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
                    style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <ArrowLeft size={13} /> Volver
                  </button>
                  <span className="ml-auto text-[0.7rem] font-mono px-2 py-0.5 rounded truncate max-w-[180px]"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {email}
                  </span>
                </div>

                {/* Nombre */}
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder="Nombre artístico o profesional" maxLength={60}
                    className="nightlife-input !py-3 !pl-9 text-sm" autoFocus />
                </div>

                {/* Role grid — 2 columnas, cards con descripción */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2 px-0.5">¿Cuál es tu rol principal?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.filter(r => r.value !== 'empresario').map(r => (
                      <button key={r.value} type="button" onClick={() => setSelectedRole(r.value)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                        style={{
                          background: selectedRole === r.value ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${selectedRole === r.value ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.07)'}`,
                          boxShadow: selectedRole === r.value ? '0 0 14px rgba(212,175,55,0.08)' : 'none',
                        }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: selectedRole === r.value ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)' }}>
                          <r.icon size={14} style={{ color: selectedRole === r.value ? '#D4AF37' : '#8E8EA0' }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-tight truncate"
                            style={{ color: selectedRole === r.value ? '#D4AF37' : 'rgba(255,255,255,0.8)' }}>{r.label}</p>
                          <p className="text-[0.65rem] leading-tight mt-0.5 truncate"
                            style={{ color: selectedRole === r.value ? 'rgba(212,175,55,0.65)' : '#555' }}>{(r as any).desc}</p>
                        </div>
                      </button>
                    ))}
                    {/* Empresario — ancho completo */}
                    {(() => {
                      const emp = roles.find(r => r.value === 'empresario')!;
                      return (
                        <button type="button" onClick={() => setSelectedRole('empresario')}
                          className="col-span-2 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                          style={{
                            background: selectedRole === 'empresario' ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${selectedRole === 'empresario' ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.07)'}`,
                            boxShadow: selectedRole === 'empresario' ? '0 0 14px rgba(212,175,55,0.08)' : 'none',
                          }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: selectedRole === 'empresario' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)' }}>
                            <Building2 size={14} style={{ color: selectedRole === 'empresario' ? '#D4AF37' : '#8E8EA0' }} />
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight"
                              style={{ color: selectedRole === 'empresario' ? '#D4AF37' : 'rgba(255,255,255,0.8)' }}>Empresario / Sala</p>
                            <p className="text-[0.65rem]" style={{ color: '#555' }}>Contrata profesionales para tu negocio — siempre gratis</p>
                          </div>
                        </button>
                      );
                    })()}
                  </div>
                  <button type="button" onClick={() => setShowRolePreview(true)}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all hover:scale-[1.01]"
                    style={{ color: 'rgba(212,175,55,0.5)' }}>
                    <MonitorPlay size={11} /> Ver ejemplo de dashboard
                  </button>
                </div>

                <button type="button" onClick={handleStep2Continue}
                  className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  Continuar <ArrowRight size={15} />
                </button>
              </>
            )}

            {/* ── REGISTER STEP 3: ciudad + tarifa ──────────── */}
            {!isLogin && registerStep === 3 && (
              <>
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  {[
                    { n: 1, label: 'Cuenta', done: true },
                    { n: 2, label: 'Tu rol', done: true },
                    { n: 3, label: 'Ubicación', done: false, active: true },
                  ].map((s, i, arr) => (
                    <div key={s.n} className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="w-5 h-5 rounded-full text-[0.65rem] font-black flex items-center justify-center"
                          style={{
                            background: s.done ? 'rgba(34,197,94,0.15)' : s.active ? 'linear-gradient(90deg,#D4AF37,#B8941E)' : 'rgba(255,255,255,0.06)',
                            color: s.done ? '#22c55e' : s.active ? '#000' : '#444',
                            border: s.done ? '1px solid rgba(34,197,94,0.3)' : 'none',
                          }}>{s.done ? '✓' : s.n}</span>
                        <span className="text-[0.65rem] font-bold hidden sm:block"
                          style={{ color: s.done ? '#22c55e' : s.active ? '#D4AF37' : '#444' }}>{s.label}</span>
                      </div>
                      {i < arr.length - 1 && <div className="w-5 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
                    </div>
                  ))}
                </div>

                <button type="button" onClick={() => setRegisterStep(2)}
                  className="flex items-center gap-1 text-xs self-start transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <ArrowLeft size={13} /> Volver
                </button>

                {/* Resumen rol elegido */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {(() => { const r = roles.find(x => x.value === selectedRole)!; return <r.icon size={15} style={{ color: '#D4AF37', flexShrink: 0 }} />; })()}
                  <div>
                    <p className="text-xs font-bold" style={{ color: '#D4AF37' }}>{roles.find(r => r.value === selectedRole)?.label}</p>
                    <p className="text-[0.65rem] text-muted-foreground">{displayName}</p>
                  </div>
                </div>

                {/* Ciudad */}
                <NightlifeSelect
                  options={SPAIN_CITY_OPTIONS}
                  value={city ? { value: city, label: city } : null}
                  onChange={opt => setCity(opt?.value ?? '')}
                  placeholder="¿En qué ciudad trabajas principalmente?"
                />

                {/* Tarifa */}
                {selectedRole !== 'empresario' && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">€</span>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={e => setHourlyRate(e.target.value)}
                      placeholder={`Tarifa por hora (mín. €${currentRole.minRate})`}
                      min={currentRole.minRate}
                      max={9999}
                      className="nightlife-input !py-3 !pl-7 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/h</span>
                  </div>
                )}

                {selectedRole === 'empresario' && (
                  <div className="px-3 py-2.5 rounded-xl text-left" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(212,175,55,0.8)' }}>
                      Las cuentas de empresario requieren revisión. Recibirás confirmación por email en menos de 24h.
                    </p>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  {loading ? 'Creando cuenta...' : <><span>Crear mi cuenta gratis</span> <ArrowRight size={15} /></>}
                </button>
                <button type="submit" disabled={loading}
                  className="text-xs text-center transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onClick={() => { setCity(''); setHourlyRate(''); }}>
                  Saltar — configurar después →
                </button>
              </>
            )}
          </form>

          {isLogin && !showForgot && (
            <button type="button" onClick={() => setShowForgot(true)}
              className="block w-full mt-2 text-xs transition-colors hover:opacity-80 text-center"
              style={{ color: 'rgba(255,255,255,0.35)' }}>
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {showForgot && (
            <div className="mt-3 text-left animate-[fadeIn_0.3s_ease]">
              {forgotSent ? (
                <p className="text-xs text-center" style={{ color: '#22c55e' }}>
                  Email enviado. Revisa tu bandeja de entrada para restablecer la contraseña.
                </p>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">Introduce tu email y te enviamos un enlace de recuperación.</p>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                      placeholder="tu@email.com" className="nightlife-input !py-2.5 !pl-9 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowForgot(false)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--nightlife-border)', color: '#8E8EA0' }}>
                      Cancelar
                    </button>
                    <button type="submit" disabled={forgotLoading}
                      className="flex-1 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                      style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                      {forgotLoading ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <button onClick={() => { setIsLogin(!isLogin); setShowForgot(false); setForgotSent(false); }}
            className="block w-full mt-4 text-xs transition-colors text-center" style={{ color: '#D4AF37' }}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>

      <p className="text-center py-4 text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.18)' }}>
        © {new Date().getFullYear()} XPEAK · Todos los derechos reservados
      </p>

      {showWelcome && (
        <WelcomeScreen
          role={selectedRole}
          displayName={displayName}
          onClose={() => { setShowWelcome(false); navigate('/dashboard'); }}
        />
      )}

      {showRolePreview && (
        <RolePreviewModal
          initialRole={selectedRole}
          onClose={() => setShowRolePreview(false)}
        />
      )}
    </div>
  );
};

export default Auth;
