# Imagens

As imagens são servidas localmente em `public/images`, sem hotlink no navegador.

- Fundo do Eclipse: https://hdqwalls.com/berserk-wallpaper
- Arquivo do fundo: https://images.hdqwalls.com/download/berserk-aj-2560x1440.jpg
- Retratos dos 14 personagens: MyAnimeList, obtidos por https://api.jikan.moe/v4/manga/2/characters em 02/10/2026.
- Retrato adicional de Femto: https://tenor.com/view/femto-gif-22248771 (imagem estática do anime).
- A página e a URL de origem de cada retrato estão em `public/images/characters/sources.json`.

Berserk e seus personagens pertencem aos respectivos titulares. A disponibilidade pública dessas imagens não equivale a uma licença de redistribuição. Os créditos também estão no diálogo Como jogar.

## Expansão para o mangá completo

145 novas fichas: 140 com imagens locais e cinco com ausência de retrato indicada. Consulte `docs/roster-audit.md` para a cobertura. A proveniência individual das imagens está em `public/images/characters/sources.json` (Berserk Wiki, MyAnimeList e prévia oficial de Dark Horse). Os arquivos são servidos localmente, sem depender de hotlink. Recortes de painéis para Nico, Toma, Giorgio, Poliziano, Errol, Valancia e a mãe de Serpico usam `portraitCrop` na apresentação, preservando os arquivos originais.
