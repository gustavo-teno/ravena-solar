# O que falta

## Depende do cliente (nada disso pode ser inventado)

- [ ] Razão social, CNPJ, endereço, telefone e WhatsApp reais (o rodapé diz "CNPJ, endereço e telefone: a publicar"; continua pendente).
- [ ] Prazo de guarda dos dados na política de privacidade: a página diz **12 meses** como proposta; confirmar.
- [ ] Nome da marca de inversor (a página diz "a marca do inversor que instalamos").
- [ ] Percentual vigente da cobrança da Lei 14.300: sem o dado verificado, a página explica o mecanismo sem número.
- [ ] As 40 fotos de obra e os 3 depoimentos em vídeo (não vieram no material). Se vierem, entram poucas, com telha de barro primeiro.
- [ ] Confirmação de que o retorno de 3 a 4 anos já considera a cobrança da Lei 14.300 (a página só diz que "tem levado de 3 a 4 anos").

## Funcionalidade

- [ ] **Destino real dos pedidos** (`server/destino.js`): hoje é de demonstração. Ao ligar o real, decidir onde guardar o anexo.
- [ ] Publicar e rodar Lighthouse e o envio de ponta a ponta na página publicada.
- [ ] Abrir num iPhone real (Safari).

## Operação

- [ ] Medir pedidos por mês e % com conta ≥ R$ 450 (meta do brief: 25/mês). Hoje a página não usa cookies nem analytics de propósito; se entrar medição, entra também aviso de cookies.
- [ ] Limite de envios por IP/tempo no servidor (hoje só há o campo-armadilha contra robô).
- [ ] Alerta quando o destino falhar (hoje o visitante vê o erro, mas ninguém é avisado).
- [ ] Rotina de exclusão de dados a pedido (a política promete responder pelo WhatsApp).
- [ ] Revisar a política de privacidade com quem responde pela LGPD na Ravena.
