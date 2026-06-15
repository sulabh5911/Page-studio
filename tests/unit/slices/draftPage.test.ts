import { describe, it, expect } from 'vitest';
import reducer, { loadPage, addSection, removeSection, reorderSections } from '@/features/editor/draftPageSlice';
import { Page, Section } from '@/types';

describe('draftPageSlice', () => {
  const initialState = {
    page: null,
    isDirty: false,
    lastSaved: null,
  };

  const samplePage: Page = {
    pageId: '1',
    slug: 'home',
    title: 'Home',
    sections: [
      { id: 's1', type: 'hero', props: {} },
      { id: 's2', type: 'cta', props: {} },
    ]
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle loadPage', () => {
    const actual = reducer(initialState, loadPage(samplePage));
    expect(actual.page).toEqual(samplePage);
    expect(actual.isDirty).toBe(false);
  });

  it('should handle addSection', () => {
    const state = reducer(initialState, loadPage(samplePage));
    const newSection: Section = { id: 's3', type: 'testimonial', props: {} };
    
    const actual = reducer(state, addSection(newSection));
    expect(actual.page?.sections.length).toBe(3);
    expect(actual.page?.sections[2].id).toBe('s3');
    expect(actual.isDirty).toBe(true);
  });

  it('should handle removeSection', () => {
    const state = reducer(initialState, loadPage(samplePage));
    const actual = reducer(state, removeSection('s1'));
    
    expect(actual.page?.sections.length).toBe(1);
    expect(actual.page?.sections[0].id).toBe('s2');
    expect(actual.isDirty).toBe(true);
  });

  it('should handle reorderSections', () => {
    const state = reducer(initialState, loadPage(samplePage));
    const actual = reducer(state, reorderSections({ fromIndex: 0, toIndex: 1 }));
    
    expect(actual.page?.sections[0].id).toBe('s2');
    expect(actual.page?.sections[1].id).toBe('s1');
    expect(actual.isDirty).toBe(true);
  });
});
