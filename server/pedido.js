// Recebe o pedido de simulação (POST /api/pedido). Funciona com e sem JavaScript na página:
//  - com JS (Accept: application/json): responde JSON (200, 422 ou 502);
//  - sem JS (envio nativo do formulário): redireciona 303 para a confirmação, sem dado pessoal na URL.
// A regra de validação é a mesma da página: shared/validacao.js.
import { validarPedido, ANEXO_MAX_BYTES } from '../shared/validacao.js';
import { enviarPedido } from './destino.js';

const LIMITE_CORPO = ANEXO_MAX_BYTES + 256 * 1024;

const paginaHtml = (titulo, texto, status) =>
  new Response(
    `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>${titulo} | Ravena Solar</title>` +
      `<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:10vh auto;padding:0 16px;line-height:1.5">` +
      `<h1>${titulo}</h1>${texto}<p><a href="/#pedido">Voltar ao formulário</a></p></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8' } },
  );

const json = (corpo, status) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export async function tratarPedido(request, { enviar = enviarPedido } = {}) {
  const querJson = (request.headers.get('accept') || '').includes('application/json');
  const responderErro = (status, titulo, texto, corpo) =>
    querJson ? json(corpo, status) : paginaHtml(titulo, texto, status);

  if (request.method !== 'POST') {
    return new Response('Método não permitido', { status: 405, headers: { allow: 'POST' } });
  }

  const tamanho = Number(request.headers.get('content-length') || 0);
  if (tamanho > LIMITE_CORPO) {
    return responderErro(413, 'Arquivo grande demais', '<p>O pedido passa de 4 MB. Envie uma foto menor ou um PDF.</p>', {
      ok: false,
      erros: { anexo: 'O arquivo passa de 4 MB. Envie uma foto menor ou um PDF.' },
    });
  }

  let dados;
  try {
    dados = await request.formData();
  } catch {
    return responderErro(400, 'Pedido ilegível', '<p>Não conseguimos ler o pedido. Tente de novo.</p>', {
      ok: false,
      erro: 'ilegivel',
    });
  }

  // Armadilha para robôs: pessoas não veem este campo. Fingimos sucesso e descartamos.
  if (String(dados.get('site') || '').trim() !== '') {
    return querJson ? json({ ok: true }, 200) : Response.redirect(new URL('/pedido-enviado.html', request.url), 303);
  }

  const arquivo = dados.get('anexo');
  const temArquivo = arquivo && typeof arquivo === 'object' && arquivo.size > 0;
  const resultado = validarPedido({
    nome: dados.get('nome'),
    whatsapp: dados.get('whatsapp'),
    cidade: dados.get('cidade'),
    conta: dados.get('conta'),
    anexo: temArquivo ? { nome: arquivo.name, tipo: arquivo.type, tamanho: arquivo.size } : null,
  });

  if (!resultado.ok) {
    const lista = Object.values(resultado.erros).map((e) => `<li>${e}</li>`).join('');
    return responderErro(422, 'Confira o pedido', `<ul>${lista}</ul>`, { ok: false, erros: resultado.erros });
  }

  try {
    await enviar(resultado.pedido, temArquivo ? arquivo : null);
  } catch (erro) {
    console.error('[pedido] falha no destino:', erro.message);
    return responderErro(
      502,
      'Não conseguimos enviar agora',
      '<p>O seu pedido não foi enviado. Tente de novo em instantes.</p>',
      { ok: false, erro: 'destino' },
    );
  }

  return querJson ? json({ ok: true }, 200) : Response.redirect(new URL('/pedido-enviado.html', request.url), 303);
}
