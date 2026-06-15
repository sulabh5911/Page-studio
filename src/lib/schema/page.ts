import { z } from 'zod';
import { sectionSchema } from './sections';

export const pageSchema = z.object({
  pageId: z.string().min(1, 'Page ID is required'),
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  sections: z.array(sectionSchema).default([]),
});

export type ValidatedPage = z.infer<typeof pageSchema>;
