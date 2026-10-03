import { arcs, characters, type Character } from '../data/characters';

export const TIME_ZONE = 'America/Sao_Paulo';
const DAY_MS = 86_400_000;
const epoch = Date.UTC(2026, 9, 1);
const expandedEpoch = Date.UTC(2026, 9, 3);
// Preserve answers before the expanded roster starts on October 3.
export const legacySchedule = [
  'judeau',
  'irvine',
  'guts',
  'farnese',
  'zodd',
  'rickert',
  'schierke',
  'griffith',
  'puck',
  'grunbeld',
  'serpico',
  'casca',
  'locus',
  'isidro',
] as const;
// The first fifteen slots are unchanged. The complete manga roster follows.
export const schedule = [
  'femto',
  ...legacySchedule,
  ...characters
    .filter(
      (c) => c.id !== 'femto' && !legacySchedule.some((id) => id === c.id),
    )
    .map((c) => c.id),
] as const;
export const fields = [
  { key: 'gender', label: 'Gênero' },
  { key: 'nature', label: 'Natureza' },
  { key: 'group', label: 'Núcleo' },
  { key: 'weapon', label: 'Armas / poderes' },
  { key: 'arc', label: 'Arco de referência' },
] as const;
export type Field = (typeof fields)[number]['key'];
export type Clue = 'match' | 'partial' | 'earlier' | 'later' | 'miss';
export const clueLabels: Record<Clue, string> = {
  match: 'Igual',
  partial: 'Parcial: pelo menos um atributo em comum',
  miss: 'Diferente',
  earlier: 'Resposta em arco anterior',
  later: 'Resposta em arco posterior',
};
export const clueSymbols: Record<Clue, string> = {
  match: '✓',
  partial: '≈',
  miss: '×',
  earlier: '↓',
  later: '↑',
};

export function dateInBrasilia(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  return ['year', 'month', 'day']
    .map((type) => parts.find((p) => p.type === type)!.value)
    .join('-');
}
export function challenge(date: string) {
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  const day = Math.floor((timestamp - epoch) / DAY_MS);
  const calendar = timestamp >= expandedEpoch ? schedule : legacySchedule;
  const calendarDay = Math.floor(
    (timestamp - (timestamp >= expandedEpoch ? expandedEpoch : epoch)) / DAY_MS,
  );
  const id =
    calendar[
      ((calendarDay % calendar.length) + calendar.length) % calendar.length
    ];
  return {
    date,
    number: day + 1,
    answer: characters.find((c) => c.id === id)!,
  };
}
export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
export function search(query: string, excluded: readonly string[] = []) {
  const needle = normalize(query);
  return needle
    ? characters.filter(
        (c) => !excluded.includes(c.id) && normalize(c.name).includes(needle),
      )
    : [];
}
export function exactCharacter(query: string) {
  return characters.find((c) =>
    [c.name, ...c.aliases].some((n) => normalize(n) === normalize(query)),
  );
}
export function compare(
  guess: Character,
  answer: Character,
  field: Field,
): Clue {
  if (field === 'nature' || field === 'group' || field === 'weapon') {
    const guessed = new Set<string>(guess[field]);
    const expected = new Set<string>(answer[field]);
    if (
      guessed.size === expected.size &&
      [...guessed].every((value) => expected.has(value))
    )
      return 'match';
    return [...guessed].some((value) => expected.has(value))
      ? 'partial'
      : 'miss';
  }
  if (guess[field] === answer[field]) return 'match';
  if (field === 'arc')
    return arcs.indexOf(answer.arc) > arcs.indexOf(guess.arc)
      ? 'later'
      : 'earlier';
  return 'miss';
}
export function isFinished(guesses: readonly string[], answerId: string) {
  return guesses.includes(answerId);
}
export function storageKey(date: string) {
  const edition =
    Date.parse(`${date}T00:00:00Z`) >= expandedEpoch ? 'v2' : 'v1';
  return `berserkdle:${edition}:${date}`;
}
export function restore(raw: string | null, date: string): string[] {
  try {
    const data: unknown = JSON.parse(raw ?? 'null');
    if (
      !data ||
      typeof data !== 'object' ||
      !('date' in data) ||
      data.date !== date ||
      !('guesses' in data) ||
      !Array.isArray(data.guesses)
    )
      return [];
    const guesses: string[] = [];
    for (const id of data.guesses) {
      if (
        typeof id !== 'string' ||
        !characters.some((c) => c.id === id) ||
        guesses.includes(id)
      )
        continue;
      guesses.push(id);
      if (isFinished(guesses, challenge(date).answer.id)) break;
    }
    return guesses;
  } catch {
    return [];
  }
}
export function shareText(date: string, guesses: readonly string[]) {
  const { number, answer } = challenge(date);
  const grid = guesses
    .map((id) =>
      fields
        .map(({ key }) => {
          const clue = compare(
            characters.find((c) => c.id === id)!,
            answer,
            key,
          );
          return clue === 'match' ? '🟩' : clue === 'partial' ? '🟧' : '🟥';
        })
        .join(''),
    )
    .join('\n');
  return `BERSERKDLE #${number} · ${date}\n${guesses.includes(answer.id) ? 'Personagem encontrado' : 'Em andamento'}\n${grid}`;
}
