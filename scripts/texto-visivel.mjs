// Extrai o texto que a pessoa vê (e o que o Google/WhatsApp veem) dos HTML gerados em public/.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const pasta = new URL('../public/', import.meta.url);

export function paginas() {
  if (!existsSync(pasta)) throw new Error('public/ não existe. Rode "npm run build" antes.');
  return readdirSync(pasta)
    .filter((nome) => nome.endsWith('.html'))
    .map((nome) => ({ nome, html: readFileSync(new URL(nome, pasta), 'utf8') }));
}

const entidades = { '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

export function textoVisivel(html) {
  const metas = [...html.matchAll(/<meta[^>]+(?:name="description"|property="og:(?:title|description)")[^>]+content="([^"]*)"/g)]
    .map((m) => m[1])
    .join(' \n ');
  const corpo = html
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return (corpo + ' \n ' + metas)
    .replace(/&[a-z#0-9]+;/gi, (e) => entidades[e] ?? ' ')
    .replace(/[ \t]+/g, ' ');
}

// Textos que o navegador escreve na tela: app.js e a saída do simulador (shared/simulacao.js).
export function textoDoApp() {
  return ['../src/app.js', '../shared/simulacao.js']
    .map((arquivo) => readFileSync(new URL(arquivo, import.meta.url), 'utf8'))
    .join('\n');
}
