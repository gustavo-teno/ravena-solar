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

Pilha de sistema (`system-ui`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`): zero download, sem piscar nem refluxo. Título em 800, corpo em 400, números com `tabular-nums`. Escala fluida com `clamp()`: título do hero 2,125–3,5 rem; h2 1,75–2,5 rem; corpo 1,0625 rem; linha de leitura limitada a ~62–68 caracteres.

## Espaço e forma

Base de 8 px. Contêiner de 1120 px com margem lateral de 16 px no celular. Seções com respiro vertical `clamp(48px, 8vw, 96px)`. Raios de 10–14 px; cartões com borda de 1 px (`--linha`), caixas de ação com borda de 2 px (`--azul`). Alvos de toque de 44–48 px.

## Ritmo da página

Fundo claro (hero, lei, garantias, como funciona, investimento, FAQ, pedido) e **um** bloco azul escuro, o caso real, para dar peso ao único antes/depois conferido. A prova rápida fica numa faixa branca logo abaixo do hero.

## Componentes

- **Botão principal:** âmbar, texto azul, borda azul de 2 px, 48 px de altura.
- **Simulador:** cartão branco com borda azul; campo grande com "R$"; resultado numa região `aria-live`; abaixo de R$ 450 aparece o aviso e o botão some.
- **Prova rápida:** quatro números em grade, separados por linha.
- **Caso real:** duas barras proporcionais (780 → 118, largura calculada da razão) sobre fundo azul, com a nota "Não é zero" e "É um caso, não uma média".
- **Garantias:** "E se chover?" em destaque (5 anos), as garantias de fabricante em lista de uma linha.
- **Passos:** lista numerada com linha vertical; o passo da CPFL leva a etiqueta "Depende da distribuidora, não de nós".
- **FAQ:** `<details>`, funciona sem JavaScript.
- **Ilustrações:** quatro desenhos da mesma família, todos SVG inline (nunca `<img>` nem .svg externo, para o `checar-cores` varrer). Traço de `--traco: 3px` (com `vector-effect: non-scaling-stroke`, então são 3 px em qualquer largura), cantos e pontas redondos, sem gradiente, sombra nem animação. Cores só por classe (`.il-azul`, `.il-ambar`, `.il-branco`, `.il-claro`, `.il-laranja`, `.il-fundo`) com os tokens `--azul`, `--ambar`, `--branco`, `--azul-claro`, `--laranja` e `--ambar-fundo`. Símbolos compartilhados (sol, casa, casa à noite, rede) ficam num bloco `<defs>` no topo da página.
  1. Hero: casa de duas águas com painel em trapézio e grade do logo, e o sol. Decorativa (`aria-hidden`); 180 px de altura no celular, acima do simulador no desktop.
  2. Garantias: selo "5 anos" sobre telha capa e canal, dentro do bloco azul. Decorativo; o texto "5 anos" continua no HTML.
  3. Lei 14.300: sol, casa de dia, rede, casa à noite, ligados por setas. Horizontal a partir de 760 px, vertical abaixo. `role="img"` com `<title>` e `aria-label`; rótulos só com o que o brief diz, sem percentual.
  4. Pedido: mapa esquemático com Sorocaba no centro, círculo "raio de 80 km" e Votorantim, Itu e Salto em posição aproximada, sem distância por cidade. `role="img"`; a lista `ul.cidades` segue no HTML para o leitor de tela.

  Todas têm `viewBox` fixo e `aspect-ratio` no CSS (CLS 0). Os pares de contraste estão em `scripts/checar-contraste.mjs`.
- **Formulário:** rótulo sempre visível, erro em texto + ícone + cor (nunca só cor), foco visível de 3 px, anexo opcional dito como "ajuda a acelerar".

## Movimento

Nenhum obrigatório. Só rolagem suave para âncoras, desligada com `prefers-reduced-motion`.

## Imagens

Não há foto, vídeo nem imagem de banco: as 40 fotos de obra e os 3 depoimentos em vídeo existem, mas não vieram no material, e nada disso vai chegar. Placeholder fingindo ser obra e imagem gerada por IA também ficam fora (SPEC §5). O visual vem do próprio logo: as ilustrações (ver Componentes) reaproveitam o sol de 5 raios e o trapézio com grade, são SVG inline em `src/index.html` e usam só os tokens de cor. Fora delas, só o logo, o ícone derivado dele e a imagem de compartilhamento (`og.png`, gerada com as cores do logo). Se as fotos chegarem, entram poucas, com prioridade para telhado de telha de barro.
