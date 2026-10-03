import { mangaCharacters } from './manga-characters';

export const arcs = [
  'Espadachim Negro',
  'Era de Ouro',
  'Convicção',
  'Falcão Milenar',
  'Fantasia',
] as const;
export type Character = {
  id: string;
  name: string;
  image: string | null;
  /** Visible portrait region, in percentages of the source image. */
  portraitCrop?: readonly [number, number, number, number];
  aliases: readonly string[];
  gender: 'Homem' | 'Mulher' | 'Outro/indefinido';
  nature: readonly (
    | 'Humano'
    | 'Elfo'
    | 'Apóstolo'
    | 'Ser astral'
    | 'Manifestação'
    | 'Pseudoapóstolo'
    | 'Anão'
    | 'Híbrido'
    | 'Sereia'
    | 'Não informada'
    | 'Armadura animada'
  )[];
  group: readonly (
    | 'Grupo de Guts'
    | 'Bando do Falcão'
    | 'Santa Sé'
    | 'Mão de Deus'
    | 'Independente'
    | 'Novo Bando do Falcão'
    | 'Tudor'
    | 'Midland'
    | 'Piratas'
    | 'Servos do Conde'
    | 'Kushan'
    | 'Vale Nebuloso'
    | 'Mercenários de Gambino'
    | 'Família Vandimion'
    | 'Elfhelm'
    | 'Grupo de Luca'
    | 'Império Antigo'
    | 'Culto do Grande Bode'
    | 'Não informado'
    | 'Koka'
    | 'Enoch'
    | 'Ys'
    | 'Bakiraka'
    | 'Cães Negros'
    | 'Quatro Reis'
    | 'Trupe circense'
  )[];
  weapon: readonly (
    | 'Espada'
    | 'Facas'
    | 'Besta'
    | 'Nenhuma'
    | 'Magia'
    | 'Lança'
    | 'Arco'
    | 'Martelo'
    | 'Não informada'
    | 'Bastão'
    | 'Maça'
    | 'Machado'
    | 'Mangual'
    | 'Livro'
    | 'Lâminas'
    | 'Bombas'
    | 'Instrumentos de tortura'
    | 'Forcado'
    | 'Canhão'
    | 'Escudo'
    | 'Picareta'
  )[];
  arc: (typeof arcs)[number];
  note: string;
  source: string;
};

const encyclopedia =
  'https://www.skullknight.net/encyclopedia/world/characters';
// Cada ficha é um recorte editorial, não o estado mais recente do personagem.
// Consulte docs/editorial.md antes de alterar uma ficha ou ampliar o calendário.
export const characters: readonly Character[] = [
  {
    id: 'guts',
    image: '/images/characters/guts.jpg',
    name: 'Guts',
    aliases: ['Gatts', 'Espadachim Negro', 'Black Swordsman'],
    gender: 'Homem',
    nature: ['Humano'],
    group: ['Grupo de Guts', 'Bando do Falcão', 'Mercenários de Gambino'],
    weapon: ['Espada', 'Besta', 'Canhão'],
    arc: 'Espadachim Negro',
    note: 'Núcleos e arsenal acumulados ao longo do mangá; arco mantido como referência editorial.',
    source: `${encyclopedia}/arc1/index.html`,
  },
  {
    id: 'griffith',
    image: '/images/characters/griffith.jpg',
    name: 'Griffith',
    aliases: ['Grifith', 'Falcão Branco'],
    gender: 'Homem',
    nature: ['Humano'],
    group: ['Bando do Falcão'],
    weapon: ['Espada'],
    arc: 'Era de Ouro',
    note: 'Líder do bando original, antes do Eclipse. Esta ficha não representa Femto.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'femto',
    image: '/images/characters/femto.png',
    name: 'Femto',
    aliases: ['Falcão das Trevas'],
    gender: 'Homem',
    nature: ['Ser astral'],
    group: ['Mão de Deus'],
    weapon: ['Magia'],
    arc: 'Era de Ouro',
    note: 'Forma de Griffith após o renascimento no Eclipse. Integrante da Mão de Deus; manipulação espacial agrupada em Magia para o jogo.',
    source: 'https://berserk.fandom.com/wiki/Griffith',
  },
  {
    id: 'casca',
    image: '/images/characters/casca.jpg',
    name: 'Casca',
    aliases: ['Caska'],
    gender: 'Mulher',
    nature: ['Humano'],
    group: ['Bando do Falcão', 'Grupo de Guts', 'Grupo de Luca'],
    weapon: ['Espada'],
    arc: 'Era de Ouro',
    note: 'Comandante do bando original, companheira de Guts e acolhida pelo grupo de Luca.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'judeau',
    image: '/images/characters/judeau.jpg',
    name: 'Judeau',
    aliases: ['Judo', 'Judô'],
    gender: 'Homem',
    nature: ['Humano'],
    group: ['Bando do Falcão', 'Trupe circense'],
    weapon: ['Espada', 'Facas'],
    arc: 'Era de Ouro',
    note: 'Antigo artista de circo; no Bando do Falcão luta com espadas curtas e facas de arremesso.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'rickert',
    image: '/images/characters/rickert.jpg',
    name: 'Rickert',
    aliases: ['Rikert'],
    gender: 'Homem',
    nature: ['Humano'],
    group: ['Bando do Falcão'],
    weapon: ['Besta'],
    arc: 'Era de Ouro',
    note: 'Jovem combatente do bando original. Ferramentas de ferreiro não são a arma desta ficha.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'puck',
    image: '/images/characters/puck.jpg',
    name: 'Puck',
    aliases: ['Pak'],
    gender: 'Homem',
    nature: ['Elfo'],
    group: ['Grupo de Guts', 'Elfhelm'],
    weapon: ['Magia'],
    arc: 'Espadachim Negro',
    note: 'Elfo de Elfhelm; cura com pó élfico e clarões agrupados em Magia.',
    source: `${encyclopedia}/arc1/index.html`,
  },
  {
    id: 'zodd',
    image: '/images/characters/zodd.jpg',
    name: 'Zodd',
    aliases: ['Nosferatu Zodd', 'Zodd o Imortal'],
    gender: 'Homem',
    nature: ['Humano', 'Apóstolo'],
    group: ['Independente', 'Tudor', 'Novo Bando do Falcão'],
    weapon: ['Espada', 'Machado'],
    arc: 'Era de Ouro',
    note: 'Atua por conta própria e junto de Tudor antes de servir ao novo exército de Griffith.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'farnese',
    image: '/images/characters/farnese.jpg',
    name: 'Farnese',
    aliases: ['Farnese de Vandimion'],
    gender: 'Mulher',
    nature: ['Humano'],
    group: ['Santa Sé', 'Família Vandimion', 'Grupo de Guts'],
    weapon: ['Espada', 'Facas', 'Magia'],
    arc: 'Convicção',
    note: 'Passado na Santa Sé e família Vandimion; depois integra o grupo de Guts e aprende magia.',
    source: `${encyclopedia}/arc3/index.html`,
  },
  {
    id: 'serpico',
    image: '/images/characters/serpico.jpg',
    name: 'Serpico',
    aliases: [],
    gender: 'Homem',
    nature: ['Humano'],
    group: ['Santa Sé', 'Família Vandimion', 'Grupo de Guts'],
    weapon: ['Espada', 'Magia'],
    arc: 'Convicção',
    note: 'Espadachim ligado a Farnese; poderes da espada e capa dos silfos agrupados em Magia.',
    source: `${encyclopedia}/arc3/index.html`,
  },
  {
    id: 'isidro',
    image: '/images/characters/isidro.jpg',
    name: 'Isidro',
    aliases: ['Isidoro'],
    gender: 'Homem',
    nature: ['Humano'],
    group: ['Grupo de Guts'],
    weapon: ['Espada', 'Facas', 'Bombas', 'Magia'],
    arc: 'Falcão Milenar',
    note: 'Usa alfanje, adaga de salamandra e bombas; o fogo da adaga é agrupado em Magia.',
    source: `${encyclopedia}/arc3/index.html`,
  },
  {
    id: 'schierke',
    image: '/images/characters/schierke.jpg',
    name: 'Schierke',
    aliases: ['Shierke', 'Schierk'],
    gender: 'Mulher',
    nature: ['Humano'],
    group: ['Grupo de Guts', 'Elfhelm'],
    weapon: ['Magia'],
    arc: 'Falcão Milenar',
    note: 'Aprendiz de Flora durante sua jornada com Guts. Magia é uma categoria de combate.',
    source: `${encyclopedia}/arc4/index.html`,
  },
  {
    id: 'locus',
    image: '/images/characters/locus.jpg',
    name: 'Locus',
    aliases: ['Cavaleiro do Luar', 'Moonlight Knight'],
    gender: 'Homem',
    nature: ['Humano', 'Apóstolo'],
    group: ['Novo Bando do Falcão'],
    weapon: ['Lança'],
    arc: 'Falcão Milenar',
    note: 'Cavaleiro a serviço de Griffith no novo bando.',
    source: `${encyclopedia}/arc4/index.html`,
  },
  {
    id: 'irvine',
    image: '/images/characters/irvine.jpg',
    name: 'Irvine',
    aliases: [],
    gender: 'Homem',
    nature: ['Humano', 'Apóstolo'],
    group: ['Novo Bando do Falcão'],
    weapon: ['Arco'],
    arc: 'Falcão Milenar',
    note: 'Arqueiro do novo bando; natureza inclui sua identidade de apóstolo.',
    source: `${encyclopedia}/arc4/index.html`,
  },
  {
    id: 'grunbeld',
    image: '/images/characters/grunbeld.jpg',
    name: 'Grunbeld',
    aliases: ['Grunbeldt'],
    gender: 'Homem',
    nature: ['Humano', 'Apóstolo'],
    group: ['Novo Bando do Falcão'],
    weapon: ['Martelo', 'Escudo', 'Canhão'],
    arc: 'Falcão Milenar',
    note: 'Arsenal inclui martelo e escudo com canhão, além da forma de dragão.',
    source: `${encyclopedia}/arc4/index.html`,
  },
  ...mangaCharacters,
];
