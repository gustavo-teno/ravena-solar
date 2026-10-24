// Falha se a página mostrar um número que não está no brief.
// Cada número permitido traz, ao lado, a linha do brief (ou a decisão) que o autoriza.
// Se este check falhar, descubra se a PÁGINA ou o CHECK está errado. Nunca afrouxe o check para passar.
import { paginas, textoVisivel, textoDoApp } from './texto-visivel.mjs';

const brief = (trecho) => `brief: ${trecho}`;
const FAIXA = 'faixa do formulário (decisão de design, não afirmação)';

const PERMITIDOS = {
  '75': [{ fonte: brief('"a conta cai entre 75% e 90%"; "indústria nem comércio acima de 75 kWp"') }],
  '90': [{ fonte: brief('"a conta cai entre 75% e 90%"') }],
  '3': [{ fonte: brief('"de três a quatro anos" de retorno') }],
  '4': [{ fonte: brief('"de três a quatro anos" de retorno') }],
  '25': [{ fonte: brief('"o sistema dura mais de 25"; "25 anos de performance do painel"') }],
  '450': [{ fonte: brief('"conta de luz acima de R$ 450 por mês"') }],
  '412': [{ fonte: brief('"412 sistemas residenciais"') }],
  '6': [{ fonte: brief('"seis anos"; "6,4 kWp" é outro token') }],
  '11': [{ fonte: brief('"seis anos, onze pessoas, sede em Sorocaba"') }],
  '4,8': [{ fonte: brief('"Nota 4,8 no Google"') }],
  '137': [{ fonte: brief('"137 avaliações"') }],
  '80': [{ fonte: brief('"num raio de 80 km"') }],
  '14': [{ fonte: brief('"R$ 14 mil e R$ 19 mil"') }],
  '19': [{ fonte: brief('"R$ 14 mil e R$ 19 mil"') }],
  '5': [{ fonte: brief('"entre 5 e 8 kWp"; "5 anos da nossa instalação"') }],
  '8': [{ fonte: brief('"entre 5 e 8 kWp"') }],
  '12': [
    { fonte: brief('"de doze a vinte painéis"'), em: ['index.html'] },
    { fonte: 'PROPOSTA a confirmar com o cliente: guarda de 12 meses (ver FALTA.md)', em: ['politica-de-privacidade.html'] },
  ],
  '20': [{ fonte: brief('"de doze a vinte painéis"') }],
  '45': [{ fonte: brief('"de 45 a 60 dias entre a assinatura e o sistema ligado"') }],
  '60': [{ fonte: brief('"de 45 a 60 dias"') }],
  '2': [{ fonte: brief('"A instalação em si leva dois dias"') }],
  '10': [{ fonte: brief('"10 anos do inversor"') }],
  '780': [{ fonte: brief('"conta de R$ 780 por mês"') }],
  '118': [{ fonte: brief('"conta média dos últimos doze meses em R$ 118"') }],
  '6,4': [{ fonte: brief('"sistema de 6,4 kWp"') }],
  '2025': [{ fonte: brief('"instalado em março de 2025"') }],
  '14.300': [{ fonte: brief('"desde a Lei 14.300"') }],
  '85': [{ fonte: 'derivado do caso real: 1 − 118/780 = 84,9%, rotulado como "neste caso", nunca como média' }],
  '78': [{ fonte: 'derivado do exemplo do simulador: estimarConta(780), queda de 90%', em: ['index.html'] }],
  '195': [{ fonte: 'derivado do exemplo do simulador: estimarConta(780), queda de 75%', em: ['index.html'] }],
  '700': [{ fonte: FAIXA, em: ['index.html'] }],
  '1.000': [{ fonte: FAIXA, em: ['index.html'] }],
  '4 MB': [{ fonte: 'limite técnico do anexo (corpo máximo de função na Vercel é 4,5 MB)', em: ['index.html'] }],
};

const achados = new Map(); // token -> { paginas:Set, vezes }
const desconhecidos = [];

function registrar(token, nome) {
  const entradas = PERMITIDOS[token];
  const ok = entradas?.some((e) => !e.em || e.em.includes(nome));
  if (!ok) desconhecidos.push(`${token}  (em ${nome})`);
  const atual = achados.get(token) || { paginas: new Set(), vezes: 0 };
  atual.paginas.add(nome);
  atual.vezes += 1;
  achados.set(token, atual);
}

function extrair(texto, nome) {
  let resto = texto;
  for (const m of resto.matchAll(/(\d+)\s*MB\b/g)) registrar(`${m[1]} MB`, nome);
  resto = resto.replace(/(\d+)\s*MB\b/g, ' ');
  for (const m of resto.matchAll(/\d[\d.,]*\d|\d/g)) registrar(m[0].replace(/[.,]$/, ''), nome);
}

for (const { nome, html } of paginas()) extrair(textoVisivel(html), nome);

// Textos que o app.js escreve na tela (resultado do simulador).
const textosDoApp = [...textoDoApp().matchAll(/`([^`]*)`/g)].map((m) => m[1].replace(/\$\{[^}]*\}/g, ' ')).join(' ');
extrair(textosDoApp, 'app.js');

console.log('Número   | Onde aparece                         | Fonte');
console.log('---------|--------------------------------------|------');
for (const [token, info] of [...achados].sort((a, b) => a[0].localeCompare(b[0], 'pt', { numeric: true }))) {
  const fonte = (PERMITIDOS[token] || []).map((e) => e.fonte).join(' | ') || '??? SEM FONTE';
  console.log(`${token.padEnd(8)} | ${[...info.paginas].join(', ').padEnd(36)} | ${fonte}`);
}

if (desconhecidos.length) {
  console.error('\nFALHOU: números sem fonte no brief:\n  ' + desconhecidos.join('\n  '));
  process.exit(1);
}
console.log(`\nOK: ${achados.size} números distintos, todos com fonte.`);
