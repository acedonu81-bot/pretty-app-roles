import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User, Eye, EyeOff, Zap, ShieldCheck, Users, FileText, MapPin, Target, BadgeCheck, Search, Wallet, type LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { track, trackLead } from '@/lib/track';
import TurnstileWidget from '@/components/TurnstileWidget';

const ROLE_CONTENT: Record<string, { tagline: string; sub: string; bullets: { icon: LucideIcon; text: string }[] }> = {
  dj: {
    tagline: 'Publica tu tarifa y que te encuentren salas y promotoras.',
    sub: 'Crea tu perfil gratis y aparece cuando busquen un DJ en tu zona.',
    bullets: [
      { icon: Target, text: 'Tu perfil visible en Google y en el directorio' },
      { icon: FileText, text: 'Contratos digitales automáticos' },
      { icon: Wallet, text: '0% comisión — cobras todo lo tuyo' },
    ],
  },
  staff: {
    tagline: 'Consigue trabajo de camarero en eventos reales.',
    sub: 'Salas y organizadores buscan profesionales como tú cada semana.',
    bullets: [
      { icon: Target, text: 'Tu perfil visible para empresarios de tu zona' },
      { icon: FileText, text: 'Contratos digitales sin papeleo' },
      { icon: Wallet, text: '0% comisión — cobras todo lo tuyo' },
    ],
  },
  azafata: {
    tagline: 'Consigue trabajo de azafata en eventos reales.',
    sub: 'Salas y organizadores buscan azafatas como tú cada semana.',
    bullets: [
      { icon: Target, text: 'Tu perfil visible para empresarios de tu zona' },
      { icon: FileText, text: 'Contratos digitales sin papeleo' },
      { icon: Wallet, text: '0% comisión — cobras todo lo tuyo' },
    ],
  },
  peluqueria: {
    tagline: 'Consigue trabajo de peluquería para eventos y clientas de tu zona.',
    sub: 'Novias, comuniones y clientas particulares buscan peluquera cada semana.',
    bullets: [
      { icon: Target, text: 'Tu perfil visible para clientas de tu zona' },
      { icon: FileText, text: 'Contratos digitales sin papeleo' },
      { icon: Wallet, text: '0% comisión — cobras todo lo tuyo' },
    ],
  },
  profesional: {
    tagline: 'El directorio de referencia para profesionales de eventos.',
    sub: 'Crea tu perfil gratis y publica tu tarifa. Tardas menos de 2 minutos.',
    bullets: [
      { icon: Target, text: 'Visible para salas y promotoras de España' },
      { icon: FileText, text: 'Contratos automáticos con PDF' },
      { icon: Wallet, text: '0% comisión — cobras todo lo tuyo' },
    ],
  },
  empresario: {
    tagline: 'Encuentra DJ, staff y fotógrafo para tu evento en minutos.',
    sub: 'Profesionales verificados con tarifa pública. Contacto directo, sin intermediarios.',
    bullets: [
      { icon: Search, text: 'Filtra por ciudad, precio y disponibilidad' },
      { icon: FileText, text: 'Contrato automático — sin papeleo' },
      { icon: Wallet, text: '0€ comisión — el trato es directo' },
    ],
  },
  // Continúa el gancho del anuncio de Instagram "Pon tu precio" — evita el
  // salto a un mensaje genérico que no reconoce por qué la persona hizo clic.
  pontuprecio: {
    tagline: 'Pon tu precio. Deja de aceptar lo que otros imponen.',
    sub: 'Publica tu tarifa gratis y que te contraten directamente por ella. Sin intermediarios.',
    bullets: [
      { icon: Wallet, text: 'Tú decides tu tarifa — 0% comisión' },
      { icon: Target, text: 'Tu perfil visible para salas y organizadores' },
      { icon: FileText, text: 'Contratos digitales automáticos' },
    ],
  },
};

const DEFAULT_CONTENT = {
  tagline: 'El directorio de referencia para profesionales de eventos.',
  sub: 'Publica tu perfil, consigue trabajo. Gratis, sin comisiones.',
  bullets: [
    { icon: Target, text: 'Tu perfil visible en Google y en el directorio' },
    { icon: Wallet, text: '0% comisión — cobras todo lo tuyo' },
    { icon: MapPin, text: 'Visible en toda España' },
  ],
};

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') ?? '';
  const modeParam = searchParams.get('mode') ?? '';
  // Tras login → directo al swipe (experiencia principal). El dashboard clásico
  // queda accesible desde el menú ☰ del feed ("Volver a versión clásica").
  // Un ?redirect= explícito (p.ej. tras registro con onboarding) tiene prioridad.
  const redirectParam = searchParams.get('redirect') ?? '/descubrir';
  const refParam = searchParams.get('ref') ?? '';
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
  const [showRecovery, setShowRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [proCount, setProCount] = useState<number | null>(null);
  const isRegistering = useRef(false);
  // Vuelta de Google con ?code=... — el SDK aún no ha intercambiado el código
  // por una sesión. Sin esta pantalla, el usuario ve el login "normal" y le da
  // otra vez, lo que pisa el code_verifier PKCE del primer intento y rompe el login.
  const [oauthCallbackPending, setOauthCallbackPending] = useState(() => searchParams.has('code'));
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [forgotCaptchaToken, setForgotCaptchaToken] = useState<string | null>(null);
  const [turnstileStalled, setTurnstileStalled] = useState(false);

  useEffect(() => {
    track('auth_view', { mode: isLogin ? 'login' : 'register', role: roleParam || 'none' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    supabase.from('profiles')
      .select('user_id', { count: 'exact', head: true })
      .eq('is_seed', false)
      .neq('role', 'empresario')
      .then(({ count }) => {
        if (typeof count === 'number') setProCount(count);
      });
  }, []);

  useEffect(() => {
    // Destino tras login: si el perfil está INCOMPLETO (recién registrado, sin
    // rol/nombre), va al dashboard a completar la ficha — NO al feed. Si ya está
    // completo, al feed (/descubrir). Evita que un usuario nuevo entre directo
    // al swipe sin haber rellenado su perfil.
    const goAfterLogin = async (userId: string) => {
      if (redirectParam !== '/descubrir') { navigate(redirectParam, { replace: true }); return; }
      const { data } = await supabase
        .from('profiles').select('role, display_name').eq('user_id', userId)
        .order('is_primary', { ascending: false }).limit(1);
      const p = data?.[0];
      const complete = !!p && p.role && p.role !== 'pending' && !!p.display_name?.trim();
      navigate(complete ? '/descubrir' : '/dashboard', { replace: true });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !isRegistering.current) goAfterLogin(session.user.id);
      else if (oauthCallbackPending) setOauthCallbackPending(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowRecovery(true);
        return;
      }
      if (isRegistering.current) return;
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        goAfterLogin(session.user.id);
      } else if (oauthCallbackPending) {
        // El code_verifier no coincidía (p.ej. doble clic previo) o el código
        // ya expiró — no dejar al usuario colgado en la pantalla de carga.
        setOauthCallbackPending(false);
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, redirectParam]);

  // Google bloquea OAuth en navegadores integrados (TikTok, Instagram, FB) con
  // "disallowed_useragent" — en esos casos solo ofrecemos registro por email.
  // Calculado una vez con inicializador lazy: el user agent no cambia durante
  // la vida del componente, así que releerlo en cada render es trabajo repetido.
  const [isInAppBrowser] = useState(() =>
    /TikTok|musical_ly|Instagram|FBAN|FBAV|FB_IAB|Line\//i.test(navigator.userAgent));

  const handleCopyAuthLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Enlace copiado — pégalo en Chrome o Safari'))
      .catch(() => authAlert('Copia el enlace de la barra de arriba y ábrelo en Chrome o Safari'));
  };

  const handleGoogleSignIn = async () => {
    const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin);
    track('auth_google_click', { mode: isLogin ? 'login' : 'register' });
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${SITE_URL}/auth` },
    });
    if (error) {
      console.error('[Auth] Google OAuth error:', error);
      track('auth_google_error', { message: error.message });
      authAlert(
        error.message.includes('provider') || error.message.includes('OAuth')
          ? 'Google login no está configurado. Usa email y contraseña.'
          : 'Error al conectar con Google. Inténtalo de nuevo.'
      );
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin);
    e.preventDefault();
    if (!forgotEmail) { authAlert('Introduce tu email'); return; }
    if (!forgotCaptchaToken) { authAlert('Espera a que termine la verificación de seguridad e inténtalo de nuevo.'); return; }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${SITE_URL}/auth`,
      captchaToken: forgotCaptchaToken,
    });
    setForgotLoading(false);
    if (error) { authAlert(error.message); return; }
    setForgotSent(true);
    toast.success('Email enviado — revisa tu bandeja de entrada');
  };

  // Respaldo con alert() nativo: el toast personalizado (xpeak-toast) no
  // siempre llega a pintarse en producción tras un submit de formulario —
  // alert() bloquea y siempre se ve, así que garantiza que el usuario
  // vea por qué falló su login/registro.
  const authAlert = (message: string) => {
    toast.error(message);
    window.alert(message);
  };

  // Errores de validación con campo identificable: en vez de alert() bloqueante,
  // resalta el campo culpable y hace scroll hasta él — el alert cerraba pero
  // dejaba al usuario sin saber dónde estaba el problema (ej. checkbox legal
  // al fondo del formulario, fuera de la vista en móvil).
  const [fieldError, setFieldError] = useState<string | null>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const legalRef = useRef<HTMLLabelElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const fieldRefs: Record<string, React.RefObject<HTMLElement>> = {
    name: nameRef,
    legal: legalRef,
    password: passwordRef,
  };
  const authFieldError = (field: string, message: string) => {
    toast.error(message);
    setFieldError(field);
    const el = fieldRefs[field]?.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
    if (pwd.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    track('auth_submit', { mode: isLogin ? 'login' : 'register', role: roleParam || 'none' });
    if (!email || !password) {
      track('auth_validation_error', { mode: isLogin ? 'login' : 'register', reason: 'missing_fields' });
      authAlert('Completa todos los campos');
      return;
    }
    if (!captchaToken) {
      authAlert('Espera a que termine la verificación de seguridad e inténtalo de nuevo.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        if (!checkRateLimit()) {
          track('auth_rate_limited', {});
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } });
        if (error) {
          recordLoginFailure();
          track('auth_error', { mode: 'login', message: error.message });
          authAlert(error.message.includes('Invalid login credentials') ? 'Email o contraseña incorrectos.' : (error.message || 'Error de autenticación'));
          setLoading(false);
          return;
        }
        clearRateLimit();
        track('auth_success', { mode: 'login' });
        toast.success('¡Bienvenido de vuelta!');
        navigate(redirectParam);
      } else {
        if (!displayName.trim()) {
          track('auth_validation_error', { mode: 'register', reason: 'missing_name' });
          authFieldError('name', 'Introduce tu nombre profesional'); setLoading(false); return;
        }
        if (!legalAccepted) {
          track('auth_validation_error', { mode: 'register', reason: 'legal_not_accepted' });
          authFieldError('legal', 'Acepta los términos para continuar'); setLoading(false); return;
        }

        const pwdError = validatePassword(password);
        if (pwdError) {
          track('auth_validation_error', { mode: 'register', reason: 'weak_password' });
          authFieldError('password', pwdError); setLoading(false); return;
        }

        setFieldError(null);
        const safeName = displayName.trim().replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]/g, '').slice(0, 60);
        if (!safeName) {
          track('auth_validation_error', { mode: 'register', reason: 'invalid_name' });
          authFieldError('name', 'El nombre no es válido.'); setLoading(false); return;
        }

        isRegistering.current = true;
        const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin);
        const KNOWN_ROLES = ['dj', 'grupo-musical', 'media', 'makeup', 'peluqueria', 'staff', 'azafata', 'promotor', 'empresario', 'catering', 'mago', 'humorista', 'animador', 'bailarin', 'speaker', 'vestuario', 'photo-booth'];
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: safeName,
              role: KNOWN_ROLES.includes(roleParam) ? roleParam : 'pending',
              hourly_rate: 0,
              category: 'pending',
              zone: 'España',
            },
            emailRedirectTo: `${SITE_URL}/auth`,
            captchaToken,
          },
        });
        if (error) {
          track('auth_error', { mode: 'register', message: error.message });
          throw error;
        }

        setFieldError(null);
        track('auth_success', { mode: 'register', role: roleParam || 'pending' });
        trackLead('registro', { role: roleParam || 'pending' });
        if (typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track', 'CompleteRegistration');
        if (typeof window !== 'undefined' && (window as any).ttq) {
          (window as any).ttq.identify({ email });
          (window as any).ttq.track('CompleteRegistration');
        }

        if (refParam && signUpData.user) {
          supabase.from('profiles').select('user_id').eq('referral_code', refParam).maybeSingle()
            .then(({ data: inviter }) => {
              if (inviter?.user_id && inviter.user_id !== signUpData.user!.id) {
                supabase.from('referrals').insert({
                  inviter_user_id: inviter.user_id,
                  invitee_user_id: signUpData.user!.id,
                } as any).then(({ error: refError }) => {
                  if (refError) console.warn('[referral] insert failed:', refError.message);
                });
              }
            });
        }

        supabase.functions.invoke('send-email', {
          body: { type: 'welcome', data: { name: safeName, email, role: roleParam || 'profesional' } },
        }).catch((err: unknown) => console.warn('[email] welcome failed:', err));

        supabase.from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .then(({ count }) => {
            if (typeof count === 'number' && count <= 20) {
              supabase.functions.invoke('send-email', {
                body: { type: 'early_adopter', data: { name: safeName, email } },
              }).catch((err: unknown) => console.warn('[email] early_adopter failed:', err));
            }
          });

        if (signUpData.session) {
          // proCount se cargó al abrir la página (antes de este registro), así
          // que +1 es el número real de este usuario entre los profesionales —
          // no se muestra para empresarios, que no cuentan en esa métrica.
          const welcomeMsg = roleParam && roleParam !== 'empresario' && proCount !== null
            ? `¡Bienvenido! Eres el profesional nº ${proCount + 1} en unirte a XPEAK`
            : '¡Cuenta creada! Bienvenido a XPEAK';
          toast.success(welcomeMsg);
          // Registro nuevo → dashboard para completar perfil/onboarding.
          // EXCEPCIÓN: si el registro venía de un flujo que dejó trabajo a
          // medias (carrito "Mi evento" → ?redirect=/directorio/...), volver
          // ahí; si no, el borrador guardado en sessionStorage se queda
          // huérfano y la solicitud que el usuario creía enviar nunca sale.
          const explicitRedirect = searchParams.get('redirect');
          navigate(explicitRedirect || '/dashboard', { replace: true });
        } else {
          setShowWelcome(true);
        }
        isRegistering.current = false;
      }
    } catch (err: any) {
      authAlert(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = !isLogin && password.length > 0 ? [
    { ok: password.length >= 6, label: '6+ caracteres' },
    { ok: password.length >= 10, label: 'Segura' },
  ] : null;

  if (oauthCallbackPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: '#ffffff', color: '#222' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(212,175,55,0.25)', borderTopColor: '#D4AF37' }} />
        <p className="text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>Conectando con Google...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#ffffff', color: '#222' }}>
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
            style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>

            {/* LEFT — Value prop (desktop only) */}
            <div className="hidden md:flex md:flex-col md:justify-between md:w-[42%] md:p-10 md:border-r"
              style={{ background: 'rgba(212,175,55,0.05)', borderColor: 'rgba(0,0,0,0.06)' }}>

              {/* Logo */}
              <div>
                <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-70 mb-8">
                  <h2 className="text-2xl font-black tracking-tight font-display text-left leading-none" style={{ color: '#111' }}>
                    X<span className="text-gradient">PEAK</span>
                  </h2>
                </button>

                <h1 className="text-xl font-black leading-snug mb-3" style={{ color: '#111' }}>
                  {content.tagline}
                </h1>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {content.sub}
                </p>

                <div className="space-y-3.5">
                  {content.bullets.map(b => {
                    const Icon = b.icon;
                    return (
                      <div key={b.text} className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}>
                          <Icon size={15} style={{ color: '#8B6A00' }} strokeWidth={2.2} />
                        </span>
                        <span className="text-sm font-medium" style={{ color: '#222' }}>{b.text}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}>
                      <ShieldCheck size={15} style={{ color: '#8B6A00' }} strokeWidth={2.2} />
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#222' }}>Gratis · 0% comisión</span>
                  </div>
                </div>
              </div>

              {/* Social proof bottom */}
              <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="text-2xl font-black leading-none" style={{ color: '#111' }}>{proCount !== null ? proCount : '—'}</p>
                    <p className="text-[0.65rem] mt-1" style={{ color: 'rgba(0,0,0,0.55)' }}>profesionales activos</p>
                  </div>
                  <div className="w-px h-9" style={{ background: 'rgba(0,0,0,0.12)' }} />
                  <div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#D4AF37', fontSize: '0.75rem' }}>★</span>)}
                    </div>
                    <p className="text-[0.65rem] mt-1" style={{ color: 'rgba(0,0,0,0.55)' }}>directorio de referencia</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['L','S','M','C'].map((l,i) => (
                      <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-black border-2"
                        style={{ background: `hsl(${i*40+20},60%,35%)`, borderColor: '#fff', color: '#fff' }}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(0,0,0,0.6)' }}>
                    <strong style={{ color: '#111' }}>DJs, fotógrafos y staff</strong> ya consiguen bolos aquí
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="flex-1 p-6 sm:p-8 md:p-10">

              {/* Mobile logo */}
              <div className="flex flex-col items-center mb-5 md:hidden">
                <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-70">
                  <h2 className="text-2xl font-black tracking-tight font-display leading-none" style={{ color: '#111' }}>
                    X<span className="text-gradient">PEAK</span>
                  </h2>
                </button>
                {/* Mobile — tagline + bullets compactos (mismo contenido que el panel desktop) */}
                {!isLogin && (
                  <>
                    <p className="text-xs mt-2 text-center" style={{ color: 'rgba(0,0,0,0.6)' }}>
                      {content.tagline}
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-3">
                      {content.bullets.map(b => (
                        <span key={b.text} className="flex items-center gap-1.5 text-[0.68rem] font-medium"
                          style={{ color: '#333' }}>
                          <b.icon size={11} style={{ color: '#8B6A00' }} strokeWidth={2.4} />
                          {b.text}
                        </span>
                      ))}
                    </div>
                    <p className="text-[0.68rem] mt-2.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      <strong style={{ color: '#333' }}>{proCount !== null ? proCount : ''} profesionales</strong> ya publican su perfil aquí
                    </p>
                  </>
                )}
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h3 className="text-lg font-black mb-1 leading-normal pb-0.5" style={{ color: '#111' }}>
                  {isLogin ? 'Accede a XPEAK' : 'Crear cuenta gratis'}
                </h3>
                <p className="text-xs" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {isLogin
                    ? '¿Primera vez? → Pulsa "Crear cuenta gratis" abajo.'
                    : 'Solo 30 segundos · Sin tarjeta de crédito · 0% comisión'}
                </p>
              </div>

              {/* === GOOGLE — primary CTA (oculto en webviews: OAuth bloqueado) === */}
              {!isInAppBrowser && (
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mb-4"
                style={{
                  background: '#fff',
                  color: '#1a1208',
                  fontSize: '1rem',
                  border: '1px solid rgba(0,0,0,0.15)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.16)',
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
              )}

              {!isInAppBrowser && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.1)' }} />
                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>o con email</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.1)' }} />
              </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Nombre — solo en registro */}
                {!isLogin && (
                  <div ref={nameRef} className={`relative rounded-xl ${fieldError === 'name' ? 'animate-field-shake' : ''}`}
                    style={fieldError === 'name' ? { boxShadow: '0 0 0 2px #ef4444' } : undefined}>
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={displayName}
                      onChange={e => { setDisplayName(e.target.value); if (fieldError === 'name') setFieldError(null); }}
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
                <div ref={passwordRef} className={`relative rounded-xl ${fieldError === 'password' ? 'animate-field-shake' : ''}`}
                  style={fieldError === 'password' ? { boxShadow: '0 0 0 2px #ef4444' } : undefined}>
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); if (fieldError === 'password') setFieldError(null); }}
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
                        <span className="text-[0.7rem] font-bold" style={{ color: ok ? '#16a34a' : '#999' }}>{ok ? '✓' : '·'}</span>
                        <span className="text-[0.7rem]" style={{ color: ok ? '#16a34a' : '#888' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legal — checkbox nativo real (accesible, robusto en webviews) */}
                {!isLogin && (
                  <label
                    ref={legalRef}
                    htmlFor="legal-accept"
                    className={`flex items-center gap-3 cursor-pointer rounded-xl px-3 py-3.5 active:bg-black/5 ${fieldError === 'legal' ? 'animate-field-shake' : ''}`}
                    style={{
                      background: fieldError === 'legal' ? 'rgba(239,68,68,0.06)' : 'rgba(0,0,0,0.03)',
                      border: fieldError === 'legal' ? '1.5px solid #ef4444' : legalAccepted ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(0,0,0,0.1)',
                    }}>
                    <input
                      id="legal-accept"
                      name="legalAccepted"
                      type="checkbox"
                      checked={legalAccepted}
                      onChange={(e) => { setLegalAccepted(e.target.checked); if (e.target.checked) setFieldError(null); }}
                      className="w-6 h-6 flex-shrink-0 rounded-md accent-[#D4AF37]"
                    />
                    <span className="text-xs leading-relaxed" style={{ color: fieldError === 'legal' ? '#b91c1c' : 'rgba(0,0,0,0.65)' }}>
                      {fieldError === 'legal' && <span className="font-bold">☝️ Marca esta casilla para continuar — </span>}
                      Acepto la{' '}
                      <Link to="/privacidad" target="_blank" onClick={e => e.stopPropagation()} className="underline" style={{ color: '#8B6A00' }}>Privacidad</Link>,{' '}
                      <Link to="/terminos" target="_blank" onClick={e => e.stopPropagation()} className="underline" style={{ color: '#8B6A00' }}>Términos</Link>{' '}
                      y{' '}
                      <Link to="/cookies" target="_blank" onClick={e => e.stopPropagation()} className="underline" style={{ color: '#8B6A00' }}>Cookies</Link>
                    </span>
                  </label>
                )}

                {/* Verificación anti-bot — invisible la mayoría de las veces */}
                <TurnstileWidget
                  onVerify={token => { setCaptchaToken(token); setTurnstileStalled(false); }}
                  onExpire={() => setCaptchaToken(null)}
                  onStall={() => setTurnstileStalled(true)}
                />

                {/* El webview de Facebook/Instagram/TikTok rompe Turnstile igual que
                    rompe Google OAuth (arriba) — sin salida, el usuario se queda
                    mirando "Verificando seguridad…" para siempre. Este es el caso
                    real: 63% del tráfico de /auth llega desde facebook.com. */}
                {isInAppBrowser && turnstileStalled && (
                  <div className="rounded-xl px-4 py-3.5 text-xs leading-relaxed"
                    style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', color: '#5c4a12' }}>
                    <p className="font-bold mb-1.5">Este navegador no permite completar el registro.</p>
                    <p className="mb-2.5">
                      Estás dentro de la app de Facebook/Instagram, que bloquea la verificación de seguridad.
                      Toca <strong>⋮ o ···</strong> arriba y elige <strong>"Abrir en Chrome"</strong> o{' '}
                      <strong>"Abrir en el navegador"</strong>.
                    </p>
                    <button type="button" onClick={handleCopyAuthLink}
                      className="w-full py-2.5 rounded-lg font-bold text-xs transition-all hover:scale-[1.01]"
                      style={{ background: '#fff', border: '1px solid rgba(212,175,55,0.4)', color: '#8B6A00' }}>
                      Copiar enlace para pegarlo en el navegador
                    </button>
                  </div>
                )}

                {/* CTA principal */}
                <button
                  type="submit"
                  disabled={loading || !captchaToken}
                  className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #B8941E)', color: '#000' }}>
                  {loading
                    ? 'Procesando...'
                    : !captchaToken
                      ? 'Verificando seguridad…'
                      : isLogin
                        ? 'Iniciar Sesión'
                        : roleParam === 'empresario'
                          ? 'Empezar a contratar gratis →'
                          : 'Publicar mi perfil gratis →'}
                </button>

              </form>

              {/* Forgot password */}
              {isLogin && !showForgot && (
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="block w-full mt-3 text-xs text-center transition-opacity hover:opacity-80"
                  style={{ color: 'rgba(0,0,0,0.55)' }}>
                  ¿Olvidaste tu contraseña?
                </button>
              )}

              {showForgot && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
                  {forgotSent ? (
                    <p className="text-xs text-center" style={{ color: '#16a34a' }}>
                      ✓ Email enviado. Revisa tu bandeja de entrada para restablecer la contraseña.
                    </p>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-2">
                      <p className="text-xs mb-2" style={{ color: 'rgba(0,0,0,0.6)' }}>
                        Introduce tu email y te enviamos un enlace de recuperación.
                      </p>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                          placeholder="tu@email.com" className="nightlife-input !py-2.5 !pl-9 text-sm" />
                      </div>
                      <TurnstileWidget onVerify={setForgotCaptchaToken} onExpire={() => setForgotCaptchaToken(null)} />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setShowForgot(false)}
                          className="flex-1 py-2 rounded-lg text-xs font-bold"
                          style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.15)', color: '#555' }}>
                          Cancelar
                        </button>
                        <button type="submit" disabled={forgotLoading || !forgotCaptchaToken}
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
              <div className="mt-5 pt-5 flex items-center justify-center gap-1.5" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  {isLogin ? '¿Nuevo en XPEAK?' : '¿Ya tienes cuenta?'}
                </span>
                <button
                  onClick={() => { track('auth_toggle_mode', { to: isLogin ? 'register' : 'login' }); setIsLogin(!isLogin); setShowForgot(false); setForgotSent(false); }}
                  className="text-xs font-bold transition-opacity hover:opacity-80"
                  style={{ color: '#8B6A00' }}>
                  {isLogin ? 'Crear cuenta gratis →' : 'Inicia sesión →'}
                </button>
              </div>

              {/* Trust signals */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={11} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  <span className="text-[0.6rem]" style={{ color: 'rgba(0,0,0,0.4)' }}>Datos seguros</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={11} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  <span className="text-[0.6rem]" style={{ color: 'rgba(0,0,0,0.4)' }}>Sin spam</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={11} style={{ color: 'rgba(0,0,0,0.4)' }} />
                  <span className="text-[0.6rem]" style={{ color: 'rgba(0,0,0,0.4)' }}>Comunidad verificada</span>
                </div>
              </div>

            </div>
          </div>

          <p className="text-center mt-6 text-[0.6rem]" style={{ color: 'rgba(0,0,0,0.35)' }}>
            © {new Date().getFullYear()} XPEAK · Todos los derechos reservados
          </p>
        </div>
      </div>

      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-sm rounded-2xl p-8 text-center"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.12)', border: '2px solid rgba(212,175,55,0.3)' }}>
              <Mail size={28} style={{ color: '#D4AF37' }} />
            </div>
            <h2 className="text-xl font-black mb-2" style={{ color: '#111' }}>
              ¡Revisa tu email!
            </h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: '#222' }}>
              Hemos enviado un enlace de confirmación a
            </p>
            <p className="text-sm font-black mb-5" style={{ color: '#8B6A00' }}>{email}</p>
            <p className="text-xs leading-relaxed mb-6" style={{ color: '#333' }}>
              Haz clic en el enlace del email para activar tu cuenta y acceder a XPEAK.<br />
              Si no lo ves, revisa la carpeta de spam.
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {showRecovery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className="w-full max-w-sm rounded-2xl p-8 text-center"
            style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.12)', border: '2px solid rgba(212,175,55,0.3)' }}>
              <Lock size={28} style={{ color: '#D4AF37' }} />
            </div>
            <h2 className="text-xl font-black mb-2" style={{ color: '#111' }}>
              Nueva contraseña
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#222' }}>
              Introduce tu nueva contraseña para XPEAK.
            </p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const pwdErr = validatePassword(newPassword);
              if (pwdErr) { authAlert(pwdErr); return; }
              setRecoveryLoading(true);
              const { error } = await supabase.auth.updateUser({ password: newPassword });
              setRecoveryLoading(false);
              if (error) { authAlert(error.message); return; }
              toast.success('Contraseña actualizada correctamente');
              setShowRecovery(false);
              navigate(redirectParam, { replace: true });
            }} className="space-y-3">
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#999' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña (mín. 6 caracteres)"
                  maxLength={128}
                  autoFocus
                  className="w-full py-3 pl-9 pr-10 rounded-xl text-sm"
                  style={{ background: '#f5f5f5', border: '1px solid #e0e0e0', color: '#111' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#999' }}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button type="submit" disabled={recoveryLoading}
                className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
                style={{ background: 'linear-gradient(90deg,#D4AF37,#B8941E)', color: '#000' }}>
                {recoveryLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
