# Regras do projeto

## Git e GitHub

- **Nunca faça commit sem a permissão explícita do Gustavo.** Antes de qualquer `git commit`, mostre o que vai entrar no commit (arquivos e mensagem) e espere um "sim" claro no chat. Uma permissão vale só para aquele commit, não para os próximos.
- **Nunca faça push sem permissão explícita**, pela mesma regra acima.
- **Nunca envie arquivos sensíveis para o GitHub.** Isso inclui, entre outros:
  - `.env`, `.env.*` (ex.: `.env.local`, `.env.production`)
  - chaves e certificados (`*.pem`, `*.key`, `*.p12`, `*.pfx`, `id_rsa*`)
  - arquivos de credenciais (`credentials.json`, `secrets.*`, `service-account*.json`)
  - qualquer arquivo com senhas, tokens ou chaves de API
- Antes de qualquer commit, confira com `git status` e `git diff --cached` se nenhum arquivo sensível está no stage. Se encontrar algum, tire do stage, avise o Gustavo e garanta que ele está no `.gitignore`.
- Nunca use `git add -A` / `git add .` sem antes revisar a lista de arquivos.

## Projeto: landing page da Ravena Solar

- Leia `brief.md` (o que o cliente pediu), `SPEC.md` (o que foi decidido) e `DESIGN.md` (o design) antes de mexer na página. Onde divergirem, vale a `SPEC.md`.
- **Nenhuma afirmação sem fonte no brief.** Número, prazo, garantia e promessa vêm de `brief.md`. Promessa de queda sempre com o qualificador "na média dos nossos clientes". Nunca "grátis", "energia do futuro", "revolução solar", "sustentabilidade" como slogan, "95%" ou prometer zerar a conta.
- **Cores só do `logo.svg`.** Nenhum hex, `rgb()` ou `hsl()` escrito à mão; use as variáveis geradas por `scripts/tokens.mjs`.
- **Uma única regra de validação** em `shared/validacao.js`, usada pela página e pelo servidor. Não copie a regra.
- **Conteúdo visível sem JavaScript e sem animação.** Nada de `opacity: 0` no hero nem contador que começa em zero. Nenhum dado pessoal em query string.
- **Se um check falhar, descubra se o check ou a página está errado. Nunca afrouxe o check para passar.** Rode `npm run verificar` antes de dizer que terminou.
- Contato, CNPJ e endereço reais só entram quando o cliente fornecer; até lá ficam marcados como pendentes.
- Ao medir animação ou layout no navegador, mantenha o painel visível; com ele oculto, `requestAnimationFrame` não roda.
