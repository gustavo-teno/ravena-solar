import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { estimarConta } from '../shared/validacao.js';
import { htmlDaSimulacao, AVISO_ABAIXO_DO_MINIMO } from '../shared/simulacao.js';

// O formatador usa espaço sem quebra entre "R$" e o número.
const html = (valor, opcoes) => htmlDaSimulacao(estimarConta(valor), opcoes).replace(/ /g, ' ');

test('exemplo do caso real: rótulo, faixa de R$ 78 a R$ 195 e larguras em escala fixa de R$ 1.500', () => {
  const saida = html(780, { exemplo: true });
  assert.ok(saida.includes('Exemplo'));
  assert.ok(saida.includes('R$ 78'));
  assert.ok(saida.includes('R$ 195'));
  assert.ok(saida.includes('--largura:52%'));
  assert.ok(saida.includes('--piso:5.2%'));
  assert.ok(saida.includes('--teto:13%'));
  assert.match(saida, /role="img" aria-label="Conta de R\$ 780 hoje; com o sistema, entre R\$ 78 e R\$ 195 pela média dos clientes"/);
});

test('as barras acompanham a conta digitada: conta maior, barra de hoje maior', () => {
  const largura = (valor) => Number(html(valor).match(/--largura:([\d.]+)%/)[1]);
  const teto = (valor) => Number(html(valor).match(/--teto:([\d.]+)%/)[1]);
  assert.ok(largura(450) < largura(780) && largura(780) < largura(1200));
  assert.ok(teto(450) < teto(780) && teto(780) < teto(1200));
  assert.equal(largura(1500), 100);
  for (const valor of [450, 780, 1200, 5000]) assert.ok(teto(valor) < largura(valor), String(valor));
  // acima da escala fixa a conta continua cabendo na barra
  assert.equal(largura(5000), 100);
  assert.equal(teto(5000), 25);
});

test('conta da própria pessoa: rótulo "Sua conta hoje", sem "Exemplo"', () => {
  const saida = html(780);
  assert.ok(saida.includes('Sua conta hoje'));
  assert.ok(!saida.includes('Exemplo'));
});

test('R$ 449: aviso de que a conta não fecha e nenhuma barra', () => {
  const saida = html(449);
  assert.ok(saida.includes('Abaixo de R$ 450 por mês a conta não fecha'));
  assert.ok(saida.includes('desaconselhamos'));
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

test('a nota do exemplo diz a média dos clientes e que a conta não zera', () => {
  const saida = html(780, { exemplo: true });
  assert.ok(saida.includes('média dos nossos clientes'));
  assert.ok(saida.includes('não zera'));
});

test('"não zera" aparece 2 vezes no texto visível sem JavaScript: nota do exemplo e cartão da Lei', async () => {
  const { textoVisivel } = await import('../scripts/texto-visivel.mjs');
  const pagina = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  assert.equal(textoVisivel(pagina).match(/não zera/g).length, 2);
});

test('o aviso do formulário e o do simulador têm o mesmo texto', () => {
  const pagina = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  assert.ok(pagina.includes('>' + AVISO_ABAIXO_DO_MINIMO + '</p>'));
  assert.ok(html(449).includes(AVISO_ABAIXO_DO_MINIMO.replace(/ /g, ' ')));
});
