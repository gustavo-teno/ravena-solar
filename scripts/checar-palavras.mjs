// Falha se a página usar palavras que o cliente proibiu (brief, "Como falamos").
// Se este check falhar, descubra se a PÁGINA ou o CHECK está errado. Nunca afrouxe o check para passar.
import { paginas, textoVisivel, textoDoApp } from './texto-visivel.mjs';

const PROIBIDAS = [
  [/gr[aá]tis/i, '"grátis" (o brief autoriza "gratuita e sem compromisso" só para a visita)'],
  [/energia do futuro/i, 'slogan "energia do futuro"'],
  [/revolu[cç][aã]o solar/i, 'slogan "revolução solar"'],
  [/sustentabilidade|sustent[aá]vel/i, '"sustentabilidade" como slogan'],
  [/95\s*%/, 'promessa de 95%'],
  [/100\s*%/, 'promessa de 100%'],
  [/\b24\s*h\b|24 horas/i, '"24h" de atendimento (o brief diz mesmo dia útil)'],
  [/\bzerar\b|\bzere\b|\bzerou\b|conta zero/i, 'prometer zerar a conta'],
  [/(?<!n[aã]o )\bzera\b/i, '"zera" sem negação'],
  [/garantid[oa]\b(?! de)/i, '"garantido/a" (promessa solta)'],
  [/\bm[aá]ximo\b|\bmelhor do mercado\b|\bl[ií]der\b/i, 'superlativo não verificável'],
];

let falhas = 0;
const fontes = [...paginas().map((p) => ({ nome: p.nome, texto: textoVisivel(p.html) })), { nome: 'app.js', texto: textoDoApp() }];

for (const { nome, texto } of fontes) {
  for (const [regex, motivo] of PROIBIDAS) {
    const m = texto.match(regex);
    if (m) {
      falhas += 1;
      const i = m.index;
      console.error(`FALHOU em ${nome}: ${motivo}\n  ...${texto.slice(Math.max(0, i - 40), i + 60).replace(/\s+/g, ' ')}...`);
    }
  }
}

if (falhas) process.exit(1);
console.log(`OK: nenhuma das ${PROIBIDAS.length} palavras/promessas proibidas em ${fontes.length} arquivos.`);
