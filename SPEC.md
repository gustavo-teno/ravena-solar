# Spec — Landing page Ravena Solar (P1)

## 1. Objetivo e métrica

A página existe para uma ação: **pedir uma simulação**. Nada compete com isso.

- Hoje: ~12 pedidos/mês, quase todos por indicação e Instagram. Meta: 25/mês.
- Qualidade pesa tanto quanto volume: menos pedidos de quem paga ~R$ 200 de luz. O formulário filtra, não só coleta.
- Como saber que funcionou: pedidos/mês e % de pedidos com conta ≥ R$ 450.

## 2. Para quem

Dono da casa, 35–60 anos, conta acima de R$ 450/mês, compara três orçamentos e leva de 2 a 8 semanas para decidir. Chega desconfiado: o setor tem fama ruim e três empresas da região fecharam deixando obra pela metade.

**Decisão central:** a página responde às objeções na ordem em que o cliente as tem, não na ordem em que a empresa gosta de se apresentar.

1. "Vão sumir?" → 6 anos, 412 sistemas, equipe própria com carteira assinada, nota 4,8 (137 avaliações), garantia de 5 anos na instalação.
2. "Estraga o telhado?" → garantia cobre infiltração causada pela obra; instalação em 2 dias.
3. "Taxaram o sol, ainda vale?" → seção própria explicando a Lei 14.300 sem esconder que existe cobrança.
4. Mudar de casa / dia nublado e noite / bateria → FAQ.

As três primeiras têm seção própria, mas também voltam no FAQ: quem pula seções encontra a resposta no fim.

## 3. Estrutura da página (ordem)

1. **Topo** — logo e um único botão "Pedir simulação". Sem menu.
2. **Hero** — promessa específica e verificável, sempre qualificada: "na média dos nossos clientes, a conta cai de 75% a 90%" (nunca a faixa como promessa universal), retorno em 3 a 4 anos, sem prometer zerar. Traz a região (Sorocaba, Votorantim, Itu, Salto) e o corte "para contas acima de R$ 450".
   - **Simulador simples** logo abaixo: um campo "quanto você paga de luz por mês?". Acima de R$ 450, mostra a conta de hoje e a faixa estimada (75% a 90% de queda aplicados ao valor digitado), rotulada "estimativa pela média dos clientes" e nunca chegando a zero, e um botão que leva ao formulário com a conta já preenchida. Abaixo de R$ 450, diz com franqueza que nesse valor a conta não fecha e não mostra o botão.
   - O simulador **não** estima potência, número de painéis, preço nem economia em reais por ano além da faixa: quem dimensiona é a visita técnica.
   - Sem 3D nem animação obrigatória no hero: título, números e simulador estão no HTML inicial, legíveis antes de qualquer script.
3. **Prova rápida** — 412 sistemas · 6 anos · 4,8 no Google (137) com estrelas · 11 pessoas, equipe própria.
4. **Caso real** — casa em Sorocaba, conta de R$ 780 → média de R$ 118 em 12 meses, 6,4 kWp, instalado em março de 2025. É o único número "antes/depois" com conferência; vale mais que qualquer depoimento genérico.
5. **A lei 14.300, sem enrolação** — o que mudou, por que continua compensando, por que a conta não zera (taxa mínima e custo do fio).
6. **Telhado e garantias** — 25 anos painel, 10 inversor, 5 instalação (incluindo infiltração); assistência técnica autorizada da marca do inversor.
7. **Como funciona** — simulação por WhatsApp → visita técnica com medição → proposta com três tamanhos → assinatura → projeto e homologação na CPFL → instalação (2 dias) → vistoria e ligação → acompanhamento no 1º ano. Prazo honesto: 45 a 60 dias da assinatura à ligação, e a homologação depende da distribuidora.
8. **Investimento e financiamento** — faixa típica R$ 14 mil a R$ 19 mil (5 a 8 kWp, 12 a 20 painéis); dois bancos, entrada zero possível, parcela na maioria dos casos próxima da conta atual.
9. **FAQ** — as seis perguntas do brief, na ordem do brief: vão sumir? · estraga o telhado? · taxaram o sol? · e se eu mudar de casa? · nublado e à noite? · preciso de bateria? Respostas curtas, só com o que o brief afirma; as três primeiras remetem à seção própria.
10. **Formulário de simulação** (CTA final) + quem atendemos (Sorocaba, Votorantim, Itu, Salto). Logo antes do formulário, uma linha honesta de quem não atendemos: conta abaixo de R$ 450, indústria, comércio acima de 75 kWp, bateria, manutenção de sistema de outra empresa.
11. **Rodapé enxuto** — razão social, cidade, contato real, link para a política de privacidade. A política é uma página de verdade (o que coletamos, para quê, por quanto tempo, como pedir exclusão), não um link morto; o formulário traz uma linha curta dizendo para que os dados servem.

## 4. Formulário

- **Obrigatórios:** nome, WhatsApp, cidade, valor médio da conta de luz.
- **Opcional:** foto ou PDF da conta. Dito como "ajuda a acelerar", sem exigir.
- **Cidade:** lista fechada das quatro atendidas, mais "outra" (entra, mas sinalizada como fora da área).
- **Conta de luz:** faixas, não campo livre; quem veio pelo simulador chega com a faixa correspondente já escolhida. Abaixo de R$ 450 a página diz de forma direta que, nesse valor, a conta não fecha, e não oferece o envio. Perde-se algum lead de borda, mas era esse o pedido do cliente.
- **Depois do envio:** confirma que a resposta vem por WhatsApp no mesmo dia útil e que a visita é gratuita e sem compromisso.
- **Entrega dos pedidos:** o cliente é fictício, então o destino é de **demonstração**, num único ponto do código e sinalizado no README, para ser trocado pelo real sem mexer no resto. Mesmo assim, sucesso e erro funcionam de verdade: a confirmação só aparece se o destino aceitou, e uma falha mostra erro visível.
- **Mesma regra nos dois lados:** a validação (obrigatórios, faixa abaixo de R$ 450, cidade) é um único módulo usado pela página e pelo destino. Nada de dado pessoal (nome, WhatsApp, conta) em query string.

## 5. O que fica de fora (e por quê)

| Item | Origem | Motivo |
|---|---|---|
| "Quem somos", missão, visão, valores | site antigo | Não é o que decide a compra. O que o texto tenta provar vira número na prova rápida. |
| Energia comercial, industrial, rural | site antigo | Não atendemos indústria nem comércio acima de 75 kWp; página dispersa e atrai lead que o vendedor não quer. |
| Manutenção "de qualquer fabricante" | site antigo | Falso: não fazemos manutenção de sistema de terceiros. |
| Consultoria energética | site antigo | Não é produto do brief. |
| Bateria / sistema com bateria | brief | Não vendemos. Só aparece como resposta no FAQ. |
| Blog (posts de 2021) | site antigo | Datado e sem função na decisão. Se o conteúdo voltar, é outro projeto. |
| "Parceiros" (logos fictícios) | site antigo | Não são parceiros reais confirmados; logo inventada em página de empresa desconfiada é pior que nenhuma. |
| Contadores "+300", "5 anos", "100% satisfação", "24h atendimento" | site antigo | Todos contradizem o brief ou são inverificáveis (412, 6 anos, atendimento em dia útil). "100%" e "24h" são o tipo de promessa que o Procon cobra. |
| "Economize até 95%" | site antigo | Proibido pelo cliente. O número real é 75% a 90%. |
| Menu de navegação, topbar, links "Saiba mais" | site antigo | Página de uma ação não precisa de saídas. |
| Banner de cookies | site antigo | Só entra se a página passar a usar cookies/analytics; hoje a decisão é não usar. |
| Mapa, redes sociais, botão flutuante de WhatsApp | site antigo | Fora do fluxo único. O WhatsApp é o canal de resposta, não de entrada; um segundo botão desvia do formulário. |
| Depoimentos em vídeo (3) | brief | Existem, mas os arquivos não vieram no `material/`. Fica de fora até chegarem; não se simula depoimento. |
| Galeria das 40 obras | brief | Mesmo motivo: sem as fotos, nada de imagem de banco ou placeholder fingindo ser obra. Se chegarem, entram poucas, escolhidas (telhado de telha de barro tem prioridade pelo medo de infiltração). |
| Slogans: "energia do futuro", "sustentabilidade", "revolução solar" | site antigo | Proibido pelo tom de voz. |
| Palavra "grátis" e prazos inventados | — | Proibido. Dizer "visita técnica gratuita e sem compromisso" é o que o brief autoriza; prazos só os do brief. |

Também fica fora do tom: tabela de preço por kWp, simulador que calcula potência, painéis, preço ou economia além da faixa média (prometeria um número que só a visita confirma; o simulador do hero fica restrito à faixa de 75% a 90%), comparação com concorrentes.

## 6. Voz

Direta, técnica, com número. Frases curtas. Cada afirmação tem um dado do brief atrás. Assumimos o limite: a conta não zera, o prazo depende da CPFL, abaixo de R$ 450 não vale.

## 7. Marca e design (resumo; detalhe no arquivo de design)

- Cores **sempre extraídas do `logo.svg`**; nenhum valor de cor é digitado na spec nem copiado do site antigo.
- O site antigo não é referência visual: gradientes, caixas de sombra e ícones emoji são o que a página nova deixa de ser.
- Mobile primeiro (a decisão muitas vezes é tomada no celular do casal).

## 8. Dados que não podem ser reaproveitados do site antigo

Telefone `(15) 3200-0000`, WhatsApp `(15) 99000-0000`, CNPJ `00.000.000/0001-00`, CEP `18000-000`, "fundada em 2020" e "Desenvolvido por Agência Web" são placeholders ou desatualizados. A página nova só publica contato real quando o cliente fornecer; até lá, o campo fica marcado como pendente, nunca preenchido com um número inventado.

## 9. Premissas e pendências

- Se o cliente confirmar, o texto sobre a Lei 14.300 deve citar o percentual vigente da cobrança; sem o dado verificado, a página explica o mecanismo sem número.
- Nome da marca de inversor: não consta no brief; a página diz "assistência autorizada da marca do inversor que instalamos".
- Endereço, telefone e WhatsApp reais: pendentes.
- Hospedagem: a definir na implementação. Destino dos pedidos: de demonstração (cliente fictício), num único ponto do código; ver seção 4.

## 10. Critérios de pronto

- A conversão ocorre em até duas rolagens desde qualquer ponto (botão fixo no topo e formulário no fim).
- Nenhuma afirmação sem fonte no brief. Nenhum número do site antigo sobrevive.
- Lighthouse acessibilidade e performance sem erros graves; legível e usável em 375 px.
- Formulário testado: campos obrigatórios, faixa abaixo de R$ 450, envio com e sem anexo, falha de rede.
- Simulador testado: R$ 449 não oferece o botão e R$ 450 oferece; a faixa nunca chega a zero; o caso real (R$ 780 → R$ 118) cai dentro da faixa calculada; "780,00" é lido como R$ 780.
- Hero, números da prova e simulador legíveis no HTML inicial, sem depender de JavaScript nem de animação (nada de contador começando em 0 ou título com opacidade zero).
- Envio testado de ponta a ponta até o destino de demonstração, na página publicada.
- Um celular real (de preferência iPhone/Safari) aberto, ou declarado em "o que não foi verificado".

## 11. Implementação e revisões

Decisões tomadas ao construir, e o porquê.

- **Stack:** HTML + CSS + um módulo JS, sem framework; Node só para build, servidor local e a função `/api/pedido`. A página é estática e o único trecho dinâmico é o destino do lead.
- **Formulário sem JavaScript:** POST nativo para `/api/pedido`, 303 para `/pedido-enviado.html` (sem dado pessoal na URL), campo-armadilha contra robô. Com JS o envio é por `fetch` e a confirmação só aparece com o destino respondendo 200.
- **Faixas da conta:** abaixo de R$ 450 · R$ 450 a R$ 700 · R$ 700 a R$ 1.000 · acima de R$ 1.000. Só o corte de R$ 450 vem do brief; os outros limites organizam a escolha e estão marcados assim no `checar-numeros`.
- **Hover do botão clareia:** a versão escura do âmbar reprovou no contraste (4,2:1), então o hover usa âmbar mais claro.
- **Sem botão fixo extra no celular:** o topo já é fixo com "Pedir simulação", o que cumpre "uma rolagem até a conversão".
- **Mapa só esquemático:** "quem atendemos" segue em lista (é o que o leitor de tela lê); o mapa que entrou é um desenho com nomes e "80 km", sem rota nem link, fora do fluxo único.
- **"85%" no caso real:** derivado de 1 − 118/780, rotulado como "neste caso" e acompanhado de "é um caso, não uma média".
- **Ilustrações próprias (hero, telha com selo, esquema da Lei 14.300, mapa de atendimento):** sem fotos, o visual sai do logo (sol de 5 raios, trapézio com grade); SVG inline, só tokens de cor, sem animação, sem texto além do que o brief diz. Detalhe em DESIGN.md.
- **Política de privacidade:** guarda de 12 meses é proposta minha, a confirmar (ver `FALTA.md`).
- **Hero com o diferencial no título:** o `<h1>` passou a trazer a equipe própria (instalação sem terceirizar), a resposta ao medo número um do brief, porque o título começava pela ressalva e soava como letra miúda. A promessa qualificada ("na média dos nossos clientes", 75% a 90%) foi para o subtítulo, na mesma frase do retorno de 3 a 4 anos. O corte de R$ 450 foi para dentro do simulador, onde o valor é digitado; o simulador segue no hero, como manda a §3, e o aviso abaixo de R$ 450 continua sendo o do `app.js`.
- **Prova rápida reorganizada:** "Equipe própria" repetia o `<h1>` e quebrava a grade por ser texto e não número; virou "11 pessoas" (brief: "onze pessoas"). O 4,8 sem estrelas não parecia nota, então ganhou cinco estrelas (a quinta cheia até 80%), com `aria-label` único e sem link nem trecho de avaliação. A assistência técnica autorizada da marca do inversor estava no brief e não na página: entrou numa fileira de selos de texto com ícone, que fecha "Como funciona", junto de equipe própria, garantia de 5 anos e sede/raio de 80 km. O caso real (R$ 780 → R$ 118) volta em uma linha perto do botão do formulário, com link para a seção do caso.
- **Ritmo de fundo e duas colunas:** as seções passaram a alternar fundo (papel, branco, azul, âmbar claro, azul claro) em vez de linha fina, e Como funciona e Dúvidas ganharam duas colunas a partir de 960 px, sem mudar a ordem da §3; o azul escuro segue só no caso real. Detalhe em DESIGN.md.

### Bugs que a verificação pegou

1. Botão e avisos com atributo `hidden` continuavam visíveis, porque `.botao { display: inline-flex }` vencia o `hidden`. Corrigido com `[hidden] { display: none !important }`.
2. No celular, a página tinha 49 px de rolagem horizontal: a coluna do hero crescia além da tela. Corrigido com `minmax(0, 1fr)` nas grades.
3. "137 avaliações" quebrava em linha separada na prova rápida (regra `span { display: block }` pegava o `span` interno).
4. "R$ 780" quebrava entre "R$" e o número nos títulos: trocado por espaço sem quebra.
5. O primeiro hover do botão reprovou no contraste; a página mudou, não o mínimo.
