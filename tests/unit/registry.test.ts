import { describe, it, expect } from 'vitest';
import { getSectionComponent } from '@/lib/registry/sectionRegistry';
import { HeroSection } from '@/components/sections/HeroSection';
import { UnsupportedSection } from '@/components/sections/UnsupportedSection';

describe('sectionRegistry', () => {
  it('returns the correct component for a known type', () => {
    expect(getSectionComponent('hero')).toBe(HeroSection);
  });

  it('returns UnsupportedSection for an unknown type', () => {
    expect(getSectionComponent('magicNonExistentType')).toBe(UnsupportedSection);
  });
});
