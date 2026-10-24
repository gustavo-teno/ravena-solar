# Evidência de verificação

Verificado em 23/10/2026 contra o servidor local (`npm run dev`, http://localhost:3000). **A página ainda não está publicada**, então as medições na página publicada estão em "O que não foi verificado".

## Resultado

| O que foi feito | O que se esperava | Resultado |
|---|---|---|
| `npm run check` — números | todo número do texto está no brief | 30 números distintos, todos com fonte |
| `npm run check` — palavras | nenhuma promessa/slogan proibido | 0 ocorrências em 4 arquivos |
| `npm run check` — cores | nenhuma cor escrita à mão; cores vêm do `logo.svg` | OK (`#123A55`, `#F2A03D`, `#E8721C`) |
| `npm run check` — contraste | texto ≥ 4,5 e bordas/texto grande ≥ 3 | 20 pares OK (menor: 4,2 → corrigido para 7,1 no hover) |
| `npm test` | simulador, validação e envio | 23 de 23 |
| Simulador: R$ 449 / R$ 450 | 449 sem botão; 450 com botão | confere (teste + navegador) |
| Simulador: "780,00" | lido como R$ 780, não R$ 78.000 | R$ 78 a R$ 195; R$ 118 cai dentro |
| Simulador: faixa nunca zero | mínimo ≥ R$ 1 | confere (450 a 99.999) |
| Simulador → formulário | faixa já escolhida, sem dado na URL | `700-1000`, URL só com `#pedido` |
| Formulário vazio | erros por campo, foco no primeiro, nenhuma requisição | confere |
| Formulário, conta abaixo de R$ 450 | aviso e botão de envio some; servidor também recusa (422) | confere |
| Envio com anexo PDF (100 KB) e sem anexo | 200 e confirmação | confere; log do destino sem nome nem WhatsApp |
| Envio sem JavaScript (POST nativo) | 303 para `/pedido-enviado.html`, sem query | confere |
| Anexo de tipo errado / 6 MB | 422 / 413 com o motivo | confere |
| Campo-armadilha preenchido | finge sucesso, não entrega | confere |
| Falha do destino (`DEMO_FORCAR_FALHA=1`) | erro visível, dados mantidos, sem confirmação | confere |
| Servidor fora do ar | erro visível, dados mantidos | confere |
| Rolagem horizontal em 390 px e 1440 px | nenhuma | confere (após correção; ver bugs na SPEC) |
| Lighthouse mobile (local) | 100 | desempenho 100, acessibilidade 100, boas práticas 100, SEO 100; LCP 1,3 s, CLS 0, TBT 0 ms |
| Lighthouse desktop (local) | 100 | 100 nas quatro; LCP 0,3 s |

Relatórios: [`lighthouse/local-mobile.report.html`](lighthouse/local-mobile.report.html) e os `.json`. Capturas da página inteira: [`capturas/pagina-390.png`](capturas/pagina-390.png) e [`capturas/pagina-1440.png`](capturas/pagina-1440.png). Resumo dos relatórios: `node scripts/resumo-lighthouse.mjs verificacao/lighthouse/local-mobile.report.json`.

## Bugs que a verificação pegou

Estão listados na seção 11 da `SPEC.md` (botão `hidden` visível, rolagem horizontal de 49 px no celular, quebras de linha em "137" e "R$ 780", hover do botão sem contraste).

## O que não foi verificado

- **Página publicada.** Lighthouse, envio de ponta a ponta e `og:image` com URL absoluta ficam para depois do deploy.
- **iPhone/Safari e celular real.** Só emulação de 375–390 px no navegador do app e Edge (Chromium).
- **Leitor de tela de verdade.** Há landmarks, `aria-live`, rótulos e foco gerenciado, mas ninguém ouviu a página num leitor.
- **Envio a um destino real.** O destino é de demonstração; o pedido não chega a ninguém.
- **Pré-visualização do link no WhatsApp.** A `og.png` existe, mas o cartão não foi visto no app.
