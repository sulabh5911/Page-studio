export type EditorFieldType = 'text' | 'url';

export interface EditorField {
  key: string;
  label: string;
  type: EditorFieldType;
}

export const sectionEditorFields: Record<string, EditorField[]> = {
  hero: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
    { key: 'ctaText', label: 'CTA Text', type: 'text' },
    { key: 'ctaUrl', label: 'CTA URL', type: 'url' },
  ],
  cta: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'buttonLabel', label: 'Button Label', type: 'text' },
    { key: 'buttonUrl', label: 'Button URL', type: 'url' },
  ],
  testimonial: [
    { key: 'quote', label: 'Quote', type: 'text' },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
  ],
};
