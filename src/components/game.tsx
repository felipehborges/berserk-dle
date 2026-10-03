'use client';

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { characters } from '@/data/characters';
import {
  challenge,
  clueLabels,
  compare,
  dateInBrasilia,
  exactCharacter,
  fields,
  isFinished,
  restore,
  schedule,
  search,
  shareText,
  storageKey,
} from '@/lib/game';

type Session = { date: string; guesses: string[] };

function Portrait({
  id,
  name,
  large = false,
}: {
  id: string;
  name: string;
  large?: boolean;
}) {
  const character = characters.find((character) => character.id === id)!;
  const crop = character.portraitCrop;
  return (
    <div className={`portrait${large ? ' portrait-large' : ''}`}>
      {character.image ? (
        <Image
          src={character.image}
          alt={`Retrato de ${name}`}
          width={large ? 400 : 256}
          height={large ? 400 : 256}
          style={
            crop
              ? {
                  width: `${10000 / crop[2]}%`,
                  height: `${10000 / crop[3]}%`,
                  left: `${(-100 * crop[0]) / crop[2]}%`,
                  top: `${(-100 * crop[1]) / crop[3]}%`,
                  objectFit: 'fill',
                }
              : undefined
          }
        />
      ) : (
        <span
          className="portrait-unavailable"
          role="img"
          aria-label={`Retrato de ${name} não confirmado`}
        >
          <span aria-hidden="true">?</span>
          Sem retrato
        </span>
      )}
    </div>
  );
}

export default function Game() {
  const [session, setSession] = useState<Session | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [storageWarning, setStorageWarning] = useState(false);
  const [shareFallback, setShareFallback] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const helpRef = useRef<HTMLDialogElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  function update(next: Session) {
    sessionRef.current = next;
    setSession(next);
  }

  useEffect(() => {
    function refresh() {
      const date = dateInBrasilia();
      if (sessionRef.current?.date === date) return;
      let guesses: string[] = [];
      try {
        guesses = restore(localStorage.getItem(storageKey(date)), date);
      } catch {
        setStorageWarning(true);
      }
      if (sessionRef.current)
        setFeedback('Virou o dia em Brasília. Um novo desafio começou.');
      update({ date, guesses });
      setQuery('');
      setOpen(false);
      setActive(-1);
      setShareFallback('');
      setShareStatus('');
    }
    function sync(event: StorageEvent) {
      refresh();
      const date = dateInBrasilia();
      if (event.key === storageKey(date) || event.key === null) {
        update({ date, guesses: restore(event.newValue, date) });
        setQuery('');
        setOpen(false);
        setActive(-1);
        setShareFallback('');
        setFeedback('Progresso atualizado neste navegador.');
      }
    }
    const boot = window.setTimeout(refresh, 0);
    const timer = window.setInterval(refresh, 1000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('storage', sync);
    return () => {
      clearTimeout(boot);
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const daily = session ? challenge(session.date) : null;
  const guesses = (session?.guesses ?? []).filter((id) =>
    characters.some((character) => character.id === id),
  );

  const finished = !!daily && isFinished(guesses, daily.answer.id);
  const matches = search(query, guesses);
  const expanded = open && matches.length > 0;

  useEffect(() => {
    if (open && active >= 0)
      document
        .querySelector('[role="option"][aria-selected="true"]')
        ?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  useEffect(() => {
    if (finished) resultRef.current?.focus();
  }, [finished]);

  function choose(name: string) {
    submitGuess(name);
  }

  // Temporary testing control: restart only today's challenge.
  function resetGame() {
    const date = dateInBrasilia();
    try {
      localStorage.removeItem(storageKey(date));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
    update({ date, guesses: [] });
    setQuery('');
    setOpen(false);
    setActive(-1);
    setRevealedId(null);
    setShareFallback('');
    setShareStatus('');
    setAnnouncement('');
    setFeedback('Desafio reiniciado. Você pode testar novamente.');
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function onKeys(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (matches.length && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActive((index) =>
        event.key === 'ArrowDown'
          ? (index + 1) % matches.length
          : index <= 0
            ? matches.length - 1
            : index - 1,
      );
    }
    if (event.key === 'Enter' && expanded && active >= 0 && matches[active]) {
      event.preventDefault();
      choose(matches[active].name);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    submitGuess(query);
  }

  function submitGuess(name: string) {
    const current = sessionRef.current;
    if (!current) return;
    const date = dateInBrasilia();
    if (date !== current.date) {
      let next: string[] = [];
      try {
        next = restore(localStorage.getItem(storageKey(date)), date);
      } catch {
        setStorageWarning(true);
      }
      update({ date, guesses: next });
      setQuery('');
      setOpen(false);
      setActive(-1);
      setShareFallback('');
      setShareStatus('');
      setFeedback(
        'Virou o dia em Brasília. Escolha um palpite para o novo desafio.',
      );
      return;
    }
    // Releia o save para não sobrescrever um palpite feito em outra aba.
    let previous = current.guesses;
    try {
      const saved = restore(localStorage.getItem(storageKey(date)), date);
      previous = restore(
        JSON.stringify({ date, guesses: [...saved, ...previous] }),
        date,
      );
    } catch {
      setStorageWarning(true);
    }
    const { answer } = challenge(date);
    if (isFinished(previous, answer.id)) {
      update({ date, guesses: previous });
      return;
    }
    const character = exactCharacter(name);
    if (!character) {
      setFeedback('Escolha um personagem da lista ou digite o nome completo.');
      setOpen(true);
      return;
    }
    if (previous.includes(character.id)) {
      setFeedback('Você já tentou esse personagem. Escolha outro nome.');
      return;
    }
    const next = { date, guesses: [...previous, character.id] };
    setRevealedId(character.id);
    update(next);
    try {
      localStorage.setItem(storageKey(date), JSON.stringify(next));
    } catch {
      setStorageWarning(true);
    }
    setQuery('');
    setOpen(false);
    setActive(-1);
    setFeedback('');
    setAnnouncement(
      `${character.name}: ${fields.map(({ key, label }) => `${label}, ${clueLabels[compare(character, answer, key)]}`).join('. ')}.`,
    );
    inputRef.current?.focus();
  }

  async function share() {
    if (!session || !finished) return;
    const text = `${shareText(session.date, guesses)}\n${location.origin}${location.pathname}`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        setShareStatus('Resultado compartilhado.');
      } else {
        await navigator.clipboard.writeText(text);
        setShareStatus('Resultado copiado!');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setShareFallback(text);
      setShareStatus('Copie o resultado no campo abaixo.');
    }
  }

  return (
    <>
      <a className="skip-link" href="#game">
        Pular para o jogo
      </a>
      <div className="atmosphere" aria-hidden="true" />
      <main className="shell">
        <header className="hero">
          <Link className="wordmark" href="/" aria-label="Berserkdle, início">
            <p className="japanese" aria-hidden="true">
              ベルセルク
            </p>
            <h1 id="title">
              BERSERK<span>DLE</span>
            </h1>
          </Link>
          <p className="hero-copy">Um novo destino. Todos os dias.</p>
          <div className="game-toolbar">
            <span className="mode-badge">
              <span aria-hidden="true">⚔</span> Clássico
            </span>
            <span className="toolbar-divider" aria-hidden="true" />
            <button
              className="help-button"
              onClick={() => helpRef.current?.showModal()}
            >
              <span aria-hidden="true">?</span> Como jogar
            </button>
          </div>
          <button
            className="reset-button"
            onClick={resetGame}
            disabled={!session}
          >
            <span aria-hidden="true">↻</span> Resetar jogo
            <small>TESTE</small>
          </button>
        </header>

        <section
          id="game"
          className="game-card"
          aria-labelledby="game-title"
          aria-busy={!session}
        >
          <div className="card-heading">
            <p className="section-label">O DESAFIO DIÁRIO</p>
            <h2 id="game-title">
              Quem é o personagem
              <br />
              de <em>Berserk</em> de hoje?
            </h2>
            <p className="challenge-copy">
              Siga as pistas. Desafie a causalidade.
            </p>

            {!finished && (
              <form onSubmit={submit} className="guess-form" autoComplete="off">
                <div className="input-wrap">
                  <label htmlFor="character-input" className="sr-only">
                    Nome do personagem
                  </label>
                  <div className="search-field">
                    <span aria-hidden="true">⌕</span>
                    <input
                      id="character-input"
                      ref={inputRef}
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={expanded}
                      aria-controls="suggestions"
                      aria-activedescendant={
                        expanded && active >= 0
                          ? `suggestion-${matches[active]?.id}`
                          : undefined
                      }
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={80}
                      placeholder={
                        session
                          ? 'Busque um personagem…'
                          : 'Preparando o desafio…'
                      }
                      value={query}
                      disabled={!session}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                        setActive(-1);
                        setFeedback('');
                      }}
                      onKeyDown={onKeys}
                      onFocus={() => setOpen(true)}
                      onBlur={(event) => {
                        // Keep the mobile list in flow until the submit click completes.
                        if (
                          event.relatedTarget &&
                          event.currentTarget.form?.contains(
                            event.relatedTarget,
                          )
                        )
                          return;
                        setOpen(false);
                        setActive(-1);
                      }}
                    />
                  </div>
                  <ul
                    id="suggestions"
                    className="suggestions"
                    role="listbox"
                    aria-label="Personagens encontrados"
                    hidden={!expanded}
                  >
                    {matches.map((c, index) => (
                      <li
                        key={c.id}
                        id={`suggestion-${c.id}`}
                        role="option"
                        aria-selected={index === active}
                        onPointerDown={(event) => event.preventDefault()}
                        onClick={() => submitGuess(c.name)}
                      >
                        <Portrait id={c.id} name={c.name} />
                        <span>{c.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="primary"
                  disabled={!session || !query.trim()}
                  type="submit"
                >
                  <span className="sr-only">Arriscar palpite</span>
                  <span aria-hidden="true">➤</span>
                </button>
              </form>
            )}
          </div>
          <p className="feedback" role="status">
            {feedback}
          </p>
          <p className="sr-only" role="status">
            {announcement}
          </p>
          {storageWarning && (
            <p className="storage-warning" role="status">
              O navegador bloqueou o armazenamento. Você pode jogar, mas o
              progresso pode ser perdido ao sair.
            </p>
          )}

          {guesses.length > 0 && (
            <div
              className="table-wrap"
              role="region"
              aria-label="Pistas dos seus palpites; deslize para ver todos os atributos"
              tabIndex={0}
            >
              <table>
                <caption className="sr-only">
                  Palpites do mais recente ao mais antigo.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Personagem</th>
                    {fields.map((f) => (
                      <th key={f.key} scope="col">
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guesses.toReversed().map((id, index) => {
                    const c = characters.find((c) => c.id === id)!;
                    return (
                      <tr
                        key={id}
                        className={id === revealedId ? 'revealing' : undefined}
                      >
                        <th scope="row">
                          <div className="character-cell">
                            <Portrait id={c.id} name={c.name} large />
                            <span>
                              <span className="sr-only">
                                Tentativa {guesses.length - index}:{' '}
                              </span>
                              {c.name}
                            </span>
                          </div>
                        </th>
                        {fields.map(({ key }) => {
                          const clue = compare(c, daily!.answer, key);
                          return (
                            <td key={key}>
                              <div className={`clue ${clue}`}>
                                <span>
                                  {key === 'weapon' &&
                                  c.weapon.every(
                                    (value) =>
                                      value === 'Não informada' ||
                                      value === 'Nenhuma',
                                  ) ? (
                                    <span
                                      className="weapon-empty"
                                      aria-label="Sem arma"
                                    >
                                      ×
                                    </span>
                                  ) : Array.isArray(c[key]) ? (
                                    (c[key] as readonly string[]).map(
                                      (value) => (
                                        <span
                                          className="clue-value"
                                          key={value}
                                        >
                                          {value}
                                        </span>
                                      ),
                                    )
                                  ) : (
                                    c[key]
                                  )}
                                  <span className="sr-only">
                                    : {clueLabels[clue]}
                                  </span>
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {guesses.length > 0 && (
            <div className="legend" aria-label="Indicadores das pistas">
              <span>
                <b className="legend-partial" /> Parcial
              </span>
              <span>
                <b className="legend-match" /> Correto
              </span>
              <span>
                <b className="legend-miss" /> Incorreto
              </span>
            </div>
          )}
        </section>

        {finished && daily && (
          <section
            className="result"
            aria-labelledby="result-title"
            tabIndex={-1}
            ref={resultRef}
          >
            <Portrait id={daily.answer.id} name={daily.answer.name} large />
            <h2 id="result-title">{`Você encontrou ${daily.answer.name}.`}</h2>
            <button className="primary" onClick={share}>
              Compartilhar resultado <span aria-hidden="true">↗</span>
            </button>
            <p className="share-status" role="status">
              {shareStatus}
            </p>
            {shareFallback && (
              <label className="fallback-label">
                Resultado para copiar
                <textarea
                  readOnly
                  value={shareFallback}
                  onFocus={(event) => event.target.select()}
                  rows={Math.min(guesses.length + 4, 12)}
                />
              </label>
            )}
          </section>
        )}
        <footer className="site-footer">
          <span>Um desafio diário para quem carrega a marca.</span>
          <span>Projeto de fãs · Universo de Kentaro Miura</span>
        </footer>
      </main>

      <dialog
        ref={helpRef}
        aria-labelledby="help-title"
        className="help-dialog"
      >
        <form method="dialog">
          <button className="dialog-close" aria-label="Fechar instruções">
            ×
          </button>
        </form>
        <p className="section-label">ANTES DA JORNADA</p>
        <h2 id="help-title">Como jogar</h2>
        <p>
          Descubra o mesmo personagem que todos os jogadores recebem no dia.
          Jogue até acertar, sem limite de palpites. Procure pelo nome e clique
          no personagem para confirmar seu palpite.
        </p>
        <p>
          <strong>Verde</strong>: todos os valores são iguais, sem importar a
          ordem. <strong>Laranja</strong>: existe algum valor em comum, mas as
          listas são diferentes. <strong>Vermelho</strong>: nenhum valor em
          comum.
        </p>
        <p>
          A ordem é: Espadachim Negro → Era de Ouro → Convicção → Falcão Milenar
          → Fantasia.
        </p>
        <p>
          <strong>Arco de referência não é estreia.</strong> Natureza, núcleos e
          armas/poderes podem reunir vários valores confirmados ao longo do
          mangá. Griffith e Femto continuam como identidades separadas. Gênero e
          arco têm apenas um valor. Personagens diferentes podem ter todas as
          pistas iguais: apenas o nome correto vence.
        </p>
        <p>
          Há spoilers de identidade e afiliação até Fantasia. O catálogo tem{' '}
          {characters.length} fichas do mangá e o calendário se repete a cada{' '}
          {schedule.length} dias a partir de 03/10/2026.
        </p>
        <p>
          “Não informada” indica um atributo sem confirmação nas fontes. Na
          coluna de armas, × representa ausência de arma cadastrada.
        </p>
        <p>
          O jogo muda à <strong>meia-noite de Brasília</strong>. O progresso é
          local; o resultado compartilhado mostra apenas quadrados, sem nomes ou
          atributos.
        </p>
        <details>
          <summary>Consultar fichas do elenco</summary>
          <ul className="roster">
            {characters.map((c) => (
              <li key={c.id}>
                <Portrait id={c.id} name={c.name} />
                <strong>{c.name}</strong> · {c.arc}
                <p>
                  {c.gender} · {c.nature.join(', ')} · {c.group.join(', ')} ·{' '}
                  {c.weapon.join(', ')}
                </p>
                <p>
                  {c.note}{' '}
                  <a href={c.source} target="_blank" rel="noreferrer">
                    Referência editorial ↗
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </details>
        <details className="image-credits">
          <summary>Créditos das imagens</summary>
          <p>
            Fundo:{' '}
            <a
              href="https://hdqwalls.com/berserk-wallpaper"
              target="_blank"
              rel="noreferrer"
            >
              HDQWalls
            </a>
            . Retratos:{' '}
            <a
              href="https://berserk.fandom.com/wiki/Category:Characters_by_Source"
              target="_blank"
              rel="noreferrer"
            >
              Berserk Wiki
            </a>
            ,{' '}
            <a
              href="https://www.darkhorse.com/books/14-937/berserk-volume-22-tpb/"
              target="_blank"
              rel="noreferrer"
            >
              Dark Horse
            </a>{' '}
            e{' '}
            <a
              href="https://myanimelist.net/manga/2/Berserk/characters"
              target="_blank"
              rel="noreferrer"
            >
              MyAnimeList
            </a>
            , obtidos via Jikan; Femto:{' '}
            <a
              href="https://tenor.com/view/femto-gif-22248771"
              target="_blank"
              rel="noreferrer"
            >
              Tenor
            </a>
            . Berserk e seus personagens pertencem aos respectivos titulares.
          </p>
        </details>
      </dialog>
    </>
  );
}
