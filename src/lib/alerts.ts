import { defineMdastPlugin } from 'satteri';

// Build-time GitHub-style alerts: `> [!NOTE]` / `> [!TIP]` / `> [!IMPORTANT]` /
// `> [!WARNING]` / `> [!CAUTION]` blockquotes become <aside role="note">
// callouts instead of quotations (an alert is not a quote, so <blockquote>
// would misannounce it to assistive tech).
// Same mdast-plugin pattern as src/lib/mathml.ts (zero client JS).

const MARKER_RE = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([ \t]*\n?[ \t]*)/i;

const LABELS: Record<string, string> = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};

export function alertsPlugin() {
  return defineMdastPlugin({
    name: 'github-alerts',
    blockquote(node, ctx) {
      const first = node.children[0];
      if (!first || first.type !== 'paragraph') return;
      const head = first.children[0];
      if (!head || head.type !== 'text') return;
      const match = MARKER_RE.exec(head.value);
      if (!match) return;

      const kind = match[1].toLowerCase();
      const rest = head.value.slice(match[0].length);
      const sibling = first.children[1];

      if (rest.length === 0 && first.children.length === 1) {
        ctx.removeChildAt(node, 0);
      } else if (rest.length === 0) {
        ctx.removeChildAt(first, 0);
        if (sibling?.type === 'break') ctx.removeChildAt(first, 0);
      } else {
        ctx.setProperty(head, 'value', rest);
      }

      ctx.setProperty(node, 'data', {
        hName: 'aside',
        hProperties: {
          className: ['markdown-alert', `markdown-alert-${kind}`],
          role: 'note',
          dataAlert: kind,
        },
      });
      ctx.prependChild(node, {
        type: 'paragraph',
        children: [{ type: 'text', value: LABELS[kind] ?? kind }],
        data: { hProperties: { className: ['markdown-alert-title'] } },
      });
    },
  });
}
