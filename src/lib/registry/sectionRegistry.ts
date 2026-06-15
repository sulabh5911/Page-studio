import { ReactElement } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeatureGridSection } from '@/components/sections/FeatureGridSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { UnsupportedSection } from '@/components/sections/UnsupportedSection';

export type SectionComponentType = React.ComponentType<any>;

export const sectionRegistry: Record<string, SectionComponentType> = {
  hero: HeroSection,
  featureGrid: FeatureGridSection,
  testimonial: TestimonialSection,
  cta: CtaSection,
};

export function getSectionComponent(type: string): SectionComponentType {
  return sectionRegistry[type] || UnsupportedSection;
}
