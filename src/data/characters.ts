export const arcs = [
  'Espadachim Negro',
  'Era de Ouro',
  'Convicção',
  'Falcão Milenar',
] as const;
export type Character = {
  id: string;
  name: string;
  aliases: readonly string[];
  nature: 'Humano' | 'Elfo' | 'Apóstolo';
  group:
    | 'Grupo de Guts'
    | 'Bando do Falcão'
    | 'Santa Sé'
    | 'Independente'
    | 'Novo Bando do Falcão';
  weapon:
    | 'Espada'
    | 'Facas'
    | 'Besta'
    | 'Nenhuma'
    | 'Magia'
    | 'Lança'
    | 'Arco'
    | 'Martelo';
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
    name: 'Guts',
    aliases: ['Gatts', 'Espadachim Negro', 'Black Swordsman'],
    nature: 'Humano',
    group: 'Grupo de Guts',
    weapon: 'Espada',
    arc: 'Espadachim Negro',
    note: 'Em viagem com Puck; a espada é a arma principal, embora também use besta e canhão.',
    source: `${encyclopedia}/arc1/index.html`,
  },
  {
    id: 'griffith',
    name: 'Griffith',
    aliases: ['Grifith', 'Falcão Branco'],
    nature: 'Humano',
    group: 'Bando do Falcão',
    weapon: 'Espada',
    arc: 'Era de Ouro',
    note: 'Líder do bando original, antes do Eclipse. Esta ficha não representa Femto.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'casca',
    name: 'Casca',
    aliases: ['Caska'],
    nature: 'Humano',
    group: 'Bando do Falcão',
    weapon: 'Espada',
    arc: 'Era de Ouro',
    note: 'Comandante no bando original, antes do Eclipse.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'judeau',
    name: 'Judeau',
    aliases: ['Judo', 'Judô'],
    nature: 'Humano',
    group: 'Bando do Falcão',
    weapon: 'Facas',
    arc: 'Era de Ouro',
    note: 'Facas de arremesso são sua especialidade; não representam todo seu arsenal.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'rickert',
    name: 'Rickert',
    aliases: ['Rikert'],
    nature: 'Humano',
    group: 'Bando do Falcão',
    weapon: 'Besta',
    arc: 'Era de Ouro',
    note: 'Jovem combatente do bando original. Ferramentas de ferreiro não são a arma desta ficha.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'puck',
    name: 'Puck',
    aliases: ['Pak'],
    nature: 'Elfo',
    group: 'Grupo de Guts',
    weapon: 'Nenhuma',
    arc: 'Espadachim Negro',
    note: 'Companheiro de Guts; cura e luz não são classificadas como arma principal.',
    source: `${encyclopedia}/arc1/index.html`,
  },
  {
    id: 'zodd',
    name: 'Zodd',
    aliases: ['Nosferatu Zodd', 'Zodd o Imortal'],
    nature: 'Apóstolo',
    group: 'Independente',
    weapon: 'Espada',
    arc: 'Era de Ouro',
    note: 'Recorte de seu primeiro confronto com Guts; anterior ao novo bando.',
    source: `${encyclopedia}/arc2/index.html`,
  },
  {
    id: 'farnese',
    name: 'Farnese',
    aliases: ['Farnese de Vandimion'],
    nature: 'Humano',
    group: 'Santa Sé',
    weapon: 'Espada',
    arc: 'Convicção',
    note: 'Comandante dos Cavaleiros da Santa Corrente de Ferro, antes de acompanhar Guts.',
    source: `${encyclopedia}/arc3/index.html`,
  },
  {
    id: 'serpico',
    name: 'Serpico',
    aliases: [],
    nature: 'Humano',
    group: 'Santa Sé',
    weapon: 'Espada',
    arc: 'Convicção',
    note: 'A serviço de Farnese na Santa Sé; anterior à espada dos silfos.',
    source: `${encyclopedia}/arc3/index.html`,
  },
  {
    id: 'isidro',
    name: 'Isidro',
    aliases: ['Isidoro'],
    nature: 'Humano',
    group: 'Grupo de Guts',
    weapon: 'Espada',
    arc: 'Falcão Milenar',
    note: 'Já acompanha Guts e treina com lâminas; o recorte não é sua estreia em Convicção.',
    source: `${encyclopedia}/arc3/index.html`,
  },
  {
    id: 'schierke',
    name: 'Schierke',
    aliases: ['Shierke', 'Schierk'],
    nature: 'Humano',
    group: 'Grupo de Guts',
    weapon: 'Magia',
    arc: 'Falcão Milenar',
    note: 'Aprendiz de Flora durante sua jornada com Guts. Magia é uma categoria de combate.',
    source: `${encyclopedia}/arc4/index.html`,
  },
  {
    id: 'locus',
    name: 'Locus',
    aliases: ['Cavaleiro do Luar', 'Moonlight Knight'],
    nature: 'Apóstolo',
    group: 'Novo Bando do Falcão',
    weapon: 'Lança',
    arc: 'Falcão Milenar',
    note: 'Cavaleiro a serviço de Griffith no novo bando.',
    source: `${encyclopedia}/arc4/index.html`,
  },
  {
    id: 'irvine',
    name: 'Irvine',
    aliases: [],
    nature: 'Apóstolo',
    group: 'Novo Bando do Falcão',
    weapon: 'Arco',
    arc: 'Falcão Milenar',
    note: 'Arqueiro do novo bando; natureza inclui sua identidade de apóstolo.',
    source: `${encyclopedia}/arc4/index.html`,
  },
  {
    id: 'grunbeld',
    name: 'Grunbeld',
    aliases: ['Grunbeldt'],
    nature: 'Apóstolo',
    group: 'Novo Bando do Falcão',
    weapon: 'Martelo',
    arc: 'Falcão Milenar',
    note: 'Martelo de guerra é a arma principal selecionada, não o escudo ou canhão.',
    source: `${encyclopedia}/arc4/index.html`,
  },
];
