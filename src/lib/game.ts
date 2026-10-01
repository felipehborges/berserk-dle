import { arcs, characters, type Character } from '../data/characters';

export const MAX_GUESSES = 8;
export const TIME_ZONE = 'America/Sao_Paulo';
export const EDITION = 'v1';
const DAY_MS = 86_400_000;
const epoch = Date.UTC(2026, 9, 1);
// Calendário congelado: adicionar/reordenar fichas não altera desafios existentes.
export const schedule = [
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
export const fields = [
  { key: 'nature', label: 'Natureza' },
  { key: 'group', label: 'Núcleo' },
  { key: 'weapon', label: 'Arma principal' },
  { key: 'arc', label: 'Arco de referência' },
] as const;
export type Field = (typeof fields)[number]['key'];
export type Clue = 'match' | 'earlier' | 'later' | 'miss';
export const clueLabels: Record<Clue, string> = {
  match: 'Igual',
  miss: 'Diferente',
  earlier: 'Resposta em arco anterior',
  later: 'Resposta em arco posterior',
};
export const clueSymbols: Record<Clue, string> = {
  match: '✓',
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
  const day = Math.floor((Date.parse(`${date}T00:00:00Z`) - epoch) / DAY_MS);
  const id =
    schedule[((day % schedule.length) + schedule.length) % schedule.length];
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
        (c) =>
          !excluded.includes(c.id) &&
          [c.name, ...c.aliases].some((n) => normalize(n).includes(needle)),
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
  if (guess[field] === answer[field]) return 'match';
  if (field === 'arc')
    return arcs.indexOf(answer.arc) > arcs.indexOf(guess.arc)
      ? 'later'
      : 'earlier';
  return 'miss';
}
export function isFinished(guesses: readonly string[], answerId: string) {
  return guesses.includes(answerId) || guesses.length >= MAX_GUESSES;
}
export function storageKey(date: string) {
  return `berserkdle:${EDITION}:${date}`;
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
  const score = guesses.includes(answer.id) ? guesses.length : 'X';
  const grid = guesses
    .map((id) =>
      fields
        .map(({ key }) =>
          compare(
            characters.find((c) => c.id === id)!,
            answer,
            key,
          ) === 'match'
            ? '🟩'
            : '🟥',
        )
        .join(''),
    )
    .join('\n');
  return `BERSERKDLE #${number} · ${date}\nPersonagem ${score}/${MAX_GUESSES}\n${grid}`;
}
