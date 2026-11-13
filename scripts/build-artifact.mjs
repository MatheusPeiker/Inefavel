// Converte dist-artifact/index.html (gerado com vite-plugin-singlefile) no formato
// de página do Artifact do Claude: sem <html>/<head>/<body>, com título e fontes no topo.
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync('dist-artifact/index.html', 'utf8');
const styles = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
const scripts = [...src.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!styles.length || !scripts.length) throw new Error('Build inesperado: CSS ou JS não encontrados.');
const fonts = src.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)"/)?.[1];

const out = [
  '<title>Passos Automóveis</title>',
  '<meta name="claude:viewport-fit-sides" content="cover">',
  fonts ? `<link rel="stylesheet" href="${fonts}">` : '',
  `<style>${styles.join('\n')}</style>`,
  '<div id="root"></div>',
  ...scripts.map((s) => `<script type="module">${s}</script>`),
  '',
].join('\n');

writeFileSync('dist-artifact/passos-automoveis.html', out);
console.log(`dist-artifact/passos-automoveis.html  ${(out.length / 1024).toFixed(0)} KB`);
