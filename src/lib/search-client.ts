import { isCjkChar } from './cjk';

// Intl.Segmenter construction is expensive (~ms) and tokenize() runs once per
// indexed field per document plus once per keystroke. Cache a singleton so
// indexing stays in short tasks and typing never blocks on construction.
let cachedSegmenter: Intl.Segmenter | null | undefined;

function getSegmenter(): Intl.Segmenter | null {
  if (cachedSegmenter !== undefined) return cachedSegmenter;
  try {
    cachedSegmenter =
      typeof Intl.Segmenter !== 'undefined'
        ? new Intl.Segmenter('zh-TW', { granularity: 'word' })
        : null;
  } catch {
    cachedSegmenter = null;
  }
  return cachedSegmenter;
}

export function tokenize(text: string): string[] {
  const segmenter = getSegmenter();

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
  return highlightWithPattern(escapeHtml(text), buildHighlightPattern(getQueryTerms(query)));
}

// Split a raw query once so per-result work reuses the same terms instead of
// re-splitting for every rendered card.
export function getQueryTerms(query: string): string[] {
  return query.split(/\s+/).filter(Boolean);
}

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

// Single combined pattern for all terms: one regex pass over the text instead
// of one pass per term. Longest terms first so alternation prefers them.
export function buildHighlightPattern(terms: string[]): RegExp | null {
  const escaped = terms
    .map((term) => term.replace(REGEX_SPECIAL, '\\$&'))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  if (escaped.length === 0) return null;
  return new RegExp(`(${escaped.join('|')})`, 'gi');
}

// Highlight text that is already HTML-escaped (escape once per doc, reuse per keystroke).
export function highlightWithPattern(escapedText: string, pattern: RegExp | null): string {
  if (!pattern) return escapedText;
  return escapedText.replace(pattern, '<mark>$1</mark>');
}

export function extractSnippet(
  text: string,
  query: string,
  contextLen: number = 60
): string | null {
  return extractSnippetForTerms(text, text.toLowerCase(), getQueryTerms(query).map((t) => t.toLowerCase()), contextLen);
}

// Earliest match of ANY query term, so multi-term / CJK queries still get a
// snippet (the old whole-query indexOf returned null unless the exact phrase
// appeared). Accepts a pre-lowercased body + pre-split terms so per-keystroke
// renders don't re-lowercase full article bodies for every result.
export function extractSnippetForTerms(
  text: string,
  lower: string,
  terms: string[],
  contextLen: number = 60
): string | null {
  let best = -1;
  let bestLen = 0;
  for (const term of terms) {
    if (!term) continue;
    const idx = lower.indexOf(term);
    if (idx !== -1 && (best === -1 || idx < best)) {
      best = idx;
      bestLen = term.length;
    }
  }
  if (best === -1) return null;

  const start = Math.max(0, best - contextLen);
  const end = Math.min(text.length, best + bestLen + contextLen);
  let snippet = text.slice(start, end);

  if (start > 0) snippet = '…' + snippet;
  if (end < text.length) snippet = snippet + '…';

  return snippet;
}
