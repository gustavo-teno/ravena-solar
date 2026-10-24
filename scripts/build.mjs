// Gera public/: injeta as cores lidas do logo.svg, as opções do formulário (vindas de
// shared/validacao.js) e embute o CSS no HTML para a página não piscar sem estilo.
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { cssDeTokens, tokens } from './tokens.mjs';
import { CIDADES, FAIXAS_CONTA } from '../shared/validacao.js';

const raiz = new URL('../', import.meta.url);
const ler = (caminho) => readFileSync(new URL(caminho, raiz), 'utf8');
const gravar = (caminho, conteudo) => writeFileSync(new URL('public/' + caminho, raiz), conteudo);

const siteUrl = (process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '').replace(/\/$/, '');
const base = siteUrl && !siteUrl.startsWith('http') ? 'https://' + siteUrl : siteUrl;

rmSync(new URL('public/', raiz), { recursive: true, force: true });
mkdirSync(new URL('public/', raiz), { recursive: true });

const css = (cssDeTokens() + ler('src/estilos.css'))
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s*\n\s*/g, ' ')
  .replace(/\s*([{};,>])\s*/g, '$1')
  .replace(/;}/g, '}');

const opcoes = (lista) => lista.map((i) => `<option value="${i.id}">${i.rotulo}</option>`).join('\n                ');

function montar(arquivo) {
  return ler('src/' + arquivo)
    .replace('<!--CSS-->', `<style>${css}</style>`)
    .replace('<!--CIDADES-->', opcoes(CIDADES))
    .replace('<!--FAIXAS-->', opcoes(FAIXAS_CONTA))
    .replaceAll('%AZUL%', tokens.azul)
    .replaceAll('%SITE_URL%', base);
}

for (const pagina of ['index.html', 'politica-de-privacidade.html', 'pedido-enviado.html']) {
  gravar(pagina, montar(pagina));
}

// O navegador usa os mesmos arquivos do servidor.
copyFileSync(new URL('src/app.js', raiz), new URL('public/app.js', raiz));
copyFileSync(new URL('shared/validacao.js', raiz), new URL('public/validacao.js', raiz));
copyFileSync(new URL('logo.svg', raiz), new URL('public/logo.svg', raiz));
if (existsSync(new URL('src/og.png', raiz))) copyFileSync(new URL('src/og.png', raiz), new URL('public/og.png', raiz));

// Ícone da aba: o sol e o telhado do logo, com as cores do logo.
gravar(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${tokens.azul}"/>` +
    `<circle cx="32" cy="26" r="13" fill="${tokens.ambar}"/><path d="M12 50 L24 34 L40 34 L52 50 Z" fill="${tokens.branco}"/></svg>`,
);

console.log('build ok -> public/' + (base ? ` (SITE_URL=${base})` : ' (SITE_URL não definido: og:image relativo)'));
