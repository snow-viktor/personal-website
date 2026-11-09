/**
 * Generate public/og.png (social preview, 1200x630) and public/logo-512.png
 * (rasterized favicon, referenced by JSON-LD publisher logo).
 *
 * Run: node scripts/generate-og.mjs   (requires network for font subsetting)
 *
 * Pipeline:
 *   1. Fetch glyph-subset webfonts from Google Fonts (`text=` API), so the
 *      downloads stay a few KB: "SnowViktor" in Noto Serif 700 (the Latin face
 *      that leads the site's heading stack) and "彬彬" in Noto Serif TC 400.
 *   2. Render the text layer with satori — it embeds glyphs as <path>, so the
 *      output depends on no system fonts. The marker sweep behind "Viktor"
 *      mirrors the homepage hero (.hero-mark in src/pages/index.astro).
 *   3. Rasterize scripts/og-base.svg (glow + moon-and-mountain mark) and the
 *      satori layer with sharp, composite, and write public/og.png.
 *  Fonts are not committed; outputs are.
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, 'public');

const WIDTH = 1200;
const HEIGHT = 630;

// Modern Chrome UA so Google Fonts serves woff2 subsets.
const FONT_CSS_URL = (family, weight, text) =>
  `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;

/** `text=` returns a subset woff2 URL inside a @font-face block. */
async function fetchSubsetFont(family, weight, text) {
  const cssUrl = FONT_CSS_URL(family, weight, text);
  const css = await (await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' },
  })).text();
  const match = css.match(/url\((https:[^)\s]+)\)/);
  if (!match) throw new Error(`No woff2 subset URL returned for ${family}:${weight} (got: ${css.slice(0, 200)}…)`);
  const data = await (await fetch(match[1])).arrayBuffer();
  return Buffer.from(data);
}

async function main() {
  const [latin, cjk] = await Promise.all([
    fetchSubsetFont('Noto Serif', '700', 'SnowViktor'),
    fetchSubsetFont('Noto Serif TC', '400', '彬彬'),
  ]);

  // Text layer: transparent canvas, text only. The name split (-0.03em, 700)
  // and marker gradient mirror the hero: index.astro .hero-title/.hero-mark.
  const satoriSvg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '0 96px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontFamily: 'Noto Serif',
                fontWeight: 700,
                fontSize: 120,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#ededf0',
              },
              children: [
                { type: 'span', props: { children: 'Snow' } },
                {
                  type: 'span',
                  props: {
                    children: 'Viktor',
                    // Marker rule: hand-marker sweep behind the name's tail,
                    // bottom third only — highlight, never recoloring the type.
                    style: {
                      backgroundImage:
                        'linear-gradient(to top, rgba(228, 138, 74, 0.32) 0 32%, transparent 32%)',
                      paddingBottom: 4,
                    },
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              children: '彬彬',
              style: {
                fontFamily: 'Noto Serif TC',
                fontWeight: 400,
                fontSize: 48,
                marginTop: 28,
                letterSpacing: '0.02em',
                color: '#d4a060',
              },
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Noto Serif', data: latin, weight: 700, style: 'normal' },
        { name: 'Noto Serif TC', data: cjk, weight: 400, style: 'normal' },
      ],
    }
  );

  const basePng = await sharp(path.join(root, 'scripts', 'og-base.svg'))
    .resize(WIDTH, HEIGHT)
    .png()
    .toBuffer();
  const textPng = await sharp(Buffer.from(satoriSvg)).png().toBuffer();

  const og = await sharp(basePng)
    .composite([{ input: textPng }])
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(path.join(publicDir, 'og.png'), og);

  // JSON-LD publisher logo: the SVG favicon is widely rejected by consumers,
  // so emit a rasterized square version.
  const logo = await sharp(path.join(publicDir, 'favicon.svg'), { density: 800 })
    .resize(512, 512)
    .png()
    .toBuffer();
  await writeFile(path.join(publicDir, 'logo-512.png'), logo);

  for (const file of ['og.png', 'logo-512.png']) {
    const { size } = await stat(path.join(publicDir, file));
    console.log(`public/${file}: ${(size / 1024).toFixed(1)} KB`);
  }
}

try {
  await mkdir(publicDir, { recursive: true });
  await main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
