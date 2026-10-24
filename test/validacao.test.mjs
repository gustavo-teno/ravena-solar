import test from 'node:test';
import assert from 'node:assert/strict';
import { lerValorEmReais, estimarConta, validarPedido, normalizarWhatsapp, faixaDoValor } from '../shared/validacao.js';

test('lê valores em reais no formato brasileiro', () => {
  assert.equal(lerValorEmReais('780'), 780);
  assert.equal(lerValorEmReais('780,00'), 780); // regressão: "780,00" não pode virar R$ 78.000
  assert.equal(lerValorEmReais('R$ 780,00'), 780);
  assert.equal(lerValorEmReais('1.250,50'), 1250.5);
  assert.equal(lerValorEmReais('1.250'), 1250);
  assert.equal(lerValorEmReais('1250'), 1250);
  assert.equal(lerValorEmReais('780.5'), 780.5);
  assert.ok(Number.isNaN(lerValorEmReais('abc')));
  assert.ok(Number.isNaN(lerValorEmReais('')));
  assert.ok(Number.isNaN(lerValorEmReais('0')));
  assert.ok(Number.isNaN(lerValorEmReais('-5')));
  assert.ok(Number.isNaN(lerValorEmReais('1,2,3')));
});

test('simulador: R$ 449 não oferece o botão e R$ 450 oferece', () => {
  assert.equal(estimarConta(449).atende, false);
  assert.equal(estimarConta(449.99).atende, false);
  assert.equal(estimarConta(450).atende, true);
  assert.equal(estimarConta(450).faixa, '450-700');
});

test('simulador: a faixa nunca chega a zero e cobre o caso real', () => {
  for (const valor of [450, 451, 780, 1000, 5000, 99999]) {
    const e = estimarConta(valor);
    assert.ok(e.de >= 1, `${valor}: mínimo ${e.de}`);
    assert.ok(e.ate > e.de || e.ate === e.de);
    assert.ok(e.ate < valor);
  }
  const caso = estimarConta(780);
  assert.equal(caso.de, 78);
  assert.equal(caso.ate, 195);
  assert.ok(118 >= caso.de && 118 <= caso.ate, 'R$ 118 cai dentro da faixa calculada para R$ 780');
  assert.equal(estimarConta(lerValorEmReais('780,00')).conta, 780);
});

test('faixas do formulário batem com o corte de R$ 450', () => {
  assert.equal(faixaDoValor(449.99).id, 'abaixo-450');
  assert.equal(faixaDoValor(450).id, '450-700');
  assert.equal(faixaDoValor(780).id, '700-1000');
  assert.equal(faixaDoValor(1000).id, 'acima-1000');
});

test('WhatsApp: aceita formatos comuns e rejeita lixo', () => {
  assert.equal(normalizarWhatsapp('(15) 99999-9999'), '15999999999');
  assert.equal(normalizarWhatsapp('+55 15 99999-9999'), '15999999999');
  assert.equal(normalizarWhatsapp('15 3333-4444'), '1533334444');
  assert.equal(normalizarWhatsapp('99999-9999'), null);
  assert.equal(normalizarWhatsapp('(15) 89999-9999'), null);
  assert.equal(normalizarWhatsapp('(05) 99999-9999'), null);
  assert.equal(normalizarWhatsapp('abc'), null);
});

const bom = { nome: 'Maria Souza', whatsapp: '(15) 99999-9999', cidade: 'sorocaba', conta: '700-1000', anexo: null };

test('pedido válido passa e normaliza', () => {
  const r = validarPedido(bom);
  assert.equal(r.ok, true);
  assert.equal(r.pedido.whatsapp, '+5515999999999');
  assert.equal(r.pedido.foraDaArea, false);
});

test('campos obrigatórios', () => {
  for (const campo of ['nome', 'whatsapp', 'cidade', 'conta']) {
    const r = validarPedido({ ...bom, [campo]: '' });
    assert.equal(r.ok, false, campo);
    assert.ok(r.erros[campo], campo);
  }
});

test('conta abaixo de R$ 450 não envia', () => {
  const r = validarPedido({ ...bom, conta: 'abaixo-450' });
  assert.equal(r.ok, false);
  assert.match(r.erros.conta, /não fecha/);
});

test('outra cidade entra, mas sinalizada como fora da área; cidade desconhecida não', () => {
  const fora = validarPedido({ ...bom, cidade: 'outra' });
  assert.equal(fora.ok, true);
  assert.equal(fora.pedido.foraDaArea, true);
  assert.equal(validarPedido({ ...bom, cidade: 'campinas' }).ok, false);
});

test('anexo: opcional; aceita foto e PDF; rejeita tipo errado e arquivo grande', () => {
  assert.equal(validarPedido({ ...bom, anexo: { nome: 'conta.pdf', tipo: 'application/pdf', tamanho: 1000 } }).ok, true);
  assert.equal(validarPedido({ ...bom, anexo: { nome: 'conta.jpg', tipo: 'image/jpeg', tamanho: 1000 } }).ok, true);
  assert.equal(validarPedido({ ...bom, anexo: { nome: 'IMG_1.HEIC', tipo: '', tamanho: 1000 } }).ok, true);
  assert.equal(validarPedido({ ...bom, anexo: { nome: 'x.exe', tipo: 'application/x-msdownload', tamanho: 10 } }).ok, false);
  assert.equal(validarPedido({ ...bom, anexo: { nome: 'g.pdf', tipo: 'application/pdf', tamanho: 5 * 1024 * 1024 } }).ok, false);
});
