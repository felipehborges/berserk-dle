# Berserkdle

Jogo diário de adivinhar personagens de Berserk, em português. MVP com **um único modo**, Next.js App Router, TypeScript e React. Não requer banco, login, variáveis de ambiente ou serviços externos durante o jogo.

## Rodar

Use Node.js 22 ou superior (validado com Node 24) e npm.

```powershell
cd C:\Users\felipe.borges\code\hamasaki\berserkdle
npm ci
npm run dev -- --port 3001
```

Abra [http://127.0.0.1:3001](http://127.0.0.1:3001). A porta 3001 evita conflito com outros projetos na 3000. Sem `--port`, o Next usa a porta 3000. Para encerrar, use Ctrl+C no terminal.

Build de produção:

```sh
npm run build
npm run start -- --port 3001
```

## Jogar

- Busque um nome ou apelido, selecione e confirme. Acentos e maiúsculas não interferem na busca.
- Palpites distintos sem limite de tentativas. Acertar o **personagem** encerra o jogo; apenas coincidir todos os atributos não basta.
- As pistas comparam gênero, naturezas, núcleos, armas/poderes e arco de referência. Cores, símbolos e descrições para leitores de tela se complementam.
- No arco, ↓ indica que a resposta está em arco anterior; ↑ indica posterior, na ordem editorial publicada nas instruções.
- O botão de compartilhar aparece ao terminar. Usa compartilhamento nativo ou área de transferência; se indisponíveis, oferece texto selecionável. O texto não revela nomes nem atributos.

## Calendário e armazenamento

`src/lib/game.ts` define o calendário v1, com início em **01/10/2026**, 14 IDs em ordem fixa. Em **03/10/2026**, começa o calendário v2 de 160 dias, incluindo Femto e o catálogo ampliado do mangá, sem alterar respostas anteriores. A data vem de `Intl.DateTimeFormat` com `America/Sao_Paulo`, independentemente do fuso do navegador. Não depende da data usada no build. Todos recebem o mesmo personagem para a mesma data.

A página verifica a virada a cada segundo, ao ganhar foco, ao mudar de visibilidade e antes de aceitar um palpite. Abas suspensas pelo navegador atualizam ao voltar. O relógio usado é o do dispositivo: alterá-lo permite acessar outros dias. A resposta e o calendário estão no código do cliente; este é um jogo casual sem proteção contra inspeção ou manipulação local.

Os palpites ficam em `localStorage`, na chave `berserkdle:v1:AAAA-MM-DD` antes de 03/10/2026 e `berserkdle:v2:AAAA-MM-DD` a partir dessa data. A restauração valida IDs, remove duplicatas e descarta palpites posteriores à vitória. Saves inválidos são ignorados. Falha de armazenamento é informada sem impedir o jogo. Abas da mesma origem sincronizam pelo evento `storage`; não há sincronização entre dispositivos. Saves do protótipo não são importados porque os atributos e o calendário mudaram.

## Organização

| Arquivo                   | Responsabilidade                                                    |
| ------------------------- | ------------------------------------------------------------------- |
| `src/app/`                | App Router, metadados, página e estilos responsivos                 |
| `src/components/game.tsx` | Interface, teclado, diálogo, armazenamento e compartilhamento       |
| `src/lib/game.ts`         | Funções puras: calendário, busca, comparação, validação e resultado |
| `src/data/characters.ts`  | Fichas tipadas, apelidos, notas e referências editoriais            |
| `docs/editorial.md`       | Critérios, revisão do protótipo e procedimento de ampliação         |
| `tests/`                  | Testes de lógica e de navegador                                     |

A interface usa um fundo do Eclipse e 155 retratos locais para as 160 fichas; as cinco sem imagem confirmada são sinalizadas na busca, nos palpites, no resultado e nas fichas. As fontes das imagens estão em docs/images.md; as fontes tipográficas são do sistema.

## Continuidade em outro computador

Depois de clonar o repositório, execute `npm ci` e siga a seção **Rodar**. O jogo não usa `.env`, banco de dados ou credenciais.

- A interface tem uma coluna central, painel de desafio, busca com retratos e tabela de pistas coloridas sobre um fundo do Eclipse.
- Textos de apoio que ainda são necessários para teclado e leitores de tela ficam visualmente ocultos em `src/components/game.tsx` com a classe `sr-only`.
- Dados, apelidos e recortes editoriais estão em `src/data/characters.ts`; a política de revisão está em `docs/editorial.md`.
- A porta de desenvolvimento sugerida é 3001. Os testes E2E reservam a 3107.

## Verificação

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run format:check
```

Os testes E2E iniciam e encerram seu próprio servidor de produção na porta **3107**; ela precisa estar livre. Não reutilizam servidores de outros projetos. Execute o build antes dos E2E. A suíte cobre desktop e viewport/toque de iPhone em Chromium, com o fuso do navegador em Tóquio e relógio controlado. Isso não equivale a testar Safari em um aparelho físico.

Cobertura: busca e teclado, erros e duplicatas, vitória e continuidade após oito erros, recarga, virada de Brasília, armazenamento inválido/bloqueado, duas abas, compartilhamento alternativo, largura responsiva e auditorias axe WCAG A/AA em estados de jogo e diálogo. Capturas e traces ficam em `test-results/` (ignorados pelo Git). Auditorias automáticas não substituem avaliação manual com tecnologia assistiva.

## Escopo e publicação

Sem outros modos, ranking, autenticação, banco ou estatísticas históricas nesta fase. O acervo de 160 fichas e a repetição de calendário são explícitos na interface. Veja a política de spoilers e as escolhas editoriais antes de ampliar.

O repositório é local na branch `main`. **Não configure um remoto nem execute push sem obter a URL do repositório do responsável.**

Projeto de fãs independente, sem afiliação oficial com os titulares de Berserk. Referência técnica: [documentação do Next.js App Router](https://nextjs.org/docs/app/getting-started/installation).

Naturezas, núcleos históricos e armas/poderes aceitam múltiplos valores: verde para conjuntos iguais, laranja para sobreposição parcial, vermelho para nenhuma coincidência. Gênero e arco mantêm valor único.
