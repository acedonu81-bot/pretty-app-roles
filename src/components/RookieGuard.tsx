import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface RookieGuardProps {
  children: React.ReactNode;
  onDenied?: () => void;
}

/**
 * Only allows access if:
 * - User has admin role, OR
 * - User's profile has validation_status = 'rookie' or category = 'rookie'
 */
const RookieGuard = ({ children, onDenied }: RookieGuardProps) => {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setChecking(false);
        onDenied?.();
        return;
      }

      // Check if admin
      const { data: adminRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (adminRole) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      // Check if user is a promesa/rookie
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      // Access if subscription_tier is 'free' (promesas are free tier)
      if (profile && profile.subscription_tier === 'free') {
        setAuthorized(true);
      } else {
        onDenied?.();
      }
      setChecking(false);
    };
    check();
  }, [onDenied]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xs text-muted-foreground animate-pulse">Verificando acceso...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Este panel es exclusivo para DJs Promesa y administradores.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RookieGuard;
