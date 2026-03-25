import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('[AdminGuard] No session — redirecting');
        navigate('/', { replace: true });
        return;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (data) {
        setAuthorized(true);
      } else {
        console.warn('[AdminGuard] Unauthorized admin attempt:', session.user.id);
        navigate('/', { replace: true });
      }
      setChecking(false);
    };
    check();
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xs text-muted-foreground animate-pulse">Verificando acceso...</div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};

export default AdminGuard;
