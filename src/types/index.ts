export type Role = 'viewer' | 'editor' | 'publisher';

export interface Section {
  id: string;
  type: 'hero' | 'featureGrid' | 'testimonial' | 'cta' | string;
  props: Record<string, unknown>;
}

export interface Page {
  pageId: string;
  slug: string;
  title: string;
  sections: Section[];
}

export interface ReleaseSnapshot {
  version: string;
  timestamp: string;
  page: Page;
  changelog: string[];
}
