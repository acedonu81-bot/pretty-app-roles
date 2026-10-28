/**
 * Errores de registro y cambio de contraseña, en español y con el campo al que
 * apuntan (28 oct 2026).
 *
 * Hasta hoy el catch de Auth.tsx hacía window.alert(err.message): un empresario
 * de Google (Eventos 13) vio cuatro veces seguidas, en inglés y en una ventana
 * bloqueante, "Password is known to be weak and easy to guess" mientras el
 * formulario le marcaba la contraseña con ✓ verde. Supabase rechaza las
 * contraseñas que aparecen en filtraciones (lista HaveIBeenPwned), cosa que el
 * validador del formulario (solo 6 caracteres) no puede saber de antemano.
 */
export interface ErrorAuthTraducido {
  /** Campo del formulario que hay que resaltar, si el error es de uno. */
  campo: 'password' | 'email' | null;
  texto: string;
}

export function traducirErrorAuth(error: { message?: string; code?: string } | null | undefined): ErrorAuthTraducido {
  const message = error?.message ?? '';
  const code = error?.code ?? '';

  if (code === 'weak_password' || /weak and easy to guess|password.*(pwned|leak)|known to be weak/i.test(message)) {
    return {
      campo: 'password',
      texto:
        'Esa contraseña es demasiado típica: ha salido en filtraciones de datos y no podemos aceptarla. ' +
        'Prueba con otra de 10 o más caracteres que mezcle letras y números (evita 123456 y el nombre de tu empresa).',
    };
  }
  if (code === 'user_already_exists' || /already registered|already been registered/i.test(message)) {
    return {
      campo: 'email',
      texto: 'Ese email ya tiene cuenta. Entra con tu contraseña o usa «¿Olvidaste tu contraseña?».',
    };
  }
  if (code === 'same_password' || /different from the old password/i.test(message)) {
    return { campo: 'password', texto: 'La contraseña nueva tiene que ser distinta de la anterior.' };
  }
  if (/captcha/i.test(message)) {
    return { campo: null, texto: 'La comprobación de seguridad ha caducado. Inténtalo de nuevo.' };
  }
  if (/rate limit|too many requests|over_email_send_rate_limit/i.test(message) || code === 'over_request_rate_limit') {
    return { campo: null, texto: 'Demasiados intentos seguidos. Espera un minuto y vuelve a probar.' };
  }
  return { campo: null, texto: message || 'Error de autenticación' };
}
