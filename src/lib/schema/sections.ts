import { z } from 'zod';

export const baseSectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
});

export const heroSectionSchema = baseSectionSchema.extend({
  type: z.literal('hero'),
  props: z.object({
    heading: z.string().min(1, 'Heading is required'),
    subheading: z.string().optional(),
    ctaText: z.string().optional(),
    ctaUrl: z.string().optional(),
  }),
});

export const featureGridSectionSchema = baseSectionSchema.extend({
  type: z.literal('featureGrid'),
  props: z.object({
    features: z.array(
      z.object({
        title: z.string().min(1, 'Feature title is required'),
        description: z.string().optional(),
        icon: z.string().optional(),
      })
    ),
  }),
});

export const testimonialSectionSchema = baseSectionSchema.extend({
  type: z.literal('testimonial'),
  props: z.object({
    quote: z.string().min(1, 'Quote is required'),
    author: z.string().min(1, 'Author is required'),
    role: z.string().optional(),
  }),
});

export const ctaSectionSchema = baseSectionSchema.extend({
  type: z.literal('cta'),
  props: z.object({
    heading: z.string().min(1, 'Heading is required'),
    description: z.string().optional(),
    buttonLabel: z.string().min(1, 'Button label is required'),
    buttonUrl: z.string().min(1, 'Button URL is required'),
  }),
});

// A fallback schema for sections that are in Contentful but not explicitly typed above.
// It uses a catch-all for the type.
export const unknownSectionSchema = baseSectionSchema.extend({
  type: z.string(),
  props: z.record(z.string(), z.unknown()).optional().default({}),
});

export const sectionSchema = z.discriminatedUnion('type', [
  heroSectionSchema,
  featureGridSectionSchema,
  testimonialSectionSchema,
  ctaSectionSchema,
]).or(unknownSectionSchema);

export type HeroSection = z.infer<typeof heroSectionSchema>;
export type FeatureGridSection = z.infer<typeof featureGridSectionSchema>;
export type TestimonialSection = z.infer<typeof testimonialSectionSchema>;
export type CtaSection = z.infer<typeof ctaSectionSchema>;
export type UnknownSection = z.infer<typeof unknownSectionSchema>;
