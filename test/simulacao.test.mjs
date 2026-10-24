import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { estimarConta } from '../shared/validacao.js';
import { htmlDaSimulacao } from '../shared/simulacao.js';

// O formatador usa espaço sem quebra entre "R$" e o número.
const html = (valor, opcoes) => htmlDaSimulacao(estimarConta(valor), opcoes).replace(/ /g, ' ');

test('exemplo do caso real: rótulo, faixa de R$ 78 a R$ 195 e larguras 10% e 25%', () => {
  const saida = html(780, { exemplo: true });
  assert.ok(saida.includes('Exemplo'));
  assert.ok(saida.includes('R$ 78'));
  assert.ok(saida.includes('R$ 195'));
  assert.ok(saida.includes('--inicio:10%'));
  assert.ok(saida.includes('--fim:25%'));
  assert.ok(saida.includes('--largura:100%'));
  assert.match(saida, /role="img" aria-label="Conta de R\$ 780 hoje; com o sistema, entre R\$ 78 e R\$ 195 pela média dos clientes"/);
});

test('conta da própria pessoa: rótulo "Sua conta hoje", sem "Exemplo"', () => {
  const saida = html(780);
  assert.ok(saida.includes('Sua conta hoje'));
  assert.ok(!saida.includes('Exemplo'));
});

test('R$ 449: aviso de que a conta não fecha e nenhuma barra', () => {
  const saida = html(449);
  assert.ok(saida.includes('Nesse valor a conta não fecha'));
  assert.ok(!saida.includes('barra'));
  assert.ok(!saida.includes('role="img"'));
});

test('texto inválido e campo vazio não têm barras', () => {
  assert.ok(htmlDaSimulacao({ valido: false }).includes('Digite só o valor'));
  assert.ok(htmlDaSimulacao(null).includes('Digite o valor'));
  assert.ok(!htmlDaSimulacao(null).includes('barra'));
});

test('nenhuma saída chega a R$ 0', () => {
  for (const valor of [450, 1000, 99999]) {
    for (const exemplo of [true, false]) {
      assert.ok(!html(valor, { exemplo }).includes('R$ 0'), `${valor}: ${exemplo}`);
    }
  }
});

test('o build põe o exemplo no HTML inicial, no lugar do marcador', () => {
  execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: new URL('../', import.meta.url), stdio: 'ignore' });
  const pagina = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  assert.ok(!pagina.includes('<!--SIMULACAO-->'));
  assert.ok(pagina.includes('Exemplo: a conta do nosso caso em Sorocaba'));
  assert.ok(pagina.includes('value="780"'));
  assert.ok(pagina.includes('class="conta-barras"'));
  assert.ok(/id="sim-continuar" href="#pedido">/.test(pagina), 'o botão está visível, sem hidden');
});
