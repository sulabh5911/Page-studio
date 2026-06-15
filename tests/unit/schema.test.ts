import { describe, it, expect } from 'vitest';
import { pageSchema } from '@/lib/schema/page';

describe('pageSchema', () => {
  it('validates a correct page', () => {
    const validPage = {
      pageId: '1',
      slug: 'home',
      title: 'Home',
      sections: [
        {
          id: 's1',
          type: 'hero',
          props: { heading: 'Hello' }
        }
      ]
    };
    
    const result = pageSchema.safeParse(validPage);
    expect(result.success).toBe(true);
  });

  it('fails if required fields are missing', () => {
    const invalidPage = {
      slug: 'home',
      // missing pageId and title
      sections: []
    };
    
    const result = pageSchema.safeParse(invalidPage);
    expect(result.success).toBe(false);
  });

  it('handles unknown section types gracefully via fallback', () => {
    const pageWithUnknown = {
      pageId: '1',
      slug: 'home',
      title: 'Home',
      sections: [
        {
          id: 's2',
          type: 'someWeirdType',
          props: { foo: 'bar' }
        }
      ]
    };
    
    const result = pageSchema.safeParse(pageWithUnknown);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sections[0].type).toBe('someWeirdType');
    }
  });
});
