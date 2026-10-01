import test from 'node:test';
import assert from 'node:assert/strict';
import { characters } from '../src/data/characters';
import {
  challenge,
  compare,
  dateInBrasilia,
  exactCharacter,
  fields,
  isFinished,
  normalize,
  restore,
  schedule,
  search,
  shareText,
} from '../src/lib/game';

test('Brasília changes date exactly at midnight, including year and leap day', () => {
  assert.equal(
    dateInBrasilia(new Date('2026-10-02T02:59:59.999Z')),
    '2026-10-01',
  );
  assert.equal(dateInBrasilia(new Date('2026-10-02T03:00:00Z')), '2026-10-02');
  assert.equal(dateInBrasilia(new Date('2027-01-01T02:59:59Z')), '2026-12-31');
  assert.equal(dateInBrasilia(new Date('2028-03-01T02:59:59Z')), '2028-02-29');
});
test('calendar is deterministic, visits every character, and handles dates before epoch', () => {
  assert.equal(challenge('2026-10-01').number, 1);
  assert.equal(challenge('2026-10-01').answer.id, 'judeau');
  const ids = Array.from(
    { length: 14 },
    (_, i) => challenge(`2026-10-${String(i + 1).padStart(2, '0')}`).answer.id,
  );
  assert.equal(new Set(ids).size, 14);
  assert.equal(challenge('2026-10-15').answer.id, ids[0]);
  assert.ok(challenge('2026-09-30').answer);
});
test('editorial records and calendar have unique stable IDs, searchable names and no ambiguous aliases', () => {
  assert.equal(new Set(characters.map((c) => c.id)).size, characters.length);
  const names = characters.flatMap((c) => [
    ...new Set([c.name, ...c.aliases].map(normalize)),
  ]);
  assert.equal(new Set(names).size, names.length);
  for (const id of schedule) assert.ok(characters.some((c) => c.id === id));
  for (const c of characters) {
    assert.ok(c.note);
    assert.ok(c.source.startsWith('https://'));
  }
});
test('search normalizes accents, case, whitespace, and excludes previous guesses', () => {
  assert.equal(exactCharacter('  JUDÔ  ')?.id, 'judeau');
  assert.equal(exactCharacter('Espadachim   Negro')?.id, 'guts');
  assert.equal(search('vandimion')[0].id, 'farnese');
  assert.equal(search('guts', ['guts']).length, 0);
  assert.deepEqual(search(''), []);
  assert.equal(exactCharacter('unknown'), undefined);
});
test('clues compare attributes and ordered reference arcs; same clues do not win', () => {
  const guts = exactCharacter('Guts')!,
    casca = exactCharacter('Casca')!,
    griffith = exactCharacter('Griffith')!;
  assert.equal(compare(guts, casca, 'arc'), 'later');
  assert.equal(compare(casca, guts, 'arc'), 'earlier');
  for (const { key } of fields)
    assert.equal(compare(casca, griffith, key), 'match');
  assert.equal(isFinished(['casca'], 'griffith'), false);
});
test('restoration rejects corrupt data, deduplicates, stops at a win and caps attempts', () => {
  const date = '2026-10-01';
  const save = (guesses: unknown) => JSON.stringify({ date, guesses });
  for (const raw of [
    null,
    '{',
    '[]',
    '42',
    '{}',
    save('guts'),
    JSON.stringify({ date: '2026-10-02', guesses: ['guts'] }),
  ])
    assert.deepEqual(restore(raw, date), []);
  assert.deepEqual(
    restore(save(['guts', null, 'guts', 'unknown', 'judeau', 'casca']), date),
    ['guts', 'judeau'],
  );
  assert.equal(
    restore(
      save(characters.filter((c) => c.id !== 'judeau').map((c) => c.id)),
      date,
    ).length,
    8,
  );
});
test('share grids do not leak character names, attributes or the answer', () => {
  const text = shareText('2026-10-01', ['guts', 'judeau']);
  assert.match(text, /2\/8/);
  assert.match(text, /🟩🟩🟩🟩/);
  for (const c of characters) assert.ok(!text.includes(c.name));
  assert.ok(!text.includes('Humano'));
  assert.match(shareText('2026-10-01', ['guts']), /X\/8/);
});
