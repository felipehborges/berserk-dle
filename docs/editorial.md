> Atualização de 03/10/2026: catálogo atual de **118 personagens**, após 42 remoções. Os totais e inclusões abaixo registram a expansão anterior; consulte [a revisão atual](elenco-removido.md). Corpo deixou de ser uma categoria de arma.

# Política editorial — elenco atualizado em 02/10/2026

Revisão em 03/10/2026. Elenco de 160 fichas, incluindo Femto separado de Griffith. O conjunto foi revisto para explicitar recortes narrativos e separar fatos, simplificações de jogo e escolhas de tradução. Não é uma reprodução de um guia oficial.

## Convenções

- **Gênero** usa Homem, Mulher e Outro/indefinido. A última categoria fica disponível para fichas sem definição confirmada; ser não humano não muda automaticamente o gênero. Casca, Farnese e Schierke usam Mulher; as demais fichas atuais usam Homem.
- **Natureza** reúne as naturezas confirmadas ao longo da história (ex.: humano e apóstolo, humano e sereia). Magos humanos continuam humanos. Griffith e Femto permanecem separados.
- **Núcleos** são afiliações confirmadas, atuais e anteriores. Guts inclui Grupo de Guts, Bando do Falcão e Mercenários de Gambino. Uma aliança pontual ou encontro não torna alguém membro de um grupo.
- **Armas / poderes** reúne categorias de equipamento e recursos usados no mangá, incluindo Magia para poderes sobrenaturais e artefatos mágicos. Não é limitado a uma arma principal.
- **Arco de referência** indica a fase representada, **não a primeira aparição**. Evita confundir Griffith humano na Era de Ouro com sua aparição anterior na ordem de publicação.
- Ordem das pistas de arco: Espadachim Negro → Era de Ouro → Convicção → Falcão Milenar → Fantasia. As setas apontam do palpite para o arco da resposta.
- As fichas podem compartilhar todos os atributos. A comparação inclui gênero; a identidade correta é indispensável para vencer.
- Grafias localizadas e apelidos são aceitos como conveniência. Não incluem identidades de outra fase incompatíveis com a ficha: **Femto não é apelido da ficha humana de Griffith**. É uma ficha independente: Homem, Ser astral, Mão de Deus, Magia, Era de Ouro (Eclipse). A manipulação espacial é agrupada editorialmente em Magia; Femto não é classificado como apóstolo.

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
- [Berserk Wiki — facas de arremesso](https://berserk.fandom.com/wiki/Throwing_Knife), [Locus](https://berserk.fandom.com/wiki/Locus), [Isidro](https://berserk.fandom.com/wiki/Isidro) e [Rickert](https://berserk.fandom.com/wiki/Rickert): consultas complementares sobre equipamento. A enciclopédia SkullKnight é antiga; as fichas anteriores preservam seus recortes e a expansão usa as páginas individuais da Berserk Wiki.

As notas e a referência de cada ficha ficam também no dado tipado e podem ser consultadas em “Como jogar → Consultar fichas do elenco”. A ficha da resposta ganha sua nota ao fim da partida. Há aviso de spoilers antes de jogar.

## Ampliar e corrigir

1. Adicione um registro em `src/data/characters.ts`, com ID estável, nome, apelidos, atributos, recorte, nota e URL de fonte. Use os vocabulários tipados; amplie-os conscientemente quando necessário.
2. Confira o mesmo recorte para todos os atributos, grafias e possíveis colisões de apelidos após normalização. Não reutilize um ID para outra identidade.
3. Rode `npm test` e revise se o novo personagem gera pistas coerentes. Ajuste a tabela acima e, se necessário, as explicações na interface.
4. **Não altere o calendário v1 retroativamente.** A busca pode receber mais fichas sem alterar a resposta diária. Para colocar novas fichas no sorteio, acrescente uma edição de calendário com data futura de início, mantendo a função que resolve dias anteriores. Use uma chave de armazenamento correspondente à edição.
5. Mudanças em atributos de fichas já publicadas também afetam pistas antigas. Para preservar partidas, publique uma nova edição com dados versionados e data de início, em vez de mudar o significado de um palpite durante o dia.
6. Antes de ampliar o teto de spoilers ou mudar as categorias, atualize as instruções do jogo e esta política.

O calendário v1 é um ciclo fixo de 14 dias, não um sorteio aleatório nem uma lista infinita. Essa escolha mantém comportamento previsível para todos os jogadores e permite ampliar os dados sem deslocar os desafios em andamento.

## Calendário ampliado e medidas

O calendário v1 continua resolvendo datas anteriores a 03/10/2026. Nessa data inicia-se o ciclo v2 de 160 dias, começando por Femto, seguido dos 14 IDs anteriores e das 145 novas fichas do mangá. Os saves usam a edição correspondente. A inclusão de gênero recalcula as pistas dos saves locais existentes; o projeto ainda está em protótipo.

Altura e peso foram pesquisados em 02/10/2026 na [compilação do guia oficial](https://berserk.fandom.com/wiki/Berserk_Official_Guidebook) e na [transcrição de perfis](https://www.reddit.com/r/Berserk/comments/54y7jb/comprehensive_list_of_guidebook_character/). Existem estimativas para o elenco anterior, mas não foram confirmadas medidas específicas para Femto. Não reutilizamos automaticamente as de Griffith. Como a regra solicitada exige cobertura de todos, os dois atributos ficaram fora do jogo.

Fonte complementar para Femto: [Griffith / Femto — Berserk Wiki](https://berserk.fandom.com/wiki/Griffith), especialmente identidade como Mão de Deus e manipulação espacial.

## Expansão do mangá

A cobertura, fontes, exclusões e cinco retratos pendentes estão em [roster-audit.md](roster-audit.md). Os novos registros ficam em `src/data/manga-characters.ts`. Não confundir arma desconhecida com ausência de arma: “Não informada” expressa falta de confirmação. Magia agrupa recursos sobrenaturais; Corpo agrupa ataques naturais. As naturezas incluem pseudoapóstolos, sereias, híbridos, anões, manifestações e armadura animada. Os novos arcos normalmente correspondem à primeira aparição, salvo recorte explicado na nota; os arcos das 15 fichas antigas permanecem inalterados, mas os demais atributos agora acumulam valores históricos.

## Comparação de conjuntos (03/10/2026)

Natureza, núcleo e armas são listas sem duplicatas e sem limite de duas opções. Conjuntos idênticos dão verde; interseção não vazia com alguma diferença dá laranja; nenhuma interseção dá vermelho. Ordem não importa. Gênero e arco continuam escalares, sem parcial. Compartilhamento usa 🟧 para parcial. Saves guardam IDs e são preservados; pistas antigas são recalculadas com os dados revistos, sem mudar o personagem do dia.

A tabela histórica acima documenta a versão de recortes únicos, substituída por esta política nos campos de múltiplos valores. As fichas em código são a referência atual. Fontes complementares: páginas de Guts, Judeau, Pippin, Farnese, Serpico, Isidro, Zodd, Grunbeld, Flora e Isma na Berserk Wiki (mesma pesquisa do catálogo).
