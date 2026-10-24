import test from 'node:test';
import assert from 'node:assert/strict';
import { tratarPedido } from '../server/pedido.js';
import { enviarPedido } from '../server/destino.js';

const URL_BASE = 'http://localhost/api/pedido';

function requisicao(campos, { json = true, arquivo = null } = {}) {
  const corpo = new FormData();
  for (const [k, v] of Object.entries(campos)) corpo.append(k, v);
  if (arquivo) corpo.append('anexo', arquivo);
  return new Request(URL_BASE, {
    method: 'POST',
    body: corpo,
    headers: json ? { accept: 'application/json' } : {},
  });
}

const bom = { nome: 'Maria Souza', whatsapp: '(15) 99999-9999', cidade: 'itu', conta: 'acima-1000' };

test('sucesso (JSON): chama o destino e responde 200', async () => {
  const recebidos = [];
  const r = await tratarPedido(requisicao(bom), { enviar: async (p) => recebidos.push(p) });
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true });
  assert.equal(recebidos.length, 1);
  assert.equal(recebidos[0].whatsapp, '+5515999999999');
});

test('sucesso com anexo', async () => {
  const recebidos = [];
  const arquivo = new File([new Uint8Array(2000)], 'conta.pdf', { type: 'application/pdf' });
  const r = await tratarPedido(requisicao(bom, { arquivo }), { enviar: async (p) => recebidos.push(p) });
  assert.equal(r.status, 200);
  assert.equal(recebidos[0].anexo.nome, 'conta.pdf');
});

test('sem anexo: o campo de arquivo vazio não conta', async () => {
  const recebidos = [];
  const vazio = new File([], '', { type: 'application/octet-stream' });
  const r = await tratarPedido(requisicao(bom, { arquivo: vazio }), { enviar: async (p) => recebidos.push(p) });
  assert.equal(r.status, 200);
  assert.equal(recebidos[0].anexo, null);
});

test('sem JavaScript: redireciona 303 sem dado pessoal na URL', async () => {
  const r = await tratarPedido(requisicao(bom, { json: false }), { enviar: async () => {} });
  assert.equal(r.status, 303);
  const destino = new URL(r.headers.get('location'));
  assert.equal(destino.pathname, '/pedido-enviado.html');
  assert.equal(destino.search, '');
  assert.ok(!destino.href.includes('Maria'));
});

test('conta abaixo de R$ 450 é recusada no servidor (422) e o destino não é chamado', async () => {
  let chamado = false;
  const r = await tratarPedido(requisicao({ ...bom, conta: 'abaixo-450' }), { enviar: async () => (chamado = true) });
  assert.equal(r.status, 422);
  assert.ok((await r.json()).erros.conta);
  assert.equal(chamado, false);
});

test('campos obrigatórios faltando: 422 com o motivo', async () => {
  const r = await tratarPedido(requisicao({ nome: '', whatsapp: '', cidade: '', conta: '' }), { enviar: async () => {} });
  assert.equal(r.status, 422);
  const { erros } = await r.json();
  assert.deepEqual(Object.keys(erros).sort(), ['cidade', 'conta', 'nome', 'whatsapp']);
});

test('sem JS, erro de validação vira página HTML 422', async () => {
  const r = await tratarPedido(requisicao({ ...bom, nome: '' }, { json: false }), { enviar: async () => {} });
  assert.equal(r.status, 422);
  assert.match(r.headers.get('content-type'), /text\/html/);
});

test('falha no destino: 502 e nunca confirma', async () => {
  const r = await tratarPedido(requisicao(bom), {
    enviar: async () => {
      throw new Error('destino fora do ar');
    },
  });
  assert.equal(r.status, 502);
  assert.equal((await r.json()).ok, false);
});

test('destino de demonstração falha quando DEMO_FORCAR_FALHA=1', async () => {
  process.env.DEMO_FORCAR_FALHA = '1';
  try {
    const r = await tratarPedido(requisicao(bom));
    assert.equal(r.status, 502);
  } finally {
    delete process.env.DEMO_FORCAR_FALHA;
  }
});

test('armadilha de robô preenchida: finge sucesso mas não entrega', async () => {
  let chamado = false;
  const r = await tratarPedido(requisicao({ ...bom, site: 'http://spam' }), { enviar: async () => (chamado = true) });
  assert.equal(r.status, 200);
  assert.equal(chamado, false);
});

test('outro método: 405', async () => {
  const r = await tratarPedido(new Request(URL_BASE, { method: 'GET' }));
  assert.equal(r.status, 405);
});

test('o destino de demonstração não registra nome nem WhatsApp', async () => {
  const linhas = [];
  const original = console.log;
  console.log = (...a) => linhas.push(a.join(' '));
  try {
    await enviarPedido({ nome: 'Maria Souza', whatsapp: '+5515999999999', cidade: 'itu', foraDaArea: false, conta: 'acima-1000', anexo: null });
  } finally {
    console.log = original;
  }
  const saida = linhas.join('\n');
  assert.ok(!saida.includes('Maria') && !saida.includes('9999'));
  assert.match(saida, /itu/);
});

test('corpo multipart que chega em pedaços (como o curl) é lido por inteiro', async () => {
  const limite = '------------------------abc123XYZ';
  const parte = (nome, valor) => `--${limite}\r\nContent-Disposition: form-data; name="${nome}"\r\n\r\n${valor}\r\n`;
  const texto =
    parte('nome', 'Maria Souza') + parte('whatsapp', '(15) 99999-9999') + parte('cidade', 'salto') + parte('conta', '450-700') + `--${limite}--\r\n`;
  const bytes = new TextEncoder().encode(texto);
  const corpo = new ReadableStream({
    start(c) {
      for (let i = 0; i < bytes.length; i += 40) c.enqueue(bytes.slice(i, i + 40));
      c.close();
    },
  });
  const recebidos = [];
  const r = await tratarPedido(
    new Request(URL_BASE, {
      method: 'POST',
      body: corpo,
      duplex: 'half',
      headers: { accept: 'application/json', 'content-type': `multipart/form-data; boundary=${limite}` },
    }),
    { enviar: async (p) => recebidos.push(p) },
  );
  assert.equal(r.status, 200);
  assert.equal(recebidos[0].cidade, 'salto');
  assert.equal(recebidos[0].conta, '450-700');
});
