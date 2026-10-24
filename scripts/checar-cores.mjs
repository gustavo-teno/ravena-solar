// Garante que nenhuma cor foi digitada à mão e que as cores da página saem do logo.svg.
// Se este check falhar, descubra se a PÁGINA ou o CHECK está errado. Nunca afrouxe o check para passar.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marca, tokens } from './tokens.mjs';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const COR = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])|\b(?:rgb|rgba|hsl|hsla|oklch|lab)\(/gi;
let falhas = 0;

function arquivos(pasta) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

// 1. Código-fonte: nenhuma cor literal.
for (const pasta of ['src', 'server', 'api', 'shared']) {
  for (const arquivo of arquivos(join(raiz, pasta))) {
    if (!/\.(css|html|js|mjs)$/.test(arquivo)) continue;
    const texto = readFileSync(arquivo, 'utf8');
    for (const m of texto.matchAll(COR)) {
      falhas += 1;
      console.error(`FALHOU: cor literal "${m[0]}" em ${arquivo.replace(raiz, '')}. Use var(--...) (tokens do logo.svg).`);
    }
  }
}

// 2. As variáveis da página gerada têm de ser as do logo.svg.
const logo = readFileSync(join(raiz, 'logo.svg'), 'utf8').toUpperCase();
for (const [nome, hex] of Object.entries(marca)) {
  if (!logo.includes(hex)) {
    falhas += 1;
    console.error(`FALHOU: ${nome} ${hex} não está no logo.svg.`);
  }
  const html = readFileSync(join(raiz, 'public/index.html'), 'utf8').toUpperCase();
  if (!html.includes(`--${nome.toUpperCase()}:${hex}`)) {
    falhas += 1;
    console.error(`FALHOU: public/index.html não traz --${nome}:${hex}. Rode npm run build.`);
  }
}

if (falhas) process.exit(1);
console.log(`OK: sem cor literal no código; ${Object.keys(marca).length} cores da marca lidas do logo.svg (${Object.values(marca).join(', ')}); ${Object.keys(tokens).length} tokens no total.`);
