import { getPublishedNotes, toNoteCard } from '../../lib/posts';

export const prerender = true;

export async function GET() {
  const notes = (await getPublishedNotes()).map(toNoteCard);
  return new Response(JSON.stringify(notes), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
