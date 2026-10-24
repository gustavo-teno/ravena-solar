# Ravena Solar — landing page (P1)

Página de uma ação: **pedir uma simulação** de energia solar residencial. Cliente fictício; o brief está em [`brief.md`](brief.md), as decisões em [`SPEC.md`](SPEC.md), o design em [`DESIGN.md`](DESIGN.md), o que falta em [`FALTA.md`](FALTA.md) e a evidência em [`verificacao/README.md`](verificacao/README.md).

## Rodar

```bash
npm install
npm run dev        # build + servidor em http://localhost:3000
npm run verificar  # build + checks + testes
```

Node 20 ou mais novo. Sem framework: HTML, CSS e um módulo JS. Só há uma dependência de desenvolvimento (`@resvg/resvg-js`, usada para gerar a imagem de compartilhamento).

## Como é organizado

| Pasta | O que tem |
|---|---|
| `src/` | HTML, CSS e `app.js` (simulador e envio sem recarregar) |
| `shared/validacao.js` | **a regra do pedido**, usada pelo navegador e pelo servidor (obrigatórios, faixa abaixo de R$ 450, cidade, WhatsApp, anexo, simulador) |
| `shared/simulacao.js` | HTML da saída do simulador (exemplo, aviso e resultado com barras), usado pelo build e pelo navegador |
| `server/pedido.js` | recebe `POST /api/pedido`; com JS responde JSON, sem JS responde 303 para a confirmação |
| `server/destino.js` | **ponto único de entrega dos pedidos** |
| `api/pedido.js` | a mesma função como função da Vercel |
| `scripts/` | build e checks automáticos |
| `test/` | testes do simulador, da validação e do envio |
| `public/` | resultado do build (não versionado) |

O build lê as cores do `logo.svg`, injeta as opções do formulário a partir de `shared/validacao.js` e embute o CSS no HTML.

## Destino dos pedidos: demonstração

A Ravena é fictícia, então **o pedido não chega a ninguém**. `server/destino.js` só registra no log um resumo sem dado pessoal (cidade, faixa da conta, se tem anexo). Para ligar o destino real (WhatsApp Business, CRM, e-mail), troque somente o corpo de `enviarPedido`; se ele lançar erro, a página mostra falha e não exibe a confirmação. `DEMO_FORCAR_FALHA=1` simula essa falha.

## Checks (`npm run check`)

- `checar-numeros`: todo número do texto da página precisa estar no brief; a tabela mostra a fonte de cada um.
- `checar-palavras`: "grátis", "energia do futuro", "revolução solar", "sustentabilidade", "95%", "zerar" etc.
- `checar-cores`: nenhuma cor escrita à mão; as cores da página são as do `logo.svg`.
- `checar-contraste`: razão de contraste dos pares texto/fundo (WCAG AA).

Se um check falhar, descubra se o check ou a página está errado. Nunca afrouxe o check para passar.

## Publicar

Pensado para a Vercel (`vercel.json`: `npm run build`, saída `public/`, função em `api/`). Defina `SITE_URL` (ou deixe a Vercel preencher `VERCEL_PROJECT_PRODUCTION_URL`) para o `og:image` sair com URL absoluta. **Ainda não publicado.**
