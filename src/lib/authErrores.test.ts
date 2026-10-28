import { describe, it, expect } from 'vitest';
import { traducirErrorAuth } from './authErrores';

describe('traducirErrorAuth', () => {
  it('contraseña filtrada: en español, apunta al campo contraseña y da una salida', () => {
    const r = traducirErrorAuth({ message: 'Password is known to be weak and easy to guess, please choose a different one.' });
    expect(r.campo).toBe('password');
    expect(r.texto).not.toMatch(/Password is known/);
    expect(r.texto).toMatch(/10 o más caracteres/);
  });

  it('reconoce el código weak_password aunque el mensaje cambie', () => {
    expect(traducirErrorAuth({ code: 'weak_password', message: 'cualquier cosa' }).campo).toBe('password');
  });

  it('email ya registrado: apunta al email y ofrece recuperar la contraseña', () => {
    const r = traducirErrorAuth({ message: 'User already registered' });
    expect(r.campo).toBe('email');
    expect(r.texto).toMatch(/Olvidaste tu contraseña/);
  });

  it('captcha caducado y exceso de intentos no apuntan a ningún campo', () => {
    expect(traducirErrorAuth({ message: 'captcha protection: request disallowed (timeout-or-duplicate)' }).campo).toBeNull();
    expect(traducirErrorAuth({ message: 'Too many requests' }).campo).toBeNull();
  });

  it('un error desconocido se enseña tal cual y nunca queda vacío', () => {
    expect(traducirErrorAuth({ message: 'algo raro' }).texto).toBe('algo raro');
    expect(traducirErrorAuth(null).texto).toBe('Error de autenticación');
  });
});
