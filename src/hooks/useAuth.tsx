import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getSession() lee localStorage de forma async, y justo tras un login en
    // la misma pestaña puede tardar un instante en reflejar la sesión recién
    // escrita. Si onAuthStateChange dispara antes con session=null (p.ej. su
    // primer evento en algunos navegadores móviles) y ponemos loading=false
    // ahí, el guard de Dashboard.tsx ve "ya sé que no hay user" y expulsa a
    // /auth aunque la sesión sí exista — el usuario vuelve a loguearse un
    // segundo después. initialCheckDone asegura que loading solo baja tras
    // el resultado real de getSession(), nunca antes por culpa del listener.
    let initialCheckDone = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      initialCheckDone = true;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (initialCheckDone) setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, loading, signOut };
};
