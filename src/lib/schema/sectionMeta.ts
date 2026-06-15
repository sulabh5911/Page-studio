import { LayoutTemplate, Grid3x3, MessageSquareQuote, Megaphone, type LucideIcon } from 'lucide-react';

export const sectionMeta: Record<string, { label: string; description: string; icon: LucideIcon }> = {
  hero: {
    label: 'Hero',
    description: 'Headline, subheading, and primary CTA',
    icon: LayoutTemplate,
  },
  featureGrid: {
    label: 'Feature grid',
    description: 'Highlight product capabilities',
    icon: Grid3x3,
  },
  testimonial: {
    label: 'Testimonial',
    description: 'Customer quote and attribution',
    icon: MessageSquareQuote,
  },
  cta: {
    label: 'Call to action',
    description: 'Conversion-focused closing section',
    icon: Megaphone,
  },
};

export function getSectionLabel(type: string): string {
  return sectionMeta[type]?.label ?? type;
}
