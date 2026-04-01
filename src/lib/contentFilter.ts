/**
 * Client-side content moderation for XPEAK.
 * Blocks: profanity (ES/EN), hate speech, homophobia, adult content, contact bypass.
 * Not a replacement for server-side moderation — use as first line of defense.
 */

const HATE_PATTERNS = [
  /\bmaric[oó]n\b/i, /\bmarica\b/i, /\bbollerazo?\b/i,
  /\bnazi\b/i, /\bsieg heil\b/i, /\bnigger\b/i, /\bfaggot\b/i,
  /\bmuerte a los?\b/i, /\bhitler\b/i, /\bblackface\b/i,
];

const ADULT_PATTERNS = [
  /\bporno?\b/i, /\bescorts?\b/i, /\bprostitu/i, /\bputero\b/i,
  /\bxxx\b/i, /\bonlyfans\b/i, /\bdesnud/i, /\bnude\b/i,
  /\bmasaje\s*er[oó]tico/i, /\bservicio\s*privado\b/i,
];

const PROFANITY_PATTERNS = [
  /\bhijodeput/i, /\bgilipoll/i,
  /\bfuck\b/i, /\bshit\b/i, /\basshole\b/i, /\bcunt\b/i,
];

// Contact info bypass — users trying to share contact outside the platform
const CONTACT_BYPASS_PATTERNS = [
  /\b\d{9,}\b/,                                        // phone numbers
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,           // email
  /\bwa\.me\b/i, /\bwhatsapp\.com\b/i,
  /\bt\.me\/\w/i, /\btelegram\.me\b/i,
];

export function containsBlockedContent(text: string): boolean {
  return (
    [...HATE_PATTERNS, ...ADULT_PATTERNS, ...PROFANITY_PATTERNS]
      .some(p => p.test(text))
  );
}

export function sanitizeInput(text: string): { clean: boolean; reason?: string } {
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
  return { clean: true };
}
