# Design — Landing page Ravena Solar

O design escrito no disco. A página lê as cores do `logo.svg` por código; nenhum valor de cor é digitado aqui nem no CSS.

## Princípios

1. **Uma ação.** Tudo leva a "Pedir simulação". Sem menu; só logo e um botão fixo no topo.
2. **Conteúdo antes de efeito.** Título, números e simulador estão no HTML inicial. Não há animação, contador, 3D nem `opacity: 0`.
3. **Técnico e direto.** Número grande, frase curta, nada de ícone emoji, gradiente ou sombra decorativa. Separação por linha, borda e cor chapada.
4. **Mobile primeiro.** A decisão costuma ser tomada no celular do casal. Colunas só entram a partir de 760 px (cartões, prova) e 960 px (hero com o simulador ao lado).

## Cores

Lidas de `logo.svg` em `scripts/tokens.mjs` e gravadas como variáveis CSS no build.

| Token | Origem | Uso |
|---|---|---|
| `--azul` | casa/painel e "RAVENA" do logo | texto, bordas, fundos escuros |
| `--ambar` | sol do logo | botão principal, destaque do número, barra "depois" |
| `--laranja` | "SOLAR" do logo | base do token de alerta (o laranja puro não passa em contraste como texto) |
| `--papel`, `--azul-claro`, `--linha`, `--suave` | mistura do azul com branco | fundo da página, hover, divisórias, texto secundário |
| `--ambar-fundo`, `--ambar-hover` | mistura do âmbar com branco | faixas de aviso, hover do botão |
| `--alerta`, `--alerta-fundo` | mistura do laranja com o azul / branco | erro de formulário |
| `--sobre-azul` | mistura do branco com o azul | texto secundário sobre fundo azul |

Contraste medido em `npm run check` (`scripts/checar-contraste.mjs`): texto normal ≥ 4,5; texto grande e bordas ≥ 3. Se um par falhar, a cor da página muda, nunca o mínimo. O botão usa texto azul sobre âmbar (5,6:1); o hover clareia o âmbar em vez de escurecer porque a versão escura reprovou no contraste (4,2:1).

## Tipografia

**Títulos e números grandes: Archivo** (licença OFL), variável, só o eixo `wght`, subconjunto latino, hospedada no próprio site (`/fonts/archivo-latin-wght.woff2`, 34,1 KB medidos; orçamento de 50 KB). Tem números tabulares e todos os acentos do português. O arquivo vem do pacote `@fontsource-variable/archivo` (devDependency) e o build copia só esse arquivo.

**Corpo, rótulos, botões, resumo do FAQ, rodapé e `.il-sub`: pilha de sistema** (`system-ui`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`), em 400, sem download. Duas variáveis em `:root`: `--fonte-titulo` e `--fonte-texto`.

Por quê: com a pilha de sistema em peso 800 nos títulos, a página tinha cara de painel administrativo e nenhuma identidade (Segoe UI no Windows, San Francisco no iPhone). A Archivo dá um rosto só aos títulos e aos números, sem custo no corpo do texto.

Onde entra: `h1`, `h2`, `h3`, `.texto h1`, `.prova strong`, `.preco`, `.chuva .grande`, `.barra-info b`, `.garantias b`, `.sim-saida .valor`, o número da fase (`.fases > li::before`) e os `<text>` `.il-t-xg` e `.il-t-gr` do selo de garantia. Pesos: h1 700, h2 650, h3 600, números grandes 700 (o 800 da pilha de sistema ficava pesado na Archivo). `letter-spacing` de -.02em no h1 e nos números grandes e de -.015em em h2 e h3. Números com `tabular-nums lining-nums` (`.num`).

Sem piscar e sem refluxo: `font-display: swap`, `<link rel="preload">` da fonte no `<head>` e uma reserva ("Archivo reserva", `local("Arial Bold")`) com a métrica da Archivo: `size-adjust` 98,7%, `ascent-override` 88,96%, `descent-override` 21,28%, `line-gap-override` 0%. Origem: `@capsizecss/metrics` 4.4.0 (Archivo: unitsPerEm 1000, ascent 878, descent -210, xWidthAvg 440; Arial: unitsPerEm 2048, xWidthAvg 913); as contas estão em comentário no `src/estilos.css`. A reserva usa a Arial Bold porque a Archivo só entra em peso 600 a 700. Em sistemas sem Arial (Android) a reserva não existe e o navegador usa o próximo da pilha, sem ajuste.

Todo caractere dos títulos e números grandes está no subconjunto latino (conferido: não há "→", e "−", "·", aspas e travessões estão dentro do intervalo). Se um título ganhar um glifo fora dele, tire o glifo ou deixe o elemento na fonte do sistema; nunca deixe um glifo cair na reserva no meio de uma palavra.

Escala fluida com `clamp()`: título do hero 2,125–2,5 rem (`clamp(2.125rem, 6.4vw, 2.5rem)`); h2 1,75–2,5 rem; h3 1,25 rem; corpo 1,0625 rem; linha de leitura limitada a ~62–68 caracteres.

**Hierarquia por cor, não por enfeite.** O título do hero tem dois tons, sem mudar o texto: "Energia solar instalada" em `--suave` (`.tom-suave`) e "pela nossa equipe, sem terceirizar." em `--azul`, de modo que o diferencial fica na cor forte. É um recurso de uso único: nenhum outro título usa dois tons. O sublinhado âmbar (`.destaque`) saiu; "75% a 90%" é `<strong class="num">`, como "3 a 4 anos".

## Espaço e forma

Base de 8 px. Contêiner de 1120 px com margem lateral de 16 px no celular. Seções com respiro vertical `clamp(48px, 8vw, 96px)`. Alvos de toque de 44–48 px. Raios e bordas: ver "Acabamento".

### Acabamento

- **Três raios, em `:root`:** `--raio` (10 px: botão, campo, atalhos, aviso, erro, foco, chips das cidades), `--raio-bloco` (14 px: `.sim`, `.form-caixa`, `.cartao`, `.chuva`, `.prazo`, `.caso-nota`, `.confirmacao`) e `--raio-pilula` (999 px: `.etiqueta`). Ficam de fora o círculo (50%) e `--raio-barra` (6 px, as barras do caso e do simulador).
- **Um recurso por separação.** Bloco branco sobre fundo colorido (papel, âmbar claro, azul claro) se separa pelo fundo e pelo espaço, sem borda: `.cartao`, `.prazo`, `.form-caixa`, `.confirmacao`, `.caso-nota` (azul claro sobre o azul do caso) e `.cidades li` (branco). Quando o bloco cairia em fundo branco, o fundo dele vira `--papel` (`.cartao` e `.prazo` em seção branca). O simulador e o formulário levam o mesmo anel `box-shadow: 0 0 0 6px var(--ambar-fundo)`, para serem lidos como o mesmo tipo de coisa. A `.confirmacao` mantém só a faixa da esquerda (6 px, `--azul`) como sinal de status.
- **Bordas que ficam por contraste (WCAG 1.4.11):** campos (`.campo input/select`, `.sim-campo`, input de arquivo), botões (`.botao`, `.sim-atalhos button`; âmbar sobre branco não chega a 3:1) e o foco. Avisos e erro mantêm a faixa ou borda de cor que carrega o significado.
- **Chevron do FAQ:** `::after` de 10 px com `border-right` e `border-bottom` de 2 px em `currentColor`, `rotate: 45deg`; aberto, `-135deg`. Rotação de 150 ms, desligada com `prefers-reduced-motion`.

## Ritmo da página

O fundo alterna a cada seção: hero (`--papel`) → prova (`.fundo-branco`) → caso (`.fundo-azul`) → lei (papel) → garantias (`.fundo-ambar`, com o bloco `.chuva` azul por cima) → como funciona (`.fundo-branco`) → investimento (papel) → dúvidas (`.fundo-branco`) → pedido (`.fundo-claro`, com a `.form-caixa` em branco).

Por quê: a página parecia um só bloco, separada apenas por uma linha fina, e na miniatura da página inteira não se via onde uma seção terminava e a outra começava. Onde o fundo muda, não há mais `border-top`. O azul escuro continua reservado ao caso real, o único antes/depois conferido; o âmbar claro e o azul claro são tons já existentes, sem cor nova.

## Componentes

- **Botão principal:** âmbar, texto azul, borda azul de 2 px, 48 px de altura.
- **Simulador:** cartão branco com borda azul; campo grande com "R$"; resultado numa região `aria-live`; abaixo de R$ 450 aparece o aviso e o botão some.
- **Barras do simulador:** mesma estrutura do caso real, em variante sobre branco: "Hoje" em `--azul` (100% da largura) e "Com o sistema, pela média" como faixa, não valor único: segmento em `--ambar` com borda de 2 px em `--azul` (âmbar sobre branco não chega a 3:1), de `de/conta` a `ate/conta` da largura, sobre uma trilha `--azul-claro`. Larguras por custom property inline (`--largura`, `--inicio`, `--fim`), sem transição. O bloco é um `role="img"` com `aria-label` dos valores. As barras do caso real não mudam.
- **Atalhos de valor:** três botões pequenos abaixo do campo (limites das faixas do formulário, rótulos gerados de `FAIXAS_CONTA`), criados só por JavaScript; preenchem o campo e recalculam. Sem `input range`: os limites não têm fonte no brief.
- **Prova rápida:** quatro números em grade (412, 6 anos, 4,8, 11 pessoas), mesma altura e tamanho, separados por linha. Sob o 4,8, cinco estrelas em SVG inline (`#il-estrela`): quatro cheias em `--ambar` e a quinta cheia até 80% (`clipPath` fixo, sem JS), com contorno vazio em `--linha`. O grupo é um `role="img"` com `aria-label="Nota 4,8 de 5 no Google"`; sem link nem animação.
- **Selos:** fileira de quatro itens que fecha "Como funciona", cada um com ícone de traço (mesma família das ilustrações, só tokens) e uma frase curta do brief. É texto com ícone: não imita selo de certificadora, Inmetro nem marca de fabricante. 1 coluna no celular, 2 a partir de 760 px, 4 a partir de 960 px, separados por `1px solid var(--linha)`.
- **Linha do caso no formulário:** uma frase junto ao botão de envio ("Um caso conferido…") com link para o caso; não repete as barras.
- **Caso real:** duas barras proporcionais (780 → 118, largura calculada da razão) sobre fundo azul, com a nota "Não é zero" e "É um caso, não uma média".
- **Garantias:** "E se chover?" em destaque (5 anos), as garantias de fabricante em lista de uma linha.
- **Duas colunas (`.duas-col`):** usada só em Dúvidas. A partir de 960 px, 38% / 62%, com a coluna esquerda (título e prazo, ou título e a linha "Não achou a sua?") em `position: sticky; top: 88px`, o mesmo valor do `.hero-lado`; a direita traz a lista (passos ou FAQ), na mesma altura de início. Abaixo de 960 px é uma coluna. O sticky só liga em janela com 560 px de altura ou mais, para não prender a coluna numa tela baixa. Só CSS, sem JavaScript.
- **CTA de fim de seção (`.botao--fim`):** o mesmo botão principal ("Pedir simulação", `href="#pedido"`), no fim do caso real, das garantias e do Como funciona, as seções que convencem. Não aparece na Lei, no Investimento nem nas Dúvidas (esta já tem o link "Peça a simulação"), nem como botão flutuante. Largura automática a partir de 760 px, 100% abaixo. O do caso leva `data-faixa` (faixa de R$ 780, gerada no build) e um único listener em `app.js` preenche a conta para qualquer `a[data-faixa][href="#pedido"]`; a faixa nunca vai na URL. Sobre o azul o foco é âmbar; sobre âmbar claro e branco, azul; a borda azul de 2 px mantém o botão a mais de 3:1 sobre branco.
- **Pedido em duas colunas (`.pedido-grade`):** a partir de 960 px, à esquerda rótulo, título, introdução com cidades, mapa (até 360 px) e a linha "Para quem é"; à direita a `.form-caixa`, na altura do título, com `box-shadow: 0 0 0 6px var(--ambar-fundo)` (só ela, só token). A ordem do DOM é a do celular: rótulo, título, introdução, "Para quem é", formulário e, por último, o mapa, de modo que no celular o formulário vem antes do mapa e a linha de quem não atendemos fica logo antes dele (SPEC §3.10); no desktop `grid-template-areas` reposiciona sem mexer no DOM. Dentro do formulário: conta e cidade na primeira linha, o aviso da conta na largura toda logo abaixo, nome e WhatsApp na seguinte.
- **Cabeçalho da lei (`.lei-topo`):** a partir de 960 px, rótulo e título à esquerda e o parágrafo de introdução à direita, na mesma linha; esquema e cartões seguem embaixo, na largura total.
- **Fases e régua de prazo (`.fases`, `.regua`):** os 8 passos da SPEC §3.7, na ordem, agrupados em 4 fases (`ol.fases`, cada `li` com um `h3` e um `ul.fase-passos`). Número da fase por counter CSS (`01` a `04`, `--fonte-titulo`, 2rem, 700, `--azul`), sem círculo nem fundo e sem ícone. 4 colunas iguais a partir de 960 px, 2 × 2 de 760 a 959 px, uma coluna abaixo; fases separadas por `1px solid var(--linha)`, sem cartão. O passo da CPFL leva a etiqueta "Prazo da CPFL". Abaixo, a régua: barra de HTML e CSS (não SVG) com o trecho "Projeto e homologação na CPFL" em `--azul-claro` e, no fim, o trecho da instalação em `--ambar` com borda de 2 px `--azul`, de largura `--obra: calc(2 / 45 * 100%)`. Usa o menor total do brief (45 dias) porque é o caso em que a obra mais pesa; com 60 dias o trecho seria ainda menor, então a barra nunca exagera a homologação. `min-width: 28px` mantém o trecho visível em 390 px. O rótulo "Instalação: 2 dias" fica sempre acima do trecho, ligado por um traço, para nunca vazar da barra. Marcos "Assinatura" e "Sistema ligado" nas pontas e a legenda com o prazo (a única vez que "45 a 60 dias" aparece na seção). O bloco tem `role="img"` e `aria-label` com a legenda inteira; os rótulos internos são `aria-hidden`. Sem animação.
- **FAQ:** `<details>`, funciona sem JavaScript; ícone é o chevron de CSS (ver "Acabamento").
- **Rodapé (`.rodape`):** logo; duas colunas a partir de 760 px (quem somos e onde atendemos | resposta por WhatsApp, assistência técnica e links para a política e para #pedido); embaixo, separadas por `--linha`, duas linhas pequenas: "CNPJ, endereço e telefone: a publicar." e "Projeto de estudo: a Ravena Solar é uma empresa fictícia." Tudo vem do brief, sem número novo; só tokens.
- **Ilustrações:** quatro desenhos da mesma família, todos SVG inline (nunca `<img>` nem .svg externo, para o `checar-cores` varrer). Traço de `--traco: 3px` (com `vector-effect: non-scaling-stroke`, então são 3 px em qualquer largura), cantos e pontas redondos, sem gradiente, sombra nem animação. Cores só por classe (`.il-azul`, `.il-ambar`, `.il-branco`, `.il-claro`, `.il-laranja`, `.il-fundo`) com os tokens `--azul`, `--ambar`, `--branco`, `--azul-claro`, `--laranja` e `--ambar-fundo`. Símbolos compartilhados (sol, casa, casa à noite, rede) ficam num bloco `<defs>` no topo da página.
  1. Hero: casa de duas águas com painel em trapézio e grade do logo, e o sol. Decorativa (`aria-hidden`); 180 px de altura no celular, entre o texto e o simulador; no desktop fica na coluna do texto, abaixo do subtítulo, e preenche o espaço ao lado do simulador. A partir de 960 px, o hero cabe inteiro na primeira dobra: espaçamentos do hero e do simulador mais compactos, altura do desenho ligada à altura da janela (`100vh`, entre 120 e 340 px) e, nas barras, rótulo à esquerda e barra à direita. Conferido em 1366×620, 1518×700 e 1920×1000.
  2. Garantias: selo "5 anos" sobre telha capa e canal, dentro do bloco azul. Decorativo; o texto "5 anos" continua no HTML.
  3. Lei 14.300: sol, casa de dia, rede, casa à noite, ligados por setas. Horizontal a partir de 760 px, vertical abaixo. `role="img"` com `<title>` e `aria-label`; rótulos só com o que o brief diz, sem percentual.
  4. Pedido: mapa esquemático com Sorocaba no centro, círculo "raio de 80 km" e Votorantim, Itu e Salto em posição aproximada, sem distância por cidade. `role="img"`; a lista `ul.cidades` segue no HTML para o leitor de tela.

  Todas têm `viewBox` fixo e `aspect-ratio` no CSS (CLS 0). Os pares de contraste estão em `scripts/checar-contraste.mjs`.
- **Formulário:** rótulo sempre visível, erro em texto + ícone + cor (nunca só cor), foco visível de 3 px, anexo opcional dito como "ajuda a acelerar".

## Movimento

Nenhum obrigatório. Só rolagem suave para âncoras, desligada com `prefers-reduced-motion`.

## Imagens

Não há foto, vídeo nem imagem de banco: as 40 fotos de obra e os 3 depoimentos em vídeo existem, mas não vieram no material, e nada disso vai chegar. Placeholder fingindo ser obra e imagem gerada por IA também ficam fora (SPEC §5). O visual vem do próprio logo: as ilustrações (ver Componentes) reaproveitam o sol de 5 raios e o trapézio com grade, são SVG inline em `src/index.html` e usam só os tokens de cor. Fora delas, só o logo, o ícone derivado dele e a imagem de compartilhamento (`og.png`, gerada com as cores do logo). Se as fotos chegarem, entram poucas, com prioridade para telhado de telha de barro.
