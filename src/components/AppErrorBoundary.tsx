import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Sin esto, cualquier error no capturado durante el render se lleva por
 * delante TODO el árbol de React: la pantalla se queda completamente en
 * blanco, sin mensaje, sin consola visible para el usuario, sin forma de
 * volver atrás salvo recargar a ciegas. No había ningún ErrorBoundary en toda
 * la app — reportado el 5 sep 2026 como "le doy a loguear, se queda pensando
 * y luego en blanco", un patrón que encaja exactamente con esto: la sesión
 * carga bien, pero algo revienta al pintar la pantalla siguiente.
 *
 * No arregla la causa del error puntual — eso se investiga con el log que
 * manda a la vez — pero convierte "pantalla muerta sin salida" en "aviso claro
 * + botón para recargar", que es la diferencia entre perder al usuario del
 * todo o que vuelva a intentarlo.
 */
interface Props { children: ReactNode }
interface State { error: Error | null; esAdmin: boolean }

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null, esAdmin: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Caso más probable en la práctica: un deploy nuevo cambió los nombres de
    // los chunks (cada build lleva un hash distinto), y el navegador tenía en
    // memoria la lista de chunks de la versión vieja — el import() de un lazy()
    // pide un archivo que ya no existe en el servidor. Vite marca este fallo
    // con "Failed to fetch dynamically imported module" / "importing a module
    // script failed". Aquí no hace falta ni mostrar la pantalla de error: se
    // recarga sola UNA vez (el flag evita un bucle si el fallo fuera otro) y
    // coge la build nueva sin que el usuario tenga que hacer nada.
    const pareceChunkViejo = /dynamically imported module|importing a module script failed|Failed to fetch/i.test(error.message);
    if (pareceChunkViejo && !sessionStorage.getItem('xpeak_chunk_reload_attempted')) {
      sessionStorage.setItem('xpeak_chunk_reload_attempted', '1');
      window.location.reload();
      return;
    }

    // Best-effort: si esto también falla (p.ej. sin red), no debe impedir
    // que el usuario vea igualmente la pantalla de recuperación de abajo.
    // Vía el cliente de supabase-js, no un fetch a pelo: la llamada directa
    // omitía la cabecera `apikey` que Supabase exige SIEMPRE, así que el POST
    // se rechazaba y client_errors quedaba vacía — un crash real reportado por
    // el usuario no dejó ni una fila. Import dinámico para no arrastrar el
    // cliente al arranque ni romper si el propio módulo es lo que falló.
    // El detalle técnico solo se enseña a un admin: a un usuario normal le da
    // mala imagen (parece la plataforma rota) y expone nombres de funciones y
    // rutas internas del código. Para él basta el mensaje claro + Recargar.
    import('@/integrations/supabase/client')
      .then(async ({ supabase }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('user_roles').select('role')
            .eq('user_id', user.id).eq('role', 'admin').maybeSingle();
          if (data) this.setState({ esAdmin: true });
        }
        return supabase;
      })
      .then((supabase: any) => (supabase.rpc as any)('log_client_error', {
        p_message: error.message,
        p_stack: (error.stack ?? '').slice(0, 4000),
        p_component_stack: (info.componentStack ?? '').slice(0, 4000),
        p_url: window.location.href,
        p_user_agent: navigator.userAgent,
      }))
      .catch(() => { /* el detalle técnico visible de abajo es el respaldo */ });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        padding: 24, textAlign: 'center', background: '#0a0908', color: '#fff',
      }}>
        <p style={{ fontSize: 15, fontWeight: 800, maxWidth: 320 }}>
          Algo ha fallado al cargar esta pantalla.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', maxWidth: 320 }}>
          Ya lo sabemos. Prueba a recargar — si sigue pasando, escríbenos.
        </p>
        {/* Solo para admin: el envío a client_errors puede fallar (sin red,
            RLS, CSP) y entonces el crash no deja rastro consultable. Tenerlo
            aquí garantiza que siempre haya algo que leer, sin enseñarle un
            volcado de código a un usuario normal. */}
        {this.state.esAdmin && (
        <details style={{ marginTop: 4, maxWidth: 520, width: '100%' }}>
          <summary style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            Ver detalle técnico
          </summary>
          <pre style={{
            marginTop: 8, padding: 12, borderRadius: 8, textAlign: 'left',
            fontSize: 11, lineHeight: 1.5, color: '#fca5a5',
            background: 'rgba(255,255,255,0.05)', overflow: 'auto', maxHeight: 260,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {this.state.error.message}
            {'\n\n'}
            {(this.state.error.stack ?? '').slice(0, 1500)}
          </pre>
        </details>
        )}
        <button
          onClick={() => { this.setState({ error: null }); window.location.reload(); }}
          style={{
            marginTop: 8, padding: '12px 24px', borderRadius: 12, fontWeight: 800,
            fontSize: 14, background: 'linear-gradient(90deg,#D4AF37,#B8941E)',
            color: '#000', border: 'none', cursor: 'pointer',
          }}
        >
          Recargar
        </button>
      </div>
    );
  }
}
