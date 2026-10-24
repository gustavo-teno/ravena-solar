// Mede o contraste dos pares texto/fundo usados no CSS (WCAG AA: 4,5 para texto, 3 para texto grande e bordas).
// Se este check falhar, corrija a COR NA PÁGINA. Nunca baixe o mínimo para passar.
import { tokens, contraste } from './tokens.mjs';

const T = 4.5; // texto normal
const G = 3; // texto grande (>= 24px, ou >= 18,66px em negrito) e componentes de interface

const PARES = [
  ['texto sobre o papel', 'azul', 'papel', T],
  ['texto sobre branco', 'azul', 'branco', T],
  ['texto suave sobre o papel', 'suave', 'papel', T],
  ['texto suave sobre branco', 'suave', 'branco', T],
  ['botão: texto azul sobre âmbar', 'azul', 'ambar', T],
  ['botão no hover: azul sobre âmbar claro', 'azul', 'ambar-hover', T],
  ['branco sobre azul', 'branco', 'azul', T],
  ['texto suave sobre azul', 'sobre-azul', 'azul', T],
  ['rótulo âmbar sobre azul', 'ambar', 'azul', T],
  ['número âmbar grande sobre azul', 'ambar', 'azul', G],
  ['azul sobre fundo âmbar claro', 'azul', 'ambar-fundo', T],
  ['suave sobre fundo âmbar claro', 'suave', 'ambar-fundo', T],
  ['erro: texto sobre branco', 'alerta', 'branco', T],
  ['erro: texto sobre fundo de alerta', 'alerta', 'alerta-fundo', T],
  ['azul sobre fundo de alerta', 'azul', 'alerta-fundo', T],
  ['borda do campo sobre branco', 'azul', 'branco', G],
  ['barra "depois" âmbar sobre azul', 'ambar', 'azul', G],
  ['barra "antes" sobre azul', 'sobre-azul', 'azul', G],
  ['texto sobre azul claro (hover)', 'azul', 'azul-claro', T],
  ['texto sobre azul claro (pedido)', 'azul', 'azul-claro', T],
  ['texto suave sobre azul claro (pedido)', 'suave', 'azul-claro', T],
  ['bolinha da lista (âmbar) com borda azul', 'azul', 'papel', G],
  ['ilustração: traço azul sobre o papel', 'azul', 'papel', G],
  ['ilustração: traço azul sobre branco (telha, casa, mapa)', 'azul', 'branco', G],
  ['ilustração: traço azul sobre azul claro (telhado do hero)', 'azul', 'azul-claro', G],
  ['ilustração: traço azul sobre âmbar (sol, porta)', 'azul', 'ambar', G],
  ['ilustração: traço azul sobre laranja (telha capa)', 'azul', 'laranja', G],
  ['ilustração: traço azul sobre âmbar claro (telha canal, mapa)', 'azul', 'ambar-fundo', G],
  ['ilustração: traço branco da grade sobre o painel azul', 'branco', 'azul', G],
  ['mapa: nomes das cidades sobre âmbar claro', 'azul', 'ambar-fundo', T],
  ['esquema da lei: rótulos sobre o papel', 'azul', 'papel', T],
  ['selo: "5" âmbar sobre azul (texto grande)', 'ambar', 'azul', G],
  ['selo: texto branco sobre azul', 'branco', 'azul', T],
];

let falhas = 0;
console.log('Par                                       | Razão  | Mínimo');
console.log('------------------------------------------|--------|-------');
for (const [nome, frente, fundo, minimo] of PARES) {
  const razao = contraste(tokens[frente], tokens[fundo]);
  const ok = razao >= minimo;
  if (!ok) falhas += 1;
  console.log(`${nome.padEnd(41)} | ${razao.toFixed(2).padStart(5)}  | ${minimo}${ok ? '' : '   <-- FALHOU'}`);
}
if (falhas) {
  console.error(`\nFALHOU: ${falhas} par(es) abaixo do mínimo.`);
  process.exit(1);
}
console.log('\nOK: todos os pares acima do mínimo.');
