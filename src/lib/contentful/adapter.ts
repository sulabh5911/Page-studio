import { getContentfulClient } from './client';
import { ContentfulPageEntry, ContentfulSectionEntry } from './types';
import { Page, Section } from '@/types';

// Mock data fallback for development without Contentful credentials
const MOCK_PAGE: Page = {
  pageId: 'mock-page-1',
  slug: 'home',
  title: 'Welcome to Page Studio',
  sections: [
    {
      id: 'mock-hero-1',
      type: 'hero',
      props: {
        heading: 'Build Beautiful Pages',
        subheading: 'A headless CMS integrated Page Studio built with Next.js.',
        ctaText: 'Get Started',
        ctaUrl: '/studio/home',
      },
    },
    {
      id: 'mock-features-1',
      type: 'featureGrid',
      props: {
        features: [
          { title: 'Schema-Driven', description: 'Validated by Zod at runtime.' },
          { title: 'Contentful Native', description: 'Loads draft and published content directly.' },
          { title: 'Fully Accessible', description: 'WCAG 2.2 AAA oriented implementation.' },
        ]
      }
    }
  ]
};

export async function fetchPageBySlug(slug: string, preview = false): Promise<Page | null> {
  // If no space ID is configured, return the mock page for demonstration purposes
  if (!process.env.CONTENTFUL_SPACE_ID) {
    console.warn('No CONTENTFUL_SPACE_ID configured. Returning mock data.');
    return slug === 'home' ? MOCK_PAGE : null;
  }

  const client = getContentfulClient(preview);

  try {
    const entries = await client.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 2, // resolve section references
      limit: 1,
    });

    if (!entries.items.length) {
      return null;
    }

    const entry = entries.items[0] as unknown as ContentfulPageEntry;
    return adaptPage(entry);
  } catch (error) {
    console.error('Contentful fetch error:', error);
    return null;
  }
}

function adaptPage(entry: ContentfulPageEntry): Page {
  const sections = ((entry.fields.sections as any[]) || []).map((s: any) => adaptSection(s)).filter((s): s is Section => s !== null);

  return {
    pageId: entry.sys.id,
    slug: entry.fields.slug as string,
    title: entry.fields.title as string,
    sections,
  };
}

function adaptSection(entry: ContentfulSectionEntry): Section | null {
  if (!entry || !entry.sys || !entry.fields) return null;

  return {
    id: entry.sys.id,
    type: entry.fields.type as string,
    props: (entry.fields.props as Record<string, unknown>) || {},
  };
}
