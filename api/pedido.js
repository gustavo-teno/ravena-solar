// Função da Vercel: delega para o mesmo tratador usado no servidor local.
import { tratarPedido } from '../server/pedido.js';

export function POST(request) {
  return tratarPedido(request);
}

export function GET(request) {
  return tratarPedido(request);
}
