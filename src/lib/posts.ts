import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;

export async function getPublishedNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  return notes.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function readingMinutes(body: string): number {
  const chars = body.replace(/\s+/g, '').length;
  // Japanese ~400–600 chars/min; use 500 as calm midpoint
  return Math.max(1, Math.round(chars / 500));
}

/**
 * Interleaving / discriminative-contrast inspired related picks.
 * Prefer shared tags first, then intentionally pull one "neighbor thought"
 * from a different mood so contrast aids memory (spacing + interleaving research).
 */
export function pickSerendipity(current: Note, all: Note[], limit = 3): Note[] {
  const others = all.filter((n) => n.id !== current.id);
  const shared = others.filter((n) =>
    n.data.tags.some((t) => current.data.tags.includes(t)),
  );
  const contrast = others.filter(
    (n) =>
      n.data.mood !== current.data.mood &&
      !shared.some((s) => s.id === n.id),
  );

  const picks: Note[] = [];
  for (const n of shared) {
    if (picks.length >= limit - 1) break;
    picks.push(n);
  }
  if (contrast[0] && picks.length < limit) picks.push(contrast[0]);
  for (const n of others) {
    if (picks.length >= limit) break;
    if (!picks.some((p) => p.id === n.id)) picks.push(n);
  }
  return picks;
}

export type NoteCard = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  mood: string;
  gist?: string;
  href: string;
};

export function toNoteCard(note: Note): NoteCard {
  return {
    id: note.id,
    title: note.data.title,
    description: note.data.description,
    publishedAt: note.data.publishedAt.toISOString(),
    tags: note.data.tags,
    mood: note.data.mood,
    gist: note.data.gist,
    href: `/notes/${note.id}`,
  };
}
