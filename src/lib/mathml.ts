import temml from 'temml';
import { defineMdastPlugin } from 'satteri';
import { MATH } from '../config';

// Build-time LaTeX → native MathML via Temml (zero client JS).
// Runs on MDAST math/inlineMath nodes so Astro's syntax highlighter
// (which claims pre>code before any HAST plugin) never sees math as code.
// Returns mdast html nodes (same approach as satteri-katex): an html node
// in phrasing position stays inline, while a { raw } string splice is
// re-parsed as block Markdown and splits the surrounding paragraph.
// Enable features.rawHtml so the MathML becomes real elements on the MDX
// pipeline too.

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

function renderMath(source: string, displayMode: boolean) {
  try {
    return {
      type: 'html' as const,
      value: temml.renderToString(source, {
        displayMode,
        annotate: MATH.annotate,
        throwOnError: MATH.throwOnError,
        trust: MATH.trust,
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid math';
    return {
      type: 'html' as const,
      value: `<span class="math-fallback" title="${escapeHtml(message)}">${escapeHtml(source)}</span>`,
    };
  }
}

export function mathMlPlugin() {
  return defineMdastPlugin({
    name: 'temml-mathml',
    math(node) {
      return renderMath(node.value, true);
    },
    inlineMath(node) {
      return renderMath(node.value, false);
    },
  });
}
