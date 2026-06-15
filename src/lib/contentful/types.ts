import { Entry, EntrySkeletonType } from 'contentful';

export interface ContentfulSectionFields {
  internalName: string;
  type: string;
  props: Record<string, unknown>;
}

export interface ContentfulPageFields {
  slug: string;
  title: string;
  sections: Entry<EntrySkeletonType<ContentfulSectionFields>, "WITHOUT_UNRESOLVABLE_LINKS">[];
}

export type ContentfulSectionEntry = Entry<EntrySkeletonType<ContentfulSectionFields>, "WITHOUT_UNRESOLVABLE_LINKS">;
export type ContentfulPageEntry = Entry<EntrySkeletonType<ContentfulPageFields>, "WITHOUT_UNRESOLVABLE_LINKS">;
