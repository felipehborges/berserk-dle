import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
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
  storageKey,
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
    { length: schedule.length },
    (_, i) =>
      challenge(new Date(Date.UTC(2026, 9, 3 + i)).toISOString().slice(0, 10))
        .answer.id,
  );
  assert.equal(new Set(ids).size, characters.length);
  const repeatedDate = new Date(Date.UTC(2026, 9, 3 + schedule.length))
    .toISOString()
    .slice(0, 10);
  assert.equal(challenge(repeatedDate).answer.id, ids[0]);
  assert.ok(challenge('2026-09-30').answer);
  assert.equal(challenge('2026-10-02').answer.id, 'irvine');
  assert.equal(challenge('2026-10-03').answer.id, 'femto');
  assert.equal(storageKey('2026-10-02'), 'berserkdle:v1:2026-10-02');
  assert.equal(storageKey('2026-10-03'), 'berserkdle:v2:2026-10-03');
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
    assert.ok(['Homem', 'Mulher', 'Outro/indefinido'].includes(c.gender));
    if (c.image)
      assert.ok(
        existsSync(`public${c.image}`),
        `Missing portrait for ${c.name}`,
      );
    assert.ok(c.source.startsWith('https://'));
  }
});
test('search normalizes accents, case, whitespace, and excludes previous guesses', () => {
  assert.equal(exactCharacter('  JUDÔ  ')?.id, 'judeau');
  assert.equal(exactCharacter('Espadachim   Negro')?.id, 'guts');
  assert.ok(!search('vandimion').some((c) => c.id === 'farnese'));
  assert.ok(!search('a').some((c) => c.id === 'guts'));
  assert.equal(search('GÚTS')[0].id, 'guts');
  assert.equal(search('guts', ['guts']).length, 0);
  assert.deepEqual(search(''), []);
  assert.equal(exactCharacter('unknown'), undefined);
});

test('manga expansion includes later arcs, individual identities, and explicit portrait gaps', () => {
  assert.equal(characters.length, 118);
  for (const name of ['Skull Knight', 'Rosine', 'Silat', 'Void', 'Schnoz']) {
    assert.ok(
      exactCharacter(name)?.image,
      `Missing manga character or portrait: ${name}`,
    );
  }
  assert.equal(exactCharacter('Danan')?.arc, 'Fantasia');
  assert.equal(exactCharacter('Morda')?.id, exactCharacter('Molda')?.id);
  assert.notEqual(exactCharacter('Griffith')?.id, exactCharacter('Femto')?.id);
  assert.notEqual(
    exactCharacter('Menino do Luar')?.id,
    exactCharacter('Criança Demoníaca')?.id,
  );
  assert.deepEqual(
    characters
      .filter((c) => c.image === null)
      .map((c) => c.id)
      .sort(),
    [],
  );
  for (const name of ['Balzac', 'Rita', 'Niko', 'Charles'])
    assert.equal(exactCharacter(name), undefined);
  for (const c of characters) {
    if (c.portraitCrop) {
      const [x, y, width, height] = c.portraitCrop;
      assert.ok(
        x >= 0 &&
          y >= 0 &&
          width > 0 &&
          height > 0 &&
          x + width <= 100 &&
          y + height <= 100,
        c.name,
      );
    }
  }
});
test('clues compare attributes and ordered reference arcs; same clues do not win', () => {
  const guts = exactCharacter('Guts')!,
    casca = exactCharacter('Casca')!,
    griffith = exactCharacter('Griffith')!;
  assert.equal(compare(guts, casca, 'arc'), 'later');
  assert.equal(compare(casca, guts, 'arc'), 'earlier');
  for (const { key } of fields)
    assert.equal(
      compare(casca, griffith, key),
      key === 'gender' ? 'miss' : key === 'group' ? 'partial' : 'match',
    );
  assert.equal(compare(guts, casca, 'gender'), 'miss');
  assert.equal(compare(guts, griffith, 'gender'), 'match');
  const femto = exactCharacter('Femto')!;
  assert.notEqual(femto.id, griffith.id);
  assert.notEqual(femto.image, griffith.image);
  assert.equal(compare(femto, griffith, 'nature'), 'miss');
  assert.equal(isFinished(['griffith'], 'femto'), false);
  assert.equal(isFinished(['casca'], 'griffith'), false);
});

test('multi-value clues compare sets, support partial overlap and keep scalar fields binary', () => {
  const guts = exactCharacter('Guts')!;
  const griffith = exactCharacter('Griffith')!;
  const serpico = exactCharacter('Serpico')!;
  assert.equal(compare(guts, griffith, 'group'), 'partial');
  assert.equal(compare(griffith, guts, 'group'), 'partial');
  assert.equal(compare(serpico, griffith, 'weapon'), 'partial');
  assert.equal(compare(guts, exactCharacter('Void')!, 'weapon'), 'miss');
  for (const field of ['nature', 'group', 'weapon'] as const) {
    assert.equal(
      compare({ ...guts, [field]: [...guts[field]].reverse() }, guts, field),
      'match',
    );
    assert.equal(
      compare(
        { ...guts, [field]: [...guts[field], ...guts[field]] },
        guts,
        field,
      ),
      'match',
    );
  }
  assert.equal(compare(exactCharacter('Isma')!, guts, 'nature'), 'partial');
  for (const c of characters) {
    for (const field of ['nature', 'group', 'weapon'] as const) {
      assert.ok(c[field].length > 0);
      assert.equal(new Set(c[field]).size, c[field].length, c.name);
    }
    assert.notEqual(compare(c, guts, 'gender'), 'partial');
    assert.notEqual(compare(c, guts, 'arc'), 'partial');
  }
  assert.ok(shareText('2026-10-01', ['guts']).includes('🟧'));
});
test('restoration rejects corrupt data, deduplicates, stops only at a win without a guess cap', () => {
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
    characters.length - 1,
  );
});
test('share grids do not leak character names, attributes or the answer', () => {
  const text = shareText('2026-10-01', ['guts', 'judeau']);
  assert.match(text, /Personagem encontrado/);
  assert.ok(!text.includes('/8'));
  assert.match(text, /🟩🟩🟩🟩🟩/);
  for (const c of characters) assert.ok(!text.includes(c.name));
  assert.ok(!text.includes('Humano'));
  assert.match(shareText('2026-10-01', ['guts']), /Em andamento/);
});

test('all incorrect guesses remain playable until the answer is found', () => {
  const wrong = characters.filter((c) => c.id !== 'judeau').map((c) => c.id);
  assert.ok(wrong.length > 8);
  assert.equal(isFinished(wrong, 'judeau'), false);
  assert.equal(isFinished([...wrong, 'judeau'], 'judeau'), true);
});

test('roster revision removes minor characters and safely restores old guesses', () => {
  const removedIds = [
    'enoch-village-priest',
    'mayor-of-koka',
    'unidentified-female-apostle',
    'unidentified-roaming-apostle',
    'dante',
    'errol',
    'riguel',
    'sam',
    'dillos',
    'nichole',
    'kim',
    'old-fortune-teller',
    'hail',
    'hassan',
    'lustful-nobleman',
    'charlotte-s-mother',
    'mary',
    'valancia',
    'thomas',
    'father-hobbes',
    'heretic-high-priest',
    'abbot-of-the-tower',
    'nico',
    'toma',
    'serpico-s-mother',
    'hannah',
    'horace',
    'ted',
    'giorgio',
    'poliziano',
    'ganishka-s-son',
    'isma-s-father',
    'count-s-wife',
    'pick',
    'pook',
    'peck',
    'poke',
    'mozgus-crow',
    'mozgus-imp',
    'mozgus-angel-face',
    'mozgus-bubblehead',
    'mozgus-twins',
  ];
  for (const id of removedIds) {
    assert.ok(!characters.some((c) => c.id === id));
    assert.ok(!schedule.some((entry) => entry === id));
  }
  assert.ok(exactCharacter('Carcereiro da Torre'));
  assert.deepEqual(
    restore(
      JSON.stringify({
        date: '2026-10-03',
        guesses: ['sam', 'guts', 'mozgus-bird', 'griffith'],
      }),
      '2026-10-03',
    ),
    ['guts', 'griffith'],
  );
});
