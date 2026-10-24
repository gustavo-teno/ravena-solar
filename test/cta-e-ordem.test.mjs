// Confere o HTML gerado (public/index.html): CTAs repetidos e ordem dos campos do formulário.
// Rode depois do build (npm run verificar já faz isso).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { faixaDoValor } from '../shared/validacao.js';

const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const secao = (id) => html.match(new RegExp(String.raw`<section[^>]*id="${id}"[\s\S]*?</section>`))[0];
const form = html.match(/<form id="form-pedido"[\s\S]*?<\/form>/)[0];

test('ordem dos campos: conta, cidade, nome, whatsapp, anexo', () => {
  const nomes = [...form.matchAll(/<(?:input|select)\s[^>]*?name="([^"]+)"/g)].map((m) => m[1]).filter((n) => n !== 'site');
  assert.deepEqual(nomes, ['conta', 'cidade', 'nome', 'whatsapp', 'anexo']);
});

test('o aviso da conta vem logo depois do campo da conta', () => {
  assert.match(form, /<select id="conta"[\s\S]*?<\/select>\s*<\/div>\s*<p class="aviso-conta" id="aviso-conta"/);
});

test('três CTAs "Pedir simulação" fora do topo e do simulador, e o do caso leva a faixa do caso', () => {
  const fora = html
    .replace(/<header[\s\S]*?<\/header>/, '')
    .replace(/<div class="sim" id="simulador">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/, '');
  const ctas = [...fora.matchAll(/<a\s[^>]*class="[^"]*\bbotao\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  assert.equal(ctas.length, 3);
  for (const a of ctas) assert.match(a, /href="#pedido"/);
  for (const id of ['caso', 'garantias', 'como']) {
    assert.match(secao(id), /<a class="botao[^"]*" href="#pedido"[^>]*>Pedir simulação<\/a>/, id);
  }
  assert.ok(secao('caso').includes(`data-faixa="${faixaDoValor(780).id}"`));
  for (const id of ['lei', 'investimento', 'duvidas']) assert.doesNotMatch(secao(id), /class="botao/, id);
});

test('nenhum href leva conta nem faixa na URL', () => {
  for (const [, href] of html.matchAll(/href="([^"]*)"/g)) assert.doesNotMatch(href, /conta=|faixa=/);
});
