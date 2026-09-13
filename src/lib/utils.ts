import { isCjkChar } from './cjk';

export { isCjkChar };

export const CJK_THRESHOLD = 0.3;
export const CJK_READING_SPEED = 500;
export const LATIN_READING_SPEED = 200;
export const TRUNCATE_CJK = 125;
export const TRUNCATE_LATIN = 250;

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

function stripMath(text: string): string {
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/(?<!\$)\$(?!\$)([^$\n]+?)(?<!\$)\$(?!\$)/g, ' ');
}

function stripFrontmatter(text: string): string {
  return text.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '');
}

function stripFencedBlocks(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ');
}

function stripHtml(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/?[A-Za-z][^<>]*?\/?>/g, ' ');
}

export function stripMarkdown(text: string): string {
  const withoutAutolink = stripFencedBlocks(stripFrontmatter(stripMath(text))).replace(
    /<(https?:[^>\s]+)>/g,
    '$1'
  );
  return stripHtml(withoutAutolink)
    .replace(/^\s{0,3}import\s.+$/gm, '')
    .replace(/^\s{0,3}export\s.+$/gm, '')
    .replace(/^(\s{0,3}\[[^\]]+\]:\s*\S+.*)$/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(/\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/gi, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*[-|*_: \t]+$/gm, '')
    .replace(/^\s{0,3}(?:[-*+]|\d+[.)])\s+(?:\[[ xX]\]\s*)?/gm, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/`+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/(?<!\w)_([^_]+)_(?!\w)/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/\[\^[^\]]*\]/g, '')
    .replace(/\|/g, ' ')
    .split('\n')
    .map((line) => line.replace(/[ \t\u3000]+/g, ' ').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripForReading(text: string): string {
  return stripMarkdown(text);
}

export function truncate(text: string, length?: number): string {
  const stripped = stripMarkdown(text);
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

export function computeReadingTime(body: string): number {
  const wordCount = countWords(body);
  const stripped = stripForReading(body);
  const cjkCount = [...stripped].filter((ch) => isCjkChar(ch.charCodeAt(0))).length;
  const totalChars = stripped.replace(/\s/g, '').length || 1;
  const isCjkDominant = cjkCount / totalChars > CJK_THRESHOLD;
  return Math.max(1, Math.round(wordCount / (isCjkDominant ? CJK_READING_SPEED : LATIN_READING_SPEED)));
}

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});