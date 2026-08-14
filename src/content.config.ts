import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Cognitive signaling: one-sentence gist shown before depth */
    gist: z.string().optional(),
    /** Soft mood label — quiet atmosphere, not engagement bait */
    mood: z.enum(['clear', 'wander', 'craft', 'reflect']).default('clear'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
