// Gera src/og.png (1200x630) para o link no WhatsApp, com as cores lidas do logo.svg.
// Rode "npm run og" só quando o texto ou o logo mudarem; o PNG fica versionado.
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { tokens } from './tokens.mjs';

const logo = readFileSync(new URL('../logo.svg', import.meta.url), 'utf8')
  .replace(/<svg[^>]*>/, '')
  .replace('</svg>', '');

const fonte = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${tokens.papel}"/>
  <rect x="0" y="0" width="14" height="630" fill="${tokens.ambar}"/>
  <g transform="translate(64 48) scale(0.62)">${logo}</g>
  <text x="64" y="290" font-family="${fonte}" font-size="58" font-weight="800" fill="${tokens.azul}">Na média dos nossos clientes,</text>
  <text x="64" y="366" font-family="${fonte}" font-size="58" font-weight="800" fill="${tokens.azul}">a conta de luz cai de 75% a 90%.</text>
  <rect x="64" y="384" width="520" height="8" fill="${tokens.ambar}"/>
  <text x="64" y="466" font-family="${fonte}" font-size="34" fill="${tokens.suave}">412 sistemas instalados · equipe própria · 4,8 no Google</text>
  <text x="64" y="520" font-family="${fonte}" font-size="30" fill="${tokens.suave}">Casas em Sorocaba, Votorantim, Itu e Salto</text>
  <rect x="64" y="552" width="360" height="4" fill="${tokens.azul}"/>
</svg>`;

const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'Arial' } }).render().asPng();
writeFileSync(new URL('../src/og.png', import.meta.url), png);
console.log('src/og.png gerado (' + png.length + ' bytes)');
