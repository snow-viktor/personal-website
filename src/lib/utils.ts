export const CJK_THRESHOLD = 0.3;
export const CJK_READING_SPEED = 500;
export const LATIN_READING_SPEED = 200;
export const TRUNCATE_CJK = 125;
export const TRUNCATE_LATIN = 250;

export function isCjkChar(code: number): boolean {
  return (
    (code >= 0x4e00 && code <= 0x9fff) ||
    (code >= 0x3400 && code <= 0x4dbf) ||
    (code >= 0x2e80 && code <= 0x2eff)
  );
}

function isCjkDominant(text: string): boolean {
  let cjk = 0;
  let total = 0;
  for (const ch of text) {
    if (ch === ' ' || ch === '\n') continue;
    total++;
    if (isCjkChar(ch.charCodeAt(0))) cjk++;
  }
  return total > 0 && cjk / total > CJK_THRESHOLD;
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\s*\/?>/g, '')
    .trim();
}

export function truncate(text: string, length?: number): string {
  const stripped = stripMarkdown(text).replace(/\n{2,}/g, ' ');
  const limit = length ?? (isCjkDominant(stripped) ? TRUNCATE_CJK : TRUNCATE_LATIN);
  if (stripped.length <= limit) return stripped;
  return stripped.slice(0, limit) + '…';
}

export function countWords(text: string): number {
  const stripped = stripMarkdown(text);
  let count = 0;
  const chars = [...stripped];
  let i = 0;
  while (i < chars.length) {
    if (isCjkChar(chars[i].charCodeAt(0))) {
      count++;
      i++;
    } else if (chars[i].trim()) {
      while (i < chars.length && chars[i].trim()) {
        if (isCjkChar(chars[i].charCodeAt(0))) break;
        i++;
      }
      count++;
    } else {
      i++;
    }
  }
  return count;
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}