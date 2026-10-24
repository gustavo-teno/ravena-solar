// Confere a seção "Como funciona" do HTML gerado: 4 fases, 8 passos na ordem da SPEC §3.7 e a régua de prazo.
// Rode depois do build (npm run verificar já faz isso).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { textoVisivel } from '../scripts/texto-visivel.mjs';

const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const como = html.match(/<section[^>]*id="como"[\s\S]*?<\/section>/)[0];
const texto = textoVisivel(como).replace(/\s+/g, ' ').toLowerCase();

test('os 8 passos da SPEC §3.7 aparecem nesta ordem', () => {
  const passos = [
    'simulação por whatsapp', 'visita técnica', 'proposta com três tamanhos', 'assinatura',
    'projeto e homologação', 'instalação em 2 dias', 'vistoria e ligação', 'acompanhamento',
  ];
  let desde = 0;
  for (const p of passos) {
    const i = texto.indexOf(p, desde);
    assert.ok(i >= 0, `passo fora de ordem ou ausente: ${p}`);
    desde = i + p.length;
  }
});

test('há exatamente 4 fases, filhas diretas de ol.fases', () => {
  const ol = como.match(/<ol class="fases">([\s\S]*?)<\/ol>\s*<div class="regua"/)[1];
  const diretos = ol.replace(/<ul[\s\S]*?<\/ul>/g, '').match(/<li>/g) || [];
  assert.equal(diretos.length, 4);
});

test('"45 a 60 dias" aparece uma vez em #como', () => {
  assert.equal(texto.split('45 a 60 dias').length - 1, 1);
});

test('não existe .prazo em #como', () => {
  assert.doesNotMatch(como, /class="[^"]*\bprazo\b/);
});
