import { isCjkChar } from './cjk';

export function tokenize(text: string): string[] {
  const segmenter =
    typeof Intl.Segmenter !== 'undefined'
      ? new Intl.Segmenter('zh-TW', { granularity: 'word' })
      : null;

  const tokens: string[] = [];
  const chars = [...text];

  let i = 0;
  while (i < chars.length) {
    if (isCjkChar(chars[i].charCodeAt(0))) {
      let j = i;
      while (j < chars.length && isCjkChar(chars[j].charCodeAt(0))) j++;
      const cjkSegment = chars.slice(i, j).join('');

      if (segmenter) {
        const segments = segmenter.segment(cjkSegment);
        for (const seg of segments) {
          if (seg.isWordLike) {
            tokens.push(seg.segment.toLowerCase());
          }
        }
      }

      const cjkText = cjkSegment.toLowerCase();
      for (let k = 0; k < cjkText.length - 1; k++) {
        tokens.push(cjkText.slice(k, k + 2));
      }
      if (cjkText.length === 1) tokens.push(cjkText);

      i = j;
    } else {
      let j = i;
      while (j < chars.length && !isCjkChar(chars[j].charCodeAt(0)) && chars[j] !== ' ') j++;
      if (j > i) {
        const word = chars.slice(i, j).join('').toLowerCase();
        tokens.push(word);
        i = j;
      } else {
        i++;
      }
    }
  }

  return tokens;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function highlightMatches(text: string, query: string): string {
  const escaped = escapeHtml(text);
  const terms = query.split(/\s+/).filter(Boolean);
  let result = escaped;
  for (const term of terms) {
    const pattern = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(`(${pattern})`, 'gi'),
      '<mark>$1</mark>'
    );
  }
  return result;
}

export function extractSnippet(
  text: string,
  query: string,
  contextLen: number = 60
): string | null {
  const lower = text.toLowerCase();
  const qLower = query.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return null;

  const start = Math.max(0, idx - contextLen);
  const end = Math.min(text.length, idx + qLower.length + contextLen);
  let snippet = text.slice(start, end);

  if (start > 0) snippet = '…' + snippet;
  if (end < text.length) snippet = snippet + '…';

  return snippet;
}
