// Builds sprite.svg from the optimized icons in svg/opt.
//
// Replaces the abandoned `spritesh` package (last published 2022, pulled in a
// vulnerable cheerio@0.20 tree). The output format is byte-for-byte what
// spritesh produced — including its two spaces after `<symbol` and its
// single-quoted attributes — so upgrades stay reviewable as an empty diff.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INPUT = path.join(root, 'svg', 'opt');
const OUTPUT = path.join(root, 'sprite.svg');

const HEADER =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
  ' style="width: 0; height: 0; visibility: hidden; position: absolute;" aria-hidden="true">';

// spritesh rendered through cheerio, which expands `<path/>` to `<path></path>`.
const expandSelfClosing = (markup) =>
  markup.replace(/<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)\s*\/>/g, '<$1$2></$1>');

const files = fs
  .readdirSync(INPUT)
  .filter((f) => f.endsWith('.svg'))
  .sort();

const symbols = files.map((file) => {
  const id = path.basename(file, '.svg');
  const source = fs.readFileSync(path.join(INPUT, file), 'utf8');

  const open = source.match(/<svg\b[^>]*>/);
  if (!open) throw new Error(`${file}: no <svg> element found`);

  const viewBox = open[0].match(/viewBox=["']([^"']+)["']/);
  if (!viewBox) throw new Error(`${file}: no viewBox — spriting it would lose its scale`);

  const inner = source.slice(open.index + open[0].length, source.lastIndexOf('</svg>')).trim();
  if (!inner) throw new Error(`${file}: <svg> is empty`);

  console.log(`Processing '${id}' (viewBox '${viewBox[1]}')…`);
  return `<symbol  viewBox='${viewBox[1]}' id='${id}'>\n    ${expandSelfClosing(inner)}\n  </symbol>`;
});

fs.writeFileSync(OUTPUT, `${HEADER}${symbols.join('')}</svg>`, 'utf8');
console.log(`File 'sprite.svg' successfully generated (${symbols.length} symbols).`);
