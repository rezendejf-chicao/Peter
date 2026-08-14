# Peter no ar — guia passo a passo (grátis de hospedagem, você só paga a IA por uso)

Este pacote coloca o **Peter · Jogo do Gestor** num link público onde seus ~10 convidados
conversam com a IA de verdade. A hospedagem é **gratuita** (Vercel). O único custo é o
**uso da IA da Anthropic** — poucos centavos por sessão (ver o fim deste guia).

Como funciona: o navegador do convidado NÃO tem a sua chave. Ele fala com uma
"função" no Vercel (`/api/chat`), e é essa função que usa a **sua chave secreta**
para chamar a Anthropic. Assim a chave nunca vaza.

O que tem nesta pasta:
- `index.html` — o Peter, arquivo único (já pronto).
- `api/chat.js` — a função que fala com a IA usando a sua chave.
- `LEIA-ME.md` — este guia.

---

## Parte 1 — Criar a chave da IA (Anthropic)  ⏱️ ~5 min

1. Acesse **https://console.anthropic.com** e crie/entre na conta.
2. Menu **Billing** → adicione **US$ 5** de crédito (sobra muito para 10 testes).
3. Menu **API Keys** → **Create Key** → dê um nome (ex.: `peter`) → **copie a chave**
   (começa com `sk-ant-...`). **Guarde num bloco de notas** — ela só aparece uma vez.

> 🟡 Pegadinha: se pular o passo 2 (crédito), a IA responde com erro de "credit balance".
> Sem crédito, não funciona nem para teste.

---

## Parte 2 — Publicar no Vercel  ⏱️ ~10 min

Você vai subir **esta pasta inteira** (com a subpasta `api/` dentro). Escolha UM dos caminhos:

### Caminho fácil (arrastar e soltar, sem instalar nada)
1. Acesse **https://vercel.com** e crie conta (pode usar Google/GitHub ou e-mail).
2. Instale o utilitário oficial só uma vez: no seu computador, no Terminal/Prompt, rode
   `npm i -g vercel` (precisa do Node.js instalado — https://nodejs.org, versão LTS).
3. Ainda no Terminal, entre **nesta pasta** (`cd caminho/para/handoff`) e rode: `vercel`
4. Responda as perguntas apertando **Enter** (aceita os padrões). Ao final ele mostra um
   link `https://...vercel.app` — mas **ainda falta a chave** (Parte 3).

### Caminho por site (se não quiser Terminal)
1. Crie um repositório no **GitHub** e suba os arquivos desta pasta (mantendo `api/chat.js`
   dentro de `api/`).
2. No Vercel: **Add New… → Project → Import** o repositório → **Deploy**.

> 🟡 Pegadinha: a subpasta precisa se chamar exatamente **`api`** e o arquivo **`chat.js`**.
> É isso que faz o endereço `/api/chat` existir. Se renomear, o chat para de responder.

---

## Parte 3 — Colar a chave no servidor (o passo que todo mundo esquece)  ⏱️ ~3 min

1. No painel do Vercel, abra o seu projeto → **Settings → Environment Variables**.
2. Crie uma variável:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** cole a chave `sk-ant-...` da Parte 1
   - Marque os três ambientes (Production / Preview / Development).
3. Salve.
4. Vá em **Deployments → (o último) → ⋯ → Redeploy** — isso é obrigatório para a chave
   "entrar em vigor".

> 🔴 Pegadinha nº 1 do projeto inteiro: **variável de ambiente só vale após um Redeploy.**
> Se você colar a chave e não redeployar, vai jurar que está tudo certo e o chat não responde.

---

## Parte 4 — Testar antes de convidar  ⏱️ ~2 min

1. Abra o link `https://...vercel.app` no seu navegador.
2. O Peter deve abrir a reunião. Escreva uma resposta e envie.
3. Se ele responder → está no ar. 🎉 Mande o link para os 10 convidados.

Se **não** responder, abra o console do navegador (F12 → aba **Console/Network**) e veja o erro:
- `500 ANTHROPIC_API_KEY não configurada` → faltou a Parte 3 (ou o Redeploy).
- `credit balance` / `insufficient` → faltou crédito (Parte 1, passo 2).
- `model not found` → a Anthropic mudou os nomes de modelo. Abra `api/chat.js` e troque os
  dois IDs em `resolvedModel` pelos atuais (veja em console.anthropic.com → Models). Redeploy.
- Página em branco → aguarde alguns segundos (o arquivo é grande e "desempacota" ao abrir).

---

## Distribuir aos convidados
Basta enviar o link `https://...vercel.app`. Eles abrem no celular ou no PC, sem instalar
nada, sem login. Peça que, ao final, cliquem em **Encerrar reunião** e te enviem o texto do
**Debrief** (copiar/colar ou print) — é o seu material para comparar consistência.

> Observação: esta versão **não salva** as sessões automaticamente (isso seria a próxima
> etapa, com banco de dados). Para 10 testes, o debrief enviado por eles já basta.

---

## Quanto vou gastar de IA?
Cobrança por uso da Anthropic. Uma sessão completa (conversa + relatórios + 1 debrief) custa
tipicamente **poucos centavos de dólar**. 10 convidados fazendo 1–2 sessões cada tende a ficar
**abaixo de US$ 2 no total**. Os US$ 5 de crédito cobrem seus testes com folga.

Para controlar: a conversa usa um modelo econômico (Haiku) e só o debrief usa um modelo mais
forte (Sonnet). Você pode reduzir ainda mais trocando o Sonnet por Haiku no `api/chat.js`.
