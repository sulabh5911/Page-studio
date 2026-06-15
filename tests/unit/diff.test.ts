import { describe, it, expect } from 'vitest';
import { diffPages } from '@/lib/publish/diff';
import { Page } from '@/types';

const basePage: Page = {
  pageId: 'p1',
  slug: 'home',
  title: 'Home',
  sections: [
    {
      id: 's1',
      type: 'hero',
      props: { heading: 'Hello', subheading: 'World', ctaText: 'Go', ctaUrl: '/go' },
    },
    {
      id: 's2',
      type: 'cta',
      props: { heading: 'CTA', buttonLabel: 'Click', buttonUrl: '/click' },
    },
  ],
};

describe('diffPages', () => {
  it('returns minor change for initial publish', () => {
    const changes = diffPages(null, basePage);
    expect(changes).toHaveLength(1);
    expect(changes[0].severity).toBe('minor');
  });

  it('returns empty array when pages are identical', () => {
    const changes = diffPages(basePage, structuredClone(basePage));
    expect(changes).toEqual([]);
  });

  it('detects removed section as major', () => {
    const next = structuredClone(basePage);
    next.sections = next.sections.filter(s => s.id !== 's2');
    const changes = diffPages(basePage, next);
    expect(changes.some(c => c.severity === 'major' && c.description.includes('Removed'))).toBe(true);
  });

  it('detects added section as minor', () => {
    const next = structuredClone(basePage);
    next.sections.push({
      id: 's3',
      type: 'testimonial',
      props: { quote: 'Great', author: 'Ada' },
    });
    const changes = diffPages(basePage, next);
    expect(changes.some(c => c.severity === 'minor' && c.description.includes('Added'))).toBe(true);
  });

  it('detects type change as major', () => {
    const next = structuredClone(basePage);
    next.sections[0].type = 'cta';
    const changes = diffPages(basePage, next);
    expect(changes.some(c => c.severity === 'major' && c.description.includes('Changed section type'))).toBe(true);
  });

  it('detects prop change as patch', () => {
    const next = structuredClone(basePage);
    next.sections[0].props.heading = 'Updated';
    const changes = diffPages(basePage, next);
    expect(changes.some(c => c.severity === 'patch')).toBe(true);
  });

  it('detects reorder as patch', () => {
    const next = structuredClone(basePage);
    next.sections = [next.sections[1], next.sections[0]];
    const changes = diffPages(basePage, next);
    expect(changes.some(c => c.description === 'Reordered sections')).toBe(true);
  });
});
