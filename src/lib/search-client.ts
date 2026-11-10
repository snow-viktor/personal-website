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

// Date search tokens are derived from the exact display text a result card
// renders ('YYYY/MM/DD', zh-TW 2-digit), so typing the date as shown always
// matches — never the UTC-shifted date part of the stored ISO string. Both
// separators and both paddings are emitted, plus standalone pieces and
// 年/月/日, so mixed queries ('2024', '2024/02', '02月18日', '2024年2月18日')
// match the date field term-by-term under AND combination. The compact forms
// ('20240218', '0218') cover separator-free digit queries ('20240218'), and
// every earlier prefix of them ('2024', '202402') hits via prefix matching,
// so only the full sequences are needed. The set dedupes padded/unpadded
// pieces when the number is already two digits (Oct–Dec).
export function getDateTokens(dateText: string): string[] {
  const match = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(dateText);
  if (!match) return [];

  const [, year, month, day] = match;
  const unpadMonth = String(Number(month));
  const unpadDay = String(Number(day));

  return [
    ...new Set([
      dateText, // 2024/02/18 (displayed form)
      `${year}${month}${day}`, // 20240218 (compact)
      `${year}-${month}-${day}`,
      `${month}${day}`, // 0218 (compact month-day)
      `${month}/${day}`, // month-day compounds, so '02/18' works as a query
      `${month}-${day}`,
      `${unpadMonth}/${unpadDay}`, // 2024/2/18 (unpadded)
      `${unpadMonth}-${unpadDay}`,
      year,
      month,
      day,
      unpadMonth,
      unpadDay,
      '年',
      '月',
      '日',
    ]),
  ];
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Split a raw query once so per-result work reuses the same terms instead of
// re-splitting for every rendered card.
export function getQueryTerms(query: string): string[] {
  return query.split(/\s+/).filter(Boolean);
}

// A compact date query ('20240218') matches the index but never appears in
// rendered text ('2024/02/18'), so highlight patterns (and nothing else —
// snippets match the raw term against body text) need display-form
// alternatives for it. Longest-compound-first is unnecessary here:
// buildHighlightPattern already sorts by length.
export function expandDateTerm(term: string): string[] {
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(term);
  if (!match) return [];

  const [, year, month, day] = match;
  return [
    `${year}/${month}/${day}`,
    `${year}/${month}`,
    `${month}/${day}`,
    year,
    month,
    day,
  ];
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
