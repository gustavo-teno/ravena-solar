// ============================================================================
// PONTO ÚNICO DE ENTREGA DOS PEDIDOS: DESTINO DE DEMONSTRAÇÃO
//
// A Ravena Solar é uma cliente fictícia, então o pedido não é enviado a ninguém.
// Para ligar o destino real (WhatsApp Business, CRM, e-mail), troque SÓ o corpo
// de `enviarPedido`. Se ele lançar um erro, a página mostra falha ao visitante e
// não exibe a confirmação. O resto do código não precisa mudar.
//
// Para testar a falha: DEMO_FORCAR_FALHA=1
// ============================================================================

export async function enviarPedido(pedido) {
  if (process.env.DEMO_FORCAR_FALHA === '1') {
    throw new Error('Falha simulada no destino de demonstração');
  }

  // Registra só o que não identifica a pessoa (nada de nome, WhatsApp ou arquivo).
  console.log(
    '[pedido-demo]',
    JSON.stringify({
      cidade: pedido.cidade,
      foraDaArea: pedido.foraDaArea,
      faixaDaConta: pedido.conta,
      comAnexo: Boolean(pedido.anexo),
    }),
  );
  return { demonstracao: true };
}
