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
  [/\bc[e3]ro\b/gi,          '0'],
  [/\bun[ao]\b/gi,           '1'],
  [/\bdos\b/gi,              '2'],
  [/\btr[e3]s\b/gi,          '3'],
  [/\bcuatro\b/gi,           '4'],
  [/\bcinco\b/gi,            '5'],
  [/\bs[e3][i1]s\b/gi,       '6'],
  [/\bs[i1][e3]t[e3]\b/gi,   '7'],
  [/\b[o0]ch[o0]\b/gi,       '8'],
  [/\bnueve\b/gi,            '9'],
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
  const normalized = wordToDigits(text.toLowerCase());

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

// ── Contact bypass (platform circumvention) ──────────────────────────────────
// Note: phone detection is handled separately via containsPhoneNumber()
const CONTACT_BYPASS_PATTERNS = [
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
  for (const p of CONTACT_BYPASS_PATTERNS) {
    if (p.test(text)) return { clean: false, reason: 'No compartas datos de contacto aquí. Usa el sistema de mensajes de XPEAK.' };
  }
  for (const p of XSS_PATTERNS) {
    if (p.test(text)) return { clean: false, reason: 'El texto contiene contenido no permitido.' };
  }
  return { clean: true };
}
