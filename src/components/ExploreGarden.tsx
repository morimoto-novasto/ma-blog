import { useMemo, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import {
  RouterProvider,
  createRootRoute,
  createRouter,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import type { NoteCard } from '../lib/posts';

type ExploreSearch = {
  q?: string;
  mood?: string;
  tag?: string;
  view?: 'garden' | 'walk';
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

async function fetchNotes(): Promise<NoteCard[]> {
  const res = await fetch('/api/notes');
  if (!res.ok) throw new Error('failed to load notes');
  return res.json();
}

function NoteResults({
  notes,
  onTag,
}: {
  notes: NoteCard[];
  onTag: (tag: string) => void;
}) {
  if (notes.length === 0) {
    return (
      <p style={{ color: 'var(--ink-mute)' }}>
        その組み合わせのノートはまだありません。別の言葉で散策してみてください。
      </p>
    );
  }

  return (
    <div className="note-list" role="list">
      {notes.map((note) => (
        <article className="note-item" role="listitem" key={note.id}>
          <div className="timeline__meta">
            <time dateTime={note.publishedAt}>
              {new Intl.DateTimeFormat('ja-JP', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }).format(new Date(note.publishedAt))}
            </time>
            <span className="mood">{note.mood}</span>
          </div>
          <h3>
            <a href={note.href}>{note.title}</a>
          </h3>
          <p>{note.gist ?? note.description}</p>
          <div className="tags">
            {note.tags.map((t) => (
              <button
                key={t}
                type="button"
                className="tag"
                style={{
                  background: 'transparent',
                  border: 0,
                  padding: 0,
                  cursor: 'pointer',
                }}
                onClick={() => onTag(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function ExploreApp({ initial }: { initial: NoteCard[] }) {
  const search = useSearch({ from: '__root__' });
  const navigate = useNavigate({ from: '/' });
  const q = search.q ?? '';
  const mood = search.mood ?? 'all';
  const tag = search.tag ?? 'all';
  const view = search.view ?? 'garden';

  const { data = initial, isFetching } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    initialData: initial,
  });

  const tags = useMemo(() => {
    const set = new Set<string>();
    data.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [data]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.filter((n) => {
      if (mood !== 'all' && n.mood !== mood) return false;
      if (tag !== 'all' && !n.tags.includes(tag)) return false;
      if (!needle) return true;
      return (
        n.title.toLowerCase().includes(needle) ||
        n.description.toLowerCase().includes(needle) ||
        (n.gist?.toLowerCase().includes(needle) ?? false) ||
        n.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [data, q, mood, tag]);

  const patchSearch = (next: Partial<ExploreSearch>) => {
    void navigate({
      search: (prev) => {
        const merged = { ...prev, ...next };
        const clean: ExploreSearch = {};
        if (merged.q) clean.q = merged.q;
        if (merged.mood && merged.mood !== 'all') clean.mood = merged.mood;
        if (merged.tag && merged.tag !== 'all') clean.tag = merged.tag;
        if (merged.view && merged.view !== 'garden') clean.view = merged.view;
        return clean;
      },
    });
  };

  const [walkSeed] = useState(() => Math.floor(Math.random() * 10_000));
  const walkNote =
    filtered.length > 0 ? filtered[walkSeed % filtered.length] : undefined;

  return (
    <div className="explore-panel">
      <aside className="explore-filters" aria-label="探索フィルタ">
        <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '0.35rem' }}>
          <button
            type="button"
            className="tag"
            style={{
              background: 'transparent',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              color: view === 'garden' ? 'var(--accent)' : 'var(--ink-mute)',
            }}
            onClick={() => patchSearch({ view: 'garden' })}
          >
            garden
          </button>
          <button
            type="button"
            className="tag"
            style={{
              background: 'transparent',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              color: view === 'walk' ? 'var(--accent)' : 'var(--ink-mute)',
            }}
            onClick={() => patchSearch({ view: 'walk' })}
          >
            walk
          </button>
        </div>
        <label>
          さがす
          <input
            value={q}
            onChange={(e) => patchSearch({ q: e.target.value || undefined })}
            placeholder="言葉・タグ・要旨"
            autoComplete="off"
          />
        </label>
        <label>
          ムード
          <select
            value={mood}
            onChange={(e) => patchSearch({ mood: e.target.value })}
          >
            <option value="all">すべて</option>
            <option value="clear">clear</option>
            <option value="wander">wander</option>
            <option value="craft">craft</option>
            <option value="reflect">reflect</option>
          </select>
        </label>
        <label>
          タグ
          <select
            value={tag}
            onChange={(e) => patchSearch({ tag: e.target.value })}
          >
            <option value="all">すべて</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <p style={{ margin: '0.4rem 0 0', color: 'var(--ink-faint)', fontSize: '0.78rem' }}>
          {isFetching ? '更新中…' : `${filtered.length} notes`}
          <br />
          TanStack Router + Query
        </p>
      </aside>

      {view === 'walk' ? (
        <div>
          <p style={{ color: 'var(--ink-mute)', marginTop: 0 }}>
            interleaved walk — いまのフィルタから、たまたま1本。
          </p>
          {walkNote ? (
            <NoteResults
              notes={[walkNote]}
              onTag={(t) => patchSearch({ tag: t })}
            />
          ) : (
            <p style={{ color: 'var(--ink-mute)' }}>まだ歩けません。</p>
          )}
        </div>
      ) : (
        <NoteResults notes={filtered} onTag={(t) => patchSearch({ tag: t })} />
      )}
    </div>
  );
}

function createExploreRouter(initial: NoteCard[]) {
  const rootRoute = createRootRoute({
    validateSearch: (raw: Record<string, unknown>): ExploreSearch => ({
      q: typeof raw.q === 'string' ? raw.q : undefined,
      mood: typeof raw.mood === 'string' ? raw.mood : undefined,
      tag: typeof raw.tag === 'string' ? raw.tag : undefined,
      view: raw.view === 'walk' ? 'walk' : undefined,
    }),
    component: () => <ExploreApp initial={initial} />,
  });

  return createRouter({
    routeTree: rootRoute,
  });
}

export default function ExploreGarden({ initial }: { initial: NoteCard[] }) {
  const [router] = useState(() => createExploreRouter(initial));

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
