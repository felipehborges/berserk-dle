'use client';

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import Link from 'next/link';
import { characters } from '@/data/characters';
import {
  challenge,
  clueLabels,
  clueSymbols,
  compare,
  dateInBrasilia,
  exactCharacter,
  fields,
  isFinished,
  MAX_GUESSES,
  restore,
  search,
  shareText,
  storageKey,
} from '@/lib/game';

type Session = { date: string; guesses: string[] };

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
  const guesses = session?.guesses ?? [];
  const won = !!daily && guesses.includes(daily.answer.id);
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
    setQuery(name);
    setOpen(false);
    setActive(-1);
    setFeedback('');
    inputRef.current?.focus();
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
    const character = exactCharacter(query);
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
        <header className="topbar">
          <Link className="wordmark" href="/" aria-label="Berserkdle, início">
            <span aria-hidden="true">✦</span> BERSERKDLE
          </Link>
          <button
            className="text-button"
            onClick={() => helpRef.current?.showModal()}
          >
            Como jogar <span aria-hidden="true">↗</span>
          </button>
        </header>

        <section className="hero" aria-labelledby="title">
          <div className="eclipse" aria-hidden="true">
            <span />
          </div>
          <h1 id="title">
            BERSERK<span>DLE</span>
          </h1>
          <div className="divider" aria-hidden="true">
            <span />◆<span />
          </div>
        </section>

        <section
          id="game"
          className="game-card"
          aria-labelledby="game-title"
          aria-busy={!session}
        >
          <div className="card-heading">
            <h2 id="game-title" className="sr-only">
              Adivinhe o personagem
            </h2>
            <div
              className="attempt-pill"
              aria-label={`${guesses.length} de ${MAX_GUESSES} tentativas`}
            >
              <strong>{guesses.length}</strong>
              <span> / {MAX_GUESSES}</span>
            </div>
          </div>
          <div className="attempt-track" aria-hidden="true">
            {Array.from({ length: MAX_GUESSES }, (_, i) => (
              <span key={i} className={i < guesses.length ? 'used' : ''} />
            ))}
          </div>

          {!finished && (
            <form onSubmit={submit} className="guess-form" autoComplete="off">
              <div className="input-wrap">
                <label htmlFor="character-input" className="sr-only">
                  Nome ou apelido do personagem
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
                        event.currentTarget.form?.contains(event.relatedTarget)
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
                      onClick={() => choose(c.name)}
                    >
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
                Arriscar palpite <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
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
                  Palpites em ordem de tentativa. Setas indicam o arco da
                  resposta em relação ao palpite.
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
                  {guesses.map((id, index) => {
                    const c = characters.find((c) => c.id === id)!;
                    return (
                      <tr key={id}>
                        <th scope="row">
                          <span className="guess-number">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {c.name}
                        </th>
                        {fields.map(({ key }) => {
                          const clue = compare(c, daily!.answer, key);
                          return (
                            <td key={key}>
                              <div className={`clue ${clue}`}>
                                <span
                                  aria-hidden="true"
                                  className="clue-symbol"
                                >
                                  {clueSymbols[clue]}
                                </span>
                                <span>
                                  {c[key]}
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
        </section>

        {finished && daily && (
          <section
            className="result"
            aria-labelledby="result-title"
            tabIndex={-1}
            ref={resultRef}
          >
            <h2 id="result-title">
              {won
                ? `Você encontrou ${daily.answer.name}.`
                : `O personagem era ${daily.answer.name}.`}
            </h2>
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
          Você tem <strong>8 tentativas</strong>. Procure por nome ou apelido,
          selecione e confirme seu palpite.
        </p>
        <p>
          <strong>✓ Igual</strong> e <strong>× Diferente</strong> comparam os
          atributos. No arco, <strong>↓</strong> significa que a resposta usa um
          arco anterior; <strong>↑</strong>, posterior ao seu palpite.
        </p>
        <p>
          A ordem é: Espadachim Negro → Era de Ouro → Convicção → Falcão
          Milenar.
        </p>
        <p>
          <strong>Arco de referência não é estreia.</strong> Cada ficha
          representa uma fase definida: Griffith e Casca antes do Eclipse;
          Farnese e Serpico na Santa Sé; Isidro e Schierke com Guts no Falcão
          Milenar. Núcleo e arma principal seguem esse recorte. Personagens
          diferentes podem ter todas as pistas iguais: apenas o nome correto
          vence.
        </p>
        <p>
          Há spoilers de identidade e afiliação até o Falcão Milenar. O elenco
          inicial tem {characters.length} personagens e o calendário se repete a
          cada 14 dias.
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
                <strong>{c.name}</strong> · {c.arc}
                <p>
                  {c.nature} · {c.group} · {c.weapon}
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
      </dialog>
    </>
  );
}
