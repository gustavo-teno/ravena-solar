# Design — Landing page Ravena Solar

O design escrito no disco. A página lê as cores do `logo.svg` por código; nenhum valor de cor é digitado aqui nem no CSS.

## Princípios

1. **Uma ação.** Tudo leva a "Pedir simulação". Sem menu; só logo e um botão fixo no topo.
2. **Conteúdo antes de efeito.** Título, números e simulador estão no HTML inicial. Não há contador, 3D, parallax nem `opacity: 0` no conteúdo: nada some nem aparece por animação. O pouco movimento que existe é enfeite lento, só em CSS (ver "Movimento").
3. **Calmo e direto.** Número claro, frase curta, nada de ícone emoji ou gradiente. Separação por espaço, fundo e fios quase invisíveis; nada de borda grossa, cor chapada berrante ou peso preto. A página fala no mesmo tom do cabeçalho (ver "Linguagem suave").
4. **Mobile primeiro.** A decisão costuma ser tomada no celular do casal. Colunas só entram a partir de 760 px (cartões, prova) e 960 px (hero com o simulador ao lado).

## Linguagem suave

O cabeçalho (fundo `--papel` translúcido, um fio embaixo, links em 14 px e peso 500, botão em pílula) virou a régua do resto da página. Esta seção vale sobre qualquer detalhe mais antigo que a contradiga.

- **Peso e tamanho (meio-termo entre calmo e legível).** Títulos e números em Archivo 600; rótulos, resumo do FAQ, selos e rótulos de campo em 600; `strong`/`b` em 600. Corpo 17 px, texto de apoio nunca abaixo de 14 px (a maioria em 15 a 16 px). Hero 2,125 a 2,5 rem; h2 1,625 a 2,25 rem; h3 1,125 rem; números grandes (prova, preço, garantias, barras) 1,5 a 2,5 rem. Rótulos em caixa alta: 13 px, peso 600. Texto corrido (introduções, cartões, FAQ, fases, notas, rodapé) em `--azul`; `--suave` só nos rótulos de caixa alta, na dica do anexo, no "R$" do campo e no primeiro tom do título do hero.
- **Fios, não bordas.** `--fio` (16% do azul sobre o que estiver atrás) separa listas, FAQ, rodapé, limites do pedido e as fases do Como funciona; sumiram as divisórias verticais da prova, das fases e dos selos (agora só espaço).
- **Sombra no lugar do anel e da borda.** `--sombra` (duas camadas bem difusas) é o único contorno de `.sim`, `.form-caixa`, `.cartao` e `.caso-nota`; o anel de 6 px em `--ambar-fundo` foi removido.
- **Raios maiores.** `--raio` 12 px (campos, avisos), `--raio-bloco` 20 px (cartões), pílula (botões, atalhos, selos) e barras também em pílula.
- **Um único bloco escuro.** O caso real continua em azul escuro, a âncora visual da página (os dois números que o leitor precisa guardar: R$ 780 e R$ 118), mas com o acabamento suave: barras finas em pílula (a "antes" em `--sobre-azul`, a "depois" em âmbar), dados com fio claro e o cartão branco ao lado. O resto da página não tem outro bloco azul: o "E se chover?" é um cartão branco sobre âmbar a 10%, e o azul cheio aparece só no texto, no selo "5 anos" e nos 2 dias de obra da régua.
- **Botões.** Pílula, 46 px, borda de 1 px em 30% do azul, peso 600, sombra âmbar leve. A borda segue só para o contraste do botão; campos usam 1,5 px em 55% do azul (3:1 sobre branco).
- **Traços finos, mas visíveis.** Ilustrações com `--traco: 2.5px`; ícones dos selos e estrelas com 2 px; texto dentro dos SVGs em 600 (28 px nos títulos, 24 px em `.il-sub`, 26 px nos nomes do mapa); a telha com traço e laranja mais claros, para o selo azul ser o único ponto forte; o mapa com fios de 1,5 px.
- **Foco.** Contorno de 2 px (antes 3 px), com 2 a 3 px de afastamento. Chevron do FAQ de 2 px.
- **Marcas pequenas.** Lista com bolinha âmbar de 8 px sem borda; chevron do FAQ com 1,5 px; etiqueta "Prazo da CPFL" sem borda; avisos sem faixa lateral grossa; confirmação sem barra azul.

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

Escala fluida com `clamp()`: título do hero 2,125–2,5 rem (`clamp(2.125rem, 6vw, 2.5rem)`); h2 1,625–2,25 rem; h3 1,125 rem; corpo 1,0625 rem; linha de leitura limitada a ~62–68 caracteres.

**Hierarquia por cor, não por enfeite.** O título do hero tem dois tons, sem mudar o texto: "Energia solar instalada" em `--suave` (`.tom-suave`) e "pela nossa equipe, sem terceirizar." em `--azul`, de modo que o diferencial fica na cor forte. É um recurso de uso único: nenhum outro título usa dois tons. O sublinhado âmbar (`.destaque`) saiu; "75% a 90%" é `<strong class="num">`, como "3 a 4 anos".

## Espaço e forma

Base de 8 px. Contêiner de 1120 px com margem lateral de 16 px no celular. Seções com respiro vertical `clamp(48px, 8vw, 96px)`. Alvos de toque de 44–48 px. Raios e bordas: ver "Acabamento".

### Acabamento

- **Três raios, em `:root`:** `--raio` (12 px: campo, aviso, erro, foco), `--raio-bloco` (20 px: `.sim`, `.form-caixa`, `.cartao`, `.chuva`, `.prazo`, `.caso-nota`, `.confirmacao`) e `--raio-pilula` (999 px: `.etiqueta`). Ficam de fora o círculo (50%) e `--raio-barra` (6 px, as barras do caso e do simulador).
- **Um recurso por separação.** Bloco branco sobre fundo colorido (papel, âmbar claro, azul claro) se separa pelo fundo e pelo espaço, sem borda: `.cartao`, `.prazo`, `.form-caixa`, `.confirmacao`, `.caso-nota` (azul claro sobre o azul do caso) e `.cidades li` (branco). Quando o bloco cairia em fundo branco, o fundo dele vira `--papel` (`.cartao` e `.prazo` em seção branca). O simulador e o formulário levam o mesmo anel `box-shadow: 0 0 0 6px var(--ambar-fundo)`, para serem lidos como o mesmo tipo de coisa. A `.confirmacao` mantém só a faixa da esquerda (6 px, `--azul`) como sinal de status.
- **Bordas que ficam por contraste (WCAG 1.4.11):** campos (`.campo input/select`, `.sim-campo`, input de arquivo), botões (`.botao`, `.sim-atalhos button`; âmbar sobre branco não chega a 3:1) e o foco. Avisos e erro mantêm a faixa ou borda de cor que carrega o significado. O botão principal (`.botao`) usa borda de 1 px em 40% de `--azul` sobre o âmbar, mais sombra leve âmbar; o peso da fonte é 600.
- **Chevron do FAQ:** `::after` de 10 px com `border-right` e `border-bottom` de 2 px em `currentColor`, `rotate: 45deg`; aberto, `-135deg`. Rotação de 150 ms, desligada com `prefers-reduced-motion`.

## Ritmo da página

O fundo alterna a cada seção: hero (`--papel`) → prova (`.fundo-branco`) → caso (`.fundo-azul`) → lei (papel) → garantias (`.fundo-ambar`, com o cartão `.chuva` branco por cima) → como funciona (`.fundo-branco`) → investimento (`.fundo-ambar`) → dúvidas (`.fundo-branco`) → pedido (`.fundo-azul`, com a `.form-caixa` branca por cima) → rodapé (`--azul-escuro`). O azul escuro abre e fecha o miolo da página: o caso real (as provas) e o pedido (a ação).

Por quê: a página parecia um só bloco, separada apenas por uma linha fina, e na miniatura da página inteira não se via onde uma seção terminava e a outra começava. Onde o fundo muda, não há mais `border-top`. Depois de suavizar o visual, sete das dez faixas eram branco ou cinza claro e a página ficou lavada; por isso o pedido foi para o azul escuro (a última tela é a da decisão e ganha peso) e o investimento ganhou o âmbar claro, sem cor nova. Dentro do azul, tudo que é claro (cartão do formulário) leva texto e foco em `--azul`; o mapa passa a ter círculo em azul um pouco mais claro, traço, nomes e fios em branco e o tracejado do raio em branco de 2 px (em âmbar ele sumia contra o azul). O rodapé usa `--azul-escuro` (azul do logo misturado com preto, definido em `scripts/tokens.mjs`) para não se fundir ao pedido, e a logo clara (`logo-claro.svg`, gerada no build a partir do `logo.svg`: texto e painel em branco, grade em azul).

## Componentes

- **Botão principal:** âmbar, texto azul, pílula, borda de 1 px em 30% do azul, 46 px de altura.
- **Simulador:** cartão branco com sombra suave; campo grande com "R$"; resultado numa região `aria-live`; abaixo de R$ 450 aparece o aviso e o botão some.
- **Barras do simulador:** mesma estrutura do caso real, em variante sobre branco: "Hoje" em `--azul` (100% da largura) e "Com o sistema, pela média" como faixa, não valor único: segmento em `--ambar` com borda de 2 px em `--azul` (âmbar sobre branco não chega a 3:1), de `de/conta` a `ate/conta` da largura, sobre uma trilha `--azul-claro`. Larguras por custom property inline (`--largura`, `--inicio`, `--fim`), sem transição. O bloco é um `role="img"` com `aria-label` dos valores. As barras do caso real não mudam.
- **Atalhos de valor:** três botões pequenos abaixo do campo (limites das faixas do formulário, rótulos gerados de `FAIXAS_CONTA`), criados só por JavaScript; preenchem o campo e recalculam. Sem `input range`: os limites não têm fonte no brief.
- **Prova rápida:** quatro números em grade (412, 6 anos, 4,8, 11 pessoas), mesma altura e tamanho, separados por linha. Sob o 4,8, cinco estrelas em SVG inline (`#il-estrela`): quatro cheias em `--ambar` e a quinta cheia até 80% (`clipPath` fixo, sem JS), com contorno vazio em `--linha`. O grupo é um `role="img"` com `aria-label="Nota 4,8 de 5 no Google"`; sem link nem animação.
- **Selos:** fileira de quatro itens que fecha "Como funciona", cada um com ícone de traço (mesma família das ilustrações, só tokens) e uma frase curta do brief. É texto com ícone: não imita selo de certificadora, Inmetro nem marca de fabricante. 1 coluna no celular, 2 a partir de 760 px, 4 a partir de 960 px, separados por `1px solid var(--linha)`.
- **Linha do caso no formulário:** uma frase junto ao botão de envio ("Um caso conferido…") com link para o caso; não repete as barras.
- **Caso real:** duas barras proporcionais (780 → 118, largura calculada da razão) sobre fundo azul escuro (hoje em `--sobre-azul`, depois em âmbar, barras finas), com a nota "É um caso real" no cartão branco ao lado.
- **Garantias (`.garantia-topo`, `.garantias`):** a partir de 960 px, duas colunas iguais e centralizadas na vertical: à esquerda rótulo, "E se chover?" e a introdução; à direita o cartão `.chuva` (selo "5 anos" sobre a telha, título e frase, centralizados). Abaixo, três cartões brancos iguais com sombra suave: 25 anos de performance do painel, 10 anos de garantia do inversor e a assistência técnica autorizada. O botão "Pedir simulação" fica centralizado no fim (`.cta-centro`). Abaixo de 960 px tudo empilha. Antes tudo ficava alinhado à esquerda, com o cartão azul esticado e as garantias soltas em lista.
- **Duas colunas (`.duas-col`):** usada só em Dúvidas. A partir de 960 px, 38% / 62%, com a coluna esquerda (título e prazo, ou título e a linha "Não achou a sua?") em `position: sticky; top: 88px`, o mesmo valor do `.hero-lado`; a direita traz a lista (passos ou FAQ), na mesma altura de início. Abaixo de 960 px é uma coluna. O sticky só liga em janela com 560 px de altura ou mais, para não prender a coluna numa tela baixa. Só CSS, sem JavaScript.
- **CTA de fim de seção (`.botao--fim`):** o mesmo botão principal ("Pedir simulação", `href="#pedido"`), dentro do cartão do caso real (`.caso-nota`, em largura total) e no fim das garantias (centralizado) e do Como funciona, as seções que convencem. Não aparece na Lei, no Investimento nem nas Dúvidas (esta já tem o link "Peça a simulação"), nem como botão flutuante. Largura automática a partir de 760 px, 100% abaixo. O do caso leva `data-faixa` (faixa de R$ 780, gerada no build) e um único listener em `app.js` preenche a conta para qualquer `a[data-faixa][href="#pedido"]`; a faixa nunca vai na URL. Sobre o azul o foco é âmbar; sobre âmbar claro e branco, azul; a borda azul de 2 px mantém o botão a mais de 3:1 sobre branco.
- **Pedido em duas colunas (`.pedido-grade`):** a partir de 960 px, à esquerda rótulo, título, introdução curta e o mapa (até 460 px); à direita a `.form-caixa`, na altura do título, com `box-shadow: 0 0 0 6px var(--ambar-fundo)`. Abaixo das duas colunas, em largura total e nas mesmas colunas do grid, o bloco `.pedido-limites` ("Para quem é" e "Fora do que fazemos", texto simples, sem caixa): antes era uma caixa âmbar na coluna da esquerda, que a deixava bem mais alta que o formulário e abria um vazio à direita. A ordem do DOM é a do celular: rótulo, título, introdução, formulário, mapa e, por último, os limites; no desktop `grid-template-areas` reposiciona sem mexer no DOM. Dentro do formulário: conta e cidade na primeira linha, o aviso da conta na largura toda logo abaixo, nome e WhatsApp na seguinte. Texto do formulário enxuto: sem a linha do caso (já está na seção do caso), anexo com uma dica de uma frase e nota de privacidade de uma frase. Campos com borda de 1,5 px em 55% de `--azul` sobre branco (mantém 3:1); o botão nativo "Escolher arquivo" é estilizado com `::file-selector-button` (pílula `--azul-claro`, sem borda).
- **Cabeçalho da lei (`.lei-topo`):** a partir de 960 px, rótulo e título à esquerda e o parágrafo de introdução à direita, na mesma linha; esquema e cartões seguem embaixo, na largura total.
- **Fases e régua de prazo (`.fases`, `.regua`):** os 8 passos da SPEC §3.7, na ordem, agrupados em 4 fases (`ol.fases`, cada `li` com um `h3` e um `ul.fase-passos`). Cada fase é um cartão `--papel` (sem sombra, por estar em seção branca) com o número (`01` a `04`, counter CSS, `--fonte-titulo`, 600) e o título; os passos são tópicos com bolinha âmbar de 8 px, cada um com o nome em 600 e, abaixo, o detalhe em fonte menor (`strong` + `span`). 4 colunas a partir de 960 px, 2 × 2 de 760 a 959 px, uma abaixo. O passo da CPFL leva a etiqueta "Prazo da CPFL". Antes eram parágrafos corridos separados por fios verticais, o que lia como texto solto. Abaixo, a régua de quadradinhos (um por dia): 2 de instalação em `--azul` cheio, 43 de projeto e homologação em `--linha`, 15 de margem em `--azul-claro` com contorno; título com o prazo ("45 a 60 dias", a única vez que aparece na seção), marcos "Assinatura" e "Sistema ligado" e legenda de três itens. `role="img"` com `aria-label`; rótulos internos `aria-hidden`.
- **FAQ:** `<details>`, funciona sem JavaScript; ícone é o chevron de CSS (ver "Acabamento").
- **Rodapé (`.rodape`):** logo; duas colunas a partir de 760 px (quem somos e onde atendemos | resposta por WhatsApp, assistência técnica e links para a política e para #pedido); embaixo, separadas por `--linha`, duas linhas pequenas: "CNPJ, endereço e telefone: a publicar." e "Projeto de estudo: a Ravena Solar é uma empresa fictícia." Tudo vem do brief, sem número novo; só tokens.
- **Ilustrações:** quatro desenhos da mesma família, todos SVG inline (nunca `<img>` nem .svg externo, para o `checar-cores` varrer). Traço de `--traco: 2px` (com `vector-effect: non-scaling-stroke`, então são 3 px em qualquer largura), cantos e pontas redondos, sem gradiente, sombra nem animação. Cores só por classe (`.il-azul`, `.il-ambar`, `.il-branco`, `.il-claro`, `.il-laranja`, `.il-fundo`) com os tokens `--azul`, `--ambar`, `--branco`, `--azul-claro`, `--laranja` e `--ambar-fundo`. Símbolos compartilhados (sol, casa, casa à noite, rede) ficam num bloco `<defs>` no topo da página.
  1. Hero: casa de duas águas de frente, com painel em trapézio e grade do logo, e o sol (círculo com 6 raios curtos em volta). Decorativa (`aria-hidden`); 180 px de altura no celular, entre o texto e o simulador; no desktop fica na coluna do texto, abaixo do subtítulo. Tentamos uma casa em perspectiva oblíqua com mais detalhes; voltou-se à versão plana por pedido do Gustavo.
  2. Garantias: selo "5 anos" sobre telha capa e canal, dentro do cartão branco. Decorativo; o texto "5 anos" continua no HTML.
  3. Lei 14.300: sol, casa de dia, rede, casa à noite, ligados por setas. Horizontal a partir de 760 px, vertical abaixo. `role="img"` com `<title>` e `aria-label`; rótulos só com o que o brief diz, sem percentual.
  4. Pedido: mapa esquemático com Sorocaba no centro e um círculo de 80 km (só "80 km" no raio). Votorantim, Itu e Salto em posição aproximada, sem distância por cidade; os nomes ficam fora do círculo, à direita, ligados por fios finos, para não se amontoarem. `role="img"`; a lista de cidades saiu do HTML, porque os nomes já estão no próprio mapa.

  Todas têm `viewBox` fixo e `aspect-ratio` no CSS (CLS 0). Os pares de contraste estão em `scripts/checar-contraste.mjs`.
- **Formulário:** rótulo sempre visível, erro em texto + ícone + cor (nunca só cor), foco visível de 2 px, anexo opcional dito como "ajuda a acelerar".

## Movimento

Pouco, lento e só enfeite. Regras: só CSS (nenhum JavaScript para animar); nada de conteúdo escondido ou revelado (sem animação, a página está completa); tudo dentro de `@media (prefers-reduced-motion: no-preference)`, de modo que quem pede menos movimento não vê nenhum; nada que chame atenção mais que o simulador.

- **Sol do hero:** 6 raios curtos e iguais, espaçados em volta do círculo (o logo tem raios curtos e iguais, em leque; os "traços intermediários" de uma versão com 12 raios foram retirados para não se afastar do logo). Giram em torno do círculo, uma volta a cada 48 s (`.sol-raios`, `@keyframes gira`); o círculo fica parado. Os raios são um grupo à parte no SVG do hero, centrado na origem de um `translate`. O mesmo sol, parado, aparece no esquema da lei.
- **Raio de 80 km (mapa do pedido):** um anel âmbar sai de Sorocaba e cresce até a borda do círculo de 80 km (de r 10 a r 150, escala 15), esmaecendo, a cada 5 s, com pausa no fim (`.il-pulso`); e o círculo tracejado gira muito devagar, uma volta a cada 90 s (`.il-orbita`). O anel é invisível sem animação (`opacity: 0`), mas só enfeita: o círculo, o raio e os nomes já dizem tudo.
- **Botões:** subida de 1 px no hover, transição de 200 ms (`.botao`). Cartões não se mexem, porque não são clicáveis.
- **Rolagem suave** para âncoras, também desligada com `prefers-reduced-motion`. O chevron do FAQ gira 150 ms ao abrir, igualmente desligado.
- Fora de questão: contador numérico, barras que crescem ao rolar, entrada de seções, parallax, confete, cursor customizado.

## Imagens

Não há foto, vídeo nem imagem de banco: as 40 fotos de obra e os 3 depoimentos em vídeo existem, mas não vieram no material, e nada disso vai chegar. Placeholder fingindo ser obra e imagem gerada por IA também ficam fora (SPEC §5). O visual vem do próprio logo: as ilustrações (ver Componentes) reaproveitam o sol de 5 raios e o trapézio com grade, são SVG inline em `src/index.html` e usam só os tokens de cor. Fora delas, só o logo, o ícone derivado dele e a imagem de compartilhamento (`og.png`, gerada com as cores do logo). Se as fotos chegarem, entram poucas, com prioridade para telhado de telha de barro.
