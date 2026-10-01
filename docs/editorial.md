# Política editorial — edição v1

Revisão em 01/10/2026. Base inicial: as 14 fichas do protótipo local. O conjunto foi revisto para explicitar recortes narrativos e separar fatos, simplificações de jogo e escolhas de tradução. Não é uma reprodução de um guia oficial.

## Convenções

- **Natureza** é a identidade no recorte escolhido. Magos humanos continuam humanos. A natureza de apóstolo é considerada mesmo quando o personagem usa forma humana.
- **Núcleo** é uma afiliação editorial no recorte. “Grupo de Guts” inclui a dupla Guts/Puck; “Bando do Falcão” é o original; “Novo Bando do Falcão” é o exército posterior. “Independente” descreve Zodd antes de integrar o novo bando, sem afirmar ausência de vínculos com a Mão de Deus.
- **Arma principal** é uma categoria selecionada para o jogo, não um inventário completo. Inclui “Magia” como recurso de combate e “Nenhuma” para Puck no recorte inicial.
- **Arco de referência** indica a fase representada, **não a primeira aparição**. Evita confundir Griffith humano na Era de Ouro com sua aparição anterior na ordem de publicação.
- Ordem das pistas de arco: Espadachim Negro → Era de Ouro → Convicção → Falcão Milenar. As setas apontam do palpite para o arco da resposta.
- As fichas podem compartilhar todos os atributos. Griffith/Casca e Farnese/Serpico são exemplos; a identidade correta é indispensável para vencer.
- Grafias localizadas e apelidos são aceitos como conveniência. Não incluem identidades de outra fase incompatíveis com a ficha: **Femto não é apelido da ficha humana de Griffith**.

## Revisão das fichas

| Personagem | Recorte e decisão                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Guts       | Espadachim Negro, viajando com Puck; núcleo corrigido para Grupo de Guts. Espada é a arma selecionada.                                          |
| Puck       | Mesmo recorte de Guts; elfo e apoio, sem arma principal.                                                                                        |
| Griffith   | Era de Ouro antes do Eclipse. Mantido humano, agora com escopo explícito.                                                                       |
| Casca      | Comandante do bando original, antes do Eclipse.                                                                                                 |
| Judeau     | Bando original; facas de arremesso, sem excluir outras armas.                                                                                   |
| Rickert    | Bando original; substituídas “Ferramentas” por “Besta”, arma associada ao jovem combatente na Era de Ouro.                                      |
| Zodd       | Era de Ouro; independente do novo bando. Apóstolo, espada.                                                                                      |
| Farnese    | Convicção, comandando a Santa Corrente de Ferro; anterior ao aprendizado de magia.                                                              |
| Serpico    | Convicção, servindo Farnese na Santa Sé; anterior à espada dos silfos.                                                                          |
| Isidro     | Recorte deslocado de Convicção para Falcão Milenar: já treina com lâminas no grupo de Guts. Não se atribui a espada ao instante de sua estreia. |
| Schierke   | Falcão Milenar, acompanhando Guts; humana, magia.                                                                                               |
| Locus      | Falcão Milenar, novo bando; apóstolo e lança.                                                                                                   |
| Irvine     | Falcão Milenar, novo bando; apóstolo e arco.                                                                                                    |
| Grunbeld   | Falcão Milenar, novo bando; martelo selecionado em vez do escudo/canhão.                                                                        |

## Fontes e limites

A obra de Kentaro Miura é a referência canônica. Nesta implementação, a revisão usou as descrições das enciclopédias de fãs abaixo; não foi uma conferência página a página de uma edição licenciada. As categorias de arma e núcleo são simplificações editoriais. As fontes contêm spoilers e material de fases posteriores, que não devem ser transferidos automaticamente para as fichas.

- [SkullKnight.net — Espadachim Negro](https://www.skullknight.net/encyclopedia/world/characters/arc1/index.html): Guts, Puck e a distinção Griffith/Femto.
- [SkullKnight.net — Era de Ouro](https://www.skullknight.net/encyclopedia/world/characters/arc2/index.html): bando original, Rickert e Zodd.
- [SkullKnight.net — Convicção](https://www.skullknight.net/encyclopedia/world/characters/arc3/index.html): Farnese, Serpico e Isidro.
- [SkullKnight.net — Falcão Milenar](https://www.skullknight.net/encyclopedia/world/characters/arc4/index.html): Schierke, Locus, Irvine e Grunbeld.
- [Berserk Wiki — facas de arremesso](https://berserk.fandom.com/wiki/Throwing_Knife), [Locus](https://berserk.fandom.com/wiki/Locus), [Isidro](https://berserk.fandom.com/wiki/Isidro) e [Rickert](https://berserk.fandom.com/wiki/Rickert): consultas complementares sobre equipamento. A enciclopédia SkullKnight é antiga; os recortes deste MVP são deliberadamente limitados.

As notas e a referência de cada ficha ficam também no dado tipado e podem ser consultadas em “Como jogar → Consultar fichas do elenco”. A ficha da resposta ganha sua nota ao fim da partida. Há aviso de spoilers antes de jogar.

## Ampliar e corrigir

1. Adicione um registro em `src/data/characters.ts`, com ID estável, nome, apelidos, atributos, recorte, nota e URL de fonte. Use os vocabulários tipados; amplie-os conscientemente quando necessário.
2. Confira o mesmo recorte para todos os atributos, grafias e possíveis colisões de apelidos após normalização. Não reutilize um ID para outra identidade.
3. Rode `npm test` e revise se o novo personagem gera pistas coerentes. Ajuste a tabela acima e, se necessário, as explicações na interface.
4. **Não altere o calendário v1 retroativamente.** A busca pode receber mais fichas sem alterar a resposta diária. Para colocar novas fichas no sorteio, acrescente uma edição de calendário com data futura de início, mantendo a função que resolve dias anteriores. Use uma chave de armazenamento correspondente à edição.
5. Mudanças em atributos de fichas já publicadas também afetam pistas antigas. Para preservar partidas, publique uma nova edição com dados versionados e data de início, em vez de mudar o significado de um palpite durante o dia.
6. Antes de ampliar o teto de spoilers ou mudar as categorias, atualize as instruções do jogo e esta política.

O calendário v1 é um ciclo fixo de 14 dias, não um sorteio aleatório nem uma lista infinita. Essa escolha mantém comportamento previsível para todos os jogadores e permite ampliar os dados sem deslocar os desafios em andamento.
