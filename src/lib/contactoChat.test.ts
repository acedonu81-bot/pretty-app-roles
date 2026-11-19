import { describe, it, expect } from 'vitest';
import { contactoDesbloqueado, mencionaContacto } from './contactoChat';
import { sanitizeInput, RAZON_CONTACTO } from './contentFilter';
import { mensajeAcepto } from './acuerdoChat';

const COND = 'f=12/12/2026;c=Madrid;p=500;e=Boda';
const msg = (id: string, sender_id: string, content: string) => ({ id, sender_id, content });

describe('mencionaContacto', () => {
  it('frena instagram, insta, whatsapp, wasap y telegram', () => {
    for (const t of ['Te dejo mi instagram para que veas mis trabajos', 'mi Insta es danielacatering', 'escríbeme por WhatsApp', 'por whats app mejor', 'por wasap', 'estoy en Telegram']) {
      expect(mencionaContacto(t)).toBe(true);
    }
  });
  it('no frena mensajes normales', () => {
    expect(mencionaContacto('Hola, ¿qué menú tenéis para 50 personas?')).toBe(false);
    expect(mencionaContacto('Perfecto, quedamos así')).toBe(false);
  });
  it('no toca los mensajes de acuerdo', () => {
    expect(mencionaContacto('[[acuerdo:aceptado|ACUERDO|f=12/12/2026;c=Madrid;p=500;e=Sesión Instagram]]')).toBe(false);
  });
});

describe('contactoDesbloqueado', () => {
  it('bloqueado sin acuerdo y con solo una aceptación', () => {
    expect(contactoDesbloqueado([])).toBe(false);
    expect(contactoDesbloqueado([msg('1', 'a', mensajeAcepto(COND))])).toBe(false);
  });
  it('desbloqueado cuando los dos aceptan las mismas condiciones', () => {
    expect(contactoDesbloqueado([msg('1', 'a', mensajeAcepto(COND)), msg('2', 'b', mensajeAcepto(COND))])).toBe(true);
  });
  it('condiciones distintas son una contrapropuesta: sigue bloqueado', () => {
    expect(contactoDesbloqueado([msg('1', 'a', mensajeAcepto(COND)), msg('2', 'b', mensajeAcepto('f=13/12/2026;c=Madrid;p=500'))])).toBe(false);
  });
  it('una sola persona aceptando dos veces no desbloquea', () => {
    expect(contactoDesbloqueado([msg('1', 'a', mensajeAcepto(COND)), msg('2', 'a', mensajeAcepto(COND))])).toBe(false);
  });
});

describe('sanitizeInput con permitirContacto', () => {
  it('bloquea teléfono, @ y correo por defecto con el motivo de contacto', () => {
    expect(sanitizeInput('llámame al 612 345 678').reason).toBe(RAZON_CONTACTO);
    expect(sanitizeInput('mi instagram es @daniela').reason).toBe(RAZON_CONTACTO);
    expect(sanitizeInput('daniela@correo.com').reason).toBe(RAZON_CONTACTO);
  });
  it('los permite cuando el contacto está desbloqueado', () => {
    expect(sanitizeInput('llámame al 612 345 678', 'default', { permitirContacto: true }).clean).toBe(true);
    expect(sanitizeInput('mi instagram es @daniela', 'default', { permitirContacto: true }).clean).toBe(true);
    expect(sanitizeInput('daniela@correo.com', 'default', { permitirContacto: true }).clean).toBe(true);
  });
  it('desbloquear el contacto no desbloquea el resto de filtros', () => {
    expect(sanitizeInput('<script>alert(1)</script>', 'default', { permitirContacto: true }).clean).toBe(false);
  });
});
