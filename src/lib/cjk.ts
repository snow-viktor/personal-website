// CJK code ranges, including punctuation and all ideograph planes. A CJK test
// here means "rendered as a per-character glyph, not a whitespace-delimited
// word" — so it drives both word counting (utils) and search tokenization
// (search-client), and must be roughly exhaustive, not just the common range:
// CJK punctuation 0x3000–0x303F (「」『』、。) would otherwise be lumped into
// Latin "words" (word search) or produced as noise tokens (search), and
// Extension-B+ ideographs (rare han) would inflate Latin word counts.
export function isCjkChar(code: number): boolean {
  return (
    (code >= 0x3000 && code <= 0x9fff) || // punctuation, radicals, common, Ext-A
    (code >= 0xf900 && code <= 0xfaff) || // compatibility ideographs
    (code >= 0x20000 && code <= 0x323af) // extensions B–H, compat supplement
  );
}
