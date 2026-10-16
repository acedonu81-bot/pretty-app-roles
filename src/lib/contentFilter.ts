/**
 * Client-side content moderation for XPEAK.
 * Blocks: profanity (ES/EN), hate speech, homophobia, adult content, contact bypass.
 * Not a replacement for server-side moderation — use as first line of defense.
 *
 * PHONE BYPASS DEFENSE:
 *   Detects phone numbers regardless of format:
 *   - Raw digits:        612345678
 *   - Separated:        6 12 345 678 | 6-12-34-56-78 | 6.1.2.3.4.5.6.7.8
 *   - Spanish words:    seis uno dos tres cuatro cinco seis siete ocho
 *   - Mixed:            6 uno 2-tres cuatro 5 seis
 *   - Country code:     +34 612 345 678 | 0034-612-345-678
 *   - Leet/obfuscated: s3is 0ch0 nu3v3
 */

// ── Spanish digit word map (with common leet variations) ────────────────────
const WORD_DIGIT_MAP: [RegExp, string][] = [
  [/\bc[e3]r[o0]\b/gi,       '0'],
  [/\bun[ao0]\b/gi,          '1'],
  [/\bd[o0]s\b/gi,           '2'],
  [/\btr[e3]s\b/gi,          '3'],
  [/\bcuatr[o0]\b/gi,        '4'],
  [/\bc[i1]nc[o0]\b/gi,      '5'],
  [/\bs[e3][i1]s\b/gi,       '6'],
  [/\bs[i1][e3]t[e3]\b/gi,   '7'],
  [/\b[o0]ch[o0]\b/gi,       '8'],
  [/\bnu[e3]v[e3]\b/gi,      '9'],
  // Decenas y centenas (16 oct 2026): "treinta y cuatro" o "seiscientos doce"
  // pasaban el filtro. No hace falta el valor exacto, solo cuántos dígitos
  // aportan (2 y 3) para llegar a la longitud de un teléfono.
  [/\b(?:diez|once|doce|trece|catorce|quince)\b/gi, '00'],
  [/\b(?:veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)(?:\s+y)?\b/gi, '00'],
  [/\b(?:cien|ciento|doscientos|trescientos|cuatrocientos|quinientos|seiscientos|setecientos|ochocientos|novecientos)\b/gi, '000'],
  // English fallback
  [/\bzero\b/gi,             '0'],
  [/\bone\b/gi,              '1'],
  [/\btwo\b/gi,              '2'],
  [/\bthree\b/gi,            '3'],
  [/\bfour\b/gi,             '4'],
  [/\bfive\b/gi,             '5'],
  [/\bsix\b/gi,              '6'],
  [/\bseven\b/gi,            '7'],
  [/\beight\b/gi,            '8'],
  [/\bnine\b/gi,             '9'],
];

/** Replace Spanish/English number words with their digit equivalents */
function wordToDigits(text: string): string {
  let s = text;
  for (const [re, digit] of WORD_DIGIT_MAP) {
    s = s.replace(re, digit);
  }
  return s;
}

/**
 * Returns true if the text contains a phone-number-length digit run after:
 * 1. Converting number-words to digits
 * 2. Collapsing common separators between digits
 *
 * 7+ consecutive digits = suspicious (Spanish phone = 9, with country code = 11–13)
 */
export function containsPhoneNumber(text: string): boolean {
  // Fechas y horas no son teléfonos (16 oct 2026): "el 12/12/2026" o "a las
  // 21:30, 350 euros" se bloqueaban en el chat de cualquier reserva. Solo se
  // tapan si no tocan otros grupos de dígitos (con ese margen "6:12:34:56:78" o
  // "6-12-12-2026" siguen contando como número).
  const normalized = wordToDigits(text.toLowerCase())
    .replace(/(?<![\d/.\-])(?:0?[1-9]|[12]\d|3[01])[/.\-](?:0?[1-9]|1[0-2])[/.\-]20\d{2}(?![\d/.\-]\d)/g, ' F ')
    .replace(/(?<![\d:])(?:[01]?\d|2[0-3]):[0-5]\d(?![\d:])/g, ' H ');

  // Collapse any separator chars sitting between digits
  // Allowed separators: space, dot, dash, slash, plus, parens, asterisk, underscore, comma, colon
  const collapsed = normalized.replace(/(\d)[\s.\-·\/\\()+*_,;:#@!]+(?=\d)/g, '$1');

  // 7+ digit run → phone candidate
  if (/\d{7,}/.test(collapsed)) return true;

  // Country code prefix (+34, 0034, +1, etc.) followed by more digits
  if (/(\+\d{1,3}|00\d{2})[\s.\-]?\d/.test(normalized)) return true;

  return false;
}

// ── Hate / discrimination ────────────────────────────────────────────────────
// \b al final de un patrón exige un límite de palabra exacto ahí — no
// matchea el plural español regular ("nazis", "maricas"), porque entre la
// última letra de la raíz y la "s" del plural ambos son \w y no hay límite.
// Se añade "s?" opcional donde el plural es regular; maricón/maricones es
// irregular así que necesita su propio patrón de plural.
const HATE_PATTERNS = [
  /\bmaric[oó]n(es)?\b/i, /\bmaricas?\b/i, /\bbollerazos?\b/i,
  /\bnazis?\b/i, /\bsieg heil\b/i, /\bniggers?\b/i, /\bfaggots?\b/i,
  /\bmuerte a los?\b/i, /\bhitler\b/i, /\bblackface\b/i,
];

// ── Adult content ────────────────────────────────────────────────────────────
const ADULT_PATTERNS = [
  /\bpornos?\b/i, /\bescorts?\b/i, /\bprostitu/i, /\bputeros?\b/i,
  /\bxxx\b/i, /\bdesnud/i, /\bnude\b/i,
  /\bmasaje\s*er[oó]tico/i, /\bservicio\s*privado\b/i,
];

// ── Profanity ────────────────────────────────────────────────────────────────
const PROFANITY_PATTERNS = [
  /\bhijodeput/i, /\bgilipoll/i,
  /\bfucks?\b/i, /\bshits?\b/i, /\bassholes?\b/i, /\bcunts?\b/i,
];

// Insultos y palabrotas (16 oct 2026: "cabrón" se podía enviar). Se comprueban
// sobre el texto normalizado (ver normalizarInsulto): sin acentos salvo la ñ,
// con las cifras de uso habitual como letras (c4br0n), letras sueltas pegadas
// ("c a b r o n") y repetidas ("cabroooon"). La ñ se conserva para no tocar
// "cono" (de luz, helado): "coño" sí.
const INSULTOS = [
  /\bcabr[oa]+n(es|a|as)?\b/, /\bhij[oa]s?\s*(de|d)\s*(la\s*)?(gran\s*)?put[ao]s?\b/, /\bhdp\b/, /\bhijueput/,
  /\bsoplapoll/, /\bchupapoll/, /\bgilipoll/, /\bcapull[oa]s?\b/, /\bmamon(es|a|as)?\b/, /\bzorr[oa]s?\b/,
  /\bput[ao]s?\b/, /\bjoder\b/, /\bjodete\b/, /\bjoputa/, /\bcoñ[oa]s?\b/, /\bcojones\b/,
  /\bmierdas?\b/, /\bpollas?\b/, /\bcagon(es|a|as)?\b/, /\bme\s*cago\s*en\b/,
  /\bimbecil(es)?\b/, /\bidiotas?\b/, /\bsubnormal(es)?\b/, /\bmongol[oa]s?\b/, /\bpendej[oa]s?\b/,
  /\bhostias?\b/, /\bostias?\b/, /\bfoll(ar|ame|ad[oa]s?)\b/, /\bctm\b/, /\bptm\b/,
  /\bbitch(es)?\b/, /\bbastards?\b/, /\bdickheads?\b/, /\bmotherfuck/, /\bpussy\b/,
];

export function normalizarInsulto(text: string): string {
  let s = text.toLowerCase().replace(/ñ/g, '§').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/§/g, 'ñ');
  s = s.replace(/[@4]/g, 'a').replace(/3/g, 'e').replace(/[1!|]/g, 'i').replace(/0/g, 'o').replace(/[$5]/g, 's').replace(/7/g, 't');
  s = s.replace(/\b(?:[a-zñ][\s.\-_*]+){2,}[a-zñ]\b/g, m => m.replace(/[\s.\-_*]+/g, ''));
  return s.replace(/(.)\1{2,}/g, '$1$1');
}

export function contieneInsulto(text: string): boolean {
  const n = normalizarInsulto(text);
  // "cabroooon" → "cabroon": una sola repetición de la última letra basta
  const alt = n.replace(/(.)\1+/g, '$1');
  return INSULTOS.some(p => p.test(n) || p.test(alt));
}

// ── Contact bypass (platform circumvention) ──────────────────────────────────
// Note: phone detection is handled separately via containsPhoneNumber()
const CONTACT_BYPASS_PATTERNS = [
  /[@＠]/, /\barroba\b/i,                           // cualquier @ (usuarios de Instagram, correos) y "arroba"
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,      // email addresses
  /\bwa\.me\b/i, /\bwhatsapp\.com\b/i,              // WhatsApp links
  /\bt\.me\/\w/i, /\btelegram\.me\b/i,              // Telegram links
  /\btelefono\s*:/i, /\bcontacto\s*:/i,             // explicit contact labels
  /\bllam[ae]\s*al\b/i,                             // "llama al..."
  /\bescrib[ei]\s*al\b/i,                           // "escríbeme al..."
];

// ── XSS / injection ──────────────────────────────────────────────────────────
const XSS_PATTERNS = [
  /<script[\s>]/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,
  /<iframe[\s>]/i,
  /<img[^>]+onerror/i,
  /data:text\/html/i,
  /vbscript\s*:/i,
];

export function containsBlockedContent(text: string): boolean {
  if (containsPhoneNumber(text)) return true;
  return (
    [...HATE_PATTERNS, ...ADULT_PATTERNS, ...PROFANITY_PATTERNS, ...XSS_PATTERNS]
      .some(p => p.test(text))
    || contieneInsulto(text)
  );
}

const MAX_LENGTHS: Record<string, number> = {
  default: 500,
  bio: 800,
  name: 60,
};

export function sanitizeInput(text: string, field: 'bio' | 'name' | 'default' = 'default'): { clean: boolean; reason?: string } {
  const maxLen = MAX_LENGTHS[field];
  if (text.length > maxLen) return { clean: false, reason: `Máximo ${maxLen} caracteres.` };

  if (containsPhoneNumber(text)) {
    return { clean: false, reason: 'No compartas datos de contacto aquí. Usa el sistema de mensajes de XPEAK.' };
  }
  for (const p of HATE_PATTERNS) {
    if (p.test(text)) return { clean: false, reason: 'El texto contiene lenguaje discriminatorio u ofensivo.' };
  }
  for (const p of ADULT_PATTERNS) {
    if (p.test(text)) return { clean: false, reason: 'No se permite contenido para adultos en los perfiles.' };
  }
  for (const p of PROFANITY_PATTERNS) {
    if (p.test(text)) return { clean: false, reason: 'El texto contiene lenguaje no permitido.' };
  }
  if (contieneInsulto(text)) return { clean: false, reason: 'El texto contiene lenguaje no permitido.' };
  for (const p of CONTACT_BYPASS_PATTERNS) {
    if (p.test(text)) return { clean: false, reason: 'No compartas datos de contacto aquí. Usa el sistema de mensajes de XPEAK.' };
  }
  for (const p of XSS_PATTERNS) {
    if (p.test(text)) return { clean: false, reason: 'El texto contiene contenido no permitido.' };
  }
  return { clean: true };
}
