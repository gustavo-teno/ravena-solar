// Servidor local: serve public/ e POST /api/pedido (a mesma função que roda na Vercel).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tratarPedido } from './pedido.js';

const raiz = fileURLToPath(new URL('../public/', import.meta.url));
const porta = Number(process.env.PORT || 3000);

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

async function paraRequest(req) {
  const origem = `http://${req.headers.host || 'localhost'}`;
  const init = { method: req.method, headers: req.headers };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = Readable.toWeb(req);
    init.duplex = 'half';
  }
  return new Request(origem + req.url, init);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');

    if (url.pathname === '/api/pedido') {
      const resposta = await tratarPedido(await paraRequest(req));
      res.writeHead(resposta.status, Object.fromEntries(resposta.headers));
      res.end(Buffer.from(await resposta.arrayBuffer()));
      return;
    }

    let caminho = decodeURIComponent(url.pathname);
    if (caminho.endsWith('/')) caminho += 'index.html';
    const arquivo = join(raiz, normalize(caminho));
    if (!arquivo.startsWith(raiz)) throw Object.assign(new Error('fora da raiz'), { code: 'ENOENT' });
    const conteudo = await readFile(arquivo);
    res.writeHead(200, { 'content-type': tipos[extname(arquivo)] || 'application/octet-stream' });
    res.end(conteudo);
  } catch (erro) {
    res.writeHead(erro.code === 'ENOENT' ? 404 : 500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(erro.code === 'ENOENT' ? 'Não encontrado' : 'Erro interno');
  }
}).listen(porta, () => console.log(`http://localhost:${porta}`));
