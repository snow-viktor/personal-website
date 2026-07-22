export function stripMarkdown(text: string): string {
  return text
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\s*\/?>/g, '')
    .trim();
}

function isCjkDominant(text: string): boolean {
  let cjk = 0;
  let total = 0;
  for (const ch of text) {
    if (ch === ' ' || ch === '\n') continue;
    total++;
    const code = ch.charCodeAt(0);
    if (
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0x2e80 && code <= 0x2eff)
    )
      cjk++;
  }
  return total > 0 && cjk / total > 0.3;
}

export function truncate(text: string, length?: number): string {
  const stripped = stripMarkdown(text).replace(/\n{2,}/g, ' ');
  const limit = length ?? (isCjkDominant(stripped) ? 125 : 250);
  if (stripped.length <= limit) return stripped;
  return stripped.slice(0, limit) + '…';
}

export function countWords(text: string): number {
  const stripped = stripMarkdown(text);
  let count = 0;
  const chars = [...stripped];
  let i = 0;
  while (i < chars.length) {
    const code = chars[i].charCodeAt(0);
    const isCJK =
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0x2e80 && code <= 0x2eff);
    if (isCJK) {
      count++;
      i++;
    } else if (chars[i].trim()) {
      while (i < chars.length && chars[i].trim()) {
        const c2 = chars[i].charCodeAt(0);
        if (
          (c2 >= 0x4e00 && c2 <= 0x9fff) ||
          (c2 >= 0x3400 && c2 <= 0x4dbf) ||
          (c2 >= 0x2e80 && c2 <= 0x2eff)
        )
          break;
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
