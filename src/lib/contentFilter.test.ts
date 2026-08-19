import { describe, it, expect } from 'vitest';
import { containsPhoneNumber, containsBlockedContent, sanitizeInput } from './contentFilter';

describe('containsPhoneNumber', () => {
  it('detects a raw 9-digit Spanish phone number', () => {
    expect(containsPhoneNumber('llámame al 612345678')).toBe(true);
  });

  it('detects a phone number with spaces between digits', () => {
    expect(containsPhoneNumber('6 12 345 678')).toBe(true);
  });

  it('detects a phone number with dashes', () => {
    expect(containsPhoneNumber('6-12-34-56-78')).toBe(true);
  });

  it('detects a phone number with dots', () => {
    expect(containsPhoneNumber('6.1.2.3.4.5.6.7.8')).toBe(true);
  });

  it('detects a phone number spelled out in Spanish words', () => {
    expect(containsPhoneNumber('seis uno dos tres cuatro cinco seis siete ocho')).toBe(true);
  });

  it('detects a phone number mixing digits and Spanish words', () => {
    expect(containsPhoneNumber('6 uno 2-tres cuatro 5 seis 7 8')).toBe(true);
  });

  it('detects a phone number with a Spanish country code prefix', () => {
    expect(containsPhoneNumber('+34 612 345 678')).toBe(true);
  });

  it('detects a phone number with an international dial-out prefix (00)', () => {
    expect(containsPhoneNumber('0034-612-345-678')).toBe(true);
  });

  it('does not flag normal conversational text', () => {
    expect(containsPhoneNumber('Hola, ¿tienes disponibilidad para el 15 de septiembre?')).toBe(false);
  });

  it('does not flag short, non-phone digit runs (e.g. a price or a date)', () => {
    expect(containsPhoneNumber('El precio es 80€ y el evento es a las 22:30')).toBe(false);
  });

  it('does not flag an hourly rate range', () => {
    expect(containsPhoneNumber('Cobro entre 60 y 120 euros por hora')).toBe(false);
  });
});

describe('containsBlockedContent', () => {
  it('flags a message containing a phone number', () => {
    expect(containsBlockedContent('contáctame al 612345678')).toBe(true);
  });

  it('flags hate speech', () => {
    expect(containsBlockedContent('eres un nazi de mierda')).toBe(true);
  });

  it('flags adult content keywords', () => {
    expect(containsBlockedContent('ofrezco servicio privado y masaje erótico')).toBe(true);
  });

  it('flags profanity', () => {
    expect(containsBlockedContent('menudo gilipollas')).toBe(true);
  });

  it('flags an inline <script> tag (stored XSS attempt)', () => {
    expect(containsBlockedContent('hola <script>alert(1)</script>')).toBe(true);
  });

  it('flags a javascript: URI', () => {
    expect(containsBlockedContent('mira esto javascript:alert(1)')).toBe(true);
  });

  it('flags an onerror handler on an img tag', () => {
    expect(containsBlockedContent('<img src=x onerror=alert(1)>')).toBe(true);
  });

  it('does not flag a clean, normal message', () => {
    expect(containsBlockedContent('Encantado, ¿cuál es tu disponibilidad para bodas en junio?')).toBe(false);
  });
});

describe('sanitizeInput', () => {
  it('accepts a normal bio', () => {
    const result = sanitizeInput('DJ residente en Madrid con 5 años de experiencia en bodas y eventos corporativos.', 'bio');
    expect(result).toEqual({ clean: true });
  });

  it('rejects text longer than the field limit, with the limit in the reason', () => {
    const tooLong = 'a'.repeat(70);
    const result = sanitizeInput(tooLong, 'name');
    expect(result.clean).toBe(false);
    expect(result.reason).toContain('60');
  });

  it('applies the correct max length per field (bio vs name vs default)', () => {
    const text61 = 'a'.repeat(61);
    expect(sanitizeInput(text61, 'name').clean).toBe(false);
    expect(sanitizeInput(text61, 'bio').clean).toBe(true);
    expect(sanitizeInput(text61, 'default').clean).toBe(true);
  });

  it('rejects a phone number with a message pointing to XPEAK messaging', () => {
    const result = sanitizeInput('Escríbeme al 612345678 mejor', 'bio');
    expect(result.clean).toBe(false);
    expect(result.reason).toMatch(/sistema de mensajes/i);
  });

  it('rejects an email address as a contact-bypass attempt', () => {
    const result = sanitizeInput('contacta conmigo en dj@example.com', 'default');
    expect(result.clean).toBe(false);
  });

  it('rejects a WhatsApp link', () => {
    const result = sanitizeInput('escríbeme por wa.me/34612345678', 'default');
    expect(result.clean).toBe(false);
  });

  it('rejects hate speech with the discrimination-specific reason', () => {
    const result = sanitizeInput('sois todos unos nazi', 'bio');
    expect(result.clean).toBe(false);
    expect(result.reason).toMatch(/discriminatorio/i);
  });

  it('catches the plural "nazis" as well as the singular (regex fix 19 ago 2026)', () => {
    const result = sanitizeInput('sois todos unos nazis', 'bio');
    expect(result.clean).toBe(false);
  });

  it('catches the irregular plural "maricones" (regex fix 19 ago 2026)', () => {
    expect(sanitizeInput('sois unos maricones', 'bio').clean).toBe(false);
  });

  it('catches profanity plurals (e.g. "fucks") after the regex fix', () => {
    expect(containsBlockedContent('what the fucks')).toBe(true);
  });
});
