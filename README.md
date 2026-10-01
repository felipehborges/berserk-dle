# Berserkdle

Jogo diário de adivinhar personagens de Berserk, em português. MVP com **um único modo**, Next.js App Router, TypeScript e React. Não requer banco, login, variáveis de ambiente, serviços externos ou imagens licenciadas.

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
- Até oito palpites distintos. Acertar o **personagem** encerra o jogo; apenas coincidir todos os atributos não basta.
- As pistas comparam natureza, núcleo, arma principal e arco de referência. Cores, símbolos e descrições para leitores de tela se complementam.
- No arco, ↓ indica que a resposta está em arco anterior; ↑ indica posterior, na ordem editorial publicada nas instruções.
- O botão de compartilhar aparece ao terminar. Usa compartilhamento nativo ou área de transferência; se indisponíveis, oferece texto selecionável. O texto não revela nomes nem atributos.

## Calendário e armazenamento

`src/lib/game.ts` define o calendário v1, com início em **01/10/2026**, 14 IDs em ordem fixa e ciclo de 14 dias. A data vem de `Intl.DateTimeFormat` com `America/Sao_Paulo`, independentemente do fuso do navegador. Não depende da data usada no build. Todos recebem o mesmo personagem para a mesma data.

A página verifica a virada a cada segundo, ao ganhar foco, ao mudar de visibilidade e antes de aceitar um palpite. Abas suspensas pelo navegador atualizam ao voltar. O relógio usado é o do dispositivo: alterá-lo permite acessar outros dias. A resposta e o calendário estão no código do cliente; este é um jogo casual sem proteção contra inspeção ou manipulação local.

Os palpites ficam em `localStorage`, na chave `berserkdle:v1:AAAA-MM-DD`. A restauração valida IDs, remove duplicatas, limita a oito e descarta palpites posteriores à vitória. Saves inválidos são ignorados. Falha de armazenamento é informada sem impedir o jogo. Abas da mesma origem sincronizam pelo evento `storage`; não há sincronização entre dispositivos. Saves do protótipo não são importados porque os atributos e o calendário mudaram.

## Organização

| Arquivo                   | Responsabilidade                                                    |
| ------------------------- | ------------------------------------------------------------------- |
| `src/app/`                | App Router, metadados, página e estilos responsivos                 |
| `src/components/game.tsx` | Interface, teclado, diálogo, armazenamento e compartilhamento       |
| `src/lib/game.ts`         | Funções puras: calendário, busca, comparação, validação e resultado |
| `src/data/characters.ts`  | Fichas tipadas, apelidos, notas e referências editoriais            |
| `docs/editorial.md`       | Critérios, revisão do protótipo e procedimento de ampliação         |
| `tests/`                  | Testes de lógica e de navegador                                     |

Os elementos gráficos são CSS e texto originais, com fontes locais do sistema. Nenhum quadro do mangá, imagem de personagem ou fonte remota é carregado.

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

Cobertura: busca e teclado, erros e duplicatas, vitória/derrota, recarga, virada de Brasília, armazenamento inválido/bloqueado, duas abas, compartilhamento alternativo, largura responsiva e auditorias axe WCAG A/AA em estados de jogo e diálogo. Capturas e traces ficam em `test-results/` (ignorados pelo Git). Auditorias automáticas não substituem avaliação manual com tecnologia assistiva.

## Escopo e publicação

Sem outros modos, ranking, autenticação, banco ou estatísticas históricas nesta fase. O acervo inicial de 14 fichas e a repetição de calendário são explícitos na interface. Veja a política de spoilers e as escolhas editoriais antes de ampliar.

O repositório é local na branch `main`. **Não configure um remoto nem execute push sem obter a URL do repositório do responsável.**

Projeto de fãs independente, sem afiliação oficial com os titulares de Berserk. Referência técnica: [documentação do Next.js App Router](https://nextjs.org/docs/app/getting-started/installation).
